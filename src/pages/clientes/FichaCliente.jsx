import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  CreditCard,
  Ruler,
  Shirt,
  FileText,
  Wallet,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { obtenerClienteDetalleService } from "../../services/clienteService";
import "./FichaCliente.css";

const TABS = [
  { id: "resumen", label: "Resumen" },
  { id: "medidas", label: "Medidas" },
  { id: "prendas", label: "Prendas" },
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "pagos", label: "Planes de pago" },
];

const formatearQ = (n) =>
  `Q ${Number(n || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(fecha);
  }
};

function FichaCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("resumen");
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      setError("");
      const d = await obtenerClienteDetalleService(id);
      setData(d);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.status === 404
          ? "Cliente no encontrado."
          : "No se pudo cargar la ficha del cliente."
      );
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (cargando) {
    return (
      <div className="ficha">
        <p className="ficha__state">Cargando ficha del cliente...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="ficha">
        <div className="ficha__state ficha__state--error">
          <span>{error}</span>
          <button type="button" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    );
  }

  const { cliente, resumen, medidas, prendas, cotizaciones, planesPago } = data;
  const estaActivo = Number(cliente.estado) === 1;

  return (
    <div className="ficha">
      <button
        type="button"
        className="ficha__back"
        onClick={() => navigate("/home/clientes")}
      >
        <ArrowLeft size={16} /> Volver a clientes
      </button>

      <header className="ficha__header">
        <div className="ficha__avatar">
          {(cliente.nombre_cliente?.[0] || "?").toUpperCase()}
        </div>
        <div className="ficha__title">
          <h1>
            {cliente.nombre_cliente} {cliente.apellido_cliente}
          </h1>
          <div className="ficha__meta">
            <span className="ficha__meta-item">
              <CreditCard size={14} /> {cliente.dpi || "—"}
            </span>
            <span className="ficha__meta-item">
              <Phone size={14} /> {cliente.telefono || "Sin teléfono"}
            </span>
            <span
              className={`ficha__estado ${
                estaActivo ? "ficha__estado--on" : "ficha__estado--off"
              }`}
            >
              {estaActivo ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {estaActivo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </header>

      <section className="ficha__resumen">
        <article className="ficha-kpi">
          <span className="ficha-kpi__label">Total facturado</span>
          <span className="ficha-kpi__value">{formatearQ(resumen.totalFacturado)}</span>
        </article>
        <article className="ficha-kpi">
          <span className="ficha-kpi__label">Total cobrado</span>
          <span className="ficha-kpi__value">{formatearQ(resumen.totalCobrado)}</span>
        </article>
        <article className="ficha-kpi">
          <span className="ficha-kpi__label">Saldo pendiente</span>
          <span
            className={`ficha-kpi__value ${
              Number(resumen.saldoPendiente) > 0 ? "ficha-kpi__value--alert" : ""
            }`}
          >
            {formatearQ(resumen.saldoPendiente)}
          </span>
        </article>
        <article className="ficha-kpi">
          <span className="ficha-kpi__label">Cotizaciones / Prendas</span>
          <span className="ficha-kpi__value">
            {resumen.totalCotizaciones} / {resumen.totalPrendas}
          </span>
        </article>
      </section>

      <nav className="ficha__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            className={`ficha__tab ${tab === t.id ? "ficha__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === "medidas" && medidas.length > 0 && (
              <span className="ficha__tab-badge">{medidas.length}</span>
            )}
            {t.id === "prendas" && prendas.length > 0 && (
              <span className="ficha__tab-badge">{prendas.length}</span>
            )}
            {t.id === "cotizaciones" && cotizaciones.length > 0 && (
              <span className="ficha__tab-badge">{cotizaciones.length}</span>
            )}
            {t.id === "pagos" && planesPago.length > 0 && (
              <span className="ficha__tab-badge">{planesPago.length}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="ficha__panel">
        {tab === "resumen" && (
          <div className="ficha-panel-section">
            <p className="ficha-panel-section__title">
              <User size={16} /> Información general
            </p>
            <dl className="ficha-info">
              <div>
                <dt>Nombre completo</dt>
                <dd>
                  {cliente.nombre_cliente} {cliente.apellido_cliente}
                </dd>
              </div>
              <div>
                <dt>DPI</dt>
                <dd>{cliente.dpi || "—"}</dd>
              </div>
              <div>
                <dt>Teléfono</dt>
                <dd>{cliente.telefono || "—"}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{estaActivo ? "Activo" : "Inactivo"}</dd>
              </div>
              <div>
                <dt>Registrado</dt>
                <dd>{formatearFecha(cliente.fecha_creado)}</dd>
              </div>
            </dl>
          </div>
        )}

        {tab === "medidas" && (
          <div className="ficha-panel-section">
            <p className="ficha-panel-section__title">
              <Ruler size={16} /> Medidas registradas
            </p>
            {medidas.length === 0 ? (
              <p className="ficha-empty">
                Este cliente aún no tiene medidas registradas.
              </p>
            ) : (
              <ul className="ficha-medidas">
                {medidas.map((m, idx) => {
                  const key =
                    m.cliente_medida_id ??
                    m.id_medida ??
                    `${m.tipo_medida_id ?? idx}-${idx}`;
                  return (
                    <li key={key} className="ficha-medidas__item">
                      <span className="ficha-medidas__nombre">
                        {m.nombre_tipo_medida || "Medida"}
                      </span>
                      <span className="ficha-medidas__valor">{m.valor}</span>
                      {m.fecha_creado && (
                        <span className="ficha-medidas__fecha">
                          {formatearFecha(m.fecha_creado)}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {tab === "prendas" && (
          <div className="ficha-panel-section">
            <p className="ficha-panel-section__title">
              <Shirt size={16} /> Prendas
            </p>
            {prendas.length === 0 ? (
              <p className="ficha-empty">Sin prendas registradas.</p>
            ) : (
              <table className="ficha-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Título</th>
                    <th>Estado</th>
                    <th>Creada</th>
                  </tr>
                </thead>
                <tbody>
                  {prendas.map((p) => (
                    <tr key={p.cliente_prenda_id}>
                      <td>{p.cliente_prenda_id}</td>
                      <td>{p.titulo || "—"}</td>
                      <td>
                        <span
                          className={`ficha-pill ${
                            Number(p.estado) === 1
                              ? "ficha-pill--on"
                              : "ficha-pill--off"
                          }`}
                        >
                          {Number(p.estado) === 1 ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td>{formatearFecha(p.fecha_creado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "cotizaciones" && (
          <div className="ficha-panel-section">
            <p className="ficha-panel-section__title">
              <FileText size={16} /> Cotizaciones
            </p>
            {cotizaciones.length === 0 ? (
              <p className="ficha-empty">Sin cotizaciones registradas.</p>
            ) : (
              <table className="ficha-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Prenda</th>
                    <th>Valor</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map((c) => (
                    <tr key={c.cotizacion_id}>
                      <td>
                        <strong>{c.codigo_cotizacion}</strong>
                      </td>
                      <td>{c.titulo_prenda || "—"}</td>
                      <td>{formatearQ(c.valor_total)}</td>
                      <td>{formatearFecha(c.fecha_creado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "pagos" && (
          <div className="ficha-panel-section">
            <p className="ficha-panel-section__title">
              <Wallet size={16} /> Planes de pago
            </p>
            {planesPago.length === 0 ? (
              <p className="ficha-empty">Sin planes de pago registrados.</p>
            ) : (
              <table className="ficha-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Total</th>
                    <th>Abonado</th>
                    <th>Saldo</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {planesPago.map((p) => (
                    <tr key={p.plan_pago_id}>
                      <td>
                        <strong>{p.codigo_plan}</strong>
                      </td>
                      <td>{formatearQ(p.valor_a_cobrar)}</td>
                      <td>{formatearQ(p.total_abonado)}</td>
                      <td>
                        <span
                          className={
                            Number(p.saldo_pendiente) > 0
                              ? "ficha-saldo ficha-saldo--alert"
                              : "ficha-saldo"
                          }
                        >
                          {formatearQ(p.saldo_pendiente)}
                        </span>
                      </td>
                      <td>{formatearFecha(p.fecha_creado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FichaCliente;
