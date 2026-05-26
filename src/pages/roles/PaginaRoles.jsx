import { useCallback, useEffect, useState } from "react";
import { Shield, Plus, Edit3 } from "lucide-react";
import { obtenerRolesService } from "../../services/rolesService";
import { listarPermisosService } from "../../services/permisosService";
import FormularioRol from "./FormularioRol";
import SiPermiso from "../../components/SiPermiso";
import "./roles.css";

function PaginaRoles() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [rolEditarId, setRolEditarId] = useState(null);

  const cargarRoles = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const data = await obtenerRolesService();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los roles.");
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarPermisos = useCallback(async () => {
    try {
      const data = await listarPermisosService();
      setPermisos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPermisos([]);
    }
  }, []);

  useEffect(() => {
    cargarRoles();
    cargarPermisos();
  }, [cargarRoles, cargarPermisos]);

  const abrirCrear = () => {
    setRolEditarId(null);
    setMostrarForm(true);
  };

  const abrirEditar = (rolId) => {
    setRolEditarId(rolId);
    setMostrarForm(true);
  };

  const cerrarForm = (refresh) => {
    setMostrarForm(false);
    setRolEditarId(null);
    if (refresh) cargarRoles();
  };

  return (
    <div className="roles-page">
      <header className="roles-page__header">
        <div>
          <h1 className="roles-page__title">
            <Shield size={22} /> Roles y permisos
          </h1>
          <p className="roles-page__subtitle">
            Define los perfiles del sistema y asigna qué puede hacer cada uno.
          </p>
        </div>
        <SiPermiso codigo="crear_roles">
          <button
            type="button"
            className="roles-page__btn-create"
            onClick={abrirCrear}
          >
            <Plus size={16} /> Crear rol
          </button>
        </SiPermiso>
      </header>

      {cargando ? (
        <div className="roles-page__state">Cargando roles...</div>
      ) : error ? (
        <div className="roles-page__state roles-page__state--error">
          <span>{error}</span>
          <button type="button" onClick={cargarRoles}>
            Reintentar
          </button>
        </div>
      ) : roles.length === 0 ? (
        <div className="roles-page__state">
          No hay roles creados aún. Usa «Crear rol» para empezar.
        </div>
      ) : (
        <div className="roles-page__table-wrap">
          <table className="roles-page__table">
            <thead>
              <tr>
                <th>Nombre del rol</th>
                <th className="roles-page__table-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => (
                <tr key={rol.rol_id}>
                  <td>{rol.nombre_rol}</td>
                  <td>
                    <SiPermiso codigo="editar_roles" fallback={<span className="roles-page__no-action">—</span>}>
                      <button
                        type="button"
                        className="roles-page__btn-edit"
                        onClick={() => abrirEditar(rol.rol_id)}
                      >
                        <Edit3 size={14} /> Editar
                      </button>
                    </SiPermiso>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormularioRol
        open={mostrarForm}
        rolId={rolEditarId}
        permisosBackend={permisos}
        onClose={cerrarForm}
      />
    </div>
  );
}

export default PaginaRoles;
