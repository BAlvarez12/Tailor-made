import "./tipo_medidas.css";

export default function tipoMedidasTable({
  tipos,
  selected,
  setSelected,
  handleSelectAll,
  handleSelectOne,
  onRowClick
}) {
  return (
    <div className="tm-users__table-wrapper">
      <table className="tm-users__table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className="ui-checkbox"
                checked={selected.length === tipos.length && tipos.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {tipos.map((t) => (
            <tr
              key={t.tipo_medida_id}
              onClick={() => onRowClick(t)}
            >
              <td>
                <input
                  type="checkbox"
                  className="ui-checkbox"
                  checked={selected.includes(t.tipo_medida_id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleSelectOne(t.tipo_medida_id)}
                />
              </td>

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}