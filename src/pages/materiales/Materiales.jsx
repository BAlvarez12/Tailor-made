import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Materiales.css";
import logo from "../../assets/logo-tailor-made.png";
import MaterialesExistenciasModal from "./MaterialesExistenciasModal";
import MaterialFormModal from "./MaterialFormModal";

const API_BASE = "http://localhost:3000";

const urlImagenMaterial = (nombreArchivo) =>
  `${API_BASE}/uploads/materiales/${nombreArchivo}`;

function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [filtroCategoriaId, setFiltroCategoriaId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostrarModalExistencias, setMostrarModalExistencias] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [materialEditarId, setMaterialEditarId] = useState(null);

  const [imageIndexes, setImageIndexes] = useState({});
  const [previewImagenes, setPreviewImagenes] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [animando, setAnimando] = useState(false);

  const fetchMateriales = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/api/materiales`);
      setMateriales(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los materiales.");
      setMateriales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMateriales();
  }, [fetchMateriales]);

  const categoriasDisponibles = useMemo(() => {
    const map = new Map();
    materiales.forEach((m) => {
      const id = m.categoria_id;
      const nombre = m.nombre_categoria || "Sin categoría";
      if (id != null && id !== "") {
        map.set(String(id), nombre);
      } else if (nombre) {
        map.set(`nom:${nombre}`, nombre);
      }
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "es"));
  }, [materiales]);

  const materialesFiltrados = useMemo(() => {
    const termNombre = busquedaNombre.trim().toLowerCase();
    const catId = filtroCategoriaId;

    return materiales.filter((m) => {
      if (catId) {
        const matchId = String(m.categoria_id) === catId;
        const matchNom =
          catId.startsWith("nom:") &&
          (m.nombre_categoria || "Sin categoría") === catId.slice(4);
        if (!matchId && !matchNom) return false;
      }

      if (termNombre) {
        const nombre = (m.nombre_material || "").toLowerCase();
        if (!nombre.includes(termNombre)) return false;
      }

      return true;
    });
  }, [materiales, busquedaNombre, filtroCategoriaId]);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar material?")) return;

    try {
      await axios.delete(`${API_BASE}/api/materiales/${id}`);
      fetchMateriales();
    } catch (err) {
      console.error(err);
    }
  };

  const cambiarImagenCard = (materialId, total, direction) => {
    if (total <= 1) return;
    setImageIndexes((prev) => {
      const current = prev[materialId] || 0;
      const next =
        direction === "next"
          ? (current + 1) % total
          : (current - 1 + total) % total;
      return { ...prev, [materialId]: next };
    });
  };

  const obtenerImagenActual = (mat) => {
    const imgs = Array.isArray(mat.imagenes) ? mat.imagenes : [];
    if (imgs.length === 0) return null;
    const idx = imageIndexes[mat.material_id] || 0;
    return imgs[idx] || imgs[0];
  };

  const abrirPreview = (imgs, index = 0) => {
    if (!imgs?.length) return;
    setPreviewImagenes(imgs);
    setPreviewIndex(index);
  };

  const cambiarImagenPreview = (nuevoIndex) => {
    setAnimando(true);
    setTimeout(() => {
      setPreviewIndex(nuevoIndex);
      setAnimando(false);
    }, 150);
  };

  const formatearPrecio = (valor) =>
    `Q ${Number(valor || 0).toLocaleString("es-GT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const obtenerClaseStock = (stock) => {
    const n = Number(stock) || 0;
    if (n <= 0) return "material-card__stock material-card__stock--bajo";
    if (n <= 5) return "material-card__stock material-card__stock--medio";
    return "material-card__stock material-card__stock--ok";
  };

  return (
    <div className="materiales-page">
      <header className="materiales-page__header">
        <div>
          <h1 className="materiales-page__title">Materiales</h1>
          <p className="materiales-page__subtitle">
            Catálogo visual de materiales e insumos con existencias y precios.
          </p>
        </div>

        <div className="materiales-page__header-actions">
          <button
            type="button"
            className="materiales-page__btn-secondary"
            onClick={() => setMostrarModalExistencias(true)}
          >
            + Existencia
          </button>
          <button
            type="button"
            className="materiales-page__btn-create"
            onClick={() => {
              setMaterialEditarId(null);
              setMostrarModalCrear(true);
            }}
          >
            Crear material
          </button>
        </div>
      </header>

      <div className="materiales-page__filters">
        <div className="materiales-page__filter-group">
          <label htmlFor="filtro-nombre">Nombre del material</label>
          <input
            id="filtro-nombre"
            type="search"
            className="materiales-page__search"
            placeholder="Buscar por nombre..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
          />
        </div>

        <div className="materiales-page__filter-group">
          <label htmlFor="filtro-categoria">Categoría</label>
          <select
            id="filtro-categoria"
            className="materiales-page__select"
            value={filtroCategoriaId}
            onChange={(e) => setFiltroCategoriaId(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {!loading && !error && (
          <p className="materiales-page__results-meta">
            {materialesFiltrados.length} de {materiales.length} materiales
          </p>
        )}
      </div>

      {loading && (
        <div className="materiales-page__state">Cargando materiales...</div>
      )}

      {error && (
        <div className="materiales-page__state materiales-page__state--error">
          <span>{error}</span>
          <button type="button" onClick={fetchMateriales}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && materialesFiltrados.length === 0 && (
        <div className="materiales-page__state">
          No hay materiales que coincidan con los filtros.
        </div>
      )}

      {!loading && !error && materialesFiltrados.length > 0 && (
        <div className="materiales-page__grid">
          {materialesFiltrados.map((mat) => {
            const imgs = Array.isArray(mat.imagenes) ? mat.imagenes : [];
            const imagenActual = obtenerImagenActual(mat);
            const currentIndex = imageIndexes[mat.material_id] || 0;
            const stock = Number(mat.stock) || 0;

            return (
              <article className="material-card" key={mat.material_id}>
                <div className="material-card__image-wrap">
                  {imagenActual ? (
                    <>
                      <img
                        src={urlImagenMaterial(imagenActual)}
                        alt={mat.nombre_material}
                        className="material-card__image"
                        onClick={() => abrirPreview(imgs, currentIndex)}
                      />
                      {imgs.length > 1 && (
                        <>
                          <button
                            type="button"
                            className="material-card__carousel-btn material-card__carousel-btn--left"
                            onClick={() =>
                              cambiarImagenCard(mat.material_id, imgs.length, "prev")
                            }
                            aria-label="Imagen anterior"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            className="material-card__carousel-btn material-card__carousel-btn--right"
                            onClick={() =>
                              cambiarImagenCard(mat.material_id, imgs.length, "next")
                            }
                            aria-label="Imagen siguiente"
                          >
                            ›
                          </button>
                          <div className="material-card__dots">
                            {imgs.map((_, i) => (
                              <span
                                key={i}
                                className={`material-card__dot ${
                                  i === currentIndex ? "material-card__dot--active" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="material-card__image-placeholder">
                      <img src={logo} alt="" />
                      <span>Sin imagen</span>
                    </div>
                  )}

                  {mat.nombre_categoria && (
                    <span className="material-card__categoria">
                      {mat.nombre_categoria}
                    </span>
                  )}
                </div>

                <div className="material-card__body">
                  <h2 className="material-card__title">{mat.nombre_material}</h2>

                  <div className="material-card__meta">
                    <div className="material-card__row">
                      <span className="material-card__label">Precio</span>
                      <span className="material-card__precio">
                        {formatearPrecio(mat.precio_unitario)}
                      </span>
                    </div>
                    <div className="material-card__row">
                      <span className="material-card__label">Existencia</span>
                      <span className={obtenerClaseStock(stock)}>{stock}</span>
                    </div>
                  </div>

                  <div className="material-card__actions">
                    <button
                      type="button"
                      className="material-card__btn material-card__btn--edit"
                      onClick={() => {
                        setMaterialEditarId(mat.material_id);
                        setMostrarModalCrear(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="material-card__btn material-card__btn--delete"
                      onClick={() => handleDelete(mat.material_id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <MaterialesExistenciasModal
        open={mostrarModalExistencias}
        onClose={() => {
          setMostrarModalExistencias(false);
          fetchMateriales();
        }}
      />

      <MaterialFormModal
        open={mostrarModalCrear}
        materialId={materialEditarId}
        onClose={() => {
          setMostrarModalCrear(false);
          setMaterialEditarId(null);
          fetchMateriales();
        }}
      />

      {previewImagenes.length > 0 && (
        <div
          className="modal-img-overlay"
          onClick={() => setPreviewImagenes([])}
          role="presentation"
        >
          <div
            className="modal-img-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-cerrar"
              onClick={() => setPreviewImagenes([])}
            >
              ✕
            </button>

            <img
              src={urlImagenMaterial(previewImagenes[previewIndex])}
              alt="Vista previa"
              className={`modal-img ${animando ? "fade-out" : "fade-in"}`}
            />

            <div className="dots-container">
              {previewImagenes.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === previewIndex ? "active" : ""}`}
                  onClick={() => cambiarImagenPreview(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && cambiarImagenPreview(i)}
                  aria-label={`Imagen ${i + 1}`}
                />
              ))}
            </div>

            {previewImagenes.length > 1 && (
              <>
                <button
                  type="button"
                  className="carrusel-btn left"
                  onClick={() =>
                    cambiarImagenPreview(
                      (previewIndex - 1 + previewImagenes.length) %
                        previewImagenes.length
                    )
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="carrusel-btn right"
                  onClick={() =>
                    cambiarImagenPreview(
                      (previewIndex + 1) % previewImagenes.length
                    )
                  }
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Materiales;
