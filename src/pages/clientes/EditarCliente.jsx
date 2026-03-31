import React, { useEffect, useState } from "react";
import { updateCliente } from "../../services/clienteService";
import "./clientes.css";

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

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tm-modal-overlay" onClick={onClose}>
      <div className="tm-modal" onClick={(e) => e.stopPropagation()}>

        <div className="tm-modal__header">
          <h2>Editar Cliente</h2>
          <button className="tm-modal__close" onClick={onClose}>×</button>
        </div>

        <form className="tm-modal__form" onSubmit={handleSubmit}>

          <div className="tm-modal__grid">

            <div className="tm-modal__field">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="tm-modal__field">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="tm-modal__field">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="tm-modal__field">
              <label>Estado</label>
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
              Actualizar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default EditarCliente;