import { FileText, Pencil, Ruler, Save, Tag, ToggleLeft, XCircle } from "lucide-react";
import "./tipo_medidas.css";

export default function tipoMedidasModal({
  modoCrear,
  tipoSeleccionado,
  formData,
  setFormData,
  onClose,
  onGuardar,
  onArchivar,
  onRestaurar
}) {
  return (
    <div className="clientes-modal-overlay">
      <div className="clientes-modal">
        <div className="clientes-modal-header">
          <div className="clientes-modal-title-wrap">
            <div className="clientes-modal-title-icon">
              {modoCrear ? <Ruler size={18} /> : <Pencil size={18} />}
            </div>
            <h3>{modoCrear ? "Crear tipo" : "Editar tipo"}</h3>
          </div>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="clientes-modal-body">
          <div className="form-group form-group--icon">
            <label>Nombre</label>
            <div className="input-wrap">
              <Tag size={16} className="input-icon" />
              <input
                value={formData.nombre_tipo_medida}
                placeholder="Introduce el nombre del tipo de medida"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre_tipo_medida: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="form-group form-group--icon">
            <label>Descripción</label>
            <div className="input-wrap">
              <FileText size={16} className="input-icon" />
              <input
                value={formData.descripcion_tipo_medida}
                placeholder="Agrega una descripción para el tipo de medida"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descripcion_tipo_medida: e.target.value
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="clientes-modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            <XCircle size={15} />
            Cancelar
          </button>
          {modoCrear && (
            <button className="btn-guardar" onClick={onGuardar}>
              <Save size={15} />
              Crear
            </button>
          )}
          {!modoCrear && tipoSeleccionado?.estado === 1 && (
            <>
              <button className="btn-guardar" onClick={onGuardar}>
                <Save size={15} />
                Guardar
              </button>
              <button className="btn-desactivar" onClick={onArchivar}>
                Innactivar
              </button>
            </>
          )}
          {!modoCrear && tipoSeleccionado?.estado === 0 && (
            <button className="btn-activar" onClick={onRestaurar}>
              <ToggleLeft size={15} />
              Activar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}