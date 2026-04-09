import React, { useEffect, useState } from "react";
import { updateCliente } from "../../services/clienteService";
import "./clientes.css";
import { toast } from "react-toastify";
import { Pencil, User, Phone, ToggleLeft, Save, XCircle, FileText } from "lucide-react";

function EditarCliente({ isOpen, onClose, onSuccess, cliente }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    estado: 1
  });

  useEffect(() => {
    if (cliente) {
      setForm({
        nombre: cliente.nombre_cliente || "",
        apellido: cliente.apellido_cliente || "",
        telefono: cliente.telefono || "",
        estado: cliente.estado ?? 1
      });
    }
  }, [cliente]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateCliente(cliente.cliente_id, {
        ...form,
        estado: Number(form.estado)
      });

      toast.success("Cliente actualizado con éxito");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error al actualizar cliente");
    }
  };

  return (
  <div className="tm-modal-overlay" onClick={onClose}>
    <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
      <div className="tm-modal__header">
        <div className="tm-modal__title-wrap">
          <div className="tm-modal__title-icon">
            <Pencil size={22} />
          </div>
          <div>
            <h2>Editar Cliente</h2>
            <p className="tm-modal__subtitle">
              Actualiza la información del cliente seleccionado
            </p>
          </div>
        </div>

        <button className="tm-modal__close" onClick={onClose}>×</button>
      </div>

      <form className="tm-modal__form" onSubmit={handleSubmit}>
        <div className="tm-modal__section">
          <p className="tm-modal__section-title">
            <FileText size={16} />
            Información general
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
                  required
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
                  required
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
                  required
                />
              </div>
            </div>

            <div className="tm-modal__field tm-modal__field--icon">
              <label>Estado</label>
              <div className="tm-input-wrap">
                <ToggleLeft size={16} className="tm-input-icon" />
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
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
            Actualizar
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default EditarCliente;