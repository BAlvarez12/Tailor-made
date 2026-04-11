import "./unidades.css";

export default function unidadesHeader({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  showFilterMenu,
  setShowFilterMenu,
  onCreateClick
}) {
  const filterLabel =
    filtroEstado === null ? "Todos" : filtroEstado === 1 ? "Activos" : "Inactivos";

  return (
    <div className="tm-users__header">
      <div>
        <h1>Unidades de medida</h1>
       {/* <p>Listado de unidades registradas en el sistema.</p> */}
      </div>

      <div className="search-filter-container">
        <div className="group">
          <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
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
          <button className="filter-button" title="Filtrar" onClick={() => setShowFilterMenu(!showFilterMenu)}>
            <span>{filterLabel}</span>
          </button>
          <div className={`filter-menu ${showFilterMenu ? 'active' : ''}`}>
            <button 
              className={`filter-option ${filtroEstado === null ? 'active' : ''}`}
              onClick={() => {
                setFiltroEstado(null);
                setShowFilterMenu(false);
              }}
            >
              Todos
            </button>
            <button 
              className={`filter-option ${filtroEstado === 1 ? 'active' : ''}`}
              onClick={() => {
                setFiltroEstado(1);
                setShowFilterMenu(false);
              }}
            >
              Activos
            </button>
            <button 
              className={`filter-option ${filtroEstado === 0 ? 'active' : ''}`}
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
        <button
          className="tm-users__create-btn big"
          onClick={onCreateClick}
        >
          <span>Crear unidad</span>
        </button>
      </div>
    </div>
  );
}
