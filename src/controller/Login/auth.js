const pool = require('../../config/db.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  normalizarUsuario,
  registrarIntentoFallido,
  reiniciarIntentos,
  MAX_INTENTOS,
  MINUTOS_BLOQUEO,
} = require('../../services/loginIntentos');

const responderFalloLogin = async (res, usuario, mensajeBase = 'Credenciales inválidas') => {
  const resultado = await registrarIntentoFallido(usuario);

  if (resultado.bloqueado) {
    return res.status(429).json({
      ok: false,
      bloqueado: true,
      intentosRestantes: 0,
      minutosRestantes: resultado.minutosRestantes,
      message: `Demasiados intentos fallidos. Acceso bloqueado por ${MINUTOS_BLOQUEO} minutos.`,
    });
  }

  const intentos = resultado.intentosRestantes;
  const intentoLabel = intentos === 1 ? 'intento' : 'intentos';

  return res.status(401).json({
    ok: false,
    intentosRestantes: intentos,
    message: `${mensajeBase}. Te quedan ${intentos} ${intentoLabel}.`,
  });
};

const login = async (req, res) => {
  try {
    const usuario = normalizarUsuario(req.body?.usuario);
    const { password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario y contraseña son obligatorios',
      });
    }

    const sql = `
      SELECT
        u.usuario_id,
        u.nombre_usuario,
        u.apellido_usuario,
        u.usuario,
        u.password,
        u.email,
        u.estado,
        u.rol_id,
        u.fecha_creado,
        u.usuario_creador,
        r.nombre_rol
      FROM usuarios u
      LEFT JOIN roles r ON r.rol_id = u.rol_id
      WHERE u.usuario = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [usuario]);

    if (rows.length === 0) {
      return responderFalloLogin(res, usuario);
    }

    const usuarioDB = rows[0];

    const estadoCuenta = Number(usuarioDB.estado);

    if (estadoCuenta === 2) {
      return res.status(403).json({
        ok: false,
        message:
          'Debes activar tu cuenta con el enlace enviado a tu correo electrónico.',
        invitacionPendiente: true,
      });
    }

    if (estadoCuenta !== 1) {
      return res.status(403).json({
        ok: false,
        message: 'Tu cuenta está inactiva. Contacta al administrador.',
        cuentaInactiva: true,
      });
    }

    const passwordValida = await bcrypt.compare(password, usuarioDB.password);

    if (!passwordValida) {
      return responderFalloLogin(res, usuario);
    }

    await reiniciarIntentos(usuario);

    const [permisosRows] = await pool.query(
      `SELECT p.nombre_permiso
         FROM permisos p
         JOIN permisos_rol pr ON pr.permiso_id = p.permiso_id
        WHERE pr.rol_id = ?`,
      [usuarioDB.rol_id]
    );
    const permisos = permisosRows.map((r) => r.nombre_permiso);

    const token = jwt.sign(
      {
        usuario_id: usuarioDB.usuario_id,
        usuario: usuarioDB.usuario,
        email: usuarioDB.email,
        rol_id: usuarioDB.rol_id,
        permisos,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      ok: true,
      message: 'Login exitoso',
      token,
      usuario: {
        usuario_id: usuarioDB.usuario_id,
        nombre_usuario: usuarioDB.nombre_usuario,
        apellido_usuario: usuarioDB.apellido_usuario,
        usuario: usuarioDB.usuario,
        email: usuarioDB.email,
        rol_id: usuarioDB.rol_id,
        nombre_rol: usuarioDB.nombre_rol,
        permisos,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);

    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        ok: false,
        message:
          'Falta la tabla login_intentos en la base de datos. Ejecuta database/login_intentos.sql',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = {
  login,
  MAX_INTENTOS,
};
