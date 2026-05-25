const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { enviarCorreoRecuperacion } = require('./mailService');

const MINUTOS_VALIDEZ = 5;
const LONGITUD_CODIGO = 8;
const CARACTERES_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const MENSAJE_GENERICO =
  'Si la cuenta está registrada, enviamos un código al correo electrónico asociado.';

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

const generarCodigoRecuperacion = () => {
  let codigo = '';
  const bytes = crypto.randomBytes(LONGITUD_CODIGO);
  for (let i = 0; i < LONGITUD_CODIGO; i += 1) {
    codigo += CARACTERES_CODIGO[bytes[i] % CARACTERES_CODIGO.length];
  }
  return codigo;
};

const invalidarTokensPendientes = async (usuario) => {
  await pool.query(
    `UPDATE password_reset_tokens
     SET invalidado = 1
     WHERE usuario = ? AND usado = 0`,
    [usuario]
  );
};

/** Solo puede existir un token activo: invalida los demás pendientes del usuario. */
const invalidarTokensExcepto = async (usuario, tokenIdActivo) => {
  await pool.query(
    `UPDATE password_reset_tokens
     SET invalidado = 1
     WHERE usuario = ?
       AND usado = 0
       AND token_id <> ?`,
    [usuario, tokenIdActivo]
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

const crearYEnviarCodigo = async (usuarioDB) => {
  const usuario = usuarioDB.usuario;
  const email = String(usuarioDB.email || '').trim();

  if (!email) {
    return { enviado: false };
  }

  await invalidarTokensPendientes(usuario);

  const codigoPlano = generarCodigoRecuperacion();
  const codigoHash = await bcrypt.hash(codigoPlano, 10);
  const expiraEn = expiraEnDesdeAhora();

  await pool.query(
    `INSERT INTO password_reset_tokens (
      usuario, usuario_id, codigo_hash, expira_en, usado, invalidado
    ) VALUES (?, ?, ?, ?, 0, 0)`,
    [usuario, usuarioDB.usuario_id, codigoHash, expiraEn]
  );

  await enviarCorreoRecuperacion({
    email,
    codigo: codigoPlano,
    minutosValidez: MINUTOS_VALIDEZ,
  });

  return { enviado: true, expiraEn };
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
      const resultado = await crearYEnviarCodigo(usuarioDB);
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

const verificarCodigoRecuperacion = async (identificadorInput, codigoInput) => {
  const identificador = normalizarIdentificador(identificadorInput);
  const codigoLimpio = String(codigoInput || '').trim().toUpperCase();

  if (!identificador || codigoLimpio.length < LONGITUD_CODIGO) {
    return {
      status: 400,
      body: {
        ok: false,
        message:
          'Usuario o correo y código de 8 caracteres son obligatorios.',
      },
    };
  }

  const cuenta = await resolverCuentaRecuperacion(identificador);

  if (!cuenta) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'El código no es válido o ya venció. Solicita uno nuevo.',
        codigoInvalido: true,
      },
    };
  }

  const usuario = cuenta.usuario;

  const token = await obtenerTokenActivoUnico(usuario);

  if (!token) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'El código no es válido o ya venció. Solicita uno nuevo.',
        codigoInvalido: true,
      },
    };
  }

  await invalidarTokensExcepto(usuario, token.token_id);

  const codigoValido = await bcrypt.compare(codigoLimpio, token.codigo_hash);

  if (!codigoValido) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'El código ingresado no es correcto o ya no está vigente.',
        codigoInvalido: true,
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      message: 'Código verificado correctamente.',
      usuario: cuenta.usuario,
      tokenId: token.token_id,
      expiresAt: new Date(token.expira_en).toISOString(),
    },
  };
};

const restablecerPassword = async ({
  usuario: usuarioInput,
  identificador: identificadorInput,
  codigo,
  tokenId,
  password,
  passwordConfirm,
}) => {
  const identificador = normalizarIdentificador(
    identificadorInput ?? usuarioInput
  );
  const codigoLimpio = String(codigo || '').trim().toUpperCase();

  if (!identificador || !codigoLimpio) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'Usuario o correo y código son obligatorios.',
      },
    };
  }

  const cuenta = await resolverCuentaRecuperacion(identificador);

  if (!cuenta) {
    return {
      status: 400,
      body: {
        ok: false,
        message:
          'El código ya no es válido (venció o fue reemplazado). Solicita uno nuevo.',
        codigoInvalido: true,
      },
    };
  }

  const usuario = cuenta.usuario;

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

  const tokenIdNum = Number(tokenId);

  if (!tokenIdNum) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'Sesión de recuperación inválida. Verifica el código nuevamente.',
        codigoInvalido: true,
      },
    };
  }

  const token = await obtenerTokenPorId(usuario, tokenIdNum);

  if (!token) {
    return {
      status: 400,
      body: {
        ok: false,
        message:
          'El código ya no es válido (venció o fue reemplazado). Solicita uno nuevo.',
        codigoInvalido: true,
      },
    };
  }

  const tokenActivo = await obtenerTokenActivoUnico(usuario);

  if (!tokenActivo || Number(tokenActivo.token_id) !== tokenIdNum) {
    return {
      status: 400,
      body: {
        ok: false,
        message:
          'Este código ya no está vigente. Usa el último código enviado a tu correo.',
        codigoInvalido: true,
      },
    };
  }

  const codigoValido = await bcrypt.compare(codigoLimpio, token.codigo_hash);

  if (!codigoValido) {
    return {
      status: 400,
      body: {
        ok: false,
        message: 'El código ingresado no es correcto.',
        codigoInvalido: true,
      },
    };
  }

  const passwordHash = await bcrypt.hash(String(password).trim(), 10);

  await pool.query('UPDATE usuarios SET password = ? WHERE usuario_id = ?', [
    passwordHash,
    cuenta.usuario_id,
  ]);

  await pool.query(
    'UPDATE password_reset_tokens SET usado = 1, invalidado = 1 WHERE token_id = ?',
    [token.token_id]
  );

  await pool.query(
    `UPDATE password_reset_tokens
     SET invalidado = 1
     WHERE usuario = ? AND token_id <> ?`,
    [usuario, token.token_id]
  );

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
  password,
  passwordConfirm,
}) => {
  const identificador = normalizarIdentificador(usuarioInput);

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

  if (!tokenIdNum) {
    return {
      status: 400,
      body: { ok: false, message: 'Enlace de invitación inválido.' },
    };
  }

  const token = await obtenerTokenPorId(usuario, tokenIdNum);

  if (!token) {
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

  const passwordHash = await bcrypt.hash(String(password).trim(), 10);

  await pool.query('UPDATE usuarios SET password = ?, estado = 1 WHERE usuario_id = ?', [
    passwordHash,
    cuenta.usuario_id,
  ]);

  await pool.query(
    'UPDATE password_reset_tokens SET usado = 1, invalidado = 1 WHERE token_id = ?',
    [token.token_id]
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
  verificarCodigoRecuperacion,
  restablecerPassword,
  activarCuentaInvitacion,
  validarReglasPassword,
};
