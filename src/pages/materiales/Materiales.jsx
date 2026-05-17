import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../styles/tmListPage.css";
import "./Materiales.css";
import logo from "../../assets/logo-tailor-made.png";
import MaterialesExistenciasModal from "./MaterialesExistenciasModal";
import MaterialFormModal from "./MaterialFormModal";

const API_BASE = "http://localhost:3000";

function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mostrarModalExistencias, setMostrarModalExistencias] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [materialEditarId, setMaterialEditarId] = useState(null);

  const [previewImagenes, setPreviewImagenes] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [animando, setAnimando] = useState(false);

  const fetchMateriales = async () => {
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
  };

  useEffect(() => {
    fetchMateriales();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar material?")) return;

    try {
      await axios.delete(`${API_BASE}/api/materiales/${id}`);
      fetchMateriales();
    } catch (err) {
      console.error(err);
    }
  };

  const cambiarImagen = (nuevoIndex) => {
    setAnimando(true);
    setTimeout(() => {
      setPreviewIndex(nuevoIndex);
      setAnimando(false);
    }, 150);
  };

  const materialesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return materiales;

    return materiales.filter((m) => {
      const nombre = (m.nombre_material || "").toLowerCase();
      const categoria = (m.nombre_categoria || "").toLowerCase();
      return nombre.includes(texto) || categoria.includes(texto);
    });
  }, [materiales, busqueda]);

  return (
    <div className="tm-users tm-users--materiales">
      <header className="tm-users__header">
        <div>
          <h1>Materiales</h1>
          <p>Listado de materiales e insumos registrados en el sistema.</p>
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
              placeholder="Buscar material o categoría"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="tm-users__buttons">
          <button
            type="button"
            className="tm-users__btn-secondary"
            onClick={() => setMostrarModalExistencias(true)}
          >
            + Existencia
          </button>
          <button
            type="button"
            className="tm-users__create-btn"
            onClick={() => {
              setMaterialEditarId(null);
              setMostrarModalCrear(true);
            }}
          >
            <span>Crear material</span>
          </button>
        </div>
      </header>

      <div className="tm-users__card">
        {loading && <p className="tm-users__state">Cargando materiales...</p>}

        {error && <p className="tm-users__error">{error}</p>}

        {!loading && !error && materialesFiltrados.length === 0 && (
          <p className="tm-users__state">No hay materiales para mostrar.</p>
        )}

        {!loading && !error && materialesFiltrados.length > 0 && (
          <div className="tm-users__table-wrapper">
            <table className="tm-users__table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Existencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {materialesFiltrados.map((mat) => {
                  const imgs = Array.isArray(mat.imagenes) ? mat.imagenes : [];
                  const primeraImg = imgs[0] || null;

                  return (
                    <tr key={mat.material_id}>
                      <td>
                        <div className="materiales-material-info">
                          <div className="materiales-carrusel-container">
                            {primeraImg ? (
                              <img
                                src={`${API_BASE}/uploads/materiales/${primeraImg}`}
                                alt=""
                                onClick={() => {
                                  setPreviewImagenes(imgs);
                                  setPreviewIndex(0);
                                }}
                              />
                            ) : (
                              <img src={logo} alt="" />
                            )}
                          </div>
                          <span>{mat.nombre_material}</span>
                        </div>
                      </td>
                      <td>{mat.nombre_categoria || "—"}</td>
                      <td>Q {Number(mat.precio_unitario || 0).toFixed(2)}</td>
                      <td>
                        <span className="tm-users__badge tm-users__badge--stock">
                          {mat.stock ?? 0}
                        </span>
                      </td>
                      <td>
                        <div className="tm-users__acciones">
                          <button
                            type="button"
                            className="tm-users__btn-accion tm-users__btn-accion--editar"
                            onClick={() => {
                              setMaterialEditarId(mat.material_id);
                              setMostrarModalCrear(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="tm-users__btn-accion tm-users__btn-accion--eliminar"
                            onClick={() => handleDelete(mat.material_id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
              src={`${API_BASE}/uploads/materiales/${previewImagenes[previewIndex]}`}
              alt="Vista previa"
              className={`modal-img ${animando ? "fade-out" : "fade-in"}`}
            />

            <div className="dots-container">
              {previewImagenes.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === previewIndex ? "active" : ""}`}
                  onClick={() => cambiarImagen(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && cambiarImagen(i)}
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
                    cambiarImagen(
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
                    cambiarImagen((previewIndex + 1) % previewImagenes.length)
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
