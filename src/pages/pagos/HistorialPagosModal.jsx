import { useMemo } from "react";
import { X, FileText } from "lucide-react";
import "./Pagos.css";
import { abrirPdfRecibo } from "../../services/pagosService";
import {
  formatearCuotasPlan,
  textoCuotaPago,
  etiquetaTipoPago,
} from "../../utils/pagosCalc";
import { formatearFechaPago } from "../../utils/pagosFecha";

const formatearMoneda = (valor) => {
  const n = Number(valor);
  if (Number.isNaN(n)) return "Q 0.00";
  return `Q ${n.toLocaleString("es-GT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

function HistorialPagosModal({ open, loading, plan, mensajeError, onClose }) {
  const pagosDelHistorial = useMemo(() => {
    if (!plan?.pagos) return [];
    return [...plan.pagos].sort((a, b) => {
      const fa = new Date(a.fecha_pago || a.fecha_registro).getTime();
      const fb = new Date(b.fecha_pago || b.fecha_registro).getTime();
      return fa - fb;
    });
  }, [plan]);

  if (!open) return null;

  return (
    <div className="pagos-modal-overlay" onClick={onClose}>
      <div
        className="pagos-modal pagos-modal--historial"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pagos-modal__header">
          <h3>Abonos registrados</h3>
          <button
            type="button"
            className="pagos-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {loading && (
          <p className="pagos-hint">Cargando historial de pagos...</p>
        )}

        {!loading && mensajeError && (
          <p className="pagos-hint pagos-hint--error">{mensajeError}</p>
        )}

        {!loading && !mensajeError && plan && (
          <>
            <p className="pagos-modal__sub">
              Plan <strong>{plan.codigo_plan}</strong> · {plan.cliente_nombre} ·
              Cuotas {formatearCuotasPlan(plan)}
            </p>

            {pagosDelHistorial.length === 0 ? (
              <p className="pagos-hint">
                Este plan aún no tiene pagos registrados.
              </p>
            ) : (
              <div className="pagos-historial-table-wrap">
                <table className="pagos-historial-table">
                  <thead>
                    <tr>
                      <th>Cuota</th>
                      <th>Recibo</th>
                      <th>Fecha del pago</th>
                      <th>Monto</th>
                      <th>Tipo</th>
                      <th>Transferencia</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagosDelHistorial.map((pago, idx) => (
                      <tr key={pago.pago_cliente_id}>
                        <td>{textoCuotaPago(plan, idx)}</td>
                        <td>
                          <strong>{pago.codigo_recibo}</strong>
                        </td>
                        <td className="pagos-table-fecha">
                          {formatearFechaPago(pago.fecha_pago || pago.fecha_registro)}
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
              <button type="button" className="pagos-btn-cancel" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </>
        )}

        {!loading && (mensajeError || !plan) && (
          <div className="pagos-modal__actions">
            <button type="button" className="pagos-btn-cancel" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistorialPagosModal;
