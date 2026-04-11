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
          <h3>
            {modoCrear ? "Crear unidad" : <span className="modal-title-bold">Editar unidad</span>}
          </h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="clientes-modal-body">
          <div className="form-group">
            <label>Nombre</label>
            <input
              value={formData.nombre_unidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nombre_unidad: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Símbolo</label>
            <input
              value={formData.simbolo_unidad}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  simbolo_unidad: e.target.value
                })
              }
            />
          </div>
        </div>

        <div className="clientes-modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>

          {modoCrear && (
            <button className="btn-guardar" onClick={onGuardar}>
              Crear
            </button>
          )}

          {!modoCrear && unidadSeleccionada?.estado === 1 && (
            <button className="btn-guardar" onClick={onGuardar}>
              Guardar
            </button>
          )}

          {!modoCrear && unidadSeleccionada?.estado === 1 && (
            <button className="btn-desactivar" onClick={onArchivar}>
              Innactivar
            </button>
          )}

          {!modoCrear && unidadSeleccionada?.estado === 0 && (
            <button className="btn-activar" onClick={onRestaurar}>
              Activar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
