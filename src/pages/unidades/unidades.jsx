/* COMPONENTE UNIDADES */
import { useState, useEffect } from "react";
import {
  getUnidades,
  createUnidad,
  updateUnidad,
  archiveUnidad,
  restoreUnidad
} from "../../services/unidades/unidadesService";

import "./unidades.css";

export default function Unidades() {

  /* ESTADOS PRINCIPALES */
  const [unidades, setUnidades] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ESTADOS DE UI */
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  /* ESTADO DEL FORMULARIO */
  const [formData, setFormData] = useState({
    nombre_unidad: "",
    simbolo_unidad: "",
  });

  /* EFECTO: CARGAR UNIDADES */
  useEffect(() => {
    cargarUnidades();
  }, [mostrarArchivados]);

  /* FUNCIÓN: OBTENER UNIDADES */
  const cargarUnidades = async () => {
    try {
      const res = await getUnidades(mostrarArchivados);
      setUnidades(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error cargando unidades:", error);
      setUnidades([]);
    }
  };

  /* FUNCIÓN: SELECCIONAR TODOS */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(unidades.map((u) => u.unidad_id));
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

  /* FUNCIÓN: ARCHIVAR UNIDADES */
  const handleArchivar = async () => {
    try {
      for (let id of selected) {
        await archiveUnidad(id);
      }
      setSelected([]);
      cargarUnidades();
    } catch (error) {
      console.error("Error archivando:", error);
    }
  };

  /* FUNCIÓN: DESARCHIVAR UNIDAD */
  const handleDesarchivar = async () => {
    try {
      await restoreUnidad(unidadSeleccionada.unidad_id);
      setShowModal(false);
      cargarUnidades();
    } catch (error) {
      console.error("Error restaurando:", error);
    }
  };

  /* FUNCIÓN: GUARDAR UNIDAD */
  const handleGuardar = async () => {
    try {
      if (modoCrear) {
        await createUnidad(formData);
      } else {
        await updateUnidad(unidadSeleccionada.unidad_id, formData);
      }

      setShowModal(false);
      cargarUnidades();
    } catch (error) {
      console.error("Error guardando unidad:", error);
    }
  };

  return (
    <div className="container clientes-container">

      {/* TITULO */}
      <h2 className="clientes-title">Unidades de medida</h2>

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
              setUnidadSeleccionada(null);
              setFormData({
                nombre_unidad: "",
                simbolo_unidad: "",
              });
              setShowModal(true);
            }}
          >
            Crear unidad
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
                  selected.length === unidades.length &&
                  unidades.length > 0
                }
              />
            </th>
            <th>Nombre</th>
            <th>Símbolo</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {unidades.length > 0 ? (
            unidades.map((u) => (
              <tr
                key={u.unidad_id}
                className={
                  selected.includes(u.unidad_id)
                    ? "clientes-row-selected"
                    : ""
                }
                onClick={() => {
                  setUnidadSeleccionada(u);
                  setModoCrear(false);
                  setFormData({
                    nombre_unidad: u.nombre_unidad,
                    simbolo_unidad: u.simbolo_unidad,
                  });
                  setShowModal(true);
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(u.unidad_id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleSelectOne(u.unidad_id)}
                  />
                </td>
                <td>{u.nombre_unidad}</td>
                <td>{u.simbolo_unidad}</td>
                <td>
                  {u.estado === 0 ? (
                    <span className="badge bg-danger">Archivado</span>
                  ) : (
                    <span className="badge bg-success">Activo</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay unidades registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="clientes-modal-overlay">
          <div className="clientes-modal">

            {/* HEADER MODAL */}
            <div className="clientes-modal-header">
              <h3>
                {modoCrear ? "Crear unidad" : "Editar unidad"}
              </h3>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>

            {/* BODY MODAL */}
            <div className="clientes-modal-body">

              <div className="mb-3">
                <label>Nombre</label>
                <input
                  className="form-control"
                  value={formData.nombre_unidad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_unidad: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label>Símbolo</label>
                <input
                  className="form-control"
                  value={formData.simbolo_unidad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      simbolo_unidad: e.target.value,
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

              {unidadSeleccionada?.estado === 0 && (
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