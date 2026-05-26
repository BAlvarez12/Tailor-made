import SiPermiso from "../../components/SiPermiso";
import "./unidades.css";

export default function UnidadesTable({ unidades, onEdit }) {
  return (
    <div
      className="tm-users__table-wrapper"
    >
      <table className="tm-users__table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Símbolo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {unidades.map((u) => (
            <tr key={u.unidad_id}>
              <td>{u.nombre_unidad}</td>
              <td>{u.simbolo_unidad}</td>

              <td>
                <span
                  className={`tm-users__badge ${
                    u.estado === 1
                      ? "tm-users__badge--active"
                      : "tm-users__badge--inactive"
                  }`}
                >
                  {u.estado === 1 ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <SiPermiso codigo="editar_unidades_medidas">
                  <button
                    type="button"
                    className="tm-users__btn-accion tm-users__btn-accion--editar"
                    onClick={() => onEdit(u)}
                  >
                    Editar
                  </button>
                </SiPermiso>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

