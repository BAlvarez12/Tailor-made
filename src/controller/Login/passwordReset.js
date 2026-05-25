const {
  solicitarCodigoRecuperacion,
  reenviarCodigoRecuperacion,
  verificarCodigoRecuperacion,
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

const verificarCodigo = async (req, res) => {
  const resultado = await verificarCodigoRecuperacion(
    obtenerIdentificadorBody(req.body),
    req.body?.codigo
  );
  return res.status(resultado.status).json(resultado.body);
};

const restablecerConCodigo = async (req, res) => {
  const identificador = obtenerIdentificadorBody(req.body);
  const resultado = await restablecerPassword({
    identificador,
    usuario: req.body?.usuario,
    codigo: req.body?.codigo,
    tokenId: req.body?.tokenId,
    password: req.body?.password,
    passwordConfirm: req.body?.passwordConfirm,
  });
  return res.status(resultado.status).json(resultado.body);
};

module.exports = {
  solicitarRecuperacion,
  reenviarRecuperacion,
  verificarCodigo,
  restablecerConCodigo,
};
