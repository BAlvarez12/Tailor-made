const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const {
  enviarCorreoRecuperacion,
  enviarCorreoCambioPassword,
} = require('./mailService');

const MINUTOS_VALIDEZ = 30;
// Bytes de entropía del secreto que viaja en el enlace de recuperación.
const LONGITUD_TOKEN_ENLACE = 32;

const MENSAJE_GENERICO =
  'Si la cuenta está registrada, enviamos un enlace para restablecer la contraseña al correo electrónico asociado.';

const normalizarUsuario = (usuario) => String(usuario || '').trim();

const esCorreoElectronico = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || '').trim());

const normalizarIdentificador = (valor) => {
  const limpio = String(valor || '').trim();
  if (!limpio) return '';
  if (esCorreoElectronico(limpio)) {
    return limpio.toLowerCase();
  }
  return limpio;
};

const expiraEnDesdeAhora = () => {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() + MINUTOS_VALIDEZ);
  return fecha;
};

/** Secreto de un solo uso que viaja dentro del enlace de recuperación. */
const generarTokenEnlace = () =>
  crypto.randomBytes(LONGITUD_TOKEN_ENLACE).toString('hex');

const construirEnlaceRecuperacion = ({ usuario, tokenId, token }) => {
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(
    /\/$/,
    ''
  );
  return (
    `${frontendUrl}/?recuperar=1` +
    `&usuario=${encodeURIComponent(usuario)}` +
    `&tokenId=${tokenId}` +
    `&token=${token}`
  );
};

const invalidarTokensPendientes = async (usuario) => {
  await pool.query(
    `UPDATE password_reset_tokens
     SET invalidado = 1
     WHERE usuario = ? AND usado = 0`,
    [usuario]
  );
};

const obtenerTokenActivoUnico = async (usuario) => {
  const [rows] = await pool.query(
    `SELECT token_id, codigo_hash, expira_en
     FROM password_reset_tokens
     WHERE usuario = ?
       AND usado = 0
       AND invalidado = 0
       AND expira_en > NOW()
     ORDER BY token_id DESC`,
    [usuario]
  );

  if (rows.length === 0) return null;

  const tokenActivo = rows[0];

  if (rows.length > 1) {
    const idsAntiguos = rows.slice(1).map((r) => r.token_id);
    await pool.query(
      `UPDATE password_reset_tokens
       SET invalidado = 1
       WHERE token_id IN (?)`,
      [idsAntiguos]
    );
  }

  return tokenActivo;
};

const obtenerTokenPorId = async (usuario, tokenId) => {
  const [rows] = await pool.query(
    `SELECT token_id, codigo_hash, expira_en
     FROM password_reset_tokens
     WHERE token_id = ?
       AND usuario = ?
       AND usado = 0
       AND invalidado = 0
       AND expira_en > NOW()
     LIMIT 1`,
    [tokenId, usuario]
  );
  return rows[0] || null;
};

const buscarUsuarioActivoPorIdentificador = async (identificadorInput) => {
  const identificador = normalizarIdentificador(identificadorInput);
  if (!identificador) return null;

  let rows;

  if (esCorreoElectronico(identificador)) {
    [rows] = await pool.query(
      `SELECT usuario_id, usuario, email, estado
       FROM usuarios
       WHERE LOWER(TRIM(email)) = ?
       LIMIT 1`,
      [identificador]
    );
  } else {
    [rows] = await pool.query(
      `SELECT usuario_id, usuario, email, estado
       FROM usuarios
       WHERE usuario = ?
       LIMIT 1`,
      [identificador]
    );
  }

  return rows[0] || null;
};

const resolverCuentaRecuperacion = async (identificadorInput) => {
  const usuarioDB = await buscarUsuarioActivoPorIdentificador(identificadorInput);
  if (!usuarioDB || Number(usuarioDB.estado) !== 1) {
    return null;
  }
  return usuarioDB;
};

const resolverCuentaInvitacionPendiente = async (identificadorInput) => {
  const usuarioDB = await buscarUsuarioActivoPorIdentificador(identificadorInput);
  if (!usuarioDB || Number(usuarioDB.estado) !== 2) {
    return null;
  }
  return usuarioDB;
};

const crearYEnviarEnlace = async (usuarioDB) => {
  const usuario = usuarioDB.usuario;
  const email = String(usuarioDB.email || '').trim();

  if (!email) {
    return { enviado: false };
  }

  // Solo puede existir un enlace activo: invalidamos los pendientes anteriores
  // para que el último enviado sea el único válido (uso único).
  await invalidarTokensPendientes(usuario);

  const tokenPlano = generarTokenEnlace();
  const codigoHash = await bcrypt.hash(tokenPlano, 10);
  const expiraEn = expiraEnDesdeAhora();

  const [result] = await pool.query(
    `INSERT INTO password_reset_tokens (
      usuario, usuario_id, codigo_hash, expira_en, usado, invalidado
    ) VALUES (?, ?, ?, ?, 0, 0)`,
    [usuario, usuarioDB.usuario_id, codigoHash, expiraEn]
  );

  const tokenId = result.insertId;
  const enlaceRecuperacion = construirEnlaceRecuperacion({
    usuario,
    tokenId,
    token: tokenPlano,
  });

  await enviarCorreoRecuperacion({
    email,
    enlaceRecuperacion,
    minutosValidez: MINUTOS_VALIDEZ,
  });

  return { enviado: true, tokenId, expiraEn, enlaceRecuperacion };
};

const respuestaSolicitud = (expiraEnReferencia = null) => {
  const expiraEn = expiraEnReferencia || expiraEnDesdeAhora();
  return {
    ok: true,
    message: MENSAJE_GENERICO,
    expiresAt: expiraEn.toISOString(),
    minutosValidez: MINUTOS_VALIDEZ,
  };
};

const solicitarCodigoRecuperacion = async (identificadorInput) => {
  const identificador = normalizarIdentificador(identificadorInput);

  if (!identificador) {
    return {
      ok: false,
      status: 400,
      body: {
        ok: false,
        message: 'El usuario o correo electrónico es obligatorio.',
      },
    };
  }

  try {
    const usuarioDB = await buscarUsuarioActivoPorIdentificador(identificador);

    let expiraReferencia = null;

    if (usuarioDB && Number(usuarioDB.estado) === 1) {
      const resultado = await crearYEnviarEnlace(usuarioDB);
      if (resultado?.expiraEn) {
        expiraReferencia = resultado.expiraEn;
      }
    }

    return {
      ok: true,
      status: 200,
      body: respuestaSolicitud(expiraReferencia),
    };
  } catch (error) {
    console.error('Error en solicitarCodigoRecuperacion:', error);

    if (error.code === 'ER_NO_SUCH_TABLE') {
      return {
        ok: false,
        status: 500,
        body: {
          ok: false,
          message:
            'Falta la tabla password_reset_tokens. Ejecuta database/password_reset_tokens.sql',
        },
      };
    }

    if (error.message?.includes('Configuración de correo')) {
      return {
        ok: false,
        status: 500,
        body: {
          ok: false,
          message: 'El servicio de correo no está configurado. Contacta al administrador.',
        },
      };
    }

    return {
      ok: false,
      status: 500,
      body: { ok: false, message: 'No se pudo procesar la solicitud.' },
    };
  }
};

const reenviarCodigoRecuperacion = async (usuarioInput) => {
  return solicitarCodigoRecuperacion(usuarioInput);
};

const validarReglasPassword = (password) => {
  const valor = String(password || '');
  if (valor.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }
  if (!/[a-z]/.test(valor)) {
    return 'La contraseña debe incluir al menos una letra minúscula.';
  }
  if (!/[A-Z]/.test(valor)) {
    return 'La contraseña debe incluir al menos una letra mayúscula.';
  }
  if (!/\d/.test(valor)) {
    return 'La contraseña debe incluir al menos un número.';
  }
  if (!/[^A-Za-z0-9]/.test(valor)) {
    return 'La contraseña debe incluir al menos un símbolo.';
  }
  return null;
};

const respuestaEnlaceInvalido = (message) => ({
  status: 400,
  body: {
    ok: false,
    message:
      message ||
      'El enlace no es válido, ya venció o fue reemplazado. Solicita uno nuevo.',
    enlaceInvalido: true,
  },
});

/**
 * Resuelve y valida el enlace de recuperación (cuenta + token).
 * Comprueba que el token exista, no esté usado/invalidado/vencido, que sea el
 * único activo del usuario y que el secreto del enlace coincida con el hash.
 */
const resolverEnlaceRecuperacion = async ({ identificador, tokenId, token }) => {
  const id = normalizarIdentificador(identificador);
  const tokenIdNum = Number(tokenId);
  const secreto = String(token || '').trim();

  if (!id || !tokenIdNum || !secreto) {
    return { error: respuestaEnlaceInvalido('El enlace está incompleto o es inválido.') };
  }

  const cuenta = await resolverCuentaRecuperacion(id);
  if (!cuenta) {
    return { error: respuestaEnlaceInvalido() };
  }

  const usuario = cuenta.usuario;
  const tokenRow = await obtenerTokenPorId(usuario, tokenIdNum);
  if (!tokenRow) {
    return { error: respuestaEnlaceInvalido() };
  }

  // Solo el último enlace enviado puede usarse.
  const tokenActivo = await obtenerTokenActivoUnico(usuario);
  if (!tokenActivo || Number(tokenActivo.token_id) !== tokenIdNum) {
    return { error: respuestaEnlaceInvalido('Este enlace ya no está vigente. Usa el último que enviamos a tu correo.') };
  }

  const secretoValido = await bcrypt.compare(secreto, tokenRow.codigo_hash);
  if (!secretoValido) {
    return { error: respuestaEnlaceInvalido() };
  }

  return { cuenta, token: tokenRow };
};

/** Valida el enlace al abrir la pantalla, sin consumirlo todavía. */
const verificarEnlaceRecuperacion = async ({ identificador, tokenId, token }) => {
  const resultado = await resolverEnlaceRecuperacion({ identificador, tokenId, token });

  if (resultado.error) {
    return resultado.error;
  }

  return {
    status: 200,
    body: {
      ok: true,
      message: 'Enlace válido. Crea tu nueva contraseña.',
      usuario: resultado.cuenta.usuario,
      tokenId: resultado.token.token_id,
      expiresAt: new Date(resultado.token.expira_en).toISOString(),
    },
  };
};

const restablecerPassword = async ({
  usuario: usuarioInput,
  identificador: identificadorInput,
  token,
  tokenId,
  password,
  passwordConfirm,
}) => {
  const identificador = identificadorInput ?? usuarioInput;

  if (!password || !passwordConfirm) {
    return {
      status: 400,
      body: { ok: false, message: 'Debes ingresar y confirmar la nueva contraseña.' },
    };
  }

  if (password !== passwordConfirm) {
    return {
      status: 400,
      body: { ok: false, message: 'Las contraseñas no coinciden.' },
    };
  }

  const errorPassword = validarReglasPassword(password);
  if (errorPassword) {
    return { status: 400, body: { ok: false, message: errorPassword } };
  }

  const resultado = await resolverEnlaceRecuperacion({ identificador, tokenId, token });

  if (resultado.error) {
    return resultado.error;
  }

  const { cuenta, token: tokenRow } = resultado;
  const usuario = cuenta.usuario;

  const passwordHash = await bcrypt.hash(String(password).trim(), 10);

  await pool.query('UPDATE usuarios SET password = ? WHERE usuario_id = ?', [
    passwordHash,
    cuenta.usuario_id,
  ]);

  // Uso único: el enlace queda marcado como usado e invalidado.
  await pool.query(
    'UPDATE password_reset_tokens SET usado = 1, invalidado = 1 WHERE token_id = ?',
    [tokenRow.token_id]
  );

  await pool.query(
    `UPDATE password_reset_tokens
     SET invalidado = 1
     WHERE usuario = ? AND token_id <> ?`,
    [usuario, tokenRow.token_id]
  );

  // Aviso de seguridad: notificamos que la contraseña cambió. Si falla el
  // correo NO revertimos el cambio, solo lo registramos.
  const correoCambio = String(cuenta.email || '').trim();
  if (correoCambio) {
    try {
      await enviarCorreoCambioPassword({ email: correoCambio });
    } catch (errorCorreo) {
      console.error('No se pudo enviar el aviso de cambio de contraseña:', errorCorreo);
    }
  }

  return {
    status: 200,
    body: {
      ok: true,
      message: 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
    },
  };
};

const activarCuentaInvitacion = async ({
  usuario: usuarioInput,
  tokenId,
  token,
  password,
  passwordConfirm,
}) => {
  const identificador = normalizarIdentificador(usuarioInput);
  const secreto = String(token || '').trim();

  if (!identificador) {
    return {
      status: 400,
      body: { ok: false, message: 'El usuario es obligatorio.' },
    };
  }

  const cuenta = await resolverCuentaInvitacionPendiente(identificador);

  if (!cuenta) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'La invitación no es válida, ya fue utilizada o la cuenta ya está activa.',
      },
    };
  }

  const usuario = cuenta.usuario;

  if (!password || !passwordConfirm) {
    return {
      status: 400,
      body: { ok: false, message: 'Debes ingresar y confirmar tu contraseña.' },
    };
  }

  if (password !== passwordConfirm) {
    return {
      status: 400,
      body: { ok: false, message: 'Las contraseñas no coinciden.' },
    };
  }

  const errorPassword = validarReglasPassword(password);
  if (errorPassword) {
    return { status: 400, body: { ok: false, message: errorPassword } };
  }

  const tokenIdNum = Number(tokenId);

  if (!tokenIdNum || !secreto) {
    return {
      status: 400,
      body: { ok: false, message: 'Enlace de invitación inválido.' },
    };
  }

  const tokenRow = await obtenerTokenPorId(usuario, tokenIdNum);

  if (!tokenRow) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'La invitación venció o ya fue utilizada. Solicita una nueva al administrador.',
      },
    };
  }

  const tokenActivo = await obtenerTokenActivoUnico(usuario);

  if (!tokenActivo || Number(tokenActivo.token_id) !== tokenIdNum) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'Este enlace de invitación ya no está vigente.',
      },
    };
  }

  // Validamos el secreto del enlace contra el hash almacenado: impide activar
  // cuentas adivinando el tokenId (que es secuencial).
  const secretoValido = await bcrypt.compare(secreto, tokenRow.codigo_hash);
  if (!secretoValido) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'Enlace de invitación inválido o ya utilizado. Solicita uno nuevo al administrador.',
      },
    };
  }

  const passwordHash = await bcrypt.hash(String(password).trim(), 10);

  await pool.query('UPDATE usuarios SET password = ?, estado = 1 WHERE usuario_id = ?', [
    passwordHash,
    cuenta.usuario_id,
  ]);

  await pool.query(
    'UPDATE password_reset_tokens SET usado = 1, invalidado = 1 WHERE token_id = ?',
    [tokenRow.token_id]
  );

  return {
    status: 200,
    body: {
      ok: true,
      message: 'Cuenta activada correctamente. Ya puedes iniciar sesión.',
    },
  };
};

module.exports = {
  MINUTOS_VALIDEZ,
  MENSAJE_GENERICO,
  normalizarUsuario,
  solicitarCodigoRecuperacion,
  reenviarCodigoRecuperacion,
  verificarEnlaceRecuperacion,
  restablecerPassword,
  activarCuentaInvitacion,
  validarReglasPassword,
  crearYEnviarEnlace,
};
