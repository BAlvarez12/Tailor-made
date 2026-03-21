import { useState, useEffect } from "react";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
  restoreCliente,
} from "../../services/clientes/clienteService";
import "./clientes.css";

/* COMPONENTE CLIENTES */
export default function Clientes() {

  /* ESTADOS PRINCIPALES */
  const [clientes, setClientes] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ESTADOS DE UI */
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  /* ESTADO DEL FORMULARIO */
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    apellido_cliente: "",
    telefono: "",
  });

  /* EFECTO: CARGAR CLIENTES */
  useEffect(() => {
    cargarClientes();
  }, [mostrarArchivados]);

  /* FUNCIÓN: OBTENER CLIENTES */
  const cargarClientes = async () => {
    try {
      const data = await getClientes(mostrarArchivados);
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    }
  };

  /* FUNCIÓN: SELECCIONAR TODOS */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(clientes.map((c) => c.cliente_id));
    } else {
      setSelected([]);
    }
  };

  /* FUNCIÓN: SELECCIONAR UNO */
  const handleSelectOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  /* FUNCIÓN: ARCHIVAR CLIENTES */
  const handleArchivar = async () => {
    try {
      for (let id of selected) {
        await deleteCliente(id);
      }
      setSelected([]);
      cargarClientes();
    } catch (error) {
      console.error("Error archivando:", error);
    }
  };

  /* FUNCIÓN: DESARCHIVAR CLIENTE */
  const handleDesarchivar = async () => {
    try {
      await restoreCliente(clienteSeleccionado.cliente_id);
      setShowModal(false);
      cargarClientes();
    } catch (error) {
      console.error("Error desarchivando:", error);
    }
  };

  /* FUNCIÓN: GUARDAR CLIENTE */
  const handleGuardar = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      if (modoCrear) {
        await createCliente({
          ...formData,
          usuario_creador: usuario?.usuario_id
        });
      } else {
        await updateCliente(clienteSeleccionado.cliente_id, formData);
      }

      setShowModal(false);
      cargarClientes();
    } catch (error) {
      console.error("Error guardando cliente:", error);
    }
  };

  return (
    <div className="container clientes-container">

      {/* TITULO */}
      <h2 className="clientes-title">Clientes</h2>

      {/* TOOLBAR */}
      <div className="clientes-toolbar">

        {/* BUSCADOR */}
        <div className="clientes-search">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar"
            />
          </div>
        </div>

        {/* FILTRO */}
        <div className="clientes-filtro dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            {mostrarArchivados ? "Archivados" : "Activos"}
          </button>

          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setMostrarArchivados(false);
                  setSelected([]);
                }}
              >
                Activos
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setMostrarArchivados(true);
                  setSelected([]);
                }}
              >
                Archivados
              </button>
            </li>
          </ul>
        </div>

        {/* ACCIONES */}
        <div className="clientes-accion-center">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              ⚙️ Acción
            </button>

            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={handleArchivar}
                >
                  Archivar seleccionados
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTÓN CREAR */}
        <div className="clientes-crear">
          <button
            className="btn btn-primary"
            onClick={() => {
              setModoCrear(true);
              setClienteSeleccionado(null);
              setFormData({
                nombre_cliente: "",
                apellido_cliente: "",
                telefono: "",
              });
              setShowModal(true);
            }}
          >
            Crear cliente
          </button>
        </div>

      </div>

      {/* TABLA */}
      <table className="table clientes-table">
        <thead className="table-dark">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selected.length === clientes.length &&
                  clientes.length > 0
                }
              />
            </th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {clientes.map((c) => (
            <tr
              key={c.cliente_id}
              className={
                selected.includes(c.cliente_id)
                  ? "clientes-row-selected"
                  : ""
              }
              onClick={() => {
                setClienteSeleccionado(c);
                setModoCrear(false);
                setFormData({
                  nombre_cliente: c.nombre_cliente,
                  apellido_cliente: c.apellido_cliente,
                  telefono: c.telefono,
                });
                setShowModal(true);
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(c.cliente_id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleSelectOne(c.cliente_id)}
                />
              </td>
              <td>{c.nombre_cliente}</td>
              <td>{c.apellido_cliente}</td>
              <td>{c.telefono}</td>
              <td>
                {c.estado === 0 ? (
                  <span className="badge bg-danger">Archivado</span>
                ) : (
                  <span className="badge bg-success">Activo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="clientes-modal-overlay">
          <div className="clientes-modal">

            {/* HEADER MODAL */}
            <div className="clientes-modal-header">
              <h3>
                {modoCrear ? "Crear cliente" : "Editar cliente"}
              </h3>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>

            {/* BODY MODAL */}
            <div className="clientes-modal-body">

              <div className="row">
                <div className="col">
                  <label>Nombre</label>
                  <input
                    className="form-control"
                    value={formData.nombre_cliente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nombre_cliente: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col">
                  <label>Apellido</label>
                  <input
                    className="form-control"
                    value={formData.apellido_cliente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        apellido_cliente: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-3">
                <label>Teléfono</label>
                <input
                  className="form-control"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefono: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            {/* FOOTER MODAL */}
            <div className="clientes-modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>

              <button className="btn btn-primary" onClick={handleGuardar}>
                {modoCrear ? "Crear" : "Guardar"}
              </button>

              {clienteSeleccionado?.estado === 0 && (
                <button
                  className="btn btn-warning"
                  onClick={handleDesarchivar}
                >
                  Desarchivar
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}