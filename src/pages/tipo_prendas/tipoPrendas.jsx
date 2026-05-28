import { useState, useEffect } from "react";
import {
  getTipoPrendas,
  createTipoPrenda,
  updateTipoPrenda,
  archiveTipoPrenda,
  restoreTipoPrenda,
} from "../../services/tipoPrendasService";
import TipoPrendasHeader from "./tipoPrendasHeader";
import TipoPrendasTable from "./tipoPrendasTable";
import TipoPrendasModal from "./tipoPrendasModal";

import "../unidades/unidades.css";

export default function TipoPrendas() {
  const [tiposPrenda, setTiposPrenda] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [seleccionado, setSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
  });

  useEffect(() => {
    cargarTiposPrenda();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroEstado, itemsPerPage]);

  const cargarTiposPrenda = async () => {
    try {
      const [activos, archivados] = await Promise.all([
        getTipoPrendas(false),
        getTipoPrendas(true),
      ]);

      const todos = [
        ...(Array.isArray(activos.data) ? activos.data : []),
        ...(Array.isArray(archivados.data) ? archivados.data : []),
      ];

      setTiposPrenda(todos);
    } catch (error) {
      console.error("Error cargando tipos de prenda:", error);
      setTiposPrenda([]);
    }
  };

  const getFiltrados = () => {
    let filtrados = tiposPrenda;

    if (filtroEstado !== null) {
      filtrados = filtrados.filter((t) => t.estado === filtroEstado);
    }

    const texto = busqueda.trim().toLowerCase();
    if (texto.length > 0) {
      filtrados = filtrados.filter((t) =>
        (t.nombre || "").toLowerCase().includes(texto)
      );
    }

    return filtrados;
  };

  const getPaginados = () => {
    const filtrados = getFiltrados();
    const inicio = (currentPage - 1) * itemsPerPage;
    const fin = inicio + itemsPerPage;
    return filtrados.slice(inicio, fin);
  };

  const total = getFiltrados().length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const inicioRegistro = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const finRegistro = total === 0 ? 0 : Math.min(currentPage * itemsPerPage, total);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleArchivarIndividual = async () => {
    try {
      await archiveTipoPrenda(seleccionado.tipo_prendas_id);
      setShowModal(false);
      cargarTiposPrenda();
    } catch (error) {
      console.error("Error archivando:", error);
      setErrorModal(
        error?.response?.data?.message || "No se pudo archivar."
      );
    }
  };

  const handleDesarchivar = async () => {
    try {
      await restoreTipoPrenda(seleccionado.tipo_prendas_id);
      setShowModal(false);
      cargarTiposPrenda();
    } catch (error) {
      console.error("Error restaurando:", error);
      setErrorModal(
        error?.response?.data?.message || "No se pudo restaurar."
      );
    }
  };

  const handleGuardar = async () => {
    try {
      setErrorModal("");
      if (modoCrear) {
        await createTipoPrenda(formData);
      } else {
        await updateTipoPrenda(seleccionado.tipo_prendas_id, formData);
      }
      setShowModal(false);
      cargarTiposPrenda();
    } catch (error) {
      console.error("Error guardando tipo de prenda:", error);
      setErrorModal(
        error?.response?.data?.message || "No se pudo guardar el tipo de prenda."
      );
    }
  };

  const handleModalOpen = (tipo = null) => {
    setErrorModal("");
    if (tipo) {
      setSeleccionado(tipo);
      setModoCrear(false);
      setFormData({ nombre: tipo.nombre || "" });
    } else {
      setModoCrear(true);
      setSeleccionado(null);
      setFormData({ nombre: "" });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrorModal("");
  };

  return (
    <div className="tm-users">
      <TipoPrendasHeader
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        onCreateClick={() => handleModalOpen()}
      />

      <div className="tm-users__card">
        {total === 0 && (
          <p className="tm-users__state">
            No hay tipos de prenda registrados.
          </p>
        )}

        {total > 0 && (
          <div className="tm-users__table-wrapper">
            <TipoPrendasTable
              tiposPrenda={getPaginados()}
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
            {inicioRegistro}-{finRegistro} de {total}
          </span>

          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || total === 0}
            aria-label="Primera pagina"
          >
            {"<<"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || total === 0}
            aria-label="Pagina anterior"
          >
            {"<"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || total === 0}
            aria-label="Pagina siguiente"
          >
            {">"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || total === 0}
            aria-label="Ultima pagina"
          >
            {">>"}
          </button>
        </div>
      </div>

      {showModal && (
        <TipoPrendasModal
          modoCrear={modoCrear}
          seleccionado={seleccionado}
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
