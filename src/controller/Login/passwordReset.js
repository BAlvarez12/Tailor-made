const {
  solicitarCodigoRecuperacion,
  reenviarCodigoRecuperacion,
  verificarEnlaceRecuperacion,
  restablecerPassword,
} = require('../../services/passwordResetService');

const obtenerIdentificadorBody = (body) =>
  body?.identificador ?? body?.usuario ?? '';

const solicitarRecuperacion = async (req, res) => {
  const resultado = await solicitarCodigoRecuperacion(
    obtenerIdentificadorBody(req.body)
  );
  return res.status(resultado.status).json(resultado.body);
};

const reenviarRecuperacion = async (req, res) => {
  const resultado = await reenviarCodigoRecuperacion(
    obtenerIdentificadorBody(req.body)
  );
  return res.status(resultado.status).json(resultado.body);
};

const verificarEnlace = async (req, res) => {
  const resultado = await verificarEnlaceRecuperacion({
    identificador: obtenerIdentificadorBody(req.body),
    tokenId: req.body?.tokenId,
    token: req.body?.token,
  });
  return res.status(resultado.status).json(resultado.body);
};

const restablecerConEnlace = async (req, res) => {
  const identificador = obtenerIdentificadorBody(req.body);
  const resultado = await restablecerPassword({
    identificador,
    usuario: req.body?.usuario,
    token: req.body?.token,
    tokenId: req.body?.tokenId,
    password: req.body?.password,
    passwordConfirm: req.body?.passwordConfirm,
  });
  return res.status(resultado.status).json(resultado.body);
};

module.exports = {
  solicitarRecuperacion,
  reenviarRecuperacion,
  verificarEnlace,
  restablecerConEnlace,
};
