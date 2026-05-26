import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { Edit3, Save, XCircle, User, Shirt, FileText } from "lucide-react";
import { editarCotizacionService } from "../../services/cotizacionesService";
import "../../styles/tmModalShared.css";

const IconoQuetzal = ({ size = 16 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      fontWeight: 800,
      color: "#9ca3af",
    }}
  >
    Q
  </span>
);

/**
 * Modal para editar una cotización. Solo permite cambiar valor_total y notas.
 * Cliente y prenda se muestran como info readonly.
 */
function EditarCotizacionModal({ open, cotizacion, onClose, onGuardado }) {
  const [valor, setValor] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !cotizacion) return;
    setValor(String(cotizacion.valor_total ?? ""));
    setNotas(cotizacion.notas || "");
    setError("");
  }, [open, cotizacion]);

  if (!open || !cotizacion) return null;

  const cerrar = () => {
    if (guardando) return;
    onClose?.();
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const valorNum = Number(valor);
    if (!valor.trim() || Number.isNaN(valorNum) || valorNum <= 0) {
      setError("Ingresa un monto válido mayor a 0.");
      return;
    }

    try {
      setGuardando(true);
      await editarCotizacionService(cotizacion.cotizacion_id, {
        valor_total: valorNum,
        notas: notas.trim(),
      });
      toast.success("Cotización actualizada.");
      onGuardado?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "No se pudo actualizar la cotización."
      );
    } finally {
      setGuardando(false);
    }
  };

  return createPortal(
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={cerrar}>
        <div
          className="tm-modal tm-modal--sm"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon" aria-hidden>
                <Edit3 size={22} />
              </div>
              <div>
                <h2>Editar cotización</h2>
                <p className="tm-modal__subtitle">
                  {cotizacion.codigo_cotizacion}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={cerrar}
              aria-label="Cerrar"
              disabled={guardando}
            >
              ×
            </button>
          </div>

          <form className="tm-modal__form" onSubmit={submit}>
            {error && <p className="cotiz-modal-error">{error}</p>}

            <div className="tm-modal__section">
              <p className="tm-modal__section-title">
                <User size={16} /> Información de la cotización
              </p>

              <div className="cotiz-edit-info">
                <div>
                  <span className="cotiz-edit-info__label">Cliente</span>
                  <span className="cotiz-edit-info__value">
                    {cotizacion.cliente_nombre || "—"}
                  </span>
                </div>
                <div>
                  <span className="cotiz-edit-info__label">
                    <Shirt size={12} /> Prenda
                  </span>
                  <span className="cotiz-edit-info__value">
                    {cotizacion.titulo_prenda || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="tm-modal__section">
              <div className="tm-modal__grid tm-modal__grid--single">
                <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                  <label htmlFor="cot-edit-valor">
                    Monto (quetzales){" "}
                    <span className="tm-required">*</span>
                  </label>
                  <div className="tm-input-wrap">
                    <IconoQuetzal size={16} />
                    <input
                      id="cot-edit-valor"
                      type="number"
                      min="0"
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      required
                      style={{ paddingLeft: 42 }}
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                  <label htmlFor="cot-edit-notas">Notas (opcional)</label>
                  <div className="tm-input-wrap tm-input-wrap--textarea">
                    <FileText size={16} className="tm-input-icon" />
                    <textarea
                      id="cot-edit-notas"
                      rows={3}
                      value={notas}
                      onChange={(e) => setNotas(e.target.value)}
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>

              <p className="tm-required-note">
                <span className="tm-required">*</span> Campos obligatorios
              </p>
            </div>

            <div className="tm-modal__actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={cerrar}
                disabled={guardando}
              >
                <XCircle size={16} /> Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={guardando}>
                <Save size={16} />
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EditarCotizacionModal;
