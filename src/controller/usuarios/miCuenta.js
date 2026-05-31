const bcrypt = require('bcryptjs');
const pool = require('../../config/db.js');
const {
  esCorreoValido,
  validarReglasPassword,
} = require('../../utils/validarCredenciales');
const { registrar, fromReq } = require('../../services/logOperaciones');
const { enviarCorreoCambioPassword } = require('../../services/mailService');

/**
 * GET /api/usuarios/me
 * Devuelve los datos del usuario autenticado.
 */
const obtenerMiCuenta = async (req, res) => {
  try {
    const usuarioId = req.user?.usuario_id;
    if (!usuarioId) {
      return res.status(401).json({ message: 'No autorizado.' });
    }

    const [rows] = await pool.query(
      `
        SELECT
          t.usuario_id,
          t.nombre_usuario,
          t.apellido_usuario,
          t.usuario,
          t.email,
          t.estado,
          t.rol_id,
          a.nombre_rol
        FROM usuarios t
        INNER JOIN roles a ON t.rol_id = a.rol_id
        WHERE t.usuario_id = ?
        LIMIT 1
      `,
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Error en obtenerMiCuenta:', error);
    return res.status(500).json({ message: 'Error al obtener la información de la cuenta.' });
  }
};

/**
 * PUT /api/usuarios/me/perfil
 * Permite al usuario actualizar SU propio nombre, apellido y correo.
 * NO toca rol, estado ni nombre de usuario.
 */
const actualizarMiPerfil = async (req, res) => {
  try {
    const usuarioId = req.user?.usuario_id;
    if (!usuarioId) {
      return res.status(401).json({ message: 'No autorizado.' });
    }

    const { nombre_usuario, apellido_usuario, email } = req.body;

    const nombre = String(nombre_usuario || '').trim();
    const apellido = String(apellido_usuario || '').trim();
    const emailRaw = String(email || '').trim();

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }
    if (!apellido) {
      return res.status(400).json({ message: 'El apellido es obligatorio.' });
    }
    if (emailRaw && !esCorreoValido(emailRaw)) {
      return res.status(400).json({ message: 'El correo no tiene un formato válido.' });
    }

    const emailLimpio = emailRaw ? emailRaw.toLowerCase() : null;

    if (emailLimpio) {
      const [duplicados] = await pool.query(
        'SELECT usuario_id FROM usuarios WHERE LOWER(email) = ? AND usuario_id <> ? LIMIT 1',
        [emailLimpio, usuarioId]
      );
      if (duplicados.length > 0) {
        return res.status(409).json({
          message: 'Ya existe otro usuario con ese correo electrónico.',
        });
      }
    }

    await pool.query(
      `
        UPDATE usuarios
        SET nombre_usuario = ?, apellido_usuario = ?, email = ?
        WHERE usuario_id = ?
      `,
      [nombre, apellido, emailLimpio, usuarioId]
    );

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'mi_cuenta',
      entidadId: usuarioId,
      descripcion: `El usuario #${usuarioId} actualizó sus datos personales`,
      datosDespues: {
        nombre_usuario: nombre,
        apellido_usuario: apellido,
        email: emailLimpio,
      },
    });

    return res.json({
      message: 'Datos actualizados correctamente.',
      usuario: {
        usuario_id: usuarioId,
        nombre_usuario: nombre,
        apellido_usuario: apellido,
        email: emailLimpio,
      },
    });
  } catch (error) {
    console.error('Error en actualizarMiPerfil:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Ya existe otro usuario con ese correo electrónico.',
      });
    }
    return res.status(500).json({ message: 'Error al actualizar los datos.' });
  }
};

/**
 * PUT /api/usuarios/me/password
 * Permite al usuario cambiar SU propia contraseña.
 * Requiere la contraseña actual.
 */
const cambiarMiPassword = async (req, res) => {
  try {
    const usuarioId = req.user?.usuario_id;
    if (!usuarioId) {
      return res.status(401).json({ message: 'No autorizado.' });
    }

    const { password_actual, password_nueva, password_confirmacion } = req.body;

    if (!password_actual || !password_nueva || !password_confirmacion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (password_nueva !== password_confirmacion) {
      return res.status(400).json({ message: 'La nueva contraseña y su confirmación no coinciden.' });
    }

    const errorReglas = validarReglasPassword(password_nueva);
    if (errorReglas) {
      return res.status(400).json({ message: errorReglas });
    }

    if (password_actual === password_nueva) {
      return res.status(400).json({ message: 'La nueva contraseña debe ser diferente a la actual.' });
    }

    const [rows] = await pool.query(
      `SELECT password, email, nombre_usuario, apellido_usuario
         FROM usuarios WHERE usuario_id = ? LIMIT 1`,
      [usuarioId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const coincide = await bcrypt.compare(password_actual, rows[0].password);
    if (!coincide) {
      return res.status(400).json({ message: 'La contraseña actual no es correcta.' });
    }

    const passwordHash = await bcrypt.hash(password_nueva, 10);

    await pool.query(
      'UPDATE usuarios SET password = ? WHERE usuario_id = ?',
      [passwordHash, usuarioId]
    );

    registrar({
      ...fromReq(req),
      accion: 'editar',
      entidad: 'mi_cuenta_password',
      entidadId: usuarioId,
      descripcion: `El usuario #${usuarioId} cambió su contraseña`,
    });

    // Aviso de seguridad: notificamos el cambio. Si falla el correo NO
    // revertimos el cambio, solo lo registramos.
    const correoCambio = String(rows[0].email || '').trim();
    if (correoCambio) {
      try {
        await enviarCorreoCambioPassword({
          email: correoCambio,
          nombreCompleto: `${rows[0].nombre_usuario || ''} ${rows[0].apellido_usuario || ''}`.trim(),
        });
      } catch (errorCorreo) {
        console.error('No se pudo enviar el aviso de cambio de contraseña:', errorCorreo);
      }
    }

    return res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error en cambiarMiPassword:', error);
    return res.status(500).json({ message: 'Error al cambiar la contraseña.' });
  }
};

module.exports = {
  obtenerMiCuenta,
  actualizarMiPerfil,
  cambiarMiPassword,
};
