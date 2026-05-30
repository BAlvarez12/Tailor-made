import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getUnidades,
  createUnidad,
  updateUnidad,
  archiveUnidad,
  restoreUnidad
} from "../../services/unidadesService";

const mensajeError = (error, fallback) =>
  error?.response?.data?.error || error?.response?.data?.message || fallback;
import UnidadesHeader from "./unidadesHeader";
import UnidadesTable from "./unidadesTable";
import UnidadesModal from "./unidadesModal";

import "./unidades.css";

export default function Unidades() {
  const [unidades, setUnidades] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const [formData, setFormData] = useState({
    nombre_unidad: "",
    simbolo_unidad: "",
  });

  useEffect(() => {
    cargarUnidades();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroEstado, itemsPerPage]);

  const cargarUnidades = async () => {
    try {
      const [res1, res2] = await Promise.all([
        getUnidades(false),
        getUnidades(true)
      ]);

      const todasLasUnidades = [
        ...(Array.isArray(res1.data) ? res1.data : []),
        ...(Array.isArray(res2.data) ? res2.data : [])
      ];

      setUnidades(todasLasUnidades);
    } catch (error) {
      console.error("Error cargando unidades:", error);
      setUnidades([]);
    }
  };

  const getUnidadesFiltradas = () => {
    let filtradas = unidades;

    if (filtroEstado !== null) {
      filtradas = filtradas.filter((u) => u.estado === filtroEstado);
    }

    const texto = busqueda.trim().toLowerCase();
    if (texto.length > 0) {
      filtradas = filtradas.filter((u) => {
        const nombre = (u.nombre_unidad || "").toLowerCase();
        const simbolo = (u.simbolo_unidad || "").toLowerCase();
        return nombre.includes(texto) || simbolo.includes(texto);
      });
    }

    return filtradas;
  };

  const getUnidadesPaginadas = () => {
    const unidadesFiltradas = getUnidadesFiltradas();
    const inicio = (currentPage - 1) * itemsPerPage;
    const fin = inicio + itemsPerPage;
    return unidadesFiltradas.slice(inicio, fin);
  };

  const totalUnidadesFiltradas = getUnidadesFiltradas().length;
  const totalPages = Math.max(1, Math.ceil(totalUnidadesFiltradas / itemsPerPage));
  const inicioRegistro = totalUnidadesFiltradas === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const finRegistro = totalUnidadesFiltradas === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalUnidadesFiltradas);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleDesarchivar = async () => {
    try {
      await restoreUnidad(unidadSeleccionada.unidad_id);
      setShowModal(false);
      toast.success("Unidad restaurada");
      cargarUnidades();
    } catch (error) {
      console.error("Error restaurando:", error);
      toast.error(mensajeError(error, "No se pudo restaurar la unidad."));
    }
  };

  const handleArchivarIndividual = async () => {
    try {
      await archiveUnidad(unidadSeleccionada.unidad_id);
      setShowModal(false);
      toast.success("Unidad archivada");
      cargarUnidades();
    } catch (error) {
      console.error("Error archivando:", error);
      toast.error(mensajeError(error, "No se pudo archivar la unidad."));
    }
  };

  const handleGuardar = async () => {
    try {
      if (modoCrear) {
        await createUnidad(formData);
      } else {
        await updateUnidad(unidadSeleccionada.unidad_id, formData);
      }

      setErrorModal("");
      setShowModal(false);
      toast.success(modoCrear ? "Unidad creada" : "Unidad actualizada");
      cargarUnidades();
    } catch (error) {
      console.error("Error guardando unidad:", error);
      // Error de validación → se muestra dentro del modal (sigue abierto)
      setErrorModal(mensajeError(error, "No se pudo guardar la unidad."));
    }
  };

  const handleModalOpen = (unidad = null) => {
    setErrorModal("");
    if (unidad) {
      setUnidadSeleccionada(unidad);
      setModoCrear(false);
      setFormData({
        nombre_unidad: unidad.nombre_unidad,
        simbolo_unidad: unidad.simbolo_unidad,
      });
    } else {
      setModoCrear(true);
      setUnidadSeleccionada(null);
      setFormData({
        nombre_unidad: "",
        simbolo_unidad: "",
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="tm-users">
      <UnidadesHeader
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        onCreateClick={() => handleModalOpen()}
      />

      <div className="tm-users__card">
        {totalUnidadesFiltradas === 0 && (
          <p className="tm-users__state">
            No hay unidades registradas.
          </p>
        )}

        {totalUnidadesFiltradas > 0 && (
          <div className="tm-users__table-wrapper">
            <UnidadesTable
              unidades={getUnidadesPaginadas()}
              onEdit={handleModalOpen}
            />
          </div>
        )}

        <div className="tm-users__pagination">
          <div className="tm-users__pagination-size">
            <select
              className="tm-users__pagination-select"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              aria-label="Registros por pagina"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <span className="tm-users__pagination-info">
            {inicioRegistro}-{finRegistro} de {totalUnidadesFiltradas}
          </span>

          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalUnidadesFiltradas === 0}
            aria-label="Primera pagina"
          >
            {"<<"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || totalUnidadesFiltradas === 0}
            aria-label="Pagina anterior"
          >
            {"<"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalUnidadesFiltradas === 0}
            aria-label="Pagina siguiente"
          >
            {">"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalUnidadesFiltradas === 0}
            aria-label="Ultima pagina"
          >
            {">>"}
          </button>
        </div>
      </div>

      {showModal && (
        <UnidadesModal
          modoCrear={modoCrear}
          unidadSeleccionada={unidadSeleccionada}
          formData={formData}
          setFormData={setFormData}
          errorModal={errorModal}
          onClose={handleModalClose}
          onGuardar={handleGuardar}
          onArchivar={handleArchivarIndividual}
          onRestaurar={handleDesarchivar}
        />
      )}
    </div>
  );
}
