import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { obtenerPrendaPorId } from "../../services/Prendas";
import {
  normalizarRespuestaPrenda,
  obtenerImagenesPrenda,
  obtenerImagenActualPrenda,
  cambiarImagenPrenda,
} from "../../utils/Imagenes";

function ImgPrendas() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [prenda, setPrenda] = useState(location.state?.prenda || null);
  const [loading, setLoading] = useState(!location.state?.prenda);
  const [error, setError] = useState("");
  const [imageIndexes, setImageIndexes] = useState({});

  const obtenerIdPrenda = (item) =>
    Number(item?.cliente_prenda_id ?? item?.id ?? id);

  const imagenes = useMemo(() => {
    return obtenerImagenesPrenda(prenda);
  }, [prenda]);

  const imagenActual = useMemo(() => {
    if (!prenda) return "";

    return obtenerImagenActualPrenda(prenda, imageIndexes, obtenerIdPrenda);
  }, [prenda, imageIndexes]);

  const indiceActual = useMemo(() => {
    const prendaId = obtenerIdPrenda(prenda);
    return imageIndexes[prendaId] || 0;
  }, [imageIndexes, prenda]);

  const obtenerTitulo = () => {
    if (!prenda) return "Imágenes de la prenda";
    return prenda?.titulo || `Prenda #${obtenerIdPrenda(prenda)}`;
  };

  const cargarPrenda = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await obtenerPrendaPorId(id);
      const detalle = normalizarRespuestaPrenda(response)?.[0] || response?.data || response;

      setPrenda(detalle || null);
      setImageIndexes((prev) => ({
        ...prev,
        [Number(id)]: 0,
      }));
    } catch (err) {
      console.error("Error al cargar imágenes de la prenda:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "No se pudieron cargar las imágenes de la prenda."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!prenda && id) {
      cargarPrenda();
      return;
    }

    if (prenda) {
      setImageIndexes((prev) => ({
        ...prev,
        [obtenerIdPrenda(prenda)]: 0,
      }));
    }
  }, [id]);

  const handleCambiarImagen = (direction) => {
    const prendaId = obtenerIdPrenda(prenda);

    cambiarImagenPrenda(
      prendaId,
      imagenes.length,
      direction,
      setImageIndexes
    );
  };

  return (
    <div className="prendas-page" style={{ padding: "24px" }}>
      <div className="prendas-page__header">
        <div>
          <h1 className="prendas-page__title">Imágenes de la prenda</h1>
          <p className="prendas-page__subtitle">{obtenerTitulo()}</p>
        </div>

        <div className="prendas-page__header-actions">
          <button
            type="button"
            className="prendas-page__create-button"
            onClick={() => navigate("/home/prendas")}
          >
            Volver
          </button>
        </div>
      </div>

      {loading && (
        <div className="prendas-page__state prendas-page__state--loading">
          Cargando imágenes...
        </div>
      )}

      {!loading && error && (
        <div className="prendas-page__state prendas-page__state--error">
          <span>{error}</span>
          <button
            type="button"
            className="prendas-page__retry"
            onClick={cargarPrenda}
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && imagenes.length === 0 && (
        <div className="prendas-page__state prendas-page__state--empty">
          No hay imágenes para mostrar.
        </div>
      )}

      {!loading && !error && imagenes.length > 0 && (
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              minHeight: "500px",
              borderRadius: "18px",
              overflow: "hidden",
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={imagenActual}
              alt={obtenerTitulo()}
              style={{
                width: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                display: "block",
              }}
            />

            {imagenes.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => handleCambiarImagen("prev")}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                  }}
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={() => handleCambiarImagen("next")}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                  }}
                >
                  ›
                </button>
              </>
            )}
          </div>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <strong>
              Imagen {indiceActual + 1} de {imagenes.length}
            </strong>

            {imagenes.length > 1 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {imagenes.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setImageIndexes((prev) => ({
                        ...prev,
                        [obtenerIdPrenda(prenda)]: index,
                      }))
                    }
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                      opacity: index === indiceActual ? 1 : 0.35,
                      background: "#111",
                    }}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImgPrendas;