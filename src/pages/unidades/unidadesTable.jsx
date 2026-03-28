import "./unidades.css";

export default function unidadesTable({
  unidades,
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
                checked={selected.length === unidades.length && unidades.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Nombre</th>
            <th>Símbolo</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {unidades.map((u) => (
            <tr
              key={u.unidad_id}
              onClick={() => onRowClick(u)}
            >
              <td>
                <input
                  type="checkbox"
                  className="ui-checkbox"
                  checked={selected.includes(u.unidad_id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleSelectOne(u.unidad_id)}
                />
              </td>

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
