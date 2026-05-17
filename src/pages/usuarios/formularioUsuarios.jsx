import { useEffect, useState } from "react";
import {
  crearUsuarioService,
  actualizarUsuarioService,
  obtenerUsuarioPorId,
} from "../../services/usuarios";
import { obtenerRolesService } from "../../services/roles";
import { toast } from "react-toastify";
import {
  UserPlus,
  UserCog,
  User,
  AtSign,
  Lock,
  Mail,
  Shield,
  Save,
  XCircle,
  FileText,
} from "lucide-react";
import "./formularioUsuarios.css";

const INITIAL_FORM = {
  nombre_usuario: "",
  apellido_usuario: "",
  usuario: "",
  password: "",
  email: "",
  estado: 1,
  rol_id: "",
};

function FormularioUsuarios({
  isOpen,
  onClose,
  onSuccess,
  usuarioEditarId = null,
}) {
  const isEditMode = Boolean(usuarioEditarId);

  const [form, setForm] = useState(INITIAL_FORM);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [error, setError] = useState("");

  const obtenerMensajeError = (err, mensajePorDefecto) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.mensaje ||
      err?.response?.data?.error ||
      err?.message ||
      mensajePorDefecto
    );
  };

  const mostrarError = (mensaje) => {
    setError(mensaje);
    toast.error(mensaje);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setError("");
  };

  const handleClose = () => {
    if (loading || loadingUsuario) return;
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  useEffect(() => {
    if (!isOpen) return;

    const cargarRoles = async () => {
      try {
        setLoadingRoles(true);
        setError("");

        const data = await obtenerRolesService();
        setRoles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setRoles([]);
        mostrarError("No se pudieron cargar los roles.");
      } finally {
        setLoadingRoles(false);
      }
    };

    cargarRoles();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const cargarUsuario = async () => {
      if (!usuarioEditarId) {
        setForm(INITIAL_FORM);
        setError("");
        return;
      }

      try {
        setLoadingUsuario(true);
        setError("");

        const usuario = await obtenerUsuarioPorId(usuarioEditarId);

        setForm({
          nombre_usuario: usuario.nombre_usuario || "",
          apellido_usuario: usuario.apellido_usuario || "",
          usuario: usuario.usuario || "",
          password: "",
          email: usuario.email || usuario.correo || "",
          estado:
            usuario.estado !== undefined && usuario.estado !== null
              ? Number(usuario.estado)
              : 1,
          rol_id:
            usuario.rol_id !== undefined && usuario.rol_id !== null
              ? String(usuario.rol_id)
              : "",
        });
      } catch (err) {
        console.error(err);
        mostrarError("No se pudo cargar la información del usuario.");
      } finally {
        setLoadingUsuario(false);
      }
    };

    cargarUsuario();
  }, [usuarioEditarId, isOpen]);

  const validarFormulario = () => {
    if (!form.nombre_usuario.trim()) {
      mostrarError("El nombre es obligatorio.");
      return false;
    }

    if (!form.usuario.trim()) {
      mostrarError("El usuario es obligatorio.");
      return false;
    }

    if (!isEditMode && !form.password.trim()) {
      mostrarError("La contraseña es obligatoria.");
      return false;
    }

    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        mostrarError("El correo no tiene un formato válido.");
        return false;
      }
    }

    if (!form.rol_id) {
      mostrarError("Debe seleccionar un rol.");
      return false;
    }

    return true;
  };

  const construirPayload = (estadoFinal = null) => {
    const payload = {
      nombre_usuario: form.nombre_usuario.trim(),
      apellido_usuario: form.apellido_usuario.trim()
        ? form.apellido_usuario.trim()
        : null,
      usuario: form.usuario.trim(),
      email: form.email.trim() ? form.email.trim() : null,
      rol_id: Number(form.rol_id),
      estado: estadoFinal !== null ? Number(estadoFinal) : Number(form.estado),
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    return payload;
  };

  const finalizarAccion = async () => {
    resetForm();

    if (onSuccess) {
      await onSuccess();
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setError("");

      const payload = construirPayload();

      if (isEditMode) {
        await actualizarUsuarioService(usuarioEditarId, payload);
        toast.success("Usuario actualizado con éxito");
      } else {
        await crearUsuarioService(payload);
        toast.success("Usuario creado con éxito");
      }

      await finalizarAccion();
    } catch (err) {
      console.error(err);
      const mensaje = obtenerMensajeError(
        err,
        isEditMode
          ? "No se pudo actualizar el usuario."
          : "No se pudo crear el usuario."
      );
      mostrarError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    if (!isEditMode) return;
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setError("");

      const payload = construirPayload(0);

      await actualizarUsuarioService(usuarioEditarId, payload);
      toast.success("Usuario desactivado con éxito");

      await finalizarAccion();
    } catch (err) {
      console.error(err);
      const mensaje = obtenerMensajeError(
        err,
        "No se pudo desactivar el usuario."
      );
      mostrarError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async () => {
    if (!isEditMode) return;
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setError("");

      const payload = construirPayload(1);

      await actualizarUsuarioService(usuarioEditarId, payload);
      toast.success("Usuario activado con éxito");

      await finalizarAccion();
    } catch (err) {
      console.error(err);
      const mensaje = obtenerMensajeError(
        err,
        "No se pudo activar el usuario."
      );
      mostrarError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="formularioUsuarios">
      <div className="tm-modal-overlay" onClick={handleClose}>
        <div className="tm-modal" onClick={(e) => e.stopPropagation()}>
          {(loading || loadingUsuario) && (
            <div className="tm-modal__loading-screen">
              <div className="tm-modal__loader"></div>
              <p>
                {loadingUsuario
                  ? "Cargando información del usuario..."
                  : isEditMode
                  ? "Procesando usuario..."
                  : "Creando usuario..."}
              </p>
            </div>
          )}

          <div className="tm-modal__header">
            <div className="tm-modal__title-wrap">
              <div className="tm-modal__title-icon">
                {isEditMode ? <UserCog size={22} /> : <UserPlus size={22} />}
              </div>

              <div>
                <h2>{isEditMode ? "Editar usuario" : "Crear usuario"}</h2>
                <p className="tm-modal__subtitle">
                  {isEditMode
                    ? "Actualiza la información del usuario"
                    : "Registra un nuevo usuario en el sistema"}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="tm-modal__close"
              onClick={handleClose}
              disabled={loading || loadingUsuario}
            >
              ×
            </button>
          </div>

          <form
            className={`tm-modal__form ${
              loading || loadingUsuario ? "tm-modal__form--disabled" : ""
            }`}
            onSubmit={handleSubmit}
          >
            {error && <p className="tm-modal__error">{error}</p>}

            <div className="tm-modal__section">
              <p className="tm-modal__section-title">
                <FileText size={16} />
                Datos del usuario
              </p>

              <div className="tm-modal__grid">
                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="nombre_usuario">Nombre</label>
                  <div className="tm-input-wrap">
                    <User size={16} className="tm-input-icon" />
                    <input
                      id="nombre_usuario"
                      type="text"
                      name="nombre_usuario"
                      value={form.nombre_usuario}
                      onChange={handleChange}
                      placeholder="Ingresa el nombre"
                      disabled={loading || loadingUsuario}
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="apellido_usuario">Apellido</label>
                  <div className="tm-input-wrap">
                    <User size={16} className="tm-input-icon" />
                    <input
                      id="apellido_usuario"
                      type="text"
                      name="apellido_usuario"
                      value={form.apellido_usuario}
                      onChange={handleChange}
                      placeholder="Ingresa el apellido"
                      disabled={loading || loadingUsuario}
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="usuario">Usuario</label>
                  <div className="tm-input-wrap">
                    <AtSign size={16} className="tm-input-icon" />
                    <input
                      id="usuario"
                      type="text"
                      name="usuario"
                      value={form.usuario}
                      onChange={handleChange}
                      placeholder="Ingresa el usuario"
                      disabled={loading || loadingUsuario}
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="password">
                    {isEditMode ? "Nueva contraseña" : "Contraseña"}
                  </label>
                  <div className="tm-input-wrap">
                    <Lock size={16} className="tm-input-icon" />
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={
                        isEditMode
                          ? "Déjalo vacío si no deseas cambiarla"
                          : "Ingresa la contraseña"
                      }
                      disabled={loading || loadingUsuario}
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="email">Correo</label>
                  <div className="tm-input-wrap">
                    <Mail size={16} className="tm-input-icon" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Ingresa el correo"
                      disabled={loading || loadingUsuario}
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="rol_id">Rol</label>
                  <div className="tm-input-wrap tm-input-wrap--select">
                    <Shield size={16} className="tm-input-icon" />
                    <select
                      id="rol_id"
                      name="rol_id"
                      value={form.rol_id}
                      onChange={handleChange}
                      disabled={loading || loadingUsuario || loadingRoles}
                    >
                      <option value="">
                        {loadingRoles
                          ? "Cargando roles..."
                          : "Seleccione un rol"}
                      </option>

                      {roles.map((rol) => (
                        <option
                          key={rol.rol_id || rol.id}
                          value={rol.rol_id || rol.id}
                        >
                          {rol.nombre_rol || rol.nombre || rol.rol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="formularioUsuarios__footer tm-modal__actions">
              <button
                type="button"
                className="btn-cancelar"
                onClick={handleClose}
                disabled={loading || loadingUsuario}
              >
                <XCircle size={16} />
                Cancelar
              </button>

              {!isEditMode && (
                <button
                  type="submit"
                  className="btn-guardar"
                  disabled={loading || loadingUsuario || loadingRoles}
                >
                  <Save size={16} />
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              )}

              {isEditMode && (
                <>
                  <button
                    type="submit"
                    className="btn-guardar"
                    disabled={loading || loadingUsuario || loadingRoles}
                  >
                    <Save size={16} />
                    {loading ? "Guardando..." : "Guardar"}
                  </button>

                  {Number(form.estado) === 1 ? (
                    <button
                      type="button"
                      className="btn-desactivar"
                      onClick={handleDesactivar}
                      disabled={loading || loadingUsuario || loadingRoles}
                    >
                      Inactivar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-activar"
                      onClick={handleActivar}
                      disabled={loading || loadingUsuario || loadingRoles}
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

export default FormularioUsuarios;