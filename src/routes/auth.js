const express = require('express');
const router = express.Router();
const { login } = require('../controller/login/auth.js');
const {
  solicitarRecuperacion,
  reenviarRecuperacion,
  verificarCodigo,
  restablecerConCodigo,
} = require('../controller/login/passwordReset.js');
const { activarCuenta } = require('../controller/login/activarCuenta.js');
const { verificarBloqueoLogin } = require('../middleware/loginAttempts');

router.post('/login', verificarBloqueoLogin, login);
router.post('/olvide-contrasena/solicitar', solicitarRecuperacion);
router.post('/olvide-contrasena/reenviar', reenviarRecuperacion);
router.post('/olvide-contrasena/verificar-codigo', verificarCodigo);
router.post('/olvide-contrasena/restablecer', restablecerConCodigo);
router.post('/activar-cuenta', activarCuenta);

module.exports = router;