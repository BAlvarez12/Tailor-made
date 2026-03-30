import { useState, useEffect } from "react";
import {
  getTipos,
  createTipo,
  updateTipo,
  archiveTipo,
  restoreTipo
} from "../../services/tipoMedidasService";

import "./tipo_medidas.css";

/* COMPONENTE TIPOS DE MEDIDA */
export default function TipoMedidas() {

  /* ESTADOS PRINCIPALES */
  const [tipos, setTipos] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ESTADOS DE UI */
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);
  const [mostrarArchivados, setMostrarArchivados] = useState(false);

  /* ESTADO DEL FORMULARIO */
  const [formData, setFormData] = useState({
    nombre_tipo_medida: "",
    descripcion_tipo_medida: "",
  });

  /* EFECTO: CARGAR TIPOS */
  useEffect(() => {
    cargarTipos();
  }, [mostrarArchivados]);

  /* FUNCIÓN: OBTENER TIPOS */
  const cargarTipos = async () => {
    try {
      const res = await getTipos(mostrarArchivados);
      setTipos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error cargando tipos:", error);
      setTipos([]);
    }
  };

  /* FUNCIÓN: SELECCIONAR TODOS */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(tipos.map((t) => t.tipo_medida_id));
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

  /* FUNCIÓN: ARCHIVAR TIPOS */
  const handleArchivar = async () => {
    try {
      for (let id of selected) {
        await archiveTipo(id);
      }
      setSelected([]);
      cargarTipos();
    } catch (error) {
      console.error("Error archivando:", error);
    }
  };

  /* FUNCIÓN: DESARCHIVAR TIPO */
  const handleDesarchivar = async () => {
    try {
      await restoreTipo(tipoSeleccionado.tipo_medida_id);
      setShowModal(false);
      cargarTipos();
    } catch (error) {
      console.error("Error restaurando:", error);
    }
  };

  /* 🔥 FUNCIÓN: GUARDAR (CORREGIDA) */
  const handleGuardar = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      if (modoCrear) {
        await createTipo({
          ...formData,
          usuario_creador: usuario?.usuario_id
        });
      } else {
        await updateTipo(tipoSeleccionado.tipo_medida_id, formData);
      }

      setShowModal(false);
      cargarTipos();

    } catch (error) {
      console.error("Error guardando:", error);
      alert(error.response?.data?.error || "Error al guardar");
    }
  };

  return (
    <div className="container clientes-container">

      {/* TITULO */}
      <h2 className="clientes-title">Tipos de medida</h2>

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
              setTipoSeleccionado(null);
              setFormData({
                nombre_tipo_medida: "",
                descripcion_tipo_medida: "",
              });
              setShowModal(true);
            }}
          >
            Crear tipo
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
                  selected.length === tipos.length &&
                  tipos.length > 0
                }
              />
            </th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {tipos.length > 0 ? (
            tipos.map((t) => (
              <tr
                key={t.tipo_medida_id}
                className={
                  selected.includes(t.tipo_medida_id)
                    ? "clientes-row-selected"
                    : ""
                }
                onClick={() => {
                  setTipoSeleccionado(t);
                  setModoCrear(false);
                  setFormData({
                    nombre_tipo_medida: t.nombre_tipo_medida,
                    descripcion_tipo_medida: t.descripcion_tipo_medida,
                  });
                  setShowModal(true);
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(t.tipo_medida_id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleSelectOne(t.tipo_medida_id)}
                  />
                </td>
                <td>{t.nombre_tipo_medida}</td>
                <td>{t.descripcion_tipo_medida}</td>
                <td>
                  {t.estado === 0 ? (
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
                No hay tipos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="clientes-modal-overlay">
          <div className="clientes-modal">

            <div className="clientes-modal-header">
              <h3>
                {modoCrear ? "Crear tipo" : "Editar tipo"}
              </h3>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>

            <div className="clientes-modal-body">

              <div className="mb-3">
                <label>Nombre</label>
                <input
                  className="form-control"
                  value={formData.nombre_tipo_medida}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_tipo_medida: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <label>Descripción</label>
                <input
                  className="form-control"
                  value={formData.descripcion_tipo_medida}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion_tipo_medida: e.target.value,
                    })
                  }
                />
              </div>

            </div>

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

              {tipoSeleccionado?.estado === 0 && (
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