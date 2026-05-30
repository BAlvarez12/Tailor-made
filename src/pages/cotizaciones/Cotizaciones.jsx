import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Cotizaciones.css";
import { obtenerClientesActivosService } from "../../services/clienteService";
import { obtenerPrendas, obtenerPrendaPorId } from "../../services/prendasService";
import {
  crearCotizacionService,
  listarCotizacionesService,
  obtenerCotizacionPorIdService,
  abrirPdfCotizacion,
  enviarCotizacionPorWhatsApp,
} from "../../services/cotizacionesService";
import {
  obtenerDetallePrenda,
  obtenerImagenesPrenda,
  construirUrlImagenPrenda,
} from "../../utils/Imagenes";
import {
  normalizarCliente,
  formatearClienteDisplay,
  formatearNombreCliente,
  obtenerTelefonoCliente,
  clienteCoincideBusqueda,
} from "../../utils/clienteDisplay";
import { tienePermiso } from "../../utils/permisosUsuario";
import SiPermiso from "../../components/SiPermiso";
import EditarCotizacionModal from "./EditarCotizacionModal";
import AnularCotizacionModal from "./AnularCotizacionModal";
import {
  Search,
  User,
  Shirt,
  Ruler,
  Package,
  Image,
  X,
  Save,
  Printer,
  List,
  Plus,
  Wallet,
  CircleDollarSign,
  MessageCircle,
  Edit3,
  Ban,
  MoreVertical,
} from "lucide-react";
import HistorialPagosModal from "../pagos/HistorialPagosModal";
import {
  listarPlanesPagoService,
  obtenerPlanPagoService,
} from "../../services/pagosService";

const normalizarRespuesta = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

const obtenerIdPrenda = (prenda) =>
  String(prenda?.cliente_prenda_id ?? prenda?.id ?? "");

const formatearMoneda = (valor) => {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return "Q 0.00";
  return `Q ${numero.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const ETIQUETAS_ESTADO_COTIZACION = {
  activa: "Activa",
  en_proceso: "En proceso",
  finalizada: "Finalizada",
  anulada: "Anulada",
};

const resolverEstadoCotizacion = (item) => {
  if (item?.estado_cotizacion) return item.estado_cotizacion;
  if (Number(item?.estado_registro) === 0) return "anulada";
  const saldo = Number(item?.saldo_pendiente);
  if (item?.plan_pago_id) {
    return Number.isFinite(saldo) && saldo <= 0 ? "finalizada" : "en_proceso";
  }
  return "activa";
};

const IconoQuetzal = ({ size = 18 }) => (
  <span className="cotiz-currency-icon" style={{ fontSize: size }}>
    Q
  </span>
);

function Cotizaciones() {
  const location = useLocation();
  const navigate = useNavigate();
  const deepLinkAplicado = useRef(false);
  const prendaSeleccionadaRef = useRef(null);

  const [clientes, setClientes] = useState([]);
  const [prendas, setPrendas] = useState([]);
  const [loadingInicial, setLoadingInicial] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [clienteId, setClienteId] = useState("");
  const [clienteSearch, setClienteSearch] = useState("");
  const [clienteDropdownOpen, setClienteDropdownOpen] = useState(false);
  const clienteAutocompleteRef = useRef(null);

  const [prendaId, setPrendaId] = useState("");

  const [detallePrenda, setDetallePrenda] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");

  const [valorCotizacion, setValorCotizacion] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const [vista, setVista] = useState("crear");
  const [cotizaciones, setCotizaciones] = useState([]);
  const [busquedaListado, setBusquedaListado] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activas");
  const [loadingListado, setLoadingListado] = useState(false);
  const [errorListado, setErrorListado] = useState("");
  const [cotizacionEnVista, setCotizacionEnVista] = useState(null);
  const [historialPagosAbierto, setHistorialPagosAbierto] = useState(false);
  const [cargandoHistorialPagos, setCargandoHistorialPagos] = useState(false);
  const [planHistorialPagos, setPlanHistorialPagos] = useState(null);
  const [errorHistorialPagos, setErrorHistorialPagos] = useState("");
  const [planPagoActivo, setPlanPagoActivo] = useState(null);
  const [cargandoPlanPago, setCargandoPlanPago] = useState(false);
  const [enviandoWhatsAppId, setEnviandoWhatsAppId] = useState(null);
  const [cotizacionAEditar, setCotizacionAEditar] = useState(null);
  const [cotizacionAAnular, setCotizacionAAnular] = useState(null);
  const [menuAbiertoId, setMenuAbiertoId] = useState(null);
  const [menuCoords, setMenuCoords] = useState(null);
  const menuRef = useRef(null);

  const cerrarMenuCotizacion = () => {
    setMenuAbiertoId(null);
    setMenuCoords(null);
  };

  const toggleMenuCotizacion = (cotizacionId, event) => {
    if (menuAbiertoId === cotizacionId) {
      cerrarMenuCotizacion();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const espacioAbajo = window.innerHeight - rect.bottom;
    const arriba = espacioAbajo < 220;

    // Ancho aproximado del menú (min-width 170 + padding/border)
    const MENU_WIDTH = 200;
    const MARGEN = 8;

    // ¿Hay suficiente espacio a la IZQUIERDA del borde derecho del botón?
    // Si no, alineamos el menú al borde IZQUIERDO del botón (abre hacia la derecha)
    const espacioIzquierda = rect.right;
    const abreHaciaDerecha = espacioIzquierda < MENU_WIDTH + MARGEN;

    const coords = {
      direccion: arriba ? "arriba" : "abajo",
      top: arriba ? "auto" : `${rect.bottom + 6}px`,
      bottom: arriba ? `${window.innerHeight - rect.top + 6}px` : "auto",
    };

    if (abreHaciaDerecha) {
      // No hay espacio a la izquierda → alineamos con el borde izquierdo del trigger
      // y limitamos para no salirnos del viewport por la derecha
      const left = Math.max(MARGEN, rect.left);
      const maxLeft = window.innerWidth - MENU_WIDTH - MARGEN;
      coords.left = `${Math.min(left, maxLeft)}px`;
      coords.right = "auto";
    } else {
      // Alineamos con el borde derecho del trigger (comportamiento por defecto)
      coords.right = `${window.innerWidth - rect.right}px`;
      coords.left = "auto";
    }

    setMenuCoords(coords);
    setMenuAbiertoId(cotizacionId);
  };

  useEffect(() => {
    if (menuAbiertoId == null) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        cerrarMenuCotizacion();
      }
    };
    const cerrarPorEventoExterno = () => cerrarMenuCotizacion();
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", cerrarPorEventoExterno, true);
    window.addEventListener("resize", cerrarPorEventoExterno);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", cerrarPorEventoExterno, true);
      window.removeEventListener("resize", cerrarPorEventoExterno);
    };
  }, [menuAbiertoId]);

  const cotizacionTienePlanPago = (item) =>
    Number(item?.tiene_plan_pago) === 1 || Boolean(item?.plan_pago_id);

  const cargarDatos = useCallback(async () => {
    try {
      setLoadingInicial(true);
      setErrorCarga("");
      const [clientesResp, prendasResp] = await Promise.all([
        obtenerClientesActivosService(),
        obtenerPrendas(),
      ]);
      const prendasLista = normalizarRespuesta(prendasResp);
      const idsClientesConPrenda = new Set(
        prendasLista.map((p) =>
          String(p.cliente?.cliente_id ?? p.cliente_id)
        )
      );
      const clientesConPrenda = normalizarRespuesta(clientesResp)
        .map(normalizarCliente)
        .filter((c) => idsClientesConPrenda.has(String(c.cliente_id)));
      setClientes(clientesConPrenda);
      setPrendas(prendasLista);
    } catch (err) {
      console.error("Error al cargar cotizaciones:", err);
      setErrorCarga("No se pudo cargar la información inicial.");
    } finally {
      setLoadingInicial(false);
    }
  }, []);

  const cargarListado = async (
    termino = busquedaListado,
    estado = filtroEstado
  ) => {
    try {
      setLoadingListado(true);
      setErrorListado("");
      const data = await listarCotizacionesService(
        String(termino || "").trim(),
        estado
      );
      setCotizaciones(normalizarRespuesta(data));
    } catch (err) {
      console.error("Error al cargar listado:", err);
      setErrorListado("No se pudo cargar el listado de cotizaciones.");
      setCotizaciones([]);
    } finally {
      setLoadingListado(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
    if (loadingInicial || deepLinkAplicado.current) return;

    const state = location.state;
    if (!state?.modo && !state?.clienteId) return;

    deepLinkAplicado.current = true;

    const aplicarNavegacionDesdePrendas = async () => {
      if (
        (state.modo === "ver" && state.cotizacionId) ||
        (state.clienteId && state.prendaId)
      ) {
        setVista("crear");
        setMensajeExito("");
        setErrorDetalle("");
        setCotizacionEnVista(null);

        const cliente = clientes.find(
          (c) => String(c.cliente_id) === String(state.clienteId)
        );

        if (cliente) {
          setClienteId(String(state.clienteId));
          setClienteSearch(formatearClienteDisplay(cliente));
        } else {
          setClienteId(String(state.clienteId));
        }

        setPrendaId(String(state.prendaId));
        await cargarDetallePrenda(state.prendaId);

        if (state.modo === "ver" && state.cotizacionId) {
          try {
            const cot = await obtenerCotizacionPorIdService(state.cotizacionId);
            aplicarCotizacionEnVista(cot);
          } catch (err) {
            console.error("Error al cargar cotización desde prendas:", err);
            setErrorDetalle("No se pudo cargar la cotización de esta prenda.");
          }
        }
      }

      navigate(location.pathname, { replace: true, state: null });
    };

    aplicarNavegacionDesdePrendas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingInicial, location.state, clientes]);

  // Soporte para el FAB del MobileNav: fuerza la vista "crear" cuando llega
  // navigation con `state.abrirCrear` (independiente del deep-link existente).
  useEffect(() => {
    if (location.state?.abrirCrear) {
      setVista("crear");
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    if (vista === "listado") {
      cargarListado("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vista]);

  const clienteSeleccionado = useMemo(
    () => clientes.find((c) => String(c.cliente_id) === String(clienteId)),
    [clientes, clienteId]
  );

  const prendasDelCliente = useMemo(() => {
    if (!clienteId) return [];
    return prendas.filter(
      (p) =>
        String(p.cliente?.cliente_id ?? p.cliente_id) === String(clienteId)
    );
  }, [prendas, clienteId]);

  const clientesFiltrados = useMemo(() => {
    const texto = clienteSearch.trim().toLowerCase();
    const lista = texto
      ? clientes.filter((c) => clienteCoincideBusqueda(c, texto))
      : clientes;
    return lista.slice(0, 12);
  }, [clientes, clienteSearch]);

  const imagenesReferencia = useMemo(() => {
    if (!detallePrenda) return [];
    return obtenerImagenesPrenda(detallePrenda).map(construirUrlImagenPrenda);
  }, [detallePrenda]);

  const medidas = useMemo(() => {
    if (!detallePrenda?.medidas) return [];
    return normalizarRespuesta(detallePrenda.medidas);
  }, [detallePrenda]);

  const materiales = useMemo(() => {
    if (!detallePrenda?.materiales) return [];
    return normalizarRespuesta(detallePrenda.materiales);
  }, [detallePrenda]);

  const tipoPrendaNombre = useMemo(() => {
    if (!detallePrenda) return "";
    return (
      detallePrenda.nombre_tipo_prenda ||
      detallePrenda.tipo_prenda?.nombre ||
      "Sin tipo"
    );
  }, [detallePrenda]);

  const cargarDetallePrenda = async (id) => {
    try {
      setLoadingDetalle(true);
      setErrorDetalle("");
      const response = await obtenerPrendaPorId(id);
      setDetallePrenda(obtenerDetallePrenda(response));
    } catch (err) {
      console.error("Error al cargar detalle de prenda:", err);
      setDetallePrenda(null);
      setErrorDetalle("No se pudo cargar el detalle de la prenda.");
    } finally {
      setLoadingDetalle(false);
    }
  };

  const aplicarCotizacionEnVista = (cot) => {
    if (!cot?.cotizacion_id) return;

    setCotizacionEnVista({
      cotizacion_id: cot.cotizacion_id,
      codigo_cotizacion: cot.codigo_cotizacion,
      cliente_prenda_id: cot.cliente_prenda_id,
      cliente_id: cot.cliente_id,
      cliente_nombre: cot.cliente_nombre,
      cliente_telefono: cot.cliente_telefono,
      tipo_prenda_nombre: cot.tipo_prenda_nombre,
      valor_total: cot.valor_total,
      fecha_creado: cot.fecha_creado,
    });
    setValorCotizacion(String(cot.valor_total ?? ""));
    setNotas(cot.notas || "");
    setMensajeExito(
      `Cotización ${cot.codigo_cotizacion || ""} de esta prenda.`
    );
  };

  const limpiarCotizacionEnVista = () => {
    setCotizacionEnVista(null);
    setValorCotizacion("");
    setNotas("");
    setPlanPagoActivo(null);
  };

  const cargarPlanPagoCotizacion = useCallback(async (cotizacionId) => {
    if (!cotizacionId) {
      setPlanPagoActivo(null);
      return;
    }

    try {
      setCargandoPlanPago(true);
      const planes = normalizarRespuesta(
        await listarPlanesPagoService({ cotizacion_id: cotizacionId })
      );
      setPlanPagoActivo(planes[0] || null);
    } catch (err) {
      console.error("Error al consultar plan de pago:", err);
      setPlanPagoActivo(null);
    } finally {
      setCargandoPlanPago(false);
    }
  }, []);

  const limpiarPrenda = () => {
    setPrendaId("");
    setDetallePrenda(null);
    setErrorDetalle("");
    limpiarCotizacionEnVista();
    setMensajeExito("");
  };

  const cotizacionActivaParaPrenda = useMemo(() => {
    if (!cotizacionEnVista || !prendaId) return null;
    return String(cotizacionEnVista.cliente_prenda_id) === String(prendaId)
      ? cotizacionEnVista
      : null;
  }, [cotizacionEnVista, prendaId]);

  useEffect(() => {
    if (!cotizacionActivaParaPrenda?.cotizacion_id) {
      setPlanPagoActivo(null);
      return;
    }
    cargarPlanPagoCotizacion(cotizacionActivaParaPrenda.cotizacion_id);
  }, [cotizacionActivaParaPrenda?.cotizacion_id, cargarPlanPagoCotizacion]);

  const limpiarCliente = () => {
    setClienteId("");
    setClienteSearch("");
    limpiarPrenda();
  };

  const seleccionarCliente = (cliente) => {
    const id = String(cliente.cliente_id);
    setClienteId(id);
    setClienteSearch(formatearClienteDisplay(cliente));
    setClienteDropdownOpen(false);
    limpiarPrenda();
  };

  const seleccionarPrenda = async (prenda) => {
    const id = obtenerIdPrenda(prenda);
    if (!id) return;
    if (id === prendaId && detallePrenda && cotizacionActivaParaPrenda) return;
    if (id === prendaId && detallePrenda && !prenda?.cotizacion?.cotizacion_id) {
      return;
    }

    setPrendaId(id);
    setMensajeExito("");
    limpiarCotizacionEnVista();
    await cargarDetallePrenda(id);

    const cotizacionPrenda = prenda?.cotizacion;
    if (cotizacionPrenda?.cotizacion_id) {
      try {
        const cot = await obtenerCotizacionPorIdService(
          cotizacionPrenda.cotizacion_id
        );
        aplicarCotizacionEnVista(cot);
      } catch (err) {
        console.error("Error al cargar cotización de la prenda:", err);
      }
    }
  };

  useEffect(() => {
    if (!prendaId || !detallePrenda) return;
    prendaSeleccionadaRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [prendaId, detallePrenda, clienteId]);

  useEffect(() => {
    if (!clienteDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (
        clienteAutocompleteRef.current &&
        !clienteAutocompleteRef.current.contains(e.target)
      ) {
        setClienteDropdownOpen(false);
        if (clienteSeleccionado) {
          setClienteSearch(formatearClienteDisplay(clienteSeleccionado));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clienteDropdownOpen, clienteSeleccionado]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensajeExito("");

    if (cotizacionActivaParaPrenda) {
      setErrorDetalle(
        "Esta prenda ya tiene una cotización. Usa «Ver PDF» para reimprimirla."
      );
      return;
    }

    if (!clienteId) {
      setErrorDetalle("Selecciona un cliente.");
      return;
    }
    if (!prendaId || !detallePrenda) {
      setErrorDetalle("Selecciona una prenda del cliente.");
      return;
    }
    const valor = Number(valorCotizacion);
    if (!valorCotizacion.trim() || Number.isNaN(valor) || valor <= 0) {
      setErrorDetalle("Ingresa un valor de cotización válido.");
      return;
    }

    try {
      setGuardando(true);
      const resultado = await crearCotizacionService({
        cliente_id: Number(clienteId),
        cliente_prenda_id: Number(prendaId),
        valor_total: valor,
        notas: notas.trim(),
      });

      if (resultado.cotizacion_id) {
        await abrirPdfCotizacion(
          resultado.cotizacion_id,
          resultado.codigo_cotizacion
        );
      }

      // Limpia todo el formulario para evitar guardar la misma cotización dos veces.
      // El mensaje se setea DESPUÉS de la limpieza (limpiarCliente lo borra).
      limpiarCliente();
      setErrorDetalle("");
      setMensajeExito(
        `Cotización ${resultado.codigo_cotizacion || ""} guardada correctamente.`
      );
      toast.success(
        `Cotización ${resultado.codigo_cotizacion || ""} guardada correctamente`
      );
    } catch (err) {
      console.error("Error al guardar cotización:", err);
      setErrorDetalle(
        err?.response?.data?.message || "No se pudo guardar la cotización."
      );
    } finally {
      setGuardando(false);
    }
  };

  const resolverTelefonoCotizacion = useCallback(
    (cotizacion) => {
      const telefonoDirecto = String(cotizacion?.cliente_telefono || "").trim();
      if (telefonoDirecto) return telefonoDirecto;

      if (
        clienteSeleccionado &&
        String(clienteSeleccionado.cliente_id) === String(cotizacion?.cliente_id)
      ) {
        return obtenerTelefonoCliente(clienteSeleccionado);
      }

      const cliente = clientes.find(
        (c) => String(c.cliente_id) === String(cotizacion?.cliente_id)
      );
      if (cliente) return obtenerTelefonoCliente(cliente);

      return (
        detallePrenda?.telefono ||
        detallePrenda?.cliente?.telefono ||
        ""
      );
    },
    [clientes, clienteSeleccionado, detallePrenda]
  );

  const resolverNombreClienteCotizacion = useCallback(
    (cotizacion) => {
      if (cotizacion?.cliente_nombre) return cotizacion.cliente_nombre;

      if (
        clienteSeleccionado &&
        String(clienteSeleccionado.cliente_id) === String(cotizacion?.cliente_id)
      ) {
        return formatearNombreCliente(clienteSeleccionado);
      }

      const cliente = clientes.find(
        (c) => String(c.cliente_id) === String(cotizacion?.cliente_id)
      );
      return formatearNombreCliente(cliente);
    },
    [clientes, clienteSeleccionado]
  );

  const handleImprimirPdf = async (cotizacion) => {
    try {
      await abrirPdfCotizacion(
        cotizacion.cotizacion_id,
        cotizacion.codigo_cotizacion
      );
    } catch (err) {
      console.error("Error al abrir PDF:", err);
      const mensaje = "No se pudo generar el PDF.";
      if (vista === "listado") setErrorListado(mensaje);
      else setErrorDetalle(mensaje);
    }
  };

  const handleEnviarWhatsApp = async (cotizacion, origen = "listado") => {
    const telefono = resolverTelefonoCotizacion(cotizacion);

    if (!telefono) {
      const mensaje =
        "El cliente no tiene teléfono registrado. Actualiza sus datos en Clientes.";
      if (origen === "listado") setErrorListado(mensaje);
      else setErrorDetalle(mensaje);
      return;
    }

    try {
      setEnviandoWhatsAppId(cotizacion.cotizacion_id);
      if (origen === "listado") setErrorListado("");
      else setErrorDetalle("");

      await enviarCotizacionPorWhatsApp({
        ...cotizacion,
        cliente_telefono: telefono,
        cliente_nombre: resolverNombreClienteCotizacion(cotizacion),
        tipo_prenda_nombre:
          cotizacion.tipo_prenda_nombre || tipoPrendaNombre || "",
      });

      setMensajeExito("WhatsApp abierto con el detalle de la cotización.");
    } catch (err) {
      console.error("Error al enviar por WhatsApp:", err);
      const mensaje =
        err?.message || "No se pudo preparar el envío por WhatsApp.";
      if (origen === "listado") setErrorListado(mensaje);
      else setErrorDetalle(mensaje);
    } finally {
      setEnviandoWhatsAppId(null);
    }
  };

  const cerrarHistorialPagos = () => {
    setHistorialPagosAbierto(false);
    setCargandoHistorialPagos(false);
    setPlanHistorialPagos(null);
    setErrorHistorialPagos("");
  };

  const abrirHistorialPagos = async (origen = null) => {
    const planResumen =
      origen?.plan_pago_id != null
        ? origen
        : planPagoActivo?.plan_pago_id
          ? planPagoActivo
          : null;

    if (!planResumen?.plan_pago_id) return;

    setHistorialPagosAbierto(true);
    setCargandoHistorialPagos(true);
    setPlanHistorialPagos(null);
    setErrorHistorialPagos("");

    try {
      const detalle = await obtenerPlanPagoService(planResumen.plan_pago_id);
      setPlanHistorialPagos({ ...planResumen, ...detalle });
    } catch (err) {
      console.error("Error al cargar pagos de la cotización:", err);
      setErrorHistorialPagos("No se pudo cargar el historial de pagos.");
    } finally {
      setCargandoHistorialPagos(false);
    }
  };

  const irAGenerarPlanPago = (cot) => {
    if (!cot?.cotizacion_id || !cot?.cliente_id) return;

    navigate("/home/pagos", {
      state: {
        modo: "crear",
        clienteId: cot.cliente_id,
        cotizacionId: cot.cotizacion_id,
      },
    });
  };

  return (
    <div className="cotiz-page">
      <header className="cotiz-page__header">
        <div>
          <span className="cotiz-page__eyebrow">Ventas</span>
          <h1 className="cotiz-page__title">Cotizaciones</h1>
          <p className="cotiz-page__subtitle">
            Crea cotizaciones, consulta el historial y reimprime PDF con
            encabezado BeautyBell.
          </p>
        </div>
        <div className="cotiz-tabs">
          <SiPermiso codigo="crear_cotizaciones">
            <button
              type="button"
              className={`cotiz-tabs__btn ${vista === "crear" ? "is-active" : ""}`}
              onClick={() => setVista("crear")}
            >
              <Plus size={18} />
              Nueva cotización
            </button>
          </SiPermiso>
          <button
            type="button"
            className={`cotiz-tabs__btn ${vista === "listado" ? "is-active" : ""}`}
            onClick={() => setVista("listado")}
          >
            <List size={18} />
            Listado
          </button>
        </div>
      </header>

      {vista === "listado" && (
        <section className="cotiz-listado">
          <div className="cotiz-listado__toolbar">
            <input
              type="text"
              className="cotiz-listado__search"
              placeholder="Buscar por código, nombre o teléfono del cliente..."
              value={busquedaListado}
              onChange={(e) => setBusquedaListado(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && cargarListado()}
            />
            <button type="button" onClick={() => cargarListado()}>
              Buscar
            </button>
          </div>

          <div className="cotiz-listado__filtros" role="group" aria-label="Filtrar por estado">
            {[
              { value: "activas", label: "Activas" },
              { value: "anuladas", label: "Anuladas" },
              { value: "todas", label: "Todas" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`cotiz-listado__filtro ${
                  filtroEstado === opt.value ? "is-active" : ""
                }`}
                onClick={() => {
                  setFiltroEstado(opt.value);
                  cargarListado(busquedaListado, opt.value);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loadingListado && (
            <div className="cotiz-page__state">Cargando cotizaciones...</div>
          )}

          {!loadingListado && errorListado && (
            <div className="cotiz-page__state cotiz-page__state--error">
              <span>{errorListado}</span>
            </div>
          )}

          {!loadingListado && !errorListado && cotizaciones.length === 0 && (
            <div className="cotiz-page__state">No hay cotizaciones para mostrar.</div>
          )}

          {!loadingListado && !errorListado && cotizaciones.length > 0 && (
            <div className="cotiz-table-wrap">
              <table className="cotiz-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Tipo de prenda</th>
                    <th>Total</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizaciones.map((item) => {
                    const estado = resolverEstadoCotizacion(item);
                    const esAnulada = estado === "anulada";
                    return (
                    <tr
                      key={item.cotizacion_id}
                      className={esAnulada ? "cotiz-table__row--anulada" : ""}
                    >
                      <td data-label="Código">
                        <strong>{item.codigo_cotizacion}</strong>
                      </td>
                      <td data-label="Cliente">{item.cliente_nombre}</td>
                      <td data-label="Teléfono">{item.cliente_telefono || "—"}</td>
                      <td data-label="Tipo de prenda">{item.tipo_prenda_nombre || "—"}</td>
                      <td data-label="Total">{formatearMoneda(item.valor_total)}</td>
                      <td data-label="Fecha">
                        {item.fecha_creado
                          ? new Date(item.fecha_creado).toLocaleDateString("es-GT")
                          : "—"}
                      </td>
                      <td data-label="Estado">
                        <span className={`cotiz-estado-badge cotiz-estado-badge--${estado}`}>
                          {ETIQUETAS_ESTADO_COTIZACION[estado] || estado}
                        </span>
                      </td>
                      <td data-label="Acciones" className="cotiz-table__acciones">
                        <SiPermiso codigo="generar_pdf_cotizacion">
                          <button
                            type="button"
                            className="cotiz-table__pdf"
                            onClick={() => handleImprimirPdf(item)}
                            title="Ver PDF"
                          >
                            <Printer size={16} />
                            PDF
                          </button>
                        </SiPermiso>
                        {!esAnulada && (
                          <SiPermiso codigo="enviar_whatsapp_cotizacion">
                            <button
                              type="button"
                              className="cotiz-table__whatsapp"
                              onClick={() => handleEnviarWhatsApp(item, "listado")}
                              disabled={
                                enviandoWhatsAppId === item.cotizacion_id ||
                                !resolverTelefonoCotizacion(item)
                              }
                              title={
                                resolverTelefonoCotizacion(item)
                                  ? "Enviar cotización por WhatsApp"
                                  : "Sin teléfono registrado"
                              }
                            >
                              <MessageCircle size={16} />
                              {enviandoWhatsAppId === item.cotizacion_id
                                ? "Enviando..."
                                : "WhatsApp"}
                            </button>
                          </SiPermiso>
                        )}
                        {!esAnulada && (
                          <div
                            className="cotiz-menu"
                            ref={
                              menuAbiertoId === item.cotizacion_id
                                ? menuRef
                                : null
                            }
                          >
                            <button
                              type="button"
                              className="cotiz-menu__trigger"
                              aria-haspopup="menu"
                              aria-expanded={menuAbiertoId === item.cotizacion_id}
                              title="Más acciones"
                              onClick={(e) => toggleMenuCotizacion(item.cotizacion_id, e)}
                            >
                              <MoreVertical size={16} />
                            </button>
                            {menuAbiertoId === item.cotizacion_id && menuCoords && (
                              <div
                                className={`cotiz-menu__list cotiz-menu__list--${menuCoords.direccion}`}
                                role="menu"
                                style={{
                                  position: "fixed",
                                  top: menuCoords.top,
                                  bottom: menuCoords.bottom,
                                  right: menuCoords.right,
                                  left: menuCoords.left,
                                }}
                              >
                                {cotizacionTienePlanPago(item) ? (
                                  <SiPermiso codigo="ver_plan_pagos">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="cotiz-menu__item"
                                      onClick={() => {
                                        setMenuAbiertoId(null);
                                        abrirHistorialPagos(item);
                                      }}
                                    >
                                      <Wallet size={14} />
                                      Ver pagos
                                    </button>
                                  </SiPermiso>
                                ) : (
                                  <SiPermiso codigo="generar_plan_pagos_cotizacion">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="cotiz-menu__item"
                                      onClick={() => {
                                        setMenuAbiertoId(null);
                                        irAGenerarPlanPago(item);
                                      }}
                                    >
                                      <CircleDollarSign size={14} />
                                      Generar plan
                                    </button>
                                  </SiPermiso>
                                )}

                                {!cotizacionTienePlanPago(item) && (
                                  <SiPermiso codigo="editar_cotizaciones">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="cotiz-menu__item"
                                      onClick={() => {
                                        setMenuAbiertoId(null);
                                        setCotizacionAEditar(item);
                                      }}
                                    >
                                      <Edit3 size={14} />
                                      Editar
                                    </button>
                                  </SiPermiso>
                                )}

                                {!cotizacionTienePlanPago(item) && (
                                  <SiPermiso codigo="anular_cotizaciones">
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="cotiz-menu__item cotiz-menu__item--danger"
                                      onClick={() => {
                                        setMenuAbiertoId(null);
                                        setCotizacionAAnular(item);
                                      }}
                                    >
                                      <Ban size={14} />
                                      Anular
                                    </button>
                                  </SiPermiso>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {vista === "crear" && loadingInicial && (
        <div className="cotiz-page__state">Cargando información...</div>
      )}

      {vista === "crear" && !loadingInicial && errorCarga && (
        <div className="cotiz-page__state cotiz-page__state--error">
          <span>{errorCarga}</span>
          <button type="button" onClick={cargarDatos}>
            Reintentar
          </button>
        </div>
      )}

      {vista === "crear" && !loadingInicial && !errorCarga && (
        <form className="cotiz-layout" onSubmit={handleGuardar}>
          <section className="cotiz-panel cotiz-panel--selectors">
            <h2>Selección</h2>

            <div
              className="cotiz-field cotiz-autocomplete"
              ref={clienteAutocompleteRef}
            >
              <label>Cliente <span className="tm-required">*</span></label>
              <div className="cotiz-input-icon cotiz-autocomplete__trigger">
                {clienteId ? <User size={18} /> : <Search size={18} />}
                <input
                  type="text"
                  value={clienteSearch}
                  onChange={(e) => {
                    setClienteSearch(e.target.value);
                    setClienteDropdownOpen(true);
                    if (clienteId) {
                      const sel = clientes.find(
                        (c) => String(c.cliente_id) === String(clienteId)
                      );
                      if (e.target.value.trim() !== formatearClienteDisplay(sel)) {
                        limpiarCliente();
                        setClienteSearch(e.target.value);
                      }
                    }
                  }}
                  onFocus={() => setClienteDropdownOpen(true)}
                  placeholder="Buscar por nombre o teléfono"
                  autoComplete="off"
                />
                {clienteId && (
                  <button
                    type="button"
                    className="cotiz-autocomplete__clear"
                    onClick={limpiarCliente}
                    aria-label="Quitar cliente"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {clienteDropdownOpen && (
                <ul className="cotiz-autocomplete__list" role="listbox">
                  {clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cliente) => (
                      <li key={cliente.cliente_id}>
                        <button
                          type="button"
                          className="cotiz-autocomplete__option"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => seleccionarCliente(cliente)}
                        >
                          {formatearClienteDisplay(cliente)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="cotiz-autocomplete__empty">
                      No se encontraron clientes
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div
              className={`cotiz-field cotiz-prenda-picker ${
                !clienteId ? "is-disabled" : ""
              }`}
            >
              <label>
                Prenda del cliente
                {clienteId && prendasDelCliente.length > 0 && (
                  <span className="cotiz-prenda-picker__count">
                    ({prendasDelCliente.length})
                  </span>
                )}
              </label>

              {!clienteId && (
                <p className="cotiz-prenda-picker__placeholder">
                  Primero selecciona un cliente
                </p>
              )}

              {clienteId && prendasDelCliente.length === 0 && (
                <p className="cotiz-prenda-picker__placeholder">
                  Este cliente no tiene prendas registradas
                </p>
              )}

              {clienteId && prendasDelCliente.length > 0 && (
                <ul
                  className="cotiz-prenda-picker__list"
                  role="listbox"
                  aria-label="Prendas del cliente"
                >
                  {prendasDelCliente.map((prenda) => {
                    const id = obtenerIdPrenda(prenda);
                    const isSelected = prendaId === id;
                    const tipo =
                      prenda.tipo_prenda?.nombre ||
                      prenda.nombre_tipo_prenda ||
                      "Sin tipo";

                    return (
                      <li
                        key={id}
                        ref={isSelected ? prendaSeleccionadaRef : null}
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={`cotiz-prenda-picker__item ${
                            isSelected ? "is-selected" : ""
                          }`}
                          onClick={() => seleccionarPrenda(prenda)}
                          disabled={guardando}
                        >
                          <Shirt size={16} aria-hidden />
                          <span className="cotiz-prenda-picker__text">
                            <span className="cotiz-prenda-picker__title">
                              {prenda.titulo || "Sin título"}
                            </span>
                            <span className="cotiz-prenda-picker__tipo">
                              {tipo}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          <section className="cotiz-panel cotiz-panel--detail">
            <h2>Detalle de la prenda</h2>

            {!clienteId && (
              <p className="cotiz-hint">
                Selecciona un cliente y una prenda para ver el detalle.
              </p>
            )}

            {clienteId && !prendaId && (
              <p className="cotiz-hint">
                Elige una prenda asociada al cliente seleccionado.
              </p>
            )}

            {loadingDetalle && (
              <p className="cotiz-hint">Cargando detalle de la prenda...</p>
            )}

            {errorDetalle && (
              <p className="cotiz-error" role="alert">
                {errorDetalle}
              </p>
            )}

            {mensajeExito && (
              <p className="cotiz-success" role="status">
                {mensajeExito}
              </p>
            )}

            {detallePrenda && !loadingDetalle && (
              <div className="cotiz-detail-grid">
                <article className="cotiz-detail-card">
                  <div className="cotiz-detail-card__head">
                    <Shirt size={20} />
                    <h3>Tipo de prenda</h3>
                  </div>
                  <p className="cotiz-detail-card__value">{tipoPrendaNombre}</p>
                  {detallePrenda.titulo && (
                    <p className="cotiz-detail-card__meta">
                      Título: {detallePrenda.titulo}
                    </p>
                  )}
                </article>

                <article className="cotiz-detail-card cotiz-detail-card--wide">
                  <div className="cotiz-detail-card__head">
                    <Image size={20} />
                    <h3>Imágenes de referencia</h3>
                  </div>
                  {imagenesReferencia.length > 0 ? (
                    <div className="cotiz-images">
                      {imagenesReferencia.map((url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="cotiz-images__item"
                        >
                          <img src={url} alt={`Referencia ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="cotiz-hint">Sin imágenes de referencia.</p>
                  )}
                </article>

                <article className="cotiz-detail-card">
                  <div className="cotiz-detail-card__head">
                    <Ruler size={20} />
                    <h3>Medidas del cliente</h3>
                  </div>
                  {medidas.length > 0 ? (
                    <ul className="cotiz-list">
                      {medidas.map((m) => (
                        <li key={m.cliente_medida_id ?? `${m.tipo_medida_id}-${m.valor}`}>
                          <span>{m.nombre_tipo_medida || "Medida"}</span>
                          <strong>
                            {m.valor}
                            {m.simbolo_unidad
                              ? ` ${m.simbolo_unidad}`
                              : m.nombre_unidad
                                ? ` ${m.nombre_unidad}`
                                : ""}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="cotiz-hint">Sin medidas registradas en esta prenda.</p>
                  )}
                </article>

                <article className="cotiz-detail-card">
                  <div className="cotiz-detail-card__head">
                    <Package size={20} />
                    <h3>Materiales a utilizar</h3>
                  </div>
                  {materiales.length > 0 ? (
                    <ul className="cotiz-list cotiz-list--materials">
                      {materiales.map((mat) => (
                        <li
                          key={
                            mat.cliente_p_material_id ??
                            `${mat.material_id}-${mat.cantidad}`
                          }
                        >
                          <div>
                            <span>{mat.nombre_material || "Material"}</span>
                            {mat.observaciones && (
                              <small>{mat.observaciones}</small>
                            )}
                          </div>
                          <strong>{mat.cantidad ?? 1}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="cotiz-hint">Sin materiales asignados.</p>
                  )}
                </article>
              </div>
            )}
          </section>

          <section className="cotiz-panel cotiz-panel--valor">
            <div className="cotiz-detail-card__head">
              <IconoQuetzal size={20} />
              <h2>Valor de la cotización</h2>
            </div>

            {cotizacionActivaParaPrenda && (
              <div className="cotiz-existing-banner" role="status">
                <div>
                  <strong>{cotizacionActivaParaPrenda.codigo_cotizacion}</strong>
                  <span>
                    Cotización registrada para esta prenda
                    {cotizacionActivaParaPrenda.fecha_creado
                      ? ` · ${new Date(
                          cotizacionActivaParaPrenda.fecha_creado
                        ).toLocaleDateString("es-GT")}`
                      : ""}
                  </span>
                </div>
                <div className="cotiz-existing-banner__actions">
                  <SiPermiso codigo="generar_pdf_cotizacion">
                    <button
                      type="button"
                      className="cotiz-existing-banner__pdf"
                      onClick={() => handleImprimirPdf(cotizacionActivaParaPrenda)}
                    >
                      <Printer size={16} />
                      Ver PDF
                    </button>
                  </SiPermiso>
                  <SiPermiso codigo="enviar_whatsapp_cotizacion">
                    <button
                      type="button"
                      className="cotiz-existing-banner__whatsapp"
                      onClick={() =>
                        handleEnviarWhatsApp(cotizacionActivaParaPrenda, "crear")
                      }
                      disabled={
                        enviandoWhatsAppId ===
                          cotizacionActivaParaPrenda.cotizacion_id ||
                        !resolverTelefonoCotizacion(cotizacionActivaParaPrenda)
                      }
                      title={
                        resolverTelefonoCotizacion(cotizacionActivaParaPrenda)
                          ? "Enviar cotización por WhatsApp"
                          : "Sin teléfono registrado"
                      }
                    >
                      <MessageCircle size={16} />
                      {enviandoWhatsAppId === cotizacionActivaParaPrenda.cotizacion_id
                        ? "Enviando..."
                        : "WhatsApp"}
                    </button>
                  </SiPermiso>
                  {cargandoPlanPago ? (
                    <span className="cotiz-existing-banner__loading">
                      Consultando plan...
                    </span>
                  ) : planPagoActivo ? (
                    <button
                      type="button"
                      className="cotiz-existing-banner__pagos"
                      onClick={() => abrirHistorialPagos()}
                    >
                      <Wallet size={16} />
                      Ver pagos
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cotiz-existing-banner__plan"
                      onClick={() =>
                        irAGenerarPlanPago({
                          ...cotizacionActivaParaPrenda,
                          cliente_id: clienteId,
                        })
                      }
                    >
                      <CircleDollarSign size={16} />
                      Generar plan de pagos
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="cotiz-valor-row">
              <label htmlFor="valor-cotizacion">
                Monto (quetzales) <span className="tm-required">*</span>
              </label>
              <div className="cotiz-input-icon">
                <IconoQuetzal size={16} />
                <input
                  id="valor-cotizacion"
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorCotizacion}
                  onChange={(e) => setValorCotizacion(e.target.value)}
                  placeholder="0.00"
                  disabled={
                    !detallePrenda || guardando || Boolean(cotizacionActivaParaPrenda)
                  }
                  readOnly={Boolean(cotizacionActivaParaPrenda)}
                />
              </div>
              {valorCotizacion && !Number.isNaN(Number(valorCotizacion)) && (
                <p className="cotiz-valor-preview">
                  Total: {formatearMoneda(valorCotizacion)}
                </p>
              )}
            </div>

            <div className="cotiz-valor-row">
              <label htmlFor="notas-cotizacion">Notas (opcional)</label>
              <textarea
                id="notas-cotizacion"
                className="cotiz-textarea"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Detalles adicionales de la cotización..."
                rows={3}
                disabled={
                  !detallePrenda || guardando || Boolean(cotizacionActivaParaPrenda)
                }
                readOnly={Boolean(cotizacionActivaParaPrenda)}
              />
            </div>

            {!cotizacionActivaParaPrenda && (
              <>
                <p className="tm-required-note">
                  <span className="tm-required">*</span> Campos obligatorios
                </p>
                <button
                  type="submit"
                  className="cotiz-save"
                  disabled={!detallePrenda || guardando}
                >
                  <Save size={18} />
                  {guardando ? "Guardando..." : "Guardar cotización"}
                </button>
              </>
            )}
          </section>
        </form>
      )}
      <HistorialPagosModal
        open={historialPagosAbierto}
        loading={cargandoHistorialPagos}
        plan={planHistorialPagos}
        mensajeError={errorHistorialPagos}
        onClose={cerrarHistorialPagos}
      />

      <EditarCotizacionModal
        open={Boolean(cotizacionAEditar)}
        cotizacion={cotizacionAEditar}
        onClose={() => setCotizacionAEditar(null)}
        onGuardado={() => cargarListado()}
      />

      <AnularCotizacionModal
        open={Boolean(cotizacionAAnular)}
        cotizacion={cotizacionAAnular}
        onClose={() => setCotizacionAAnular(null)}
        onAnulada={() => cargarListado()}
      />
    </div>
  );
}

export default Cotizaciones;
