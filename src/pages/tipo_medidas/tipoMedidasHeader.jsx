import SiPermiso from "../../components/SiPermiso";
import "./tipo_medidas.css";

export default function TipoMedidasHeader({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  showFilterMenu,
  setShowFilterMenu,
  onCreateClick,
}) {
  return (
    <div className="tm-users__header">
      <div>
        <h1>Tipos de medida</h1>
        <p>Listado de tipos registrados en el sistema.</p>
      </div>

      <div className="search-filter-container">
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
            </g>
          </svg>
          <input
            placeholder="Buscar"
            type="search"
            className="input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filter-dropdown" style={{ position: "relative" }}>
          <button
            type="button"
            className="filter-button"
            title="Filtrar"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            Filtrar por estado
          </button>
          <div className={`filter-menu ${showFilterMenu ? "active" : ""}`}>
            <button
              type="button"
              className={`filter-option ${filtroEstado === null ? "active" : ""}`}
              onClick={() => {
                setFiltroEstado(null);
                setShowFilterMenu(false);
              }}
            >
              Todos
            </button>
            <button
              type="button"
              className={`filter-option ${filtroEstado === 1 ? "active" : ""}`}
              onClick={() => {
                setFiltroEstado(1);
                setShowFilterMenu(false);
              }}
            >
              Activos
            </button>
            <button
              type="button"
              className={`filter-option ${filtroEstado === 0 ? "active" : ""}`}
              onClick={() => {
                setFiltroEstado(0);
                setShowFilterMenu(false);
              }}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      <div className="tm-users__buttons">
        <SiPermiso codigo="crear_tipo_medidas">
          <button type="button" className="tm-users__create-btn big" onClick={onCreateClick}>
            <span>Crear tipo</span>
          </button>
        </SiPermiso>
      </div>
    </div>
  );
}
