const {
  normalizarUsuario,
  verificarBloqueo,
} = require('../services/loginIntentos');

const verificarBloqueoLogin = async (req, res, next) => {
  try {
    const usuario = normalizarUsuario(req.body?.usuario);
    if (!usuario) return next();

    const bloqueo = await verificarBloqueo(usuario);

    if (bloqueo.bloqueado) {
      return res.status(429).json({
        ok: false,
        bloqueado: true,
        intentosRestantes: 0,
        minutosRestantes: bloqueo.minutosRestantes,
        message: `Demasiados intentos fallidos. Acceso bloqueado por ${bloqueo.minutosRestantes} minuto(s).`,
      });
    }

    next();
  } catch (error) {
    console.error('Error en verificarBloqueoLogin:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = { verificarBloqueoLogin };
