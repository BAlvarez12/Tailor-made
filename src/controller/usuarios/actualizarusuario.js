const bcrypt = require('bcryptjs');
const pool = require('../../config/db.js');
const {
  esCorreoValido,
  validarReglasPassword,
} = require('../../utils/validarCredenciales');
const {
  validarUsuarioYCorreoUnicos,
  parsearNombreCompleto,
} = require('../../utils/generarUsuarioLogin');
const { ESTADO_USUARIO, esEstadoUsuarioValido } = require('../../utils/estadosUsuario');
const { invalidarUsuario } = require('../../services/permisosCache');
const { registrar, fromReq } = require('../../services/logOperaciones');

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre_usuario,
      apellido_usuario,
      usuario,
      password,
      email,
      estado,
      rol_id,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'El id del usuario es obligatorio.' });
    }

    if (!nombre_usuario || !nombre_usuario.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    const parsedNombre = parsearNombreCompleto(nombre_usuario, apellido_usuario);

    if (!parsedNombre.apellidoStr) {
      return res.status(400).json({
        message:
          'Indica el apellido o escribe el nombre completo (nombre y apellido) en el campo nombre.',
      });
    }

    if (!usuario || !usuario.trim()) {
      return res.status(400).json({ message: 'El usuario es obligatorio.' });
    }

    const emailLimpioRaw = email && email.trim() ? email.trim() : '';

    if (emailLimpioRaw && !esCorreoValido(emailLimpioRaw)) {
      return res.status(400).json({ message: 'El correo no tiene un formato válido.' });
    }

    if (rol_id === undefined || rol_id === null || rol_id === '') {
      return res.status(400).json({ message: 'El rol es obligatorio.' });
    }

    if (password && password.trim()) {
      const errorPassword = validarReglasPassword(password);
      if (errorPassword) {
        return res.status(400).json({ message: errorPassword });
      }
    }

    const nombreLimpio = nombre_usuario.trim();
    const apellidoLimpio = apellido_usuario.trim();
    const usuarioLimpio = usuario.trim();
    const emailLimpio = emailLimpioRaw ? emailLimpioRaw.toLowerCase() : null;

    const [usuarioActual] = await pool.query(
      'SELECT usuario_id, password, estado FROM usuarios WHERE usuario_id = ? LIMIT 1',
      [id]
    );

    if (usuarioActual.length === 0) {
      return res.status(404).json({ message: 'El usuario no existe.' });
    }

    const validacionUnicos = await validarUsuarioYCorreoUnicos({
      usuario: usuarioLimpio,
      email: emailLimpio,
      excluirId: Number(id),
    });

    if (!validacionUnicos.ok) {
      return res.status(400).json({ message: validacionUnicos.message });
    }

    let estadoFinal = Number(estado ?? usuarioActual[0].estado);

    if (!esEstadoUsuarioValido(estadoFinal)) {
      return res.status(400).json({ message: 'El estado del usuario no es válido.' });
    }

    let passwordHash = usuarioActual[0].password;
    const cambioPassword = Boolean(password && password.trim());

    if (cambioPassword) {
      passwordHash = await bcrypt.hash(password.trim(), 10);
      if (Number(usuarioActual[0].estado) === ESTADO_USUARIO.INVITACION_ENVIADA) {
        estadoFinal = ESTADO_USUARIO.ACTIVO;
      }
    }

    const sql = `
      UPDATE usuarios
      SET
        nombre_usuario = ?,
        apellido_usuario = ?,
        usuario = ?,
        password = ?,
        email = ?,
        estado = ?,
        rol_id = ?
      WHERE usuario_id = ?
    `;

    const values = [
      nombreLimpio,
      apellidoLimpio,
      usuarioLimpio,
      passwordHash,
      emailLimpio,
      estadoFinal,
      Number(rol_id),
      Number(id),
    ];

    await pool.query(sql, values);

    // Invalida el cache de permisos del usuario actualizado.
    // Si cambió de rol, la próxima request leerá los permisos correctos.
    invalidarUsuario(id);

    const accion =
      Number(estadoFinal) === 0
        ? 'inactivar'
        : Number(estadoFinal) === 1
          ? 'activar'
          : 'editar';

    registrar({
      ...fromReq(req),
      accion,
      entidad: 'usuario',
      entidadId: Number(id),
      descripcion: `Usuario "${usuarioLimpio}" ${accion === 'editar' ? 'editado' : accion + 'do'}`,
      datosDespues: {
        usuario: usuarioLimpio,
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        email: emailLimpio,
        rol_id: Number(rol_id),
        estado: estadoFinal,
      },
    });

    return res.status(200).json({
      message: 'Usuario actualizado correctamente.',
      usuario_id: Number(id),
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      const campo = error.message?.includes('uk_usuarios_email')
        ? 'correo electrónico'
        : error.message?.includes('uk_usuarios_usuario')
          ? 'nombre de usuario'
          : 'dato único';
      return res.status(409).json({
        message: `Ya existe un usuario con ese ${campo}.`,
      });
    }

    return res.status(500).json({
      message: 'Error interno del servidor al actualizar el usuario.',
    });
  }
};

module.exports = { actualizarUsuario };