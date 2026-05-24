import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PrendasPage.css";
import { obtenerPrendas } from "../../services/Prendas";
import { obtenerTiposPrendaActivosService } from "../../services/tipo_prendas";
import PrendaFormulario from "./PrendaFormulario";
import {
  obtenerImagenesPrenda,
  obtenerImagenActualPrenda,
  cambiarImagenPrenda,
} from "../../utils/Imagenes";

const PAGE_SIZE = 10;

function PrendasPage() {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);
  const [prendas, setPrendas] = useState([]);
  const [tiposPrenda, setTiposPrenda] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [filtroTipoPrendaId, setFiltroTipoPrendaId] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
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

  useEffect(() => {
    obtenerTiposPrendaActivosService()
      .then((data) => {
        const lista = Array.isArray(data) ? data : [];
        setTiposPrenda(lista);
      })
      .catch((err) => console.error("Error cargando tipos de prenda:", err));
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [busquedaCliente, filtroTipoPrendaId]);

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

  const obtenerIdTipoPrenda = (prenda) => {
    const id =
      prenda?.tipo_prenda_id ??
      prenda?.tipo_prenda?.tipo_prendas_id ??
      prenda?.tipo_prenda?.id ??
      null;
    return id != null ? String(id) : "";
  };

  const obtenerTipoPrenda = (prenda) => {
    return (
      prenda?.tipo_prenda?.nombre ||
      prenda?.tipoPrenda?.nombre ||
      prenda?.nombre_tipo_prenda ||
      prenda?.tipo_prenda_nombre ||
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
    const termCliente = busquedaCliente.toLowerCase().trim();
    const tipoId = filtroTipoPrendaId ? String(filtroTipoPrendaId) : "";

    return prendas.filter((prenda) => {
      if (tipoId && obtenerIdTipoPrenda(prenda) !== tipoId) {
        return false;
      }

      if (!termCliente) return true;

      const nombreCliente = obtenerNombreCliente(prenda).toLowerCase();
      const telefono = obtenerTelefono(prenda).toLowerCase();

      return (
        nombreCliente.includes(termCliente) || telefono.includes(termCliente)
      );
    });
  }, [prendas, busquedaCliente, filtroTipoPrendaId]);

  const prendasVisibles = useMemo(
    () => prendasFiltradas.slice(0, visibleCount),
    [prendasFiltradas, visibleCount]
  );

  const hayMasPrendas = visibleCount < prendasFiltradas.length;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hayMasPrendas) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, prendasFiltradas.length)
          );
        }
      },
      { root: null, rootMargin: "120px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hayMasPrendas, prendasFiltradas.length]);

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

  const obtenerCotizacionPrenda = (prenda) => {
    if (prenda?.cotizacion?.cotizacion_id) {
      return prenda.cotizacion;
    }
    if (prenda?.cotizacion_id) {
      return {
        cotizacion_id: prenda.cotizacion_id,
        codigo_cotizacion: prenda.codigo_cotizacion,
      };
    }
    return null;
  };

  const handleCotizacionPrenda = (prenda) => {
    const prendaId = obtenerIdPrenda(prenda);
    const clienteId = prenda?.cliente?.cliente_id ?? prenda?.cliente_id;
    if (!prendaId || !clienteId) return;

    const cotizacion = obtenerCotizacionPrenda(prenda);

    if (cotizacion?.cotizacion_id) {
      navigate("/home/cotizaciones", {
        state: {
          modo: "ver",
          cotizacionId: cotizacion.cotizacion_id,
          codigoCotizacion: cotizacion.codigo_cotizacion,
          clienteId,
          prendaId,
        },
      });
      return;
    }

    navigate("/home/cotizaciones", {
      state: {
        modo: "crear",
        clienteId,
        prendaId,
      },
    });
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
          <button
            type="button"
            className="prendas-page__create-button"
            onClick={abrirFormularioCrear}
          >
            Crear prenda
          </button>
        </div>
      </div>

      <div className="prendas-page__filters">
        <div className="prendas-page__filter-group">
          <label htmlFor="filtro-cliente">Cliente</label>
          <input
            id="filtro-cliente"
            type="search"
            className="prendas-page__search"
            placeholder="Nombre o teléfono del cliente"
            value={busquedaCliente}
            onChange={(e) => setBusquedaCliente(e.target.value)}
          />
        </div>

        <div className="prendas-page__filter-group">
          <label htmlFor="filtro-tipo">Tipo de prenda</label>
          <select
            id="filtro-tipo"
            className="prendas-page__select"
            value={filtroTipoPrendaId}
            onChange={(e) => setFiltroTipoPrendaId(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {tiposPrenda.map((tipo) => (
              <option
                key={tipo.tipo_prendas_id ?? tipo.id}
                value={String(tipo.tipo_prendas_id ?? tipo.id)}
              >
                {tipo.nombre || tipo.nombre_tipo_prenda}
              </option>
            ))}
          </select>
        </div>

        {!loading && !error && prendasFiltradas.length > 0 && (
          <p className="prendas-page__results-meta">
            Mostrando {prendasVisibles.length} de {prendasFiltradas.length} prendas
          </p>
        )}
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
        <>
        <div className="prendas-page__grid">
          {prendasVisibles.map((prenda, index) => {
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
            const cotizacionPrenda = obtenerCotizacionPrenda(prenda);
            const tieneCotizacion = Boolean(cotizacionPrenda?.cotizacion_id);

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
                      className={`prenda-card__button ${
                        tieneCotizacion
                          ? "prenda-card__button--cotizacion-ver"
                          : "prenda-card__button--cotizacion"
                      }`}
                      onClick={() => handleCotizacionPrenda(prenda)}
                    >
                      {tieneCotizacion ? "Ver cotización" : "Cotización"}
                    </button>

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

        {hayMasPrendas && (
          <div ref={loadMoreRef} className="prendas-page__load-more">
            <span>Cargando más prendas...</span>
          </div>
        )}
        </>
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