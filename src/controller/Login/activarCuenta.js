const { activarCuentaInvitacion } = require('../../services/passwordResetService');

const activarCuenta = async (req, res) => {
  const resultado = await activarCuentaInvitacion({
    usuario: req.body?.usuario,
    tokenId: req.body?.tokenId,
    token: req.body?.token,
    password: req.body?.password,
    passwordConfirm: req.body?.passwordConfirm,
  });
  return res.status(resultado.status).json(resultado.body);
};

module.exports = { activarCuenta };
