import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PrendasPage.css";
import { obtenerPrendas } from "../../services/Prendas";
import PrendaFormulario from "./PrendaFormulario";
import {
  obtenerImagenesPrenda,
  obtenerImagenActualPrenda,
  cambiarImagenPrenda,
} from "../../utils/Imagenes";

function PrendasPage() {
  const navigate = useNavigate();
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("create");
  const [prendaSeleccionadaId, setPrendaSeleccionadaId] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});

  const normalizarRespuesta = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.data?.results)) return response.data.results;
    return [];
  };

  const cargarPrendas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerPrendas();
      const prendasNormalizadas = normalizarRespuesta(response);

      setPrendas(prendasNormalizadas);
    } catch (err) {
      console.error("Error al cargar prendas:", err);
      setError("No se pudo cargar la información de las prendas.");
      setPrendas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPrendas();
  }, [cargarPrendas]);

  const obtenerIdPrenda = (prenda) => {
    return prenda?.cliente_prenda_id || prenda?.id || null;
  };

  const obtenerNombreCliente = (prenda) => {
    const nombre = prenda?.cliente?.nombre_cliente || "";
    const apellido = prenda?.cliente?.apellido_cliente || "";
    const nombreCompleto = `${nombre} ${apellido}`.trim();

    return (
      nombreCompleto ||
      prenda?.nombre_cliente ||
      prenda?.cliente_nombre ||
      "Sin cliente"
    );
  };

  const obtenerTelefono = (prenda) => {
    return (
      prenda?.cliente?.telefono ||
      prenda?.telefono ||
      prenda?.numero_telefono ||
      "Sin teléfono"
    );
  };

  const obtenerTituloPrenda = (prenda) => {
    return (
      prenda?.titulo ||
      prenda?.titulo_prenda ||
      prenda?.nombre_prenda ||
      "Sin título"
    );
  };

  const obtenerTipoPrenda = (prenda) => {
    return (
      prenda?.tipo_prenda?.nombre ||
      prenda?.tipoPrenda?.nombre ||
      prenda?.nombre_tipo_prenda ||
      "Sin tipo de prenda"
    );
  };

  const obtenerFechaCreado = (prenda) => {
    return prenda?.fecha_creado || prenda?.created_at || prenda?.fecha_creacion;
  };

  const obtenerEstadoTexto = (estado) => {
    if (estado === null || estado === undefined || estado === "") {
      return "Sin estado";
    }

    if (typeof estado === "number") {
      if (estado === 1) return "Activo";
      if (estado === 0) return "Inactivo";
    }

    return String(estado);
  };

  const prendasFiltradas = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return prendas;

    return prendas.filter((prenda) => {
      const nombreCliente = obtenerNombreCliente(prenda).toLowerCase();
      const telefono = obtenerTelefono(prenda).toLowerCase();
      const tituloPrenda = obtenerTituloPrenda(prenda).toLowerCase();
      const tipoPrenda = obtenerTipoPrenda(prenda).toLowerCase();
      const estado = obtenerEstadoTexto(prenda?.estado).toLowerCase();

      return (
        nombreCliente.includes(term) ||
        telefono.includes(term) ||
        tituloPrenda.includes(term) ||
        tipoPrenda.includes(term) ||
        estado.includes(term)
      );
    });
  }, [prendas, search]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const date = new Date(fecha);

    if (Number.isNaN(date.getTime())) return fecha;

    return date.toLocaleDateString("es-GT", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const obtenerClaseEstado = (estado) => {
    const valor = obtenerEstadoTexto(estado).toLowerCase();

    if (valor.includes("proceso")) return "prenda-status prenda-status--proceso";
    if (valor.includes("pendiente")) return "prenda-status prenda-status--pendiente";
    if (
      valor.includes("final") ||
      valor.includes("terminad") ||
      valor.includes("lista") ||
      valor.includes("activo")
    ) {
      return "prenda-status prenda-status--finalizada";
    }

    return "prenda-status prenda-status--default";
  };

  const obtenerImagenActual = (prenda) => {
    return obtenerImagenActualPrenda(prenda, imageIndexes, obtenerIdPrenda);
  };

  const cambiarImagen = (prendaId, total, direction) => {
    cambiarImagenPrenda(prendaId, total, direction, setImageIndexes);
  };

  const abrirFormularioCrear = () => {
    setModoFormulario("create");
    setPrendaSeleccionadaId(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (prenda) => {
    const id = obtenerIdPrenda(prenda);
    if (!id) return;

    setModoFormulario("edit");
    setPrendaSeleccionadaId(id);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setModoFormulario("create");
    setPrendaSeleccionadaId(null);
  };

  const handleFormularioSuccess = async () => {
    cerrarFormulario();
    await cargarPrendas();
  };

  const handleVerImagenes = (prenda) => {
    const id = obtenerIdPrenda(prenda);
    if (!id) return;

    navigate(`/home/prendas/${id}/imagenes`, { state: { prenda } });
  };

  return (
    <div className="prendas-page">
      <div className="prendas-page__header">
        <div>
          <h1 className="prendas-page__title">Seguimiento de prendas</h1>
          <p className="prendas-page__subtitle">
            Visualiza la información principal y el estado actual de cada prenda.
          </p>
        </div>

        <div className="prendas-page__header-actions">
          <input
            type="text"
            className="prendas-page__search"
            placeholder="Buscar por cliente, teléfono, prenda, tipo o estado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            className="prendas-page__create-button"
            onClick={abrirFormularioCrear}
          >
            Crear prenda
          </button>
        </div>
      </div>

      {loading && (
        <div className="prendas-page__state prendas-page__state--loading">
          Cargando prendas...
        </div>
      )}

      {!loading && error && (
        <div className="prendas-page__state prendas-page__state--error">
          <span>{error}</span>
          <button type="button" className="prendas-page__retry" onClick={cargarPrendas}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && prendasFiltradas.length === 0 && (
        <div className="prendas-page__state prendas-page__state--empty">
          No hay prendas para mostrar.
        </div>
      )}

      {!loading && !error && prendasFiltradas.length > 0 && (
        <div className="prendas-page__grid">
          {prendasFiltradas.map((prenda, index) => {
            const idPrenda = obtenerIdPrenda(prenda) || `temp-${index}`;
            const nombreCliente = obtenerNombreCliente(prenda);
            const telefono = obtenerTelefono(prenda);
            const tituloPrenda = obtenerTituloPrenda(prenda);
            const tipoPrenda = obtenerTipoPrenda(prenda);
            const fechaCreado = obtenerFechaCreado(prenda);
            const estado = obtenerEstadoTexto(prenda?.estado);
            const imagenes = obtenerImagenesPrenda(prenda);
            const imagenActual = obtenerImagenActual(prenda);
            const currentIndex = imageIndexes[idPrenda] || 0;

            return (
              <article className="prenda-card" key={idPrenda}>
                <div className="prenda-card__image-container">
                  {imagenes.length > 0 ? (
                    <>
                      <img
                        src={imagenActual}
                        alt={tituloPrenda}
                        className="prenda-card__image"
                      />

                      {imagenes.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="prenda-card__carousel-button prenda-card__carousel-button--left"
                            onClick={() => cambiarImagen(idPrenda, imagenes.length, "prev")}
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            className="prenda-card__carousel-button prenda-card__carousel-button--right"
                            onClick={() => cambiarImagen(idPrenda, imagenes.length, "next")}
                          >
                            ›
                          </button>

                          <div className="prenda-card__dots">
                            {imagenes.map((_, indexDot) => (
                              <span
                                key={indexDot}
                                className={`prenda-card__dot ${
                                  indexDot === currentIndex
                                    ? "prenda-card__dot--active"
                                    : ""
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="prenda-card__image-placeholder">{tipoPrenda}</div>
                  )}

                  <span className={obtenerClaseEstado(estado)}>{estado}</span>
                </div>

                <div className="prenda-card__content">
                  <h2 className="prenda-card__title">{tituloPrenda}</h2>

                  <div className="prenda-card__info">
                    <div className="prenda-card__item">
                      <span className="prenda-card__label">Cliente</span>
                      <span className="prenda-card__value">{nombreCliente}</span>
                    </div>

                    <div className="prenda-card__item">
                      <span className="prenda-card__label">Teléfono</span>
                      <span className="prenda-card__value">{telefono}</span>
                    </div>

                    <div className="prenda-card__item">
                      <span className="prenda-card__label">Tipo de prenda</span>
                      <span className="prenda-card__value">{tipoPrenda}</span>
                    </div>

                    <div className="prenda-card__item">
                      <span className="prenda-card__label">Fecha creado</span>
                      <span className="prenda-card__value">
                        {formatearFecha(fechaCreado)}
                      </span>
                    </div>
                  </div>

                  <div className="prenda-card__actions">
                    <button
                      type="button"
                      className="prenda-card__button prenda-card__button--primary"
                      onClick={() => abrirFormularioEditar(prenda)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="prenda-card__button prenda-card__button--secondary"
                      onClick={() => handleVerImagenes(prenda)}
                    >
                      Ver imágenes
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <PrendaFormulario
        open={mostrarFormulario}
        mode={modoFormulario}
        prendaId={prendaSeleccionadaId}
        onClose={cerrarFormulario}
        onSuccess={handleFormularioSuccess}
      />
    </div>
  );
}

export default PrendasPage;