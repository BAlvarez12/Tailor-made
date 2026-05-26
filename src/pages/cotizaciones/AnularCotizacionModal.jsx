import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { ShieldAlert, XCircle } from "lucide-react";
import { anularCotizacionService } from "../../services/cotizacionesService";
import "../../styles/tmModalShared.css";

/**
 * Modal de confirmación para anular una cotización.  Incluye un campo
 * opcional de motivo que se guarda en el log de operaciones.
 */
function AnularCotizacionModal({ open, cotizacion, onClose, onAnulada }) {
  const [motivo, setMotivo] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setMotivo("");
    setError("");
  }, [open]);

  if (!open || !cotizacion) return null;

  const cerrar = () => {
    if (procesando) return;
    onClose?.();
  };

  const confirmar = async () => {
    setError("");
    try {
      setProcesando(true);
      await anularCotizacionService(cotizacion.cotizacion_id, motivo);
      toast.success("Cotización anulada.");
      onAnulada?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "No se pudo anular la cotización."
      );
    } finally {
      setProcesando(false);
    }
  };

  return createPortal(
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={cerrar}>
        <div
          className="tm-modal tm-modal--sm confirm-modal confirm-modal--peligro"
          onClick={(e) => e.stopPropagation()}
          role="alertdialog"
          aria-modal="true"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon confirm-modal__icon confirm-modal__icon--peligro" aria-hidden>
                <ShieldAlert size={22} />
              </div>
              <div>
                <h2>Anular cotización</h2>
                <p className="tm-modal__subtitle">
                  ¿Seguro que deseas anular {cotizacion.codigo_cotizacion}?
                </p>
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={cerrar}
              aria-label="Cerrar"
              disabled={procesando}
            >
              ×
            </button>
          </div>

          <div className="confirm-modal__body">
            <p>
              Esta acción marcará la cotización como anulada y dejará de
              aparecer en el listado. Quedará registrada en el log para
              auditoría.
            </p>
          </div>

          <div style={{ padding: "0 28px 0" }}>
            {error && (
              <p className="cotiz-modal-error" style={{ marginTop: 14 }}>
                {error}
              </p>
            )}

            <div className="tm-modal__field tm-modal__field--full" style={{ marginTop: 14 }}>
              <label htmlFor="cot-anular-motivo">Motivo (opcional)</label>
              <textarea
                id="cot-anular-motivo"
                rows={3}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                maxLength={200}
                placeholder="Ej. El cliente decidió no continuar"
                disabled={procesando}
              />
            </div>
          </div>

          <div className="tm-modal__actions confirm-modal__actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={cerrar}
              disabled={procesando}
            >
              <XCircle size={16} /> Cancelar
            </button>
            <button
              type="button"
              className="btn-guardar btn-guardar--peligro"
              onClick={confirmar}
              disabled={procesando}
            >
              {procesando ? "Anulando..." : "Sí, anular"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AnularCotizacionModal;
