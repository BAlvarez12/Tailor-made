import { Hash, Pencil, Ruler, Save, Tag, ToggleLeft, XCircle } from "lucide-react";
import "./unidades.css";

export default function unidadesModal({
  modoCrear,
  unidadSeleccionada,
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
            <h3>
              {modoCrear ? "Crear unidad" : <span className="modal-title-bold">Editar unidad</span>}
            </h3>
          </div>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="clientes-modal-body">
          <div className="form-group form-group--icon">
            <label>Nombre</label>
            <div className="input-wrap">
              <Tag size={16} className="input-icon" />
              <input
                value={formData.nombre_unidad}
                placeholder="Introduce el nombre de la unidad de medida"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre_unidad: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="form-group form-group--icon">
            <label>Símbolo</label>
            <div className="input-wrap">
              <Hash size={16} className="input-icon" />
              <input
                value={formData.simbolo_unidad}
                placeholder="Agrega el símbolo de la unidad de medida"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    simbolo_unidad: e.target.value
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

          {!modoCrear && unidadSeleccionada?.estado === 1 && (
            <button className="btn-guardar" onClick={onGuardar}>
              <Save size={15} />
              Guardar
            </button>
          )}

          {!modoCrear && unidadSeleccionada?.estado === 1 && (
            <button className="btn-desactivar" onClick={onArchivar}>
              <ToggleLeft size={15} />
              Innactivar
            </button>
          )}

          {!modoCrear && unidadSeleccionada?.estado === 0 && (
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
