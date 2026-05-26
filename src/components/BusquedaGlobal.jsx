import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, X, User, FileText, CreditCard, Shirt } from "lucide-react";
import { busquedaGlobalService } from "../services/busquedaService";
import "./BusquedaGlobal.css";

const DEBOUNCE_MS = 250;

const RESULTADO_VACIO = {
  clientes: [],
  cotizaciones: [],
  planes_pago: [],
  prendas: [],
};

function BusquedaGlobal() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState(RESULTADO_VACIO);
  const [buscando, setBuscando] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const abrir = useCallback(() => {
    setAbierto(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    setQuery("");
    setResultados(RESULTADO_VACIO);
  }, []);

  // Atajo de teclado: Ctrl+K / Cmd+K + Escape para cerrar
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        abierto ? cerrar() : abrir();
      }
      if (e.key === "Escape" && abierto) {
        cerrar();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, abrir, cerrar]);

  // Trigger desde el sidebar
  useEffect(() => {
    const handler = () => abrir();
    window.addEventListener("abrir-busqueda", handler);
    return () => window.removeEventListener("abrir-busqueda", handler);
  }, [abrir]);

  // Búsqueda con debounce
  useEffect(() => {
    if (!abierto) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const q = query.trim();
    if (q.length < 2) {
      setResultados(RESULTADO_VACIO);
      setBuscando(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        setBuscando(true);
        const data = await busquedaGlobalService(q);
        setResultados(data || RESULTADO_VACIO);
      } catch (err) {
        console.error(err);
        setResultados(RESULTADO_VACIO);
      } finally {
        setBuscando(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, abierto]);

  if (!abierto) return null;

  const irA = (path) => {
    cerrar();
    navigate(path);
  };

  const totalResultados =
    resultados.clientes.length +
    resultados.cotizaciones.length +
    resultados.planes_pago.length +
    resultados.prendas.length;

  return createPortal(
    <div className="busq-overlay" onClick={cerrar} role="dialog" aria-modal="true">
      <div className="busq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="busq-input-wrap">
          <Search size={18} className="busq-icon" />
          <input
            ref={inputRef}
            type="text"
            className="busq-input"
            placeholder="Buscar cliente, DPI, cotización, plan de pago, prenda..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="busq-close"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="busq-resultados">
          {query.trim().length < 2 && (
            <p className="busq-hint">
              Escribe al menos 2 caracteres para buscar.{" "}
              <kbd>Esc</kbd> para cerrar.
            </p>
          )}

          {query.trim().length >= 2 && buscando && (
            <p className="busq-hint">Buscando...</p>
          )}

          {query.trim().length >= 2 && !buscando && totalResultados === 0 && (
            <p className="busq-hint">No se encontraron resultados para "{query}".</p>
          )}

          {resultados.clientes.length > 0 && (
            <section className="busq-group">
              <h3 className="busq-group-title">
                <User size={14} /> Clientes
              </h3>
              {resultados.clientes.map((c) => (
                <button
                  key={`cli-${c.cliente_id}`}
                  type="button"
                  className="busq-item"
                  onClick={() => irA(`/home/clientes/${c.cliente_id}`)}
                >
                  <strong>
                    {c.nombre_cliente} {c.apellido_cliente}
                  </strong>
                  <span className="busq-item-meta">
                    DPI: {c.dpi || "—"} · Tel: {c.telefono || "—"}
                  </span>
                </button>
              ))}
            </section>
          )}

          {resultados.cotizaciones.length > 0 && (
            <section className="busq-group">
              <h3 className="busq-group-title">
                <FileText size={14} /> Cotizaciones
              </h3>
              {resultados.cotizaciones.map((c) => (
                <button
                  key={`cot-${c.cotizacion_id}`}
                  type="button"
                  className="busq-item"
                  onClick={() => irA(`/home/cotizaciones`)}
                >
                  <strong>{c.codigo_cotizacion}</strong>
                  <span className="busq-item-meta">
                    {c.cliente_nombre} · Q{" "}
                    {Number(c.valor_total || 0).toFixed(2)}
                  </span>
                </button>
              ))}
            </section>
          )}

          {resultados.planes_pago.length > 0 && (
            <section className="busq-group">
              <h3 className="busq-group-title">
                <CreditCard size={14} /> Planes de pago
              </h3>
              {resultados.planes_pago.map((p) => (
                <button
                  key={`pp-${p.plan_pago_id}`}
                  type="button"
                  className="busq-item"
                  onClick={() => irA(`/home/pagos`)}
                >
                  <strong>{p.codigo_plan}</strong>
                  <span className="busq-item-meta">
                    {p.cliente_nombre || "—"} · Saldo: Q{" "}
                    {Number(p.saldo_pendiente || 0).toFixed(2)}
                  </span>
                </button>
              ))}
            </section>
          )}

          {resultados.prendas.length > 0 && (
            <section className="busq-group">
              <h3 className="busq-group-title">
                <Shirt size={14} /> Prendas
              </h3>
              {resultados.prendas.map((p) => (
                <button
                  key={`pr-${p.cliente_prenda_id}`}
                  type="button"
                  className="busq-item"
                  onClick={() => irA(`/home/prendas`)}
                >
                  <strong>{p.titulo || `Prenda #${p.cliente_prenda_id}`}</strong>
                  <span className="busq-item-meta">
                    {p.cliente_nombre || "—"}
                  </span>
                </button>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default BusquedaGlobal;
