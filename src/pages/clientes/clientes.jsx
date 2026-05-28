import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getClientes } from "../../services/clienteService";
import "../../styles/tmListPage.css";
import "./clientes.css";
import FormularioCliente from "./FormularioCliente";
import ModalMedidas from "./ModalMedidas";
import SiPermiso from "../../components/SiPermiso";

function Clientes() {
  const location = useLocation();
  const navigate = useNavigate();
  const abrirCrearAplicado = useRef(false);

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;

  const [modalClienteAbierto, setModalClienteAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showMedidas, setShowMedidas] = useState(false);
  const [clienteMedidas, setClienteMedidas] = useState(null);
  const [showActualizar, setShowActualizar] = useState(false);
  const [clienteActualizar, setClienteActualizar] = useState(null);

  // Soporte para navegación con `state.abrirCrear` (desde el FAB del MobileNav)
  useEffect(() => {
    if (abrirCrearAplicado.current) return;
    if (location.state?.abrirCrear) {
      abrirCrearAplicado.current = true;
      setClienteSeleccionado(null);
      setModalClienteAbierto(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("No se pudieron cargar los clientes.");
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    let lista = clientes;

    if (filtroEstado !== null) {
      lista = lista.filter((c) => Number(c.estado) === filtroEstado);
    }

    const texto = busqueda.trim().toLowerCase();
    if (!texto) return lista;

    return lista.filter((c) => {
      const nombre = (c.nombre_cliente || "").toLowerCase();
      const apellido = (c.apellido_cliente || "").toLowerCase();
      const telefono = (c.telefono || "").toLowerCase();
      const dpi = (c.dpi || "").toLowerCase();

      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        telefono.includes(texto) ||
        dpi.includes(texto)
      );
    });
  }, [clientes, busqueda, filtroEstado]);

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  const indiceInicial = (paginaActual - 1) * clientesPorPagina;
  const indiceFinal = indiceInicial + clientesPorPagina;

  const clientesPaginados = clientesFiltrados.slice(
    indiceInicial,
    indiceFinal
  );

  return (
    <div className="tm-users">
      <header className="tm-users__header">
        <div>
          <h1>Clientes</h1>
          <p>Administra la información de tus clientes y sus medidas.</p>
        </div>

        <div className="search-filter-container">
          <div className="group">
            <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
              </g>
            </svg>

            <input
              type="search"
              className="input"
              placeholder="Buscar por nombre, teléfono o DPI"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="filter-dropdown">
            <button
              type="button"
              className="filter-button"
              title="Filtrar"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <svg
                className="filter-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0114 15.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-5.586a1 1 0 00-.293-.707L1.293 8.707A1 1 0 011 8V6z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <div className={`filter-menu ${showFilterMenu ? "active" : ""}`}>
              <button
                type="button"
                className={`filter-option ${
                  filtroEstado === null ? "active" : ""
                }`}
                onClick={() => {
                  setFiltroEstado(null);
                  setPaginaActual(1);
                  setShowFilterMenu(false);
                }}
              >
                Todos
              </button>

              <button
                type="button"
                className={`filter-option ${
                  filtroEstado === 1 ? "active" : ""
                }`}
                onClick={() => {
                  setFiltroEstado(1);
                  setPaginaActual(1);
                  setShowFilterMenu(false);
                }}
              >
                Activos
              </button>

              <button
                type="button"
                className={`filter-option ${
                  filtroEstado === 0 ? "active" : ""
                }`}
                onClick={() => {
                  setFiltroEstado(0);
                  setPaginaActual(1);
                  setShowFilterMenu(false);
                }}
              >
                Inactivos
              </button>
            </div>
          </div>
        </div>

        <div className="tm-users__buttons">
          <SiPermiso codigo="crear_clientes">
            <button
              type="button"
              className="tm-users__create-btn"
              onClick={() => {
                setClienteSeleccionado(null);
                setModalClienteAbierto(true);
              }}
            >
              <span>Crear cliente</span>
            </button>
          </SiPermiso>
        </div>
      </header>

      <div className="tm-users__card">
        {loading && <p className="tm-users__state">Cargando clientes...</p>}

        {error && <p className="tm-users__error">{error}</p>}

        {!loading && !error && clientesFiltrados.length === 0 && (
          <p className="tm-users__state">No hay clientes para mostrar.</p>
        )}

        {!loading && !error && clientesFiltrados.length > 0 && (
          <div className="tm-users__table-wrapper">
            <table className="tm-users__table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>DPI</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesPaginados.map((c) => (
                  <tr key={c.cliente_id}>
                    <td data-label="Nombre">
                      <Link
                        to={`/home/clientes/${c.cliente_id}`}
                        className="tm-cliente-link"
                        title="Ver ficha del cliente"
                      >
                        {c.nombre_cliente}
                      </Link>
                    </td>
                    <td data-label="Apellido">{c.apellido_cliente}</td>
                    <td data-label="Teléfono">{c.telefono || "—"}</td>
                    <td data-label="DPI">{c.dpi || "—"}</td>

                    <td data-label="Estado">
                      <span
                        className={`tm-users__badge ${
                          Number(c.estado) === 1
                            ? "tm-users__badge--active"
                            : "tm-users__badge--inactive"
                        }`}
                      >
                        {Number(c.estado) === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td data-label="Acciones">
                      <div className="tm-users__acciones">
                        <SiPermiso codigo="editar_clientes">
                          <button
                            type="button"
                            className="tm-users__btn-accion tm-users__btn-accion--editar"
                            onClick={() => {
                              setClienteSeleccionado(c);
                              setModalClienteAbierto(true);
                            }}
                          >
                            Editar
                          </button>
                        </SiPermiso>

                        <SiPermiso codigo="actualizar_medidas_cliente">
                          <button
                            type="button"
                            className="tm-users__btn-accion tm-users__btn-accion--secundario"
                            onClick={() => {
                              setClienteActualizar(c);
                              setShowActualizar(true);
                            }}
                          >
                            Actualizar medidas
                          </button>
                        </SiPermiso>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="tm-pagination">
                <span className="tm-pagination__results">
                  Mostrando {indiceInicial + 1}-
                  {Math.min(indiceFinal, clientesFiltrados.length)} de{" "}
                  {clientesFiltrados.length} clientes
                </span>

                <div className="tm-pagination__controls">
                  <button
                    type="button"
                    className="tm-pagination__btn"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((prev) => prev - 1)}
                  >
                    Anterior
                  </button>

                  <span className="tm-pagination__info">
                    Página {paginaActual} de {totalPaginas}
                  </span>

                  <button
                    type="button"
                    className="tm-pagination__btn"
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual((prev) => prev + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FormularioCliente
        open={modalClienteAbierto}
        cliente={clienteSeleccionado}
        onClose={() => {
          setModalClienteAbierto(false);
          setClienteSeleccionado(null);
        }}
        onSuccess={async (result) => {
          await cargarClientes();
          setPaginaActual(1);
          setModalClienteAbierto(false);
          setClienteSeleccionado(null);

          if (result?.nuevoCliente) {
            setClienteMedidas(result.nuevoCliente);
            setShowMedidas(true);
          }
        }}
      />

      {showActualizar && (
        <ModalMedidas
          cliente={clienteActualizar}
          onClose={() => setShowActualizar(false)}
        />
      )}

      {showMedidas && (
        <ModalMedidas
          cliente={clienteMedidas}
          sinMedidasRegistradas
          onClose={() => setShowMedidas(false)}
        />
      )}
    </div>
  );
}

export default Clientes;