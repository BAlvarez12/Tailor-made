const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../../config/db.js');
const {
  esCorreoValido,
  validarReglasPassword,
} = require('../../utils/validarCredenciales');
const {
  obtenerUsuarioLoginUnico,
  validarUsuarioYCorreoUnicos,
  parsearNombreCompleto,
} = require('../../utils/generarUsuarioLogin');
const { ESTADO_USUARIO } = require('../../utils/estadosUsuario');
const { crearTokenInvitacion } = require('../../services/invitacionUsuarioService');
const { registrar, fromReq } = require('../../services/logOperaciones');

const crearUsuario = async (req, res) => {
  try {
    const {
      nombre_usuario,
      apellido_usuario,
      usuario: usuarioManual,
      password,
      email,
      rol_id,
      modo_acceso,
    } = req.body;

    const modoAcceso = modo_acceso === 'password' ? 'password' : 'invitacion';

    if (!nombre_usuario || !nombre_usuario.trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    const parsedNombre = parsearNombreCompleto(nombre_usuario, apellido_usuario);

    if (!parsedNombre.nombreStr && !parsedNombre.apellidoStr) {
      return res.status(400).json({
        message:
          'Indica nombre y apellido, o escribe el nombre completo en el campo nombre.',
      });
    }

    if (!parsedNombre.apellidoStr) {
      return res.status(400).json({
        message:
          'Indica el apellido o escribe el nombre completo (nombre y apellido) en el campo nombre.',
      });
    }

    if (rol_id === undefined || rol_id === null || rol_id === '') {
      return res.status(400).json({ message: 'El rol es obligatorio.' });
    }

    const nombreLimpio = nombre_usuario.trim();
    const apellidoLimpio = apellido_usuario.trim();
    const emailLimpio = email && email.trim() ? email.trim().toLowerCase() : null;

    if (emailLimpio && !esCorreoValido(emailLimpio)) {
      return res.status(400).json({ message: 'El correo no tiene un formato válido.' });
    }

    if (modoAcceso === 'invitacion') {
      if (!emailLimpio) {
        return res.status(400).json({
          message:
            'Para enviar invitación por correo debes registrar un correo electrónico válido.',
        });
      }
    } else if (!password || !password.trim()) {
      return res.status(400).json({
        message: 'Debes asignar una contraseña cuando no se envía invitación por correo.',
      });
    } else {
      const errorPassword = validarReglasPassword(password);
      if (errorPassword) {
        return res.status(400).json({ message: errorPassword });
      }
    }

    const usuarioLimpio =
      usuarioManual && usuarioManual.trim()
        ? usuarioManual.trim().toLowerCase()
        : await obtenerUsuarioLoginUnico(nombreLimpio, apellidoLimpio);

    const validacionUnicos = await validarUsuarioYCorreoUnicos({
      usuario: usuarioLimpio,
      email: emailLimpio,
    });

    if (!validacionUnicos.ok) {
      return res.status(400).json({ message: validacionUnicos.message });
    }

    const estadoInicial =
      modoAcceso === 'invitacion'
        ? ESTADO_USUARIO.INVITACION_ENVIADA
        : ESTADO_USUARIO.ACTIVO;

    let passwordHash;

    if (modoAcceso === 'password') {
      passwordHash = await bcrypt.hash(password.trim(), 10);
    } else {
      passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    }

    const sql = `
      INSERT INTO usuarios (
        nombre_usuario,
        apellido_usuario,
        usuario,
        password,
        email,
        estado,
        rol_id,
        fecha_creado,
        usuario_creador
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    `;

    const usuarioCreador = req.user?.usuario_id;
    if (!usuarioCreador) {
      return res.status(401).json({ message: 'No autorizado.' });
    }

    const values = [
      nombreLimpio,
      apellidoLimpio,
      usuarioLimpio,
      passwordHash,
      emailLimpio,
      estadoInicial,
      Number(rol_id),
      usuarioCreador,
    ];

    const [result] = await pool.query(sql, values);
    const usuarioId = result.insertId;

    let invitacionEnviada = false;

    if (modoAcceso === 'invitacion' && emailLimpio) {
      const invitacion = await crearTokenInvitacion({
        usuario_id: usuarioId,
        usuario: usuarioLimpio,
        nombre_usuario: nombreLimpio,
        apellido_usuario: apellidoLimpio,
        email: emailLimpio,
      });

      invitacionEnviada = Boolean(invitacion.enviado);
    }

    registrar({
      ...fromReq(req),
      accion: 'crear',
      entidad: 'usuario',
      entidadId: usuarioId,
      descripcion: `Usuario "${usuarioLimpio}" (${nombreLimpio} ${apellidoLimpio}) creado`,
      datosDespues: {
        usuario: usuarioLimpio,
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        email: emailLimpio,
        modo_acceso: modoAcceso,
        invitacionEnviada,
      },
    });

    return res.status(201).json({
      message: invitacionEnviada
        ? 'Usuario creado e invitación enviada por correo.'
        : 'Usuario creado correctamente.',
      usuario_id: usuarioId,
      usuario: usuarioLimpio,
      invitacionEnviada,
      modo_acceso: modoAcceso,
      estado: estadoInicial,
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);

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

    if (error.message?.includes('Configuración de correo')) {
      return res.status(500).json({
        message: 'Usuario creado pero el correo no está configurado. Asigna contraseña manualmente.',
      });
    }

    return res.status(500).json({
      message: 'Error interno del servidor al crear el usuario.',
    });
  }
};

module.exports = {
  crearUsuario,
};
