import { tienePermiso, tieneAlgunPermiso } from "../utils/permisosUsuario";

/**
 * Renderiza `children` solo si el usuario actual tiene el permiso.
 *
 * Uso:
 *   <SiPermiso codigo="crear_clientes">
 *     <button>Crear cliente</button>
 *   </SiPermiso>
 *
 *   <SiPermiso codigos={["editar_clientes", "ver_clientes"]}>
 *     ...
 *   </SiPermiso>
 */
function SiPermiso({ codigo, codigos, fallback = null, children }) {
  const ok = Array.isArray(codigos)
    ? tieneAlgunPermiso(codigos)
    : tienePermiso(codigo);

  return ok ? children : fallback;
}

export default SiPermiso;
