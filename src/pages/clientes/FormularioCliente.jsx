import { useEffect, useState } from "react";
import { createCliente, updateCliente } from "../../services/clienteService";
import "./clientes.css";
import "./formularioCliente.css";
import { toast } from "react-toastify";
import {
  UserPlus,
  UserCog,
  User,
  Phone,
  Save,
  XCircle,
  FileText,
} from "lucide-react";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  telefono: "",
  estado: 1,
};

function FormularioCliente({ open, cliente, onClose, onSuccess }) {
  const isEditMode = Boolean(cliente?.cliente_id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setError("");
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  useEffect(() => {
    if (!open) return;

    if (isEditMode && cliente) {
      setForm({
        nombre: cliente.nombre_cliente || "",
        apellido: cliente.apellido_cliente || "",
        telefono: cliente.telefono || "",
        estado:
          cliente.estado !== undefined && cliente.estado !== null
            ? Number(cliente.estado)
            : 1,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setError("");
  }, [open, cliente, isEditMode]);

  const obtenerMensajeError = (err, defecto) =>
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    defecto;

  const validar = () => {
    if (!form.nombre.trim()) {
      const msg = "El nombre es obligatorio.";
      setError(msg);
      toast.error(msg);
      return false;
    }
    if (!form.apellido.trim()) {
      const msg = "El apellido es obligatorio.";
      setError(msg);
      toast.error(msg);
      return false;
    }
    if (!form.telefono.trim()) {
      const msg = "El teléfono es obligatorio.";
      setError(msg);
      toast.error(msg);
      return false;
    }
    return true;
  };

  const construirPayload = (estadoOverride = null) => ({
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    telefono: form.telefono.trim(),
    ...(isEditMode && {
      estado:
        estadoOverride !== null ? Number(estadoOverride) : Number(form.estado),
    }),
  });

  const finalizar = async (extra) => {
    resetForm();
    if (onSuccess) {
      await onSuccess(extra);
    } else {
      onClose?.();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await updateCliente(cliente.cliente_id, construirPayload());
        toast.success("Cliente actualizado con éxito");
        await finalizar();
      } else {
        const res = await createCliente({
          ...construirPayload(),
          usuario: 1,
        });
        toast.success("Cliente creado con éxito");
        await finalizar({
          nuevoCliente: {
            cliente_id: res.cliente_id,
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            telefono: form.telefono.trim(),
          },
        });
      }
    } catch (err) {
      console.error(err);
      const msg = obtenerMensajeError(
        err,
        isEditMode
          ? "No se pudo actualizar el cliente."
          : "No se pudo crear el cliente."
      );
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    if (!isEditMode || !validar()) return;

    try {
      setLoading(true);
      await updateCliente(cliente.cliente_id, construirPayload(0));
      toast.success("Cliente inactivado con éxito");
      await finalizar();
    } catch (err) {
      console.error(err);
      toast.error(obtenerMensajeError(err, "No se pudo inactivar el cliente."));
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async () => {
    if (!isEditMode || !validar()) return;

    try {
      setLoading(true);
      await updateCliente(cliente.cliente_id, construirPayload(1));
      toast.success("Cliente activado con éxito");
      await finalizar();
    } catch (err) {
      console.error(err);
      toast.error(obtenerMensajeError(err, "No se pudo activar el cliente."));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="formularioCliente">
      <div className="tm-modal-overlay" onClick={handleClose}>
        <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon">
                {isEditMode ? <UserCog size={22} /> : <UserPlus size={22} />}
              </div>
              <div>
                <h2>{isEditMode ? "Editar cliente" : "Crear cliente"}</h2>
                <p className="tm-modal__subtitle">
                  {isEditMode
                    ? "Actualiza la información del cliente"
                    : "Registra un nuevo cliente en el sistema"}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="tm-modal__close"
              onClick={handleClose}
              disabled={loading}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          <form
            className={`tm-modal__form ${loading ? "tm-modal__form--disabled" : ""}`}
            onSubmit={handleSubmit}
          >
            {error && <p className="tm-modal__error">{error}</p>}

            <div className="tm-modal__section">
              <p className="tm-modal__section-title">
                <FileText size={16} />
                Datos del cliente
              </p>

              <div className="tm-modal__grid">
                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="cliente-nombre">Nombre</label>
                  <div className="tm-input-wrap">
                    <User size={16} className="tm-input-icon" />
                    <input
                      id="cliente-nombre"
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ingresa el nombre"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="cliente-apellido">Apellido</label>
                  <div className="tm-input-wrap">
                    <User size={16} className="tm-input-icon" />
                    <input
                      id="cliente-apellido"
                      type="text"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      placeholder="Ingresa el apellido"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="cliente-telefono">Teléfono</label>
                  <div className="tm-input-wrap">
                    <Phone size={16} className="tm-input-icon" />
                    <input
                      id="cliente-telefono"
                      type="text"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="Ingresa el teléfono"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="formularioCliente__footer tm-modal__actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleClose}
                disabled={loading}
              >
                <XCircle size={16} />
                Cancelar
              </button>

              {!isEditMode && (
                <button type="submit" className="btn-guardar" disabled={loading}>
                  <Save size={16} />
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              )}

              {isEditMode && (
                <>
                  <button
                    type="submit"
                    className="btn-guardar"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? "Guardando..." : "Guardar"}
                  </button>

                  {Number(form.estado) === 1 ? (
                    <button
                      type="button"
                      className="btn-desactivar"
                      onClick={handleDesactivar}
                      disabled={loading}
                    >
                      Inactivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-activar"
                      onClick={handleActivar}
                      disabled={loading}
                    >
                      Activar
                    </button>
                  )}
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormularioCliente;
