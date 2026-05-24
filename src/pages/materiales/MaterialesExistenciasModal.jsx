import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../utils/api";
import "../../styles/tmModalShared.css";
import "./MaterialesModales.css";
import { Layers, Search, Save, XCircle } from "lucide-react";

function MaterialesExistenciasModal({ open, onClose }) {
  const [materiales, setMateriales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState("");

  const fetchMateriales = async () => {
    try {
      setCargando(true);
      setError("");
      const res = await api.get("/materiales");
      const data = (Array.isArray(res.data) ? res.data : []).map((m) => ({
        ...m,
        nuevoStock: 0,
      }));
      setMateriales(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los materiales.");
      setMateriales([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (open) {
      setBusqueda("");
      setGuardado(false);
      setError("");
      fetchMateriales();
    }
  }, [open]);

  const materialesFiltrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return materiales;
    return materiales.filter((m) => {
      const nombre = (m.nombre_material || "").toLowerCase();
      const cat = (m.nombre_categoria || "").toLowerCase();
      return nombre.includes(t) || cat.includes(t);
    });
  }, [materiales, busqueda]);

      const cambios = useMemo(
      () =>
        materiales.filter((m) => {
          const cantidad = Number(m.nuevoStock);
          return Number.isFinite(cantidad) && cantidad !== 0;
        }),
      [materiales]
    );

          const ajustarCantidad = (materialId, delta) => {
      setMateriales((prev) =>
        prev.map((m) => {
          if (m.material_id !== materialId) return m;

          const actual = Number(m.stock) || 0;
          const cantidadActual = Number(m.nuevoStock);
          const base = Number.isFinite(cantidadActual) ? cantidadActual : 0;

          const nuevaCantidad = base + delta;

          // No permite que el total después quede menor a 0
          const cantidadAjustada = Math.max(nuevaCantidad, -actual);

          return {
            ...m,
            nuevoStock: cantidadAjustada,
          };
        })
      );
    };

            const setCantidadEntrada = (materialId, valor) => {
        setMateriales((prev) =>
          prev.map((m) => {
            if (m.material_id !== materialId) return m;

            // Permite borrar el 0 y dejar el input vacío mientras escribes
            if (valor === "") {
              return {
                ...m,
                nuevoStock: "",
              };
            }

            // Permite escribir primero el signo negativo
            if (valor === "-") {
              return {
                ...m,
                nuevoStock: "-",
              };
            }

            const cantidad = Number(valor);

            if (!Number.isFinite(cantidad)) {
              return m;
            }

            const actual = Number(m.stock) || 0;

            // Evita que el total después quede negativo
            const cantidadAjustada = Math.max(cantidad, -actual);

            return {
              ...m,
              nuevoStock: cantidadAjustada,
            };
          })
        );
      };

  const guardarCambios = async () => {
    if (cambios.length === 0) return;

    try {
      setGuardando(true);
      setError("");

      await Promise.all(
        cambios.map((mat) =>
          api.post("/materiales/movimientos-existencias", {
            material_id: mat.material_id,
            cantidad: Number(mat.nuevoStock),
          })
        )
      );

      setGuardado(true);
      await fetchMateriales();

      setTimeout(() => {
        setGuardado(false);
        onClose?.();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Error al guardar los movimientos."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={onClose}>
        <div
          className="tm-modal tm-modal--lg"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon" aria-hidden>
                <Layers size={22} />
              </div>
              <div>
                <h2>Movimiento de existencia</h2>
                <p className="tm-modal__subtitle">
                  Registra entradas o salidas de stock por material. Usa valores positivos para sumar y negativos para restar.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <div className="mat-exist-search">
            <div className="tm-input-wrap">
              <Search size={16} className="tm-input-icon" />
              <input
                type="search"
                placeholder="Buscar material o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="mat-modal__error" style={{ margin: "0 28px 12px" }}>{error}</p>}
          {guardado && (
            <p className="mat-exist-success">Cambios guardados correctamente.</p>
          )}

          <div className="mat-exist-body">
            {cargando && (
              <p className="mat-modal__loading">Cargando materiales...</p>
            )}

            {!cargando && materialesFiltrados.length === 0 && (
              <p className="mat-modal__loading">No hay materiales para mostrar.</p>
            )}

            {!cargando && materialesFiltrados.length > 0 && (
              <table className="mat-exist-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Actual</th>
                    <th>Movimiento</th>
                    <th>Total después</th>
                  </tr>
                </thead>
                <tbody>
                  {materialesFiltrados.map((mat) => {
                    const actual = Number(mat.stock) || 0;
                    const entrada =
                      mat.nuevoStock === "" || mat.nuevoStock === "-"
                        ? 0
                        : Number(mat.nuevoStock) || 0;
                    const total = actual + entrada;

                    return (
                      <tr key={mat.material_id}>
                        <td>
                          <div className="mat-exist-material">
                            <strong>{mat.nombre_material}</strong>
                            <span>{mat.nombre_categoria || "Sin categoría"}</span>
                          </div>
                        </td>
                        <td className="mat-exist-stock-actual">{actual}</td>
                        <td>
                          <div className="mat-exist-controls">
                            <button
                              type="button"
                              onClick={() =>
                                ajustarCantidad(mat.material_id, -1)
                              }
                              aria-label="Menos"
                            >
                              −
                            </button>
                            <input
                            type="number"
                            step="1"
                            value={mat.nuevoStock}
                            onChange={(e) =>
                              setCantidadEntrada(
                                mat.material_id,
                                e.target.value
                              )
                            }
                          />
                            <button
                              type="button"
                              onClick={() =>
                                ajustarCantidad(mat.material_id, 1)
                              }
                              aria-label="Más"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="mat-exist-stock-final">{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="mat-exist-footer">
            <p className="mat-exist-footer__hint">
              {cambios.length === 0
                ? "Indica la cantidad a mover: positivo suma y negativo resta."
                : `${cambios.length} material(es) con cambios pendientes`}
            </p>
            <div className="tm-modal__actions" style={{ margin: 0, padding: 0, border: "none" }}>
              <button type="button" className="btn-cancelar" onClick={onClose}>
                <XCircle size={16} />
                Cancelar
              </button>
              <button
                type="button"
                className="btn-guardar"
                onClick={guardarCambios}
                disabled={guardando || cambios.length === 0}
              >
                <Save size={16} />
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default MaterialesExistenciasModal;
