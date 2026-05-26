import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  FileText,
  Wallet,
  Shirt,
  Users,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { obtenerDashboardService } from "../services/dashboardService";
import "./Home.css";

function obtenerNombreUsuario() {
  try {
    const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
    return usuario.nombre || usuario.usuario || "Usuario";
  } catch {
    return "Usuario";
  }
}

const formatearQ = (n) =>
  `Q ${Number(n || 0).toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatearFechaCorta = (fecha) => {
  if (!fecha) return "—";
  try {
    return new Date(fecha).toLocaleString("es-GT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(fecha);
  }
};

const OPCIONES_DIAS = [7, 15, 30];
const POR_PAGINA = 5;

function Home() {
  const navigate = useNavigate();
  const nombre = obtenerNombreUsuario();
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [diasFiltro, setDiasFiltro] = useState(30);
  const [pagina, setPagina] = useState(1);

  const cargar = useCallback(async (dias) => {
    try {
      setCargando(true);
      setError("");
      const d = await obtenerDashboardService(dias);
      setData(d);
      setPagina(1);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el dashboard.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(diasFiltro);
  }, [cargar, diasFiltro]);

  const operaciones = data?.ultimasOperaciones ?? [];
  const totalPaginas = Math.max(1, Math.ceil(operaciones.length / POR_PAGINA));
  const paginaSegura = Math.min(pagina, totalPaginas);
  const inicio = (paginaSegura - 1) * POR_PAGINA;
  const operacionesPagina = operaciones.slice(inicio, inicio + POR_PAGINA);

  if (cargando) {
    return (
      <div className="tm-home">
        <p className="tm-dashboard__state">Cargando dashboard...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="tm-home">
        <div className="tm-dashboard__state tm-dashboard__state--error">
          <span>{error || "Sin datos."}</span>
          <button type="button" onClick={() => cargar(diasFiltro)}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-home">
      <header className="tm-home__hero">
        <div className="tm-home__hero-content">
          <span className="tm-home__eyebrow">
            <Sparkles size={14} aria-hidden />
            Panel principal
          </span>
          <h1>Bienvenido, {nombre}</h1>
          <p>Vista general del negocio en tiempo real.</p>
        </div>
      </header>

      <section className="tm-kpis" aria-label="Indicadores clave">
        <article className="tm-kpi tm-kpi--violet">
          <div className="tm-kpi__icon">
            <FileText size={20} />
          </div>
          <div className="tm-kpi__body">
            <span className="tm-kpi__label">Cotizaciones este mes</span>
            <span className="tm-kpi__value">{data.cotizacionesMes.cantidad}</span>
            <span className="tm-kpi__meta">
              {formatearQ(data.cotizacionesMes.valor_total)} facturado
            </span>
          </div>
        </article>

        <article className="tm-kpi tm-kpi--emerald">
          <div className="tm-kpi__icon">
            <Wallet size={20} />
          </div>
          <div className="tm-kpi__body">
            <span className="tm-kpi__label">Pagos recibidos hoy</span>
            <span className="tm-kpi__value">{formatearQ(data.pagosHoy.valor_total)}</span>
            <span className="tm-kpi__meta">{data.pagosHoy.cantidad} transacciones</span>
          </div>
        </article>

        <article className="tm-kpi tm-kpi--amber">
          <div className="tm-kpi__icon">
            <TrendingUp size={20} />
          </div>
          <div className="tm-kpi__body">
            <span className="tm-kpi__label">Pagos del mes</span>
            <span className="tm-kpi__value">{formatearQ(data.pagosMes.valor_total)}</span>
            <span className="tm-kpi__meta">{data.pagosMes.cantidad} transacciones</span>
          </div>
        </article>

        <article className="tm-kpi tm-kpi--indigo">
          <div className="tm-kpi__icon">
            <Shirt size={20} />
          </div>
          <div className="tm-kpi__body">
            <span className="tm-kpi__label">Prendas activas</span>
            <span className="tm-kpi__value">{data.prendasActivas}</span>
            <span className="tm-kpi__meta">{data.clientesActivos} clientes activos</span>
          </div>
        </article>
      </section>

      <section className="tm-dashboard__grid">
        <div className="tm-card">
          <header className="tm-card__header">
            <h2>
              <Users size={16} /> Top clientes
            </h2>
            <span className="tm-card__hint">Por valor facturado</span>
          </header>
          <div className="tm-card__body">
            {data.topClientes.length === 0 ? (
              <p className="tm-card__empty">Sin cotizaciones registradas todavía.</p>
            ) : (
              <ul className="tm-rank">
                {data.topClientes.map((c, idx) => (
                  <li key={c.cliente_id} className="tm-rank__item">
                    <span className="tm-rank__pos">{idx + 1}</span>
                    <div className="tm-rank__info">
                      <strong>{c.nombre}</strong>
                      <span>
                        {c.cotizaciones} cotización
                        {c.cotizaciones === 1 ? "" : "es"}
                      </span>
                    </div>
                    <span className="tm-rank__total">
                      {formatearQ(c.total_facturado)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="tm-card">
          <header className="tm-card__header">
            <h2>
              <Package size={16} /> Stock bajo
            </h2>
            <span className="tm-card__hint">≤ 5 unidades</span>
          </header>
          <div className="tm-card__body">
            {data.stockBajo.length === 0 ? (
              <p className="tm-card__empty">
                Todos los materiales tienen stock suficiente.
              </p>
            ) : (
              <ul className="tm-stock-list">
                {data.stockBajo.map((m) => {
                  const stock = Number(m.stock) || 0;
                  return (
                    <li key={m.material_id} className="tm-stock-list__item">
                      <span className="tm-stock-list__name">{m.nombre_material}</span>
                      <span
                        className={`tm-stock-pill ${
                          stock <= 0 ? "tm-stock-pill--zero" : ""
                        }`}
                      >
                        {stock <= 0 && <AlertTriangle size={12} />}
                        {stock} {stock === 1 ? "unidad" : "unidades"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              type="button"
              className="tm-card__action"
              onClick={() => navigate("/home/materiales")}
            >
              Ver materiales →
            </button>
          </div>
        </div>
      </section>

      <section className="tm-card tm-card--full">
        <header className="tm-card__header">
          <h2>
            <Clock size={16} /> Últimas operaciones del sistema
          </h2>
          <div className="tm-log-filters" role="group" aria-label="Filtrar por días">
            {OPCIONES_DIAS.map((d) => (
              <button
                key={d}
                type="button"
                className={`tm-log-filters__btn ${
                  diasFiltro === d ? "tm-log-filters__btn--active" : ""
                }`}
                onClick={() => setDiasFiltro(d)}
              >
                {d} días
              </button>
            ))}
          </div>
        </header>
        <div className="tm-card__body">
          {operaciones.length === 0 ? (
            <p className="tm-card__empty">
              Sin actividad en los últimos {diasFiltro} días.
            </p>
          ) : (
            <>
              <div className="tm-log-scroll">
                <ul className="tm-log-list">
                  {operacionesPagina.map((op) => (
                    <li key={op.log_id} className="tm-log-list__item">
                      <span className={`tm-log-tag tm-log-tag--${op.accion}`}>
                        {op.accion}
                      </span>
                      <div className="tm-log-list__info">
                        <strong>
                          {op.descripcion || `${op.entidad} #${op.entidad_id}`}
                        </strong>
                        <span>
                          {op.usuario_nombre || "—"} ·{" "}
                          {formatearFechaCorta(op.fecha)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tm-log-pager">
                <span className="tm-log-pager__info">
                  Mostrando {inicio + 1}–
                  {Math.min(inicio + POR_PAGINA, operaciones.length)} de{" "}
                  {operaciones.length}
                </span>
                <div className="tm-log-pager__controls">
                  <button
                    type="button"
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={paginaSegura <= 1}
                  >
                    ← Anterior
                  </button>
                  <span className="tm-log-pager__page">
                    {paginaSegura} / {totalPaginas}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPagina((p) => Math.min(totalPaginas, p + 1))
                    }
                    disabled={paginaSegura >= totalPaginas}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
