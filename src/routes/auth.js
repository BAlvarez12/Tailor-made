const express = require('express');
const router = express.Router();
const { login } = require('../controller/login/auth.js');
const {
  solicitarRecuperacion,
  reenviarRecuperacion,
  verificarEnlace,
  restablecerConEnlace,
} = require('../controller/login/passwordReset.js');
const { activarCuenta } = require('../controller/login/activarCuenta.js');
const { verificarBloqueoLogin } = require('../middleware/loginAttempts');
const { tiempoRespuestaMinimo } = require('../middleware/tiempoRespuestaMinimo');

// Defensa contra timing attacks: forzamos 1.5s mínimo en login y recuperación
// para que un atacante no pueda inferir si un usuario/email existe por la
// diferencia de tiempo entre respuestas.
const minimoAuth = tiempoRespuestaMinimo(1500);

router.post('/login', minimoAuth, verificarBloqueoLogin, login);
router.post('/olvide-contrasena/solicitar', minimoAuth, solicitarRecuperacion);
router.post('/olvide-contrasena/reenviar', minimoAuth, reenviarRecuperacion);
router.post('/olvide-contrasena/verificar-enlace', minimoAuth, verificarEnlace);
router.post('/olvide-contrasena/restablecer', minimoAuth, restablecerConEnlace);
router.post('/activar-cuenta', activarCuenta);

module.exports = router;