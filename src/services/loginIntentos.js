const pool = require('../config/db');

const MAX_INTENTOS = 3;
const MINUTOS_BLOQUEO = 15;

const normalizarUsuario = (usuario) => String(usuario || '').trim();

const asegurarRegistro = async (usuario) => {
  await pool.query(
    `INSERT INTO login_intentos (usuario, intentos)
     VALUES (?, 0)
     ON DUPLICATE KEY UPDATE usuario = usuario`,
    [usuario]
  );
};

const obtenerRegistro = async (usuario) => {
  await asegurarRegistro(usuario);
  const [rows] = await pool.query(
    'SELECT usuario, intentos, bloqueado_hasta FROM login_intentos WHERE usuario = ? LIMIT 1',
    [usuario]
  );
  return rows[0];
};

const limpiarBloqueoExpirado = async (usuario) => {
  await pool.query(
    `UPDATE login_intentos
     SET intentos = 0, bloqueado_hasta = NULL
     WHERE usuario = ? AND bloqueado_hasta IS NOT NULL AND bloqueado_hasta <= NOW()`,
    [usuario]
  );
};

const calcularMinutosRestantes = (bloqueadoHasta) => {
  const diffMs = new Date(bloqueadoHasta).getTime() - Date.now();
  return Math.max(1, Math.ceil(diffMs / 60000));
};

const verificarBloqueo = async (usuario) => {
  const nombre = normalizarUsuario(usuario);
  if (!nombre) return { bloqueado: false };

  await limpiarBloqueoExpirado(nombre);
  const registro = await obtenerRegistro(nombre);

  if (!registro?.bloqueado_hasta) {
    return { bloqueado: false };
  }

  const bloqueadoHasta = new Date(registro.bloqueado_hasta);
  if (bloqueadoHasta <= new Date()) {
    await reiniciarIntentos(nombre);
    return { bloqueado: false };
  }

  return {
    bloqueado: true,
    minutosRestantes: calcularMinutosRestantes(bloqueadoHasta),
    intentosRestantes: 0,
  };
};

const registrarIntentoFallido = async (usuario) => {
  const nombre = normalizarUsuario(usuario);
  await limpiarBloqueoExpirado(nombre);
  const registro = await obtenerRegistro(nombre);
  const nuevosIntentos = (registro?.intentos || 0) + 1;

  if (nuevosIntentos >= MAX_INTENTOS) {
    await pool.query(
      `UPDATE login_intentos
       SET intentos = ?, bloqueado_hasta = DATE_ADD(NOW(), INTERVAL ? MINUTE), ultimo_intento = NOW()
       WHERE usuario = ?`,
      [nuevosIntentos, MINUTOS_BLOQUEO, nombre]
    );

    return {
      bloqueado: true,
      intentosRestantes: 0,
      minutosRestantes: MINUTOS_BLOQUEO,
    };
  }

  await pool.query(
    `UPDATE login_intentos
     SET intentos = ?, ultimo_intento = NOW()
     WHERE usuario = ?`,
    [nuevosIntentos, nombre]
  );

  return {
    bloqueado: false,
    intentosRestantes: MAX_INTENTOS - nuevosIntentos,
  };
};

const reiniciarIntentos = async (usuario) => {
  const nombre = normalizarUsuario(usuario);
  if (!nombre) return;

  await pool.query(
    `UPDATE login_intentos
     SET intentos = 0, bloqueado_hasta = NULL, ultimo_intento = NULL
     WHERE usuario = ?`,
    [nombre]
  );
};

module.exports = {
  MAX_INTENTOS,
  MINUTOS_BLOQUEO,
  normalizarUsuario,
  verificarBloqueo,
  registrarIntentoFallido,
  reiniciarIntentos,
};
