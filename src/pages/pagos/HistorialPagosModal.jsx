import { useMemo, useState } from "react";
import { X, FileText, MessageCircle } from "lucide-react";
import "./Pagos.css";
import { abrirPdfRecibo, enviarPagoPorWhatsApp } from "../../services/pagosService";
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
  const [errorWhatsApp, setErrorWhatsApp] = useState("");

  const pagosDelHistorial = useMemo(() => {
    if (!plan?.pagos) return [];
    return [...plan.pagos].sort((a, b) => {
      const fa = new Date(a.fecha_pago || a.fecha_registro).getTime();
      const fb = new Date(b.fecha_pago || b.fecha_registro).getTime();
      return fa - fb;
    });
  }, [plan]);

  const telefonoCliente = String(plan?.cliente_telefono || "").trim();

  const handleEnviarWhatsApp = (pago, idx) => {
    setErrorWhatsApp("");
    try {
      const totalPagos = Number(plan?.cantidad_pagos) || pagosDelHistorial.length;
      enviarPagoPorWhatsApp({
        pago,
        plan,
        contexto: {
          numeroPago: idx + 1,
          totalPagos,
        },
      });
    } catch (err) {
      console.error(err);
      setErrorWhatsApp(err?.message || "No se pudo abrir WhatsApp.");
    }
  };

  if (!open) return null;

  return (
    <div className="pagos-modal-overlay pagos-modal-overlay--historial" onClick={onClose}>
      <div
        className="pagos-modal pagos-modal--historial"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="historial-pagos-title"
      >
        <div className="pagos-modal__header">
          <h3 id="historial-pagos-title">Abonos registrados</h3>
          <button
            type="button"
            className="pagos-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="pagos-modal__body pagos-modal__body--historial">
          {loading && (
            <p className="pagos-hint">Cargando historial de pagos...</p>
          )}

          {!loading && mensajeError && (
            <p className="pagos-hint pagos-hint--error">{mensajeError}</p>
          )}

          {!loading && errorWhatsApp && (
            <p className="pagos-hint pagos-hint--error">{errorWhatsApp}</p>
          )}

          {!loading && !mensajeError && plan && (
            <>
              <p className="pagos-modal__sub pagos-modal__sub--historial">
                <span>
                  Plan <strong>{plan.codigo_plan}</strong>
                </span>
                <span>{plan.cliente_nombre}</span>
                <span>Cuotas {formatearCuotasPlan(plan)}</span>
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
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagosDelHistorial.map((pago, idx) => (
                        <tr key={pago.pago_cliente_id}>
                          <td data-label="Cuota">{textoCuotaPago(plan, idx)}</td>
                          <td data-label="Recibo">
                            <strong>{pago.codigo_recibo}</strong>
                          </td>
                          <td
                            className="pagos-table-fecha"
                            data-label="Fecha del pago"
                          >
                            {formatearFechaPago(
                              pago.fecha_pago || pago.fecha_registro
                            )}
                          </td>
                          <td data-label="Monto">{formatearMoneda(pago.monto)}</td>
                          <td data-label="Tipo">
                            {etiquetaTipoPago(pago.tipo_pago)}
                          </td>
                          <td data-label="Transferencia">
                            {pago.numero_transferencia || "—"}
                          </td>
                          <td
                            data-label="Acciones"
                            className="pagos-historial-table__acciones"
                          >
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
                              <span>PDF</span>
                            </button>
                            <button
                              type="button"
                              className="pagos-btn-wa-mini"
                              onClick={() => handleEnviarWhatsApp(pago, idx)}
                              disabled={!telefonoCliente}
                              title={
                                telefonoCliente
                                  ? "Enviar recibo por WhatsApp"
                                  : "Sin teléfono registrado"
                              }
                            >
                              <MessageCircle size={14} />
                              <span>WhatsApp</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        <div className="pagos-modal__actions pagos-modal__actions--historial">
          <button type="button" className="pagos-btn-cancel" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistorialPagosModal;
