const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { enviarCorreoInvitacion } = require('./mailService');

const HORAS_VALIDEZ_INVITACION = 72;

const invalidarTokensPendientes = async (usuario) => {
  await pool.query(
    `UPDATE password_reset_tokens
     SET invalidado = 1
     WHERE usuario = ? AND usado = 0`,
    [usuario]
  );
};

const crearTokenInvitacion = async (usuarioDB) => {
  const usuario = usuarioDB.usuario;
  const email = String(usuarioDB.email || '').trim();

  if (!email) {
    return { enviado: false, motivo: 'sin_correo' };
  }

  await invalidarTokensPendientes(usuario);

  const secreto = crypto.randomBytes(24).toString('hex');
  const codigoHash = await bcrypt.hash(secreto, 10);
  const expiraEn = new Date();
  expiraEn.setHours(expiraEn.getHours() + HORAS_VALIDEZ_INVITACION);

  const [result] = await pool.query(
    `INSERT INTO password_reset_tokens (
      usuario, usuario_id, codigo_hash, expira_en, usado, invalidado
    ) VALUES (?, ?, ?, ?, 0, 0)`,
    [usuario, usuarioDB.usuario_id, codigoHash, expiraEn]
  );

  const tokenId = result.insertId;
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(
    /\/$/,
    ''
  );
  const enlaceActivacion =
    `${frontendUrl}/?activar=1` +
    `&usuario=${encodeURIComponent(usuario)}` +
    `&tokenId=${tokenId}` +
    `&token=${secreto}`;

  await enviarCorreoInvitacion({
    email,
    nombreCompleto: `${usuarioDB.nombre_usuario || ''} ${usuarioDB.apellido_usuario || ''}`.trim(),
    usuarioLogin: usuario,
    enlaceActivacion,
    horasValidez: HORAS_VALIDEZ_INVITACION,
  });

  return {
    enviado: true,
    tokenId,
    expiraEn,
    enlaceActivacion,
  };
};

module.exports = {
  HORAS_VALIDEZ_INVITACION,
  crearTokenInvitacion,
};
