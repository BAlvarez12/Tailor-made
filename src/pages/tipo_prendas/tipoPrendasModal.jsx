import {
  Shirt,
  Plus,
  Settings,
  FileText,
  Save,
  XCircle,
} from "lucide-react";
import "../../styles/tmModalShared.css";

export default function TipoPrendasModal({
  modoCrear,
  seleccionado,
  formData,
  setFormData,
  errorModal,
  onClose,
  onGuardar,
  onArchivar,
  onRestaurar,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar();
  };

  return (
    <div className="tm-modal-form">
      <div className="tm-modal-overlay" onClick={onClose}>
        <div
          className="tm-modal tm-modal--sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon" aria-hidden>
                {modoCrear ? <Plus size={22} /> : <Settings size={22} />}
              </div>
              <div>
                <h2>{modoCrear ? "Crear tipo de prenda" : "Editar tipo de prenda"}</h2>
                <p className="tm-modal__subtitle">
                  {modoCrear
                    ? "Registra un nuevo tipo de prenda"
                    : "Actualiza el nombre del tipo de prenda"}
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

          <form className="tm-modal__form" onSubmit={handleSubmit}>
            <div className="tm-modal__section">
              <p className="tm-modal__section-title">
                <FileText size={16} />
                Datos del tipo de prenda
              </p>

              <div className="tm-modal__grid">
                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="nombre_tipo_prenda">
                    Nombre <span className="tm-required">*</span>
                  </label>
                  <div className="tm-input-wrap">
                    <Shirt size={16} className="tm-input-icon" />
                    <input
                      id="nombre_tipo_prenda"
                      type="text"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Ej. Pantalón"
                      required
                      maxLength={50}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              <p className="tm-required-note">
                <span className="tm-required">*</span> Campos obligatorios
              </p>

              {errorModal && (
                <p className="tm-modal__error" role="alert">
                  {errorModal}
                </p>
              )}
            </div>

            <div className="tm-modal-form__footer tm-modal__actions">
              <button type="button" className="btn-cancelar" onClick={onClose}>
                <XCircle size={16} />
                Cancelar
              </button>

              {modoCrear && (
                <button type="submit" className="btn-guardar">
                  <Save size={16} />
                  Crear
                </button>
              )}

              {!modoCrear && seleccionado?.estado === 1 && (
                <>
                  <button type="submit" className="btn-guardar">
                    <Save size={16} />
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="btn-desactivar"
                    onClick={onArchivar}
                  >
                    Desactivar
                  </button>
                </>
              )}

              {!modoCrear && seleccionado?.estado === 0 && (
                <button type="button" className="btn-activar" onClick={onRestaurar}>
                  Activar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
