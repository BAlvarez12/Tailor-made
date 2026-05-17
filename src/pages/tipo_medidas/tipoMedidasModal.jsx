import {
  Plus,
  Settings,
  Tag,
  AlignLeft,
  FileText,
  Save,
  XCircle,
} from "lucide-react";
import "../../styles/tmModalShared.css";

export default function TipoMedidasModal({
  modoCrear,
  tipoSeleccionado,
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
                <h2>
                  {modoCrear ? "Crear tipo de medida" : "Editar tipo de medida"}
                </h2>
                <p className="tm-modal__subtitle">
                  {modoCrear
                    ? "Registra un nuevo tipo de medida para las prendas"
                    : "Actualiza el nombre y la descripción del tipo"}
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
                Datos del tipo de medida
              </p>

              <div className="tm-modal__grid">
                <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                  <label htmlFor="nombre_tipo_medida">Nombre</label>
                  <div className="tm-input-wrap">
                    <Tag size={16} className="tm-input-icon" />
                    <input
                      id="nombre_tipo_medida"
                      type="text"
                      value={formData.nombre_tipo_medida}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_tipo_medida: e.target.value,
                        })
                      }
                      placeholder="Ej. Busto"
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                  <label htmlFor="descripcion_tipo_medida">Descripción</label>
                  <div className="tm-input-wrap tm-input-wrap--textarea">
                    <AlignLeft size={16} className="tm-input-icon" />
                    <textarea
                      id="descripcion_tipo_medida"
                      value={formData.descripcion_tipo_medida}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion_tipo_medida: e.target.value,
                        })
                      }
                      placeholder="Descripción opcional del tipo de medida"
                      rows={3}
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

              {!modoCrear && tipoSeleccionado?.estado === 1 && (
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

              {!modoCrear && tipoSeleccionado?.estado === 0 && (
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

