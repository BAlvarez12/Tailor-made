import "./tipo_medidas.css";

export default function tipoMedidasTable({
  tipos,
  onEditClick
}) {
  return (
    <div className="tm-users__table-wrapper">
      <table className="tm-users__table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tipos.map((t) => (
            <tr key={t.tipo_medida_id}>
              <td>{t.nombre_tipo_medida}</td>
              <td>{t.descripcion_tipo_medida}</td>

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
                <div className="tm-users__actions">
                  <button
                    type="button"
                    className="tm-users__action-btn tm-users__action-btn--edit"
                    onClick={() => onEditClick(t)}
                  >
                    Editar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}