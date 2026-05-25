export const ESTADO_USUARIO = {
  INACTIVO: 0,
  ACTIVO: 1,
  INVITACION: 2,
};

export const etiquetaEstadoUsuario = (estado) => {
  const valor = Number(estado);
  if (valor === ESTADO_USUARIO.ACTIVO) return "Activo";
  if (valor === ESTADO_USUARIO.INVITACION) return "Invitación enviada";
  return "Inactivo";
};

export const claseBadgeEstadoUsuario = (estado) => {
  const valor = Number(estado);
  if (valor === ESTADO_USUARIO.ACTIVO) return "tm-users__badge--active";
  if (valor === ESTADO_USUARIO.INVITACION) return "tm-users__badge--pending";
  return "tm-users__badge--inactive";
};
