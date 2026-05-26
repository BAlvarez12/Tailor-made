// Helpers para leer los permisos del usuario logueado.
// Los permisos vienen en `data.usuario.permisos` desde el login y se
// almacenan en localStorage junto con el resto del usuario.

export const obtenerUsuarioActual = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario")) || {};
  } catch {
    return {};
  }
};

export const obtenerPermisosUsuario = () => {
  const usuario = obtenerUsuarioActual();
  return Array.isArray(usuario.permisos) ? usuario.permisos : [];
};

export const tienePermiso = (codigo) => {
  if (!codigo) return true;
  return obtenerPermisosUsuario().includes(codigo);
};

export const tieneAlgunPermiso = (codigos) => {
  if (!Array.isArray(codigos) || codigos.length === 0) return true;
  const permisos = obtenerPermisosUsuario();
  return codigos.some((c) => permisos.includes(c));
};
