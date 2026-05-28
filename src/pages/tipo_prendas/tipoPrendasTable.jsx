import SiPermiso from "../../components/SiPermiso";
import "../unidades/unidades.css";

export default function TipoPrendasTable({ tiposPrenda, onEdit }) {
  return (
    <div className="tm-users__table-wrapper">
      <table className="tm-users__table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tiposPrenda.map((t) => (
            <tr key={t.tipo_prendas_id}>
              <td>{t.nombre}</td>

              <td>
                <span
                  className={`tm-users__badge ${
                    t.estado === 1
                      ? "tm-users__badge--active"
                      : "tm-users__badge--inactive"
                  }`}
                >
                  {t.estado === 1 ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <SiPermiso codigo="editar_tipo_prendas">
                  <button
                    type="button"
                    className="tm-users__btn-accion tm-users__btn-accion--editar"
                    onClick={() => onEdit(t)}
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
