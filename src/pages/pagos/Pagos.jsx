import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../../styles/tmListPage.css";
import "./Pagos.css";
import { obtenerClientesActivosService } from "../../services/clienteService";
import {
  listarPlanesPagoService,
  listarCotizacionesClientePagoService,
  crearPlanPagoService,
  registrarPagoService,
  obtenerPlanPagoService,
  abrirPdfRecibo,
} from "../../services/pagosService";
import {
  formatearCuotasPlan,
  calcularProximoAbono,
  calcularCuotaReferencial,
  textoCuotaPago,
  etiquetaTipoPago,
} from "../../utils/pagosCalc";
import {
  normalizarCliente,
  formatearClienteDisplay,
  clienteCoincideBusqueda,
} from "../../utils/clienteDisplay";
import {
  Search,
  User,
  Save,
  List,
  Plus,
  Wallet,
  X,
  Eye,
  FileText,
} from "lucide-react";

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatearMoneda = (valor) => {
  const n = Number(valor);
  if (Number.isNaN(n)) return "Q 0.00";
  return `Q ${n.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return String(fecha);
  return date.toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const obtenerUsuarioId = () => {
  try {
    const u = JSON.parse(localStorage.getItem("usuario")) || {};
    return u.usuario_id ?? u.id ?? null;
  } catch {
    return null;
  }
};

function Pagos() {
  const [vista, setVista] = useState("crear");
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [clienteSearch, setClienteSearch] = useState("");
  const [clienteDropdownOpen, setClienteDropdownOpen] = useState(false);
  const clienteRef = useRef(null);

  const [cotizaciones, setCotizaciones] = useState([]);
  const [cotizacionId, setCotizacionId] = useState("");
  const [loadingCotiz, setLoadingCotiz] = useState(false);

  const [valorACobrar, setValorACobrar] = useState("");
  const [cantidadPagos, setCantidadPagos] = useState("1");
  const [valorAnticipo, setValorAnticipo] = useState("");
  const [numeroTransferencia, setNumeroTransferencia] = useState("");
  const [notas, setNotas] = useState("");
  const [registrarAnticipo, setRegistrarAnticipo] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [planes, setPlanes] = useState([]);
  const [busquedaListado, setBusquedaListado] = useState("");
  const [loadingListado, setLoadingListado] = useState(false);

  const [planAbono, setPlanAbono] = useState(null);
  const [abonoInfo, setAbonoInfo] = useState(null);
  const [montoAbono, setMontoAbono] = useState("");
  const [transferenciaAbono, setTransferenciaAbono] = useState("");
  const [notasAbono, setNotasAbono] = useState("");
  const [guardandoAbono, setGuardandoAbono] = useState(false);
  const [cargandoAbono, setCargandoAbono] = useState(false);

  const [planHistorial, setPlanHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  useEffect(() => {
    obtenerClientesActivosService()
      .then((data) => setClientes(normalizarRespuesta(data).map(normalizarCliente)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!clienteDropdownOpen) return;
    const handler = (e) => {
      if (clienteRef.current && !clienteRef.current.contains(e.target)) {
        setClienteDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [clienteDropdownOpen]);

  const clientesFiltrados = useMemo(() => {
    const t = clienteSearch.trim().toLowerCase();
    const lista = t
      ? clientes.filter((c) => clienteCoincideBusqueda(c, t))
      : clientes;
    return lista.slice(0, 12);
  }, [clientes, clienteSearch]);

  const cargarCotizacionesCliente = useCallback(async (id) => {
    if (!id) {
      setCotizaciones([]);
      return;
    }
    try {
      setLoadingCotiz(true);
      const data = await listarCotizacionesClientePagoService(id);
      setCotizaciones(normalizarRespuesta(data));
    } catch (err) {
      console.error(err);
      setCotizaciones([]);
    } finally {
      setLoadingCotiz(false);
    }
  }, []);

  const seleccionarCliente = (cliente) => {
    const id = String(cliente.cliente_id);
    setClienteId(id);
    setClienteSearch(formatearClienteDisplay(cliente));
    setClienteDropdownOpen(false);
    setCotizacionId("");
    setValorACobrar("");
    cargarCotizacionesCliente(id);
  };

  const limpiarCliente = () => {
    setClienteId("");
    setClienteSearch("");
    setCotizaciones([]);
    setCotizacionId("");
    setValorACobrar("");
  };

  const seleccionarCotizacion = (cot) => {
    if (cot.tiene_plan_pago) return;
    setCotizacionId(String(cot.cotizacion_id));
    setValorACobrar(String(cot.valor_total ?? ""));
  };

  const saldoEstimado = useMemo(() => {
    const total = Number(valorACobrar) || 0;
    const ant = registrarAnticipo ? Number(valorAnticipo) || 0 : 0;
    return Math.max(0, total - ant);
  }, [valorACobrar, valorAnticipo, registrarAnticipo]);

  const cuotaReferencial = useMemo(
    () =>
      calcularCuotaReferencial(
        valorACobrar,
        cantidadPagos,
        valorAnticipo,
        registrarAnticipo && Number(valorAnticipo) > 0
      ),
    [valorACobrar, cantidadPagos, valorAnticipo, registrarAnticipo]
  );

  const abrirModalAbono = async (planResumen) => {
    setCargandoAbono(true);
    setPlanAbono(null);
    setAbonoInfo(null);
    setError("");
    setMontoAbono("");
    setTransferenciaAbono("");
    setNotasAbono("");

    try {
      const detalle = await obtenerPlanPagoService(planResumen.plan_pago_id);
      const planCompleto = { ...planResumen, ...detalle };
      const info = calcularProximoAbono(planCompleto);

      setPlanAbono(planCompleto);
      setAbonoInfo(info);
      setMontoAbono(
        info.montoSugerido > 0 ? info.montoSugerido.toFixed(2) : ""
      );
    } catch (err) {
      console.error(err);
      const info = calcularProximoAbono(planResumen);
      setPlanAbono(planResumen);
      setAbonoInfo(info);
      setMontoAbono(
        info.montoSugerido > 0 ? info.montoSugerido.toFixed(2) : ""
      );
      setError("No se pudo actualizar el detalle. Monto calculado con datos del listado.");
    } finally {
      setCargandoAbono(false);
    }
  };

  const cerrarModalAbono = () => {
    setPlanAbono(null);
    setAbonoInfo(null);
    setMontoAbono("");
    setTransferenciaAbono("");
    setNotasAbono("");
    setError("");
  };

  const abrirModalHistorial = async (planResumen) => {
    setCargandoHistorial(true);
    setPlanHistorial(null);
    try {
      const detalle = await obtenerPlanPagoService(planResumen.plan_pago_id);
      setPlanHistorial({ ...planResumen, ...detalle });
    } catch (err) {
      console.error(err);
      setPlanHistorial(planResumen);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const cerrarModalHistorial = () => setPlanHistorial(null);

  const pagosDelHistorial = useMemo(() => {
    if (!planHistorial?.pagos) return [];
    return [...planHistorial.pagos].sort((a, b) => {
      const fa = new Date(a.fecha_pago || a.fecha_registro).getTime();
      const fb = new Date(b.fecha_pago || b.fecha_registro).getTime();
      return fa - fb;
    });
  }, [planHistorial]);

  const cargarListado = async (termino = busquedaListado) => {
    try {
      setLoadingListado(true);
      const data = await listarPlanesPagoService({
        q: String(termino || "").trim(),
      });
      setPlanes(normalizarRespuesta(data));
    } catch (err) {
      console.error(err);
      setPlanes([]);
    } finally {
      setLoadingListado(false);
    }
  };

  useEffect(() => {
    if (vista === "listado") cargarListado("");
  }, [vista]);

  const handleCrearPlan = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!clienteId || !cotizacionId) {
      setError("Selecciona un cliente y una cotización.");
      return;
    }

    const valor = Number(valorACobrar);
    const anticipo = Number(valorAnticipo) || 0;

    if (!valor || valor <= 0) {
      setError("Ingresa un valor a cobrar válido.");
      return;
    }

    if (registrarAnticipo && anticipo > 0 && !numeroTransferencia.trim()) {
      setError("Ingresa el número de transferencia del anticipo.");
      return;
    }

    try {
      setGuardando(true);
      const resultado = await crearPlanPagoService({
        cotizacion_id: Number(cotizacionId),
        valor_a_cobrar: valor,
        cantidad_pagos: Number(cantidadPagos) || 1,
        valor_anticipo: anticipo,
        numero_transferencia: numeroTransferencia.trim(),
        notas: notas.trim(),
        registrar_anticipo: registrarAnticipo && anticipo > 0,
        usuario_creador: obtenerUsuarioId(),
      });

      setMensaje(
        `Plan ${resultado.codigo_plan} creado correctamente.`
      );

      if (resultado.pago_anticipo_id) {
        await abrirPdfRecibo(
          resultado.pago_anticipo_id,
          resultado.codigo_recibo_anticipo
        );
      }

      limpiarCliente();
      setCantidadPagos("1");
      setValorAnticipo("");
      setNumeroTransferencia("");
      setNotas("");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "No se pudo crear el plan de pago.";
      setError(msg);
    } finally {
      setGuardando(false);
    }
  };

  const handleRegistrarAbono = async (e) => {
    e.preventDefault();
    if (!planAbono) return;

    const monto = Number(montoAbono);
    if (!monto || monto <= 0) {
      setError("Ingresa un monto válido.");
      return;
    }
    if (!transferenciaAbono.trim()) {
      setError("Ingresa el número de transferencia.");
      return;
    }

    try {
      setGuardandoAbono(true);
      setError("");
      const resultado = await registrarPagoService({
        plan_pago_id: planAbono.plan_pago_id,
        monto,
        numero_transferencia: transferenciaAbono.trim(),
        tipo_pago: "abono",
        notas: notasAbono.trim(),
        usuario_creador: obtenerUsuarioId(),
      });

      await abrirPdfRecibo(resultado.pago_cliente_id, resultado.codigo_recibo);
      cerrarModalAbono();
      cargarListado();
      setMensaje(`Abono registrado (${resultado.codigo_recibo}).`);
    } catch (err) {
      setError(err?.response?.data?.message || "No se pudo registrar el abono.");
    } finally {
      setGuardandoAbono(false);
    }
  };

  const cotizacionSeleccionada = cotizaciones.find(
    (c) => String(c.cotizacion_id) === String(cotizacionId)
  );

  return (
    <div className="tm-users pagos-page">
      <header className="tm-users__header" style={{ display: "block" }}>
        <div style={{ marginBottom: 16 }}>
          <span className="cotiz-page__eyebrow" style={{
            display: "inline-block",
            marginBottom: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#7c3aed",
          }}>
            Ventas
          </span>
          <h1 style={{ margin: "0 0 6px" }}>Control de pagos</h1>
          <p style={{ margin: 0, color: "#6b7280" }}>
            Asocia una cotización con un plan de pago y genera recibos PDF.
          </p>
        </div>

        <div className="pagos-page__tabs">
          <button
            type="button"
            className={`pagos-page__tabs-btn ${vista === "crear" ? "is-active" : ""}`}
            onClick={() => setVista("crear")}
          >
            <Plus size={18} />
            Nuevo plan
          </button>
          <button
            type="button"
            className={`pagos-page__tabs-btn ${vista === "listado" ? "is-active" : ""}`}
            onClick={() => setVista("listado")}
          >
            <List size={18} />
            Listado
          </button>
        </div>
      </header>

      {mensaje && <p className="pagos-success">{mensaje}</p>}
      {error && vista !== "listado" && <p className="pagos-error">{error}</p>}

      {vista === "crear" && (
        <form className="pagos-form-grid" onSubmit={handleCrearPlan}>
          <section className="pagos-panel">
            <h2>Cliente</h2>
            <div
              className="cotiz-field cotiz-autocomplete"
              ref={clienteRef}
              style={{ position: "relative" }}
            >
              <label>Buscar cliente</label>
              <div className="cotiz-input-icon cotiz-autocomplete__trigger" style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: "0 12px",
                minHeight: 48,
              }}>
                {clienteId ? <User size={18} /> : <Search size={18} />}
                <input
                  type="text"
                  value={clienteSearch}
                  onChange={(e) => {
                    setClienteSearch(e.target.value);
                    setClienteDropdownOpen(true);
                    if (clienteId) limpiarCliente();
                  }}
                  onFocus={() => setClienteDropdownOpen(true)}
                  placeholder="Nombre o teléfono"
                  autoComplete="off"
                  style={{ border: "none", flex: 1, outline: "none" }}
                />
                {clienteId && (
                  <button type="button" onClick={limpiarCliente} aria-label="Quitar">
                    <X size={16} />
                  </button>
                )}
              </div>
              {clienteDropdownOpen && (
                <ul className="cotiz-autocomplete__list" role="listbox" style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  margin: "6px 0 0",
                  padding: 6,
                  listStyle: "none",
                  maxHeight: 220,
                  overflowY: "auto",
                }}>
                  {clientesFiltrados.map((c) => (
                    <li key={c.cliente_id}>
                      <button
                        type="button"
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "none",
                          background: "transparent",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => seleccionarCliente(c)}
                      >
                        {formatearClienteDisplay(c)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="pagos-panel">
            <h2>Cotización del cliente</h2>
            {!clienteId && (
              <p className="pagos-hint">Selecciona un cliente para ver sus cotizaciones.</p>
            )}
            {clienteId && loadingCotiz && (
              <p className="pagos-hint">Cargando cotizaciones...</p>
            )}
            {clienteId && !loadingCotiz && cotizaciones.length === 0 && (
              <p className="pagos-hint">Este cliente no tiene cotizaciones activas.</p>
            )}
            {clienteId && !loadingCotiz && cotizaciones.length > 0 && (
              <ul className="pagos-cotiz-list" role="listbox">
                {cotizaciones.map((cot) => {
                  const id = String(cot.cotizacion_id);
                  const ocupada = Number(cot.tiene_plan_pago) === 1;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        role="option"
                        disabled={ocupada}
                        className={`pagos-cotiz-item ${
                          cotizacionId === id ? "is-selected" : ""
                        }`}
                        onClick={() => seleccionarCotizacion(cot)}
                      >
                        <span className="pagos-cotiz-item__code">
                          {cot.codigo_cotizacion}
                        </span>
                        <span className="pagos-cotiz-item__meta">
                          {cot.tipo_prenda_nombre || "Prenda"} ·{" "}
                          {formatearMoneda(cot.valor_total)}
                        </span>
                        {ocupada && (
                          <span className="pagos-cotiz-item__badge">
                            Ya tiene plan ({cot.codigo_plan})
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="pagos-panel">
            <h2>Plan de pago</h2>
            {!cotizacionId ? (
              <p className="pagos-hint">Selecciona una cotización disponible.</p>
            ) : (
              <>
                {cotizacionSeleccionada && (
                  <div className="pagos-resumen">
                    <p>
                      Cotización: <strong>{cotizacionSeleccionada.codigo_cotizacion}</strong>
                    </p>
                    <p>
                      Valor original:{" "}
                      <strong>{formatearMoneda(cotizacionSeleccionada.valor_total)}</strong>
                    </p>
                  </div>
                )}

                <div className="pagos-field">
                  <label htmlFor="valor-a-cobrar">Valor a cobrar</label>
                  <div className="pagos-input-icon">
                    <span className="pagos-currency">Q</span>
                    <input
                      id="valor-a-cobrar"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorACobrar}
                      onChange={(e) => setValorACobrar(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pagos-field">
                  <label htmlFor="cantidad-pagos">Cantidad de pagos</label>
                  <input
                    id="cantidad-pagos"
                    type="number"
                    min="1"
                    step="1"
                    value={cantidadPagos}
                    onChange={(e) => setCantidadPagos(e.target.value)}
                  />
                </div>

                <div className="pagos-field">
                  <label htmlFor="valor-anticipo">Valor del anticipo</label>
                  <div className="pagos-input-icon">
                    <span className="pagos-currency">Q</span>
                    <input
                      id="valor-anticipo"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorAnticipo}
                      onChange={(e) => setValorAnticipo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pagos-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={registrarAnticipo}
                      onChange={(e) => setRegistrarAnticipo(e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    Registrar anticipo y generar recibo PDF
                  </label>
                </div>

                {registrarAnticipo && Number(valorAnticipo) > 0 && (
                  <div className="pagos-field">
                    <label htmlFor="num-transferencia">Número de transferencia</label>
                    <input
                      id="num-transferencia"
                      type="text"
                      value={numeroTransferencia}
                      onChange={(e) => setNumeroTransferencia(e.target.value)}
                      placeholder="Ej. 123456789"
                    />
                  </div>
                )}

                <div className="pagos-field">
                  <label htmlFor="notas-plan">Notas (opcional)</label>
                  <textarea
                    id="notas-plan"
                    rows={2}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>

                <div className="pagos-resumen">
                  <p>
                    Saldo después del anticipo: <strong>{formatearMoneda(saldoEstimado)}</strong>
                  </p>
                  <p>
                    Cuota referencial (plan de {cantidadPagos} pago(s)):{" "}
                    <strong>{formatearMoneda(cuotaReferencial)}</strong>
                  </p>
                </div>

                <button
                  type="submit"
                  className="pagos-save"
                  disabled={guardando}
                >
                  <Save size={18} />
                  {guardando ? "Guardando..." : "Guardar plan de pago"}
                </button>
              </>
            )}
          </section>
        </form>
      )}

      {vista === "listado" && (
        <section className="tm-users__card">
          <div className="search-filter-container pagos-list-toolbar">
            <div className="group">
              <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
                </g>
              </svg>
              <input
                type="search"
                className="input"
                placeholder="Buscar plan, cotización o cliente"
                value={busquedaListado}
                onChange={(e) => setBusquedaListado(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && cargarListado()}
              />
            </div>
            <button
              type="button"
              className="pagos-btn-buscar"
              onClick={() => cargarListado()}
            >
              Buscar
            </button>
          </div>

          {loadingListado && <p className="tm-users__state">Cargando planes...</p>}

          {!loadingListado && planes.length === 0 && (
            <p className="tm-users__state">No hay planes de pago registrados.</p>
          )}

          {!loadingListado && planes.length > 0 && (
            <div className="tm-users__table-wrapper">
              <table className="tm-users__table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Cliente</th>
                    <th>Cotización</th>
                    <th>A cobrar</th>
                    <th>Abonado</th>
                    <th>Saldo</th>
                    <th>Cuotas</th>
                    <th>Monto agregado</th>
                    <th>Fecha creado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {planes.map((p) => (
                    <tr key={p.plan_pago_id}>
                      <td>
                        <strong>{p.codigo_plan}</strong>
                      </td>
                      <td>{p.cliente_nombre}</td>
                      <td>{p.codigo_cotizacion}</td>
                      <td>{formatearMoneda(p.valor_a_cobrar)}</td>
                      <td>{formatearMoneda(p.total_abonado)}</td>
                      <td>{formatearMoneda(p.saldo_pendiente)}</td>
                      <td>
                        <span className="pagos-cuotas-badge" title="Pagos realizados / total planificado">
                          {formatearCuotasPlan(p)}
                        </span>
                      </td>
                      <td>{formatearMoneda(p.valor_anticipo)}</td>
                      <td className="pagos-table-fecha">{formatearFecha(p.fecha_creado)}</td>
                      <td>
                        <div className="tm-users__acciones pagos-acciones">
                          <button
                            type="button"
                            className="tm-users__btn-accion pagos-btn-historial"
                            onClick={() => abrirModalHistorial(p)}
                            title="Ver abonos registrados"
                          >
                            <Eye size={14} />
                            Ver pagos
                          </button>
                          {Number(p.saldo_pendiente) > 0 && (
                            <button
                              type="button"
                              className="tm-users__btn-accion tm-users__btn-accion--editar"
                              onClick={() => abrirModalAbono(p)}
                            >
                              <Wallet size={14} />
                              Abono
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {(planHistorial || cargandoHistorial) && (
        <div className="pagos-modal-overlay" onClick={cerrarModalHistorial}>
          <div
            className="pagos-modal pagos-modal--historial"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pagos-modal__header">
              <h3>Abonos registrados</h3>
              <button
                type="button"
                className="pagos-modal__close"
                onClick={cerrarModalHistorial}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {cargandoHistorial && (
              <p className="pagos-hint">Cargando historial de pagos...</p>
            )}

            {!cargandoHistorial && planHistorial && (
              <>
                <p className="pagos-modal__sub">
                  Plan <strong>{planHistorial.codigo_plan}</strong> ·{" "}
                  {planHistorial.cliente_nombre} · Cuotas{" "}
                  {formatearCuotasPlan(planHistorial)}
                </p>

                {pagosDelHistorial.length === 0 ? (
                  <p className="pagos-hint">Este plan aún no tiene pagos registrados.</p>
                ) : (
                  <div className="pagos-historial-table-wrap">
                    <table className="pagos-historial-table">
                      <thead>
                        <tr>
                          <th>Cuota</th>
                          <th>Recibo</th>
                          <th>Fecha</th>
                          <th>Monto</th>
                          <th>Tipo</th>
                          <th>Transferencia</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {pagosDelHistorial.map((pago, idx) => (
                          <tr key={pago.pago_cliente_id}>
                            <td>{textoCuotaPago(planHistorial, idx)}</td>
                            <td>
                              <strong>{pago.codigo_recibo}</strong>
                            </td>
                            <td className="pagos-table-fecha">
                              {formatearFecha(pago.fecha_pago || pago.fecha_registro)}
                            </td>
                            <td>{formatearMoneda(pago.monto)}</td>
                            <td>{etiquetaTipoPago(pago.tipo_pago)}</td>
                            <td>{pago.numero_transferencia || "—"}</td>
                            <td>
                              <button
                                type="button"
                                className="pagos-btn-pdf-mini"
                                onClick={() =>
                                  abrirPdfRecibo(
                                    pago.pago_cliente_id,
                                    pago.codigo_recibo
                                  )
                                }
                                title="Ver recibo PDF"
                              >
                                <FileText size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="pagos-modal__actions">
                  <button
                    type="button"
                    className="pagos-btn-cancel"
                    onClick={cerrarModalHistorial}
                  >
                    Cerrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {(planAbono || cargandoAbono) && (
        <div className="pagos-modal-overlay" onClick={cerrarModalAbono}>
          <div className="pagos-modal" onClick={(e) => e.stopPropagation()}>
            {cargandoAbono && (
              <>
                <h3>Registrar abono</h3>
                <p className="pagos-hint" style={{ marginTop: 12 }}>
                  Calculando pago y monto sugerido...
                </p>
              </>
            )}

            {!cargandoAbono && planAbono && abonoInfo && (
              <>
                <div className="pagos-modal__header">
                  <h3>
                    Pago {abonoInfo.numeroPago} de {abonoInfo.totalCuotas}
                  </h3>
                  <span className="pagos-modal__pago-badge">
                    {abonoInfo.esUltimaCuota ? "Última cuota" : "Abono"}
                  </span>
                </div>
                <p className="pagos-modal__sub">
                  Plan <strong>{planAbono.codigo_plan}</strong> · Cliente:{" "}
                  {planAbono.cliente_nombre}
                </p>
                <div className="pagos-modal__monto-sugerido">
                  <span>Monto sugerido según saldo pendiente</span>
                  <strong>{formatearMoneda(abonoInfo.montoSugerido)}</strong>
                  <small>
                    Saldo: {formatearMoneda(abonoInfo.saldoPendiente)}
                    {abonoInfo.cuotasRestantes > 1 &&
                      ` · ${abonoInfo.cuotasRestantes} cuota(s) por cubrir`}
                  </small>
                </div>
              </>
            )}

            {!cargandoAbono && planAbono && (
              <>
            {error && <p className="pagos-error">{error}</p>}
            <form onSubmit={handleRegistrarAbono}>
              <div className="pagos-field">
                <label className="pagos-field__label-row">
                  Monto a cobrar
                  {abonoInfo && (
                    <button
                      type="button"
                      className="pagos-link-btn"
                      onClick={() =>
                        setMontoAbono(abonoInfo.montoSugerido.toFixed(2))
                      }
                    >
                      Usar sugerido
                    </button>
                  )}
                </label>
                <div className="pagos-input-icon">
                  <span className="pagos-currency">Q</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    max={planAbono.saldo_pendiente}
                    value={montoAbono}
                    onChange={(e) => setMontoAbono(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="pagos-field">
                <label>Número de transferencia</label>
                <input
                  type="text"
                  value={transferenciaAbono}
                  onChange={(e) => setTransferenciaAbono(e.target.value)}
                  required
                />
              </div>
              <div className="pagos-field">
                <label>Notas (opcional)</label>
                <textarea
                  rows={2}
                  value={notasAbono}
                  onChange={(e) => setNotasAbono(e.target.value)}
                />
              </div>
              <div className="pagos-modal__actions">
                <button
                  type="button"
                  className="pagos-btn-cancel"
                  onClick={cerrarModalAbono}
                >
                  Cancelar
                </button>
                <button type="submit" className="pagos-btn-submit" disabled={guardandoAbono}>
                  <Save size={16} />
                  {guardandoAbono ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagos;
