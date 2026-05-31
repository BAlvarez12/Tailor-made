import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/tmListPage.css";
import "./Pagos.css";
import { obtenerClientesActivosService } from "../../services/clienteService";
import { listarCotizacionesService } from "../../services/cotizacionesService";
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
  obtenerFechaHoyInput,
  formatearFechaPago,
} from "../../utils/pagosFecha";
import SiPermiso from "../../components/SiPermiso";
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
} from "lucide-react";
import HistorialPagosModal from "./HistorialPagosModal";

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

function Pagos() {
  const location = useLocation();
  const navigate = useNavigate();
  const deepLinkAplicado = useRef(false);

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
  const [fechaPagoAnticipo, setFechaPagoAnticipo] = useState(obtenerFechaHoyInput);
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
  const [fechaPagoAbono, setFechaPagoAbono] = useState(obtenerFechaHoyInput);
  const [guardandoAbono, setGuardandoAbono] = useState(false);
  const [cargandoAbono, setCargandoAbono] = useState(false);

  const [planHistorial, setPlanHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  useEffect(() => {
    // Carga clientes activos + cotizaciones activas en paralelo, y deja en
    // el dropdown solo los clientes que tienen al menos una cotización.
    Promise.all([
      obtenerClientesActivosService(),
      listarCotizacionesService("", "activas"),
    ])
      .then(([clientesData, cotizacionesData]) => {
        const clientesList = normalizarRespuesta(clientesData).map(normalizarCliente);
        const cotizacionesList = normalizarRespuesta(cotizacionesData);
        const idsConCotizacion = new Set(
          cotizacionesList
            .map((cot) => cot.cliente_id)
            .filter((id) => id !== undefined && id !== null)
            .map(String)
        );
        setClientes(
          clientesList.filter((c) => idsConCotizacion.has(String(c.cliente_id)))
        );
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (deepLinkAplicado.current || clientes.length === 0) return;

    const state = location.state;
    if (state?.modo !== "crear" || !state?.clienteId || !state?.cotizacionId) {
      return;
    }

    deepLinkAplicado.current = true;

    const aplicarDesdeCotizaciones = async () => {
      setVista("crear");
      setError("");
      setMensaje("");

      const cliente = clientes.find(
        (c) => String(c.cliente_id) === String(state.clienteId)
      );

      if (cliente) {
        setClienteId(String(state.clienteId));
        setClienteSearch(formatearClienteDisplay(cliente));
      } else {
        setClienteId(String(state.clienteId));
      }

      try {
        setLoadingCotiz(true);
        const data = await listarCotizacionesClientePagoService(state.clienteId);
        const lista = normalizarRespuesta(data);
        setCotizaciones(lista);

        const cot = lista.find(
          (c) => String(c.cotizacion_id) === String(state.cotizacionId)
        );

        if (cot && !Number(cot.tiene_plan_pago)) {
          setCotizacionId(String(cot.cotizacion_id));
          setValorACobrar(String(cot.valor_total ?? ""));
        } else if (cot?.tiene_plan_pago) {
          setMensaje("Esta cotización ya tiene un plan de pago registrado.");
        }
      } catch (err) {
        console.error("Error al cargar cotización para plan de pago:", err);
        setError("No se pudo cargar la cotización seleccionada.");
      } finally {
        setLoadingCotiz(false);
      }

      navigate(location.pathname, { replace: true, state: null });
    };

    aplicarDesdeCotizaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientes, location.state]);

  // Soporte para el FAB del MobileNav: fuerza la vista "crear" cuando llega
  // navigation con `state.abrirCrear`.
  useEffect(() => {
    if (location.state?.abrirCrear) {
      setVista("crear");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

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
    setFechaPagoAbono(obtenerFechaHoyInput());

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
    setFechaPagoAbono(obtenerFechaHoyInput());
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

    if (!valor || valor <= 0) {
      setError("Ingresa un valor a cobrar válido.");
      return;
    }

    // En un solo pago el cliente paga directo: el "anticipo" es el total.
    // En planes con cuotas, el anticipo es el monto inicial capturado.
    const esPagoUnico = Number(cantidadPagos) === 1;
    const anticipo = esPagoUnico
      ? registrarAnticipo
        ? valor
        : 0
      : Number(valorAnticipo) || 0;

    if (registrarAnticipo && anticipo > 0 && !numeroTransferencia.trim()) {
      setError("Ingresa el número de transferencia del pago.");
      return;
    }

    if (registrarAnticipo && anticipo > 0 && !fechaPagoAnticipo) {
      setError("Selecciona la fecha en que el cliente realizó el pago.");
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
        fecha_pago: fechaPagoAnticipo,
        notas: notas.trim(),
        registrar_anticipo: registrarAnticipo && anticipo > 0,
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
      setFechaPagoAnticipo(obtenerFechaHoyInput());
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

    if (!fechaPagoAbono) {
      setError("Selecciona la fecha en que el cliente realizó el pago.");
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
        fecha_pago: fechaPagoAbono,
        notas: notasAbono.trim(),
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

  // Un solo pago = el cliente paga directo el total; no aplica anticipo.
  const esPagoUnico = Number(cantidadPagos) === 1;

  return (
    <div className="tm-users pagos-page">
      <header className="tm-users__header pagos-page__header">
        <div className="pagos-page__header-info">
          <span className="pagos-page__eyebrow">Ventas</span>
          <h1 className="pagos-page__title">Control de pagos</h1>
          <p className="pagos-page__subtitle">
            Asocia una cotización con un plan de pago y genera recibos PDF.
          </p>
        </div>

        <div className="pagos-page__tabs">
          <SiPermiso codigo="crear_plan_pagos">
            <button
              type="button"
              className={`pagos-page__tabs-btn ${vista === "crear" ? "is-active" : ""}`}
              onClick={() => setVista("crear")}
            >
              <Plus size={18} />
              Nuevo plan
            </button>
          </SiPermiso>
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
              className="cotiz-field cotiz-autocomplete pagos-autocomplete"
              ref={clienteRef}
            >
              <label>Buscar cliente <span className="tm-required">*</span></label>
              <div className="cotiz-input-icon cotiz-autocomplete__trigger pagos-autocomplete__trigger">
                {clienteId ? <User size={18} /> : <Search size={18} />}
                <input
                  type="text"
                  className="pagos-autocomplete__input"
                  value={clienteSearch}
                  onChange={(e) => {
                    setClienteSearch(e.target.value);
                    setClienteDropdownOpen(true);
                    if (clienteId) limpiarCliente();
                  }}
                  onFocus={() => setClienteDropdownOpen(true)}
                  placeholder="Nombre o teléfono"
                  autoComplete="off"
                />
                {clienteId && (
                  <button
                    type="button"
                    className="pagos-autocomplete__clear"
                    onClick={limpiarCliente}
                    aria-label="Quitar"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {clienteDropdownOpen && (
                <ul className="cotiz-autocomplete__list pagos-autocomplete__list" role="listbox">
                  {clientesFiltrados.map((c) => (
                    <li key={c.cliente_id}>
                      <button
                        type="button"
                        className="pagos-autocomplete__option"
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
                  <label htmlFor="valor-a-cobrar">
                    Valor a cobrar <span className="tm-required">*</span>
                  </label>
                  <div className="pagos-input-icon">
                    <span className="pagos-currency">Q</span>
                    <input
                      id="valor-a-cobrar"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valorACobrar}
                      onChange={(e) => setValorACobrar(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pagos-field">
                  <label htmlFor="cantidad-pagos">
                    Cantidad de pagos <span className="tm-required">*</span>
                  </label>
                  <input
                    id="cantidad-pagos"
                    type="number"
                    min="1"
                    step="1"
                    value={cantidadPagos}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCantidadPagos(v);
                      // Al volver a un solo pago, el anticipo deja de aplicar.
                      if (Number(v) === 1) setValorAnticipo("");
                    }}
                    required
                  />
                </div>

                {!esPagoUnico && (
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
                )}

                <div className="pagos-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={registrarAnticipo}
                      onChange={(e) => setRegistrarAnticipo(e.target.checked)}
                      style={{ marginRight: 8 }}
                    />
                    {esPagoUnico
                      ? "Registrar el pago y generar recibo PDF"
                      : "Registrar anticipo y generar recibo PDF"}
                  </label>
                </div>

                {registrarAnticipo && (esPagoUnico || Number(valorAnticipo) > 0) && (
                  <>
                    <div className="pagos-field">
                      <label htmlFor="fecha-pago-anticipo">
                        Fecha en que el cliente realizó el pago
                      </label>
                      <input
                        id="fecha-pago-anticipo"
                        type="date"
                        className="pagos-input-date"
                        value={fechaPagoAnticipo}
                        onChange={(e) => setFechaPagoAnticipo(e.target.value)}
                        max={obtenerFechaHoyInput()}
                        required
                      />
                    </div>
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
                  </>
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
                  {esPagoUnico ? (
                    <p>
                      El cliente paga el total en un solo pago:{" "}
                      <strong>{formatearMoneda(valorACobrar)}</strong>
                    </p>
                  ) : (
                    <>
                      <p>
                        Saldo después del anticipo:{" "}
                        <strong>{formatearMoneda(saldoEstimado)}</strong>
                      </p>
                      <p>
                        Cuota referencial (plan de {cantidadPagos} pago(s)):{" "}
                        <strong>{formatearMoneda(cuotaReferencial)}</strong>
                      </p>
                    </>
                  )}
                </div>

                <p className="tm-required-note">
                  <span className="tm-required">*</span> Campos obligatorios
                </p>

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
            <div className="tm-users__table-wrapper pagos-planes-table-wrap">
              <table className="tm-users__table pagos-planes-table">
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
                    <th>Último pago</th>
                    <th>Fecha plan</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {planes.map((p) => (
                    <tr key={p.plan_pago_id}>
                      <td data-label="Plan">
                        <strong>{p.codigo_plan}</strong>
                      </td>
                      <td data-label="Cliente">{p.cliente_nombre}</td>
                      <td data-label="Cotización">{p.codigo_cotizacion}</td>
                      <td data-label="A cobrar">{formatearMoneda(p.valor_a_cobrar)}</td>
                      <td data-label="Abonado">{formatearMoneda(p.total_abonado)}</td>
                      <td data-label="Saldo">{formatearMoneda(p.saldo_pendiente)}</td>
                      <td data-label="Cuotas">
                        <span className="pagos-cuotas-badge" title="Pagos realizados / total planificado">
                          {formatearCuotasPlan(p)}
                        </span>
                      </td>
                      <td data-label="Monto agregado">{formatearMoneda(p.valor_anticipo)}</td>
                      <td data-label="Último pago" className="pagos-table-fecha">
                        {p.ultima_fecha_pago
                          ? formatearFechaPago(p.ultima_fecha_pago)
                          : "—"}
                      </td>
                      <td data-label="Fecha plan" className="pagos-table-fecha">
                        {formatearFechaPago(p.fecha_creado)}
                      </td>
                      <td data-label="Acciones">
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
                            <SiPermiso codigo="generar_abono_plan_pagos">
                              <button
                                type="button"
                                className="tm-users__btn-accion tm-users__btn-accion--editar"
                                onClick={() => abrirModalAbono(p)}
                              >
                                <Wallet size={14} />
                                Abono
                              </button>
                            </SiPermiso>
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

      <HistorialPagosModal
        open={Boolean(planHistorial || cargandoHistorial)}
        loading={cargandoHistorial}
        plan={planHistorial}
        onClose={cerrarModalHistorial}
      />

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
                  Monto a cobrar <span className="tm-required">*</span>
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
                <label htmlFor="fecha-pago-abono">
                  Fecha en que el cliente realizó el pago <span className="tm-required">*</span>
                </label>
                <input
                  id="fecha-pago-abono"
                  type="date"
                  className="pagos-input-date"
                  value={fechaPagoAbono}
                  onChange={(e) => setFechaPagoAbono(e.target.value)}
                  max={obtenerFechaHoyInput()}
                  required
                />
              </div>
              <div className="pagos-field">
                <label>Número de transferencia <span className="tm-required">*</span></label>
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
              <p className="tm-required-note">
                <span className="tm-required">*</span> Campos obligatorios
              </p>
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
