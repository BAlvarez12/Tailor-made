import { useState, useEffect } from "react";
import {
  getTipos,
  createTipo,
  updateTipo,
  archiveTipo,
  restoreTipo
} from "../../services/tipoMedidasService";
import TipoMedidasHeader from "./tipoMedidasHeader";
import TipoMedidasTable from "./tipoMedidasTable";
import TipoMedidasModal from "./tipoMedidasModal";
import { toast } from "react-toastify";

import "./tipo_medidas.css";

export default function TipoMedidas() {
  const [tipos, setTipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroEstado, setFiltroEstado] = useState(null); // null = todos, 1 = activos, 0 = archivados
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modoCrear, setModoCrear] = useState(false);

  const [formData, setFormData] = useState({
    nombre_tipo_medida: "",
    descripcion_tipo_medida: "",
  });

  useEffect(() => {
    cargarTipos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [busqueda, filtroEstado, itemsPerPage]);

  const cargarTipos = async () => {
    try {
      const [res1, res2] = await Promise.all([
        getTipos(false), // activos
        getTipos(true)   // inactivos
      ]);
      const todosLosTipos = [
        ...(Array.isArray(res1.data) ? res1.data : []),
        ...(Array.isArray(res2.data) ? res2.data : [])
      ];
      setTipos(todosLosTipos);
    } catch (error) {
      console.error("Error cargando tipos:", error);
      toast.error("Error al cargar tipos de medida");
      setTipos([]);
    }
  };

  const getTiposFiltrados = () => {
    let filtrados = tipos;

    if (filtroEstado !== null) {
      filtrados = filtrados.filter((t) => t.estado === filtroEstado);
    }

    const texto = busqueda.trim().toLowerCase();
    if (texto.length > 0) {
      filtrados = filtrados.filter((t) => {
        const nombre = (t.nombre_tipo_medida || "").toLowerCase();
        const descripcion = (t.descripcion_tipo_medida || "").toLowerCase();
        return nombre.includes(texto) || descripcion.includes(texto);
      });
    }

    return filtrados;
  };

  const getTiposPaginados = () => {
    const tiposFiltrados = getTiposFiltrados();
    const inicio = (currentPage - 1) * itemsPerPage;
    const fin = inicio + itemsPerPage;
    return tiposFiltrados.slice(inicio, fin);
  };

  const totalTiposFiltrados = getTiposFiltrados().length;
  const totalPages = Math.max(1, Math.ceil(totalTiposFiltrados / itemsPerPage));
  const inicioRegistro = totalTiposFiltrados === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const finRegistro = totalTiposFiltrados === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalTiposFiltrados);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handleDesarchivar = async () => {
    try {
      await restoreTipo(tipoSeleccionado.tipo_medida_id);
      toast.success("Tipo de medida activado con éxito");
      setShowModal(false);
      cargarTipos();
    } catch (error) {
      console.error("Error restaurando:", error);
      toast.error(error?.response?.data?.message || "Error al activar tipo de medida");
    }
  };

  const handleArchivarIndividual = async () => {
    try {
      await archiveTipo(tipoSeleccionado.tipo_medida_id);
      toast.success("Tipo de medida innactivado con éxito");
      setShowModal(false);
      cargarTipos();
    } catch (error) {
      console.error("Error archivando:", error);
      toast.error(error?.response?.data?.message || "Error al innactivar tipo de medida");
    }
  };

  const handleGuardar = async () => {
    const nombre = (formData.nombre_tipo_medida || "").trim();
    const descripcion = (formData.descripcion_tipo_medida || "").trim();

    if (nombre.length > 100) {
      toast.error("El nombre del tipo de medida no puede superar 100 caracteres");
      return;
    }

    if (descripcion.length > 300) {
      toast.error("La descripción del tipo de medida no puede superar 300 caracteres");
      return;
    }

    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (modoCrear) {
        await createTipo({
          ...formData,
          usuario_creador: usuario?.usuario_id
        });
        toast.success("Tipo de medida creado con éxito");
      } else {
        await updateTipo(tipoSeleccionado.tipo_medida_id, formData);
        toast.success("Tipo de medida actualizado con éxito");
      }

      setShowModal(false);
      cargarTipos();

    } catch (error) {
      console.error("Error guardando:", error);
      const backendMessage = String(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        ""
      ).toLowerCase();

      if (backendMessage.includes("data too long") && backendMessage.includes("nombre_tipo_medida")) {
        toast.error("El nombre del tipo de medida no puede superar 100 caracteres");
        return;
      }

      if (backendMessage.includes("data too long") && backendMessage.includes("descripcion_tipo_medida")) {
        toast.error("La descripción del tipo de medida no puede superar 300 caracteres");
        return;
      }

      toast.error(error?.response?.data?.error || error?.response?.data?.message || "Error al guardar tipo de medida");
    }
  };

  const handleModalOpen = (tipo = null) => {
    if (tipo) {
      setTipoSeleccionado(tipo);
      setModoCrear(false);
      setFormData({
        nombre_tipo_medida: tipo.nombre_tipo_medida,
        descripcion_tipo_medida: tipo.descripcion_tipo_medida,
      });
    } else {
      setModoCrear(true);
      setTipoSeleccionado(null);
      setFormData({
        nombre_tipo_medida: "",
        descripcion_tipo_medida: "",
      });
    }
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };


  return (
    <div className="tm-users">
      {/* HEADER */}
      <TipoMedidasHeader
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
        showFilterMenu={showFilterMenu}
        setShowFilterMenu={setShowFilterMenu}
        onCreateClick={() => handleModalOpen()}
      />

      {/* CARD */}
      <div className="tm-users__card">
        {totalTiposFiltrados === 0 && (
          <p className="tm-users__state">
            No hay tipos registrados.
          </p>
        )}

        {totalTiposFiltrados > 0 && (
          <TipoMedidasTable
            tipos={getTiposPaginados()}
            onEditClick={handleModalOpen}
          />
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
            {inicioRegistro}-{finRegistro} de {totalTiposFiltrados}
          </span>

          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalTiposFiltrados === 0}
            aria-label="Primera pagina"
          >
            {"<<"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || totalTiposFiltrados === 0}
            aria-label="Pagina anterior"
          >
            {"<"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalTiposFiltrados === 0}
            aria-label="Pagina siguiente"
          >
            {">"}
          </button>
          <button
            className="tm-users__pagination-icon-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalTiposFiltrados === 0}
            aria-label="Ultima pagina"
          >
            {">>"}
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <TipoMedidasModal
          modoCrear={modoCrear}
          tipoSeleccionado={tipoSeleccionado}
          formData={formData}
          setFormData={setFormData}
          onClose={handleModalClose}
          onGuardar={handleGuardar}
          onArchivar={handleArchivarIndividual}
          onRestaurar={handleDesarchivar}
        />
      )}
    </div>
  );
}