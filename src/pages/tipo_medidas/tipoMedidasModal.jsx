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
          <h3>{modoCrear ? "Crear tipo" : "Editar tipo"}</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="clientes-modal-body">
          <div className="form-group">
            <label>Nombre</label>
            <input
              value={formData.nombre_tipo_medida}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nombre_tipo_medida: e.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <input
              value={formData.descripcion_tipo_medida}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  descripcion_tipo_medida: e.target.value
                })
              }
            />
          </div>
        </div>

        <div className="clientes-modal-footer">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          {modoCrear && (
            <button className="btn-guardar" onClick={onGuardar}>Crear</button>
          )}
          {!modoCrear && tipoSeleccionado?.estado === 1 && (
            <>
              <button className="btn-guardar" onClick={onGuardar}>Guardar</button>
              <button className="btn-desactivar" onClick={onArchivar}>Desactivar</button>
            </>
          )}
          {!modoCrear && tipoSeleccionado?.estado === 0 && (
            <button className="btn-activar" onClick={onRestaurar}>Activar</button>
          )}
        </div>
      </div>
    </div>
  );
}