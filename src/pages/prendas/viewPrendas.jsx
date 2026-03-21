import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function ViewPrendas() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const prenda = location.state?.prenda || null;

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const date = new Date(fecha);
    if (Number.isNaN(date.getTime())) return fecha;

    return date.toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  if (!prenda) {
    return (
      <div className="view-prenda">
        <div className="view-prenda__header">
          <h1>Detalle de prenda</h1>
          <button type="button" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>

        <div className="view-prenda__empty">
          No se encontró la información de la prenda con ID: {id}
        </div>
      </div>
    );
  }

  const nombreCliente = `${prenda?.cliente?.nombre_cliente || ""} ${prenda?.cliente?.apellido_cliente || ""}`.trim() || "Sin cliente";
  const telefono = prenda?.cliente?.telefono || "Sin teléfono";
  const tipoPrenda = prenda?.tipo_prenda?.nombre || "Sin tipo";
  const medidas = Array.isArray(prenda?.medidas) ? prenda.medidas : [];

  return (
    <div className="view-prenda">
      <div className="view-prenda__header">
        <div>
          <h1 className="view-prenda__title">Detalle de prenda</h1>
          <p className="view-prenda__subtitle">
            Visualización completa de la prenda y sus medidas.
          </p>
        </div>

        <button
          type="button"
          className="view-prenda__back-button"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      <div className="view-prenda__card">
        <div className="view-prenda__section">
          <h2>Información general</h2>

          <div className="view-prenda__grid">
            <div>
              <span className="view-prenda__label">Título</span>
              <p>{prenda?.titulo || "Sin título"}</p>
            </div>

            <div>
              <span className="view-prenda__label">Estado</span>
              <p>{prenda?.estado || "Sin estado"}</p>
            </div>

            <div>
              <span className="view-prenda__label">Cliente</span>
              <p>{nombreCliente}</p>
            </div>

            <div>
              <span className="view-prenda__label">Teléfono</span>
              <p>{telefono}</p>
            </div>

            <div>
              <span className="view-prenda__label">Tipo de prenda</span>
              <p>{tipoPrenda}</p>
            </div>

            <div>
              <span className="view-prenda__label">Fecha creado</span>
              <p>{formatearFecha(prenda?.fecha_creado)}</p>
            </div>
          </div>
        </div>

        <div className="view-prenda__section">
          <h2>Medidas registradas</h2>

          {medidas.length === 0 ? (
            <div className="view-prenda__empty">
              Esta prenda no tiene medidas registradas.
            </div>
          ) : (
            <div className="view-prenda__medidas">
              {medidas.map((medida) => (
                <div className="view-prenda__medida-card" key={medida.cliente_medida_id}>
                  <h3>
                    {medida?.tipo_medida?.nombre_tipo_medida || "Medida sin nombre"}
                  </h3>

                  <p>
                    <strong>Valor:</strong> {medida?.valor ?? "Sin valor"}{" "}
                    {medida?.unidad_medida?.simbolo_unidad || ""}
                  </p>

                  <p>
                    <strong>Unidad:</strong>{" "}
                    {medida?.unidad_medida?.nombre_unidad || "Sin unidad"}
                  </p>

                  <p>
                    <strong>Descripción:</strong>{" "}
                    {medida?.tipo_medida?.descripcion_tipo_medida || "Sin descripción"}
                  </p>

                  <p>
                    <strong>Fecha:</strong> {formatearFecha(medida?.fecha_creado)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewPrendas;