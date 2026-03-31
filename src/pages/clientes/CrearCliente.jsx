import { useState } from "react";
import { createCliente } from "../../services/clienteService";
import "./clientes.css";

function CrearCliente({ open, onClose, onSuccess }) {

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    usuario: 1
  });

  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIONES
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!form.apellido.trim()) {
      setError("El apellido es obligatorio");
      return;
    }

    if (!form.telefono.trim()) {
      setError("El teléfono es obligatorio");
      return;
    }

    try {
      setError("");

      // 🔥 LLAMADA AL BACKEND
      const res = await createCliente(form);

      // 🔥 AQUÍ VIENE LA MAGIA
      // Mandamos los datos al componente padre (Clientes.jsx)
      onSuccess({
        cliente_id: res.cliente_id,
        cliente_prenda_id: res.cliente_prenda_id,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono
      });

      // Cerrar este modal
      onClose();

    } catch (error) {
      console.error(error);
      setError("Error al crear cliente");
    }
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>

        <div className="tm-modal__header">
          <h2>Crear Cliente</h2>
          <button className="tm-modal__close" onClick={onClose}>×</button>
        </div>

        <form className="tm-modal__form" onSubmit={handleSubmit}>

          {error && <p className="tm-modal__error">{error}</p>}

          <div className="tm-modal__grid">

            <div className="tm-modal__field">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="tm-modal__field">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>

            <div className="tm-modal__field">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="tm-modal__actions">
            <button
              type="button"
              className="tm-modal__btn tm-modal__btn--secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="tm-modal__btn tm-modal__btn--primary"
            >
              Guardar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default CrearCliente;