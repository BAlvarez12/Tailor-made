import { Navigate } from 'react-router-dom'
import { tienePermiso, tieneAlgunPermiso } from '../utils/permisosUsuario'

/**
 * Redirige al home si el usuario no tiene el permiso requerido.
 *
 * Uso:
 *   <PermissionRoute codigo="ver_clientes">
 *     <Clientes />
 *   </PermissionRoute>
 *
 *   <PermissionRoute codigos={["ver_roles", "editar_roles"]}>
 *     <PaginaRoles />
 *   </PermissionRoute>
 */
function PermissionRoute({ codigo, codigos, children, redirectTo = '/home' }) {
  const ok = Array.isArray(codigos)
    ? tieneAlgunPermiso(codigos)
    : tienePermiso(codigo)

  if (!ok) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

export default PermissionRoute
