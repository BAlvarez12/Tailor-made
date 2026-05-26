import { createPortal } from "react-dom";
import { AlertTriangle, HelpCircle, ShieldAlert, XCircle } from "lucide-react";
import "../styles/tmModalShared.css";
import "./ConfirmacionModal.css";

const ICONOS = {
  peligro: ShieldAlert,
  advertencia: AlertTriangle,
  normal: HelpCircle,
};

/**
 * Modal de confirmación reutilizable.  Reemplaza window.confirm() con un
 * diálogo accesible que comparte el diseño del resto de modales.
 *
 * Props:
 *   open           bool   — controla la visibilidad
 *   titulo         string — título del diálogo
 *   mensaje        string — texto principal (qué se está confirmando)
 *   detalle        string — texto auxiliar opcional (ej. "Esta acción no se puede deshacer.")
 *   tono           "peligro" | "advertencia" | "normal" — color del icono y botón confirmar
 *   textoConfirmar string — texto del botón principal (default "Confirmar")
 *   textoCancelar  string — texto del botón secundario (default "Cancelar")
 *   onConfirmar    func   — callback al confirmar
 *   onCancelar     func   — callback al cancelar (también dispara con overlay / Esc)
 *   procesando     bool   — deshabilita botones mientras se ejecuta la acción
 */
function ConfirmacionModal({
  open,
  titulo = "¿Confirmar acción?",
  mensaje,
  detalle,
  tono = "normal",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
  procesando = false,
}) {
  if (!open) return null;

  const Icono = ICONOS[tono] || ICONOS.normal;

  const cerrar = () => {
    if (procesando) return;
    onCancelar?.();
  };

  return createPortal(
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={cerrar}>
        <div
          className={`tm-modal tm-modal--sm confirm-modal confirm-modal--${tono}`}
          onClick={(e) => e.stopPropagation()}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-titulo"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className={`tm-modal__title-icon confirm-modal__icon confirm-modal__icon--${tono}`} aria-hidden>
                <Icono size={22} />
              </div>
              <div>
                <h2 id="confirm-modal-titulo">{titulo}</h2>
                {mensaje && <p className="tm-modal__subtitle">{mensaje}</p>}
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={cerrar}
              disabled={procesando}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {detalle && (
            <div className="confirm-modal__body">
              <p>{detalle}</p>
            </div>
          )}

          <div className="tm-modal__actions confirm-modal__actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={cerrar}
              disabled={procesando}
            >
              <XCircle size={16} />
              {textoCancelar}
            </button>
            <button
              type="button"
              className={`btn-guardar ${tono === "peligro" ? "btn-guardar--peligro" : ""}`}
              onClick={onConfirmar}
              disabled={procesando}
            >
              {procesando ? "Procesando..." : textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmacionModal;
