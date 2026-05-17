import {
  Ruler,
  Plus,
  Settings,
  Hash,
  FileText,
  Save,
  XCircle,
} from "lucide-react";
import "../../styles/tmModalShared.css";

export default function UnidadesModal({
  modoCrear,
  unidadSeleccionada,
  formData,
  setFormData,
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
      <div
        className="tm-modal-overlay"
        onClick={onClose}
      >
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
                <h2>{modoCrear ? "Crear unidad" : "Editar unidad"}</h2>
                <p className="tm-modal__subtitle">
                  {modoCrear
                    ? "Registra una nueva unidad de medida"
                    : "Actualiza el nombre y el símbolo de la unidad"}
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
                Datos de la unidad
              </p>

              <div className="tm-modal__grid">
                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="nombre_unidad">Nombre</label>
                  <div className="tm-input-wrap">
                    <Ruler size={16} className="tm-input-icon" />
                    <input
                      id="nombre_unidad"
                      type="text"
                      value={formData.nombre_unidad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_unidad: e.target.value,
                        })
                      }
                      placeholder="Ej. Centímetro"
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="simbolo_unidad">Símbolo</label>
                  <div className="tm-input-wrap">
                    <Hash size={16} className="tm-input-icon" />
                    <input
                      id="simbolo_unidad"
                      type="text"
                      value={formData.simbolo_unidad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          simbolo_unidad: e.target.value,
                        })
                      }
                      placeholder="Ej. cm"
                    />
                  </div>
                </div>
              </div>
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

              {!modoCrear && unidadSeleccionada?.estado === 1 && (
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

              {!modoCrear && unidadSeleccionada?.estado === 0 && (
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
