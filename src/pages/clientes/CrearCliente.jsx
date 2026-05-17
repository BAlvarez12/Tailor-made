import { useState } from "react";
import { createCliente } from "../../services/clienteService";
import "./clientes.css";
import { toast } from "react-toastify";
import { UserPlus, User, Phone, Save, XCircle, FileText } from "lucide-react";

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

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      toast.error("El nombre es obligatorio");
      return;
    }

    if (!form.apellido.trim()) {
      setError("El apellido es obligatorio");
      toast.error("El apellido es obligatorio");
      return;
    }

    if (!form.telefono.trim()) {
      setError("El teléfono es obligatorio");
      toast.error("El teléfono es obligatorio");
      return;
    }

    try {
      setError("");

      const res = await createCliente(form);

      onSuccess({
        cliente_id: res.cliente_id,
        nombre: form.nombre,
        apellido: form.apellido,
        telefono: form.telefono
      });

      toast.success("Cliente creado con éxito");
      onClose();
    } catch (error) {
      console.error(error);
      setError("Error al crear cliente");
      toast.error(error?.response?.data?.message || "Error al crear cliente");
    }
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tm-modal__header">
          <div className="tm-modal__title-wrap">
            <div className="tm-modal__title-icon">
              <UserPlus size={22} />
            </div>
            <div>
              <h2>Crear Cliente</h2>
              <p className="tm-modal__subtitle">
                Registra un nuevo cliente en el sistema
              </p>
            </div>
          </div>

          <button className="tm-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="tm-modal__form" onSubmit={handleSubmit}>
          {error && <p className="tm-modal__error">{error}</p>}

          <div className="tm-modal__section">
            <p className="tm-modal__section-title">
              <FileText size={16} />
              Datos del cliente
            </p>

            <div className="tm-modal__grid">
              <div className="tm-modal__field tm-modal__field--icon">
                <label>Nombre</label>
                <div className="tm-input-wrap">
                  <User size={16} className="tm-input-icon" />
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre"
                  />
                </div>
              </div>

              <div className="tm-modal__field tm-modal__field--icon">
                <label>Apellido</label>
                <div className="tm-input-wrap">
                  <User size={16} className="tm-input-icon" />
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Ingresa el apellido"
                  />
                </div>
              </div>

              <div className="tm-modal__field tm-modal__field--icon">
                <label>Teléfono</label>
                <div className="tm-input-wrap">
                  <Phone size={16} className="tm-input-icon" />
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="Ingresa el teléfono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="tm-modal__actions">
            <button
              type="button"
              className="tm-modal__btn tm-modal__btn--secondary"
              onClick={onClose}
            >
              <XCircle size={16} />
              Cancelar
            </button>

            <button
              type="submit"
              className="tm-modal__btn tm-modal__btn--primary"
            >
              <Save size={16} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearCliente;