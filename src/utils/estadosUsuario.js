const ESTADO_USUARIO = {
  INACTIVO: 0,
  ACTIVO: 1,
  INVITACION_ENVIADA: 2,
};

const esEstadoUsuarioValido = (estado) =>
  [ESTADO_USUARIO.INACTIVO, ESTADO_USUARIO.ACTIVO, ESTADO_USUARIO.INVITACION_ENVIADA].includes(
    Number(estado)
  );

module.exports = {
  ESTADO_USUARIO,
  esEstadoUsuarioValido,
};
