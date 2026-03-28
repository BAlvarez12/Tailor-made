import "./unidades.css";

export default function unidadesHeader({
  selected,
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  showFilterMenu,
  setShowFilterMenu,
  showActionMenu,
  setShowActionMenu,
  onCreateClick,
  onActionClick,
  actionLabel
}) {
  return (
    <div className="tm-users__header">
      <div>
        <h1>Unidades de medida</h1>
        <p>Listado de unidades registradas en el sistema.</p>
      </div>

      {selected.length === 0 ? (
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
              <svg className="filter-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0114 15.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-5.586a1 1 0 00-.293-.707L1.293 8.707A1 1 0 011 8V6z" fill="currentColor"/>
              </svg>
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
      ) : (
        <div className="search-filter-container">
          <div className="acciones-dropdown" style={{ position: "relative" }}>
            <button className="button" onClick={() => setShowActionMenu(!showActionMenu)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                className="svg-icon"
              >
                <g strokeWidth="1.5" strokeLinecap="round" stroke="#5d41de">
                  <circle cx="10" cy="10" r="2.5"></circle>
                  <path d="m8.39079 2.80235c.53842-1.51424 2.67991-1.51424 3.21831-.00001.3392.95358 1.4284 1.40477 2.3425.97027 1.4514-.68995 2.9657.82427 2.2758 2.27575-.4345.91407.0166 2.00334.9702 2.34248 1.5143.53842 1.5143 2.67996 0 3.21836-.9536.3391-1.4047 1.4284-.9702 2.3425.6899 1.4514-.8244 2.9656-2.2758 2.2757-.9141-.4345-2.0033.0167-2.3425.9703-.5384 1.5142-2.67989 1.5142-3.21831 0-.33914-.9536-1.4284-1.4048-2.34247-.9703-1.45148.6899-2.96571-.8243-2.27575-2.2757.43449-.9141-.01669-2.0034-.97028-2.3425-1.51422-.5384-1.51422-2.67994.00001-3.21836.95358-.33914 1.40476-1.42841.97027-2.34248-.68996-1.45148.82427-2.9657 2.27575-2.27575.91407.4345 2.00333-.01669 2.34247-.97026z" />
                </g>
              </svg>
              <span className="lable">Acciones</span>
            </button>

            <div className={`dropdown-menu ${showActionMenu ? 'active' : ''}`}>
              <button onClick={() => {
                onActionClick();
                setShowActionMenu(false);
              }}>
                {actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

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
