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
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  telefono: "",
  dpi: "",
  estado: 1,
};

const normalizarDpiInput = (valor) => String(valor ?? "").replace(/\D/g, "").slice(0, 13);

function FormularioCliente({ open, cliente, onClose, onSuccess }) {
  const isEditMode = Boolean(cliente?.cliente_id);

  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clienteDpiDuplicado, setClienteDpiDuplicado] = useState(null);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setError("");
    setClienteDpiDuplicado(null);
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === "dpi" ? normalizarDpiInput(value) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    if (error) setError("");
    if (clienteDpiDuplicado) setClienteDpiDuplicado(null);
  };

  useEffect(() => {
    if (!open) return;

    if (isEditMode && cliente) {
      setForm({
        nombre: cliente.nombre_cliente || "",
        apellido: cliente.apellido_cliente || "",
        telefono: cliente.telefono || "",
        dpi: normalizarDpiInput(cliente.dpi || ""),
        estado:
          cliente.estado !== undefined && cliente.estado !== null
            ? Number(cliente.estado)
            : 1,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setError("");
    setClienteDpiDuplicado(null);
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
    if (!form.dpi.trim()) {
      const msg = "El DPI es obligatorio.";
      setError(msg);
      toast.error(msg);
      return false;
    }
    if (form.dpi.length !== 13) {
      const msg = "El DPI debe tener exactamente 13 dígitos.";
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
    dpi: form.dpi.trim(),
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

  const manejarErrorGuardado = (err, defecto) => {
    const data = err?.response?.data;

    if (data?.dpiDuplicado && data?.clienteExistente) {
      setClienteDpiDuplicado(data.clienteExistente);
      return;
    }

    const msg = obtenerMensajeError(err, defecto);
    setError(msg);
    toast.error(msg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      setLoading(true);
      setError("");
      setClienteDpiDuplicado(null);

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
            dpi: form.dpi.trim(),
          },
        });
      }
    } catch (err) {
      console.error(err);
      manejarErrorGuardado(
        err,
        isEditMode
          ? "No se pudo actualizar el cliente."
          : "No se pudo crear el cliente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    if (!isEditMode || !validar()) return;

    try {
      setLoading(true);
      setClienteDpiDuplicado(null);
      await updateCliente(cliente.cliente_id, construirPayload(0));
      toast.success("Cliente inactivado con éxito");
      await finalizar();
    } catch (err) {
      console.error(err);
      manejarErrorGuardado(err, "No se pudo inactivar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async () => {
    if (!isEditMode || !validar()) return;

    try {
      setLoading(true);
      setClienteDpiDuplicado(null);
      await updateCliente(cliente.cliente_id, construirPayload(1));
      toast.success("Cliente activado con éxito");
      await finalizar();
    } catch (err) {
      console.error(err);
      manejarErrorGuardado(err, "No se pudo activar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className={`formularioCliente${clienteDpiDuplicado ? " formularioCliente--dpi-open" : ""}`}
    >
      <div className="tm-modal-overlay formularioCliente__modal-overlay" onClick={handleClose}>
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

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="cliente-dpi">DPI</label>
                  <div className="tm-input-wrap">
                    <CreditCard size={16} className="tm-input-icon" />
                    <input
                      id="cliente-dpi"
                      type="text"
                      name="dpi"
                      inputMode="numeric"
                      autoComplete="off"
                      value={form.dpi}
                      onChange={handleChange}
                      placeholder="13 dígitos"
                      maxLength={13}
                      disabled={loading}
                      required
                    />
                  </div>
                  <span className="formularioCliente__dpi-hint">
                    {form.dpi.length}/13 dígitos
                  </span>
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

      {clienteDpiDuplicado && (
        <div
          className="tm-modal-overlay formularioCliente__dpi-overlay"
          onClick={() => setClienteDpiDuplicado(null)}
        >
          <div
            className="tm-modal tm-modal--sm"
            role="alertdialog"
            aria-labelledby="dpi-duplicado-titulo"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tm-modal__header">
              <div className="tm-modal__title-wrap">
                <div
                  className="tm-modal__title-icon formularioCliente__title-icon--alert"
                  aria-hidden
                >
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h2 id="dpi-duplicado-titulo">DPI ya registrado</h2>
                  <p className="tm-modal__subtitle">
                    Ya existe un cliente con este DPI en el sistema
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="tm-modal__close"
                onClick={() => setClienteDpiDuplicado(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="tm-modal__form">
              <div className="tm-modal__section">
                <p className="tm-modal__section-title">
                  <User size={16} />
                  Cliente registrado
                </p>

                <div className="tm-modal__grid">
                  <div className="tm-modal__field tm-modal__field--icon tm-modal__field--full">
                    <label htmlFor="dpi-dup-nombre">Nombre completo</label>
                    <div className="tm-input-wrap">
                      <User size={16} className="tm-input-icon" />
                      <div
                        id="dpi-dup-nombre"
                        className="tm-modal__readonly"
                        role="text"
                      >
                        {clienteDpiDuplicado.nombre_completo || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="tm-modal__field tm-modal__field--icon">
                    <label htmlFor="dpi-dup-telefono">Teléfono</label>
                    <div className="tm-input-wrap">
                      <Phone size={16} className="tm-input-icon" />
                      <div
                        id="dpi-dup-telefono"
                        className="tm-modal__readonly"
                        role="text"
                      >
                        {clienteDpiDuplicado.telefono || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="tm-modal__field tm-modal__field--icon">
                    <label htmlFor="dpi-dup-dpi">DPI</label>
                    <div className="tm-input-wrap">
                      <CreditCard size={16} className="tm-input-icon" />
                      <div id="dpi-dup-dpi" className="tm-modal__readonly" role="text">
                        {clienteDpiDuplicado.dpi || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="formularioCliente__footer tm-modal__actions">
                <button
                  type="button"
                  className="btn-guardar"
                  onClick={() => setClienteDpiDuplicado(null)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormularioCliente;
