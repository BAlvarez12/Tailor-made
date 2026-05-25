import { useEffect, useMemo, useState } from "react";
import {
  crearUsuarioService,
  actualizarUsuarioService,
  obtenerUsuarioPorId,
  reenviarInvitacionUsuarioService,
} from "../../services/usuarios";
import {
  ESTADO_USUARIO,
  etiquetaEstadoUsuario,
} from "../../utils/estadoUsuario";
import {
  generarVistaPreviaUsuario,
  tieneApellidoDetectable,
} from "../../utils/generarUsuarioLogin";
import { obtenerRolesService } from "../../services/roles";
import {
  evaluarFortalezaPassword,
  validarPasswordRecuperacion,
} from "../../services/authService";
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
  Eye,
  EyeOff,
  Check,
  Send,
  KeyRound,
} from "lucide-react";
import "./formularioUsuarios.css";

const MODOS_ACCESO = {
  INVITACION: "invitacion",
  PASSWORD: "password",
};

const REGLAS_PASSWORD_LABELS = [
  { key: "minimo8", label: "Mínimo 8 caracteres" },
  { key: "minuscula", label: "Una letra minúscula" },
  { key: "mayuscula", label: "Una letra mayúscula" },
  { key: "numero", label: "Al menos un número" },
  { key: "simbolo", label: "Al menos un símbolo" },
];

const esCorreoValido = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

function CampoPasswordUsuario({
  id,
  label,
  requiredMark = false,
  value,
  onChange,
  placeholder,
  disabled,
  visible,
  onToggleVisible,
}) {
  return (
    <div className="tm-modal__field tm-modal__field--icon formularioUsuarios__field-password">
      <label htmlFor={id}>
        {label}
        {requiredMark && <span className="formularioUsuarios__required"> *</span>}
      </label>
      <div className="tm-input-wrap formularioUsuarios__password-wrap">
        <Lock size={16} className="tm-input-icon" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          name="password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          disabled={disabled}
        />
        <button
          type="button"
          className="formularioUsuarios__password-toggle"
          onClick={onToggleVisible}
          disabled={disabled}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function PanelFortalezaPassword({ password }) {
  const analisis = useMemo(() => evaluarFortalezaPassword(password), [password]);
  if (!password) return null;

  const anchoBarra =
    analisis.nivel === "alta" ? "100%" : analisis.nivel === "media" ? "66%" : "33%";

  return (
    <div
      className={`formularioUsuarios__strength formularioUsuarios__strength--${analisis.nivel} tm-modal__field--full`}
    >
      <div className="formularioUsuarios__strength-header">
        <span>Seguridad de la contraseña</span>
        <strong>{analisis.etiqueta}</strong>
      </div>
      <div className="formularioUsuarios__strength-track">
        <div className="formularioUsuarios__strength-fill" style={{ width: anchoBarra }} />
      </div>
      <ul className="formularioUsuarios__strength-rules">
        {REGLAS_PASSWORD_LABELS.map((regla) => {
          const cumple = analisis.reglas[regla.key];
          return (
            <li key={regla.key} className={cumple ? "is-ok" : "is-pending"}>
              {cumple ? <Check size={14} /> : <span className="is-dot" />}
              {regla.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const INITIAL_FORM = {
  nombre_usuario: "",
  apellido_usuario: "",
  usuario: "",
  password: "",
  email: "",
  estado: 1,
  rol_id: "",
  modo_acceso: MODOS_ACCESO.INVITACION,
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
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const usuarioPreview = useMemo(
    () => generarVistaPreviaUsuario(form.nombre_usuario, form.apellido_usuario),
    [form.nombre_usuario, form.apellido_usuario]
  );

  const puedeEnviarInvitacion = Boolean(form.email.trim() && esCorreoValido(form.email));

  const obtenerMensajeError = (err, mensajePorDefecto) =>
    err?.response?.data?.message ||
    err?.response?.data?.mensaje ||
    err?.response?.data?.error ||
    err?.message ||
    mensajePorDefecto;

  const mostrarError = (mensaje) => {
    setError(mensaje);
    toast.error(mensaje);
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setError("");
    setMostrarPassword(false);
  };

  const handleClose = () => {
    if (loading || loadingUsuario) return;
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "email" && !isEditMode) {
        const correoValido = value.trim() && esCorreoValido(value);
        if (!correoValido && prev.modo_acceso === MODOS_ACCESO.INVITACION) {
          next.modo_acceso = MODOS_ACCESO.PASSWORD;
        }
        if (correoValido && prev.modo_acceso === MODOS_ACCESO.PASSWORD && !prev.password) {
          next.modo_acceso = MODOS_ACCESO.INVITACION;
        }
      }

      return next;
    });
    if (error) setError("");
  };

  const seleccionarModoAcceso = (modo) => {
    if (modo === MODOS_ACCESO.INVITACION && !puedeEnviarInvitacion) return;
    setForm((prev) => ({ ...prev, modo_acceso: modo, password: "" }));
    if (error) setError("");
  };

  useEffect(() => {
    if (!isOpen) return;
    const cargarRoles = async () => {
      try {
        setLoadingRoles(true);
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
          modo_acceso: MODOS_ACCESO.PASSWORD,
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
    if (
      !form.apellido_usuario.trim() &&
      !tieneApellidoDetectable(form.nombre_usuario, form.apellido_usuario)
    ) {
      mostrarError(
        "Indica el apellido o escribe el nombre completo (nombre y apellido) en el campo nombre."
      );
      return false;
    }
    if (form.email.trim() && !esCorreoValido(form.email)) {
      mostrarError("Ingresa un correo electrónico válido.");
      return false;
    }
    if (!form.rol_id) {
      mostrarError("Debe seleccionar un rol.");
      return false;
    }

    if (!isEditMode) {
      if (form.modo_acceso === MODOS_ACCESO.INVITACION) {
        if (!puedeEnviarInvitacion) {
          mostrarError("Registra un correo válido para enviar la invitación.");
          return false;
        }
      } else if (!form.password.trim()) {
        mostrarError("Debes asignar una contraseña.");
        return false;
      }
    }

    if (form.password.trim()) {
      const errorPassword = validarPasswordRecuperacion(form.password);
      if (errorPassword) {
        mostrarError(errorPassword);
        return false;
      }
    }

    return true;
  };

  const construirPayload = (estadoFinal = null) => {
    const payload = {
      nombre_usuario: form.nombre_usuario.trim(),
      apellido_usuario: form.apellido_usuario.trim(),
      email: form.email.trim() ? form.email.trim() : null,
      rol_id: Number(form.rol_id),
      estado: estadoFinal !== null ? Number(estadoFinal) : Number(form.estado),
    };

    if (isEditMode) {
      payload.usuario = form.usuario.trim();
    } else {
      payload.modo_acceso = form.modo_acceso;
    }

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    return payload;
  };

  const finalizarAccion = async () => {
    resetForm();
    if (onSuccess) await onSuccess();
    else onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setError("");

      if (isEditMode) {
        await actualizarUsuarioService(usuarioEditarId, construirPayload());
        toast.success("Usuario actualizado con éxito");
      } else {
        const res = await crearUsuarioService(construirPayload());
        if (res.invitacionEnviada) {
          toast.success(
            `Usuario creado. Invitación enviada a ${form.email.trim()}. Usuario: ${res.usuario}`
          );
        } else {
          toast.success(`Usuario creado. Usuario de acceso: ${res.usuario}`);
        }
      }

      await finalizarAccion();
    } catch (err) {
      console.error(err);
      mostrarError(
        obtenerMensajeError(
          err,
          isEditMode ? "No se pudo actualizar el usuario." : "No se pudo crear el usuario."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    if (!isEditMode || !validarFormulario()) return;
    try {
      setLoading(true);
      await actualizarUsuarioService(usuarioEditarId, construirPayload(0));
      toast.success("Usuario desactivado con éxito");
      await finalizarAccion();
    } catch (err) {
      mostrarError(obtenerMensajeError(err, "No se pudo desactivar el usuario."));
    } finally {
      setLoading(false);
    }
  };

  const handleActivar = async () => {
    if (!isEditMode || Number(form.estado) !== ESTADO_USUARIO.INACTIVO) return;
    if (!validarFormulario()) return;
    try {
      setLoading(true);
      await actualizarUsuarioService(usuarioEditarId, construirPayload(ESTADO_USUARIO.ACTIVO));
      toast.success("Usuario activado con éxito");
      await finalizarAccion();
    } catch (err) {
      mostrarError(obtenerMensajeError(err, "No se pudo activar el usuario."));
    } finally {
      setLoading(false);
    }
  };

  const handleReenviarInvitacion = async () => {
    if (!isEditMode || Number(form.estado) !== ESTADO_USUARIO.INVITACION) return;

    if (!form.email.trim() || !esCorreoValido(form.email)) {
      mostrarError("Registra un correo válido antes de reenviar la invitación.");
      return;
    }

    try {
      setLoading(true);
      const res = await reenviarInvitacionUsuarioService(usuarioEditarId);
      toast.success(res?.message || "Invitación reenviada correctamente.");
    } catch (err) {
      mostrarError(obtenerMensajeError(err, "No se pudo reenviar la invitación."));
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
                  ? "Cargando información..."
                  : isEditMode
                    ? "Procesando..."
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
                    ? `Actualiza la información del usuario · Estado: ${etiquetaEstadoUsuario(form.estado)}`
                    : "Nombre y apellido generan el usuario de acceso automáticamente"}
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
                  <label htmlFor="nombre_usuario">
                    Nombre <span className="formularioUsuarios__required">*</span>
                  </label>
                  <div className="tm-input-wrap">
                    <User size={16} className="tm-input-icon" />
                    <input
                      id="nombre_usuario"
                      type="text"
                      name="nombre_usuario"
                      value={form.nombre_usuario}
                      onChange={handleChange}
                      placeholder="Ej. Juan o Juan Carlos"
                      disabled={loading || loadingUsuario}
                      required
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="apellido_usuario">
                    Apellido
                    {!tieneApellidoDetectable(
                      form.nombre_usuario,
                      form.apellido_usuario
                    ) && <span className="formularioUsuarios__required"> *</span>}
                  </label>
                  <div className="tm-input-wrap">
                    <User size={16} className="tm-input-icon" />
                    <input
                      id="apellido_usuario"
                      type="text"
                      name="apellido_usuario"
                      value={form.apellido_usuario}
                      onChange={handleChange}
                      placeholder="Ej. Pérez (o nombre completo arriba)"
                      disabled={loading || loadingUsuario}
                      required
                    />
                  </div>
                </div>

                {!isEditMode ? (
                  <div className="tm-modal__field tm-modal__field--full formularioUsuarios__usuario-preview">
                    <label>Usuario de acceso (automático)</label>
                    <div className="formularioUsuarios__usuario-preview-box">
                      <AtSign size={18} />
                      <strong>{usuarioPreview || "—"}</strong>
                    </div>
                    <p className="formularioUsuarios__hint">
                      Se genera del nombre y apellido. Si escribes el nombre completo en
                      un solo campo, la última palabra se toma como apellido. Si el
                      usuario ya existe, se prueban más letras del nombre o apellido antes
                      de agregar un número.
                    </p>
                  </div>
                ) : (
                  <div className="tm-modal__field tm-modal__field--icon">
                    <label htmlFor="usuario">Usuario de acceso</label>
                    <div className="tm-input-wrap">
                      <AtSign size={16} className="tm-input-icon" />
                      <input
                        id="usuario"
                        type="text"
                        name="usuario"
                        value={form.usuario}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                )}

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="email">Correo electrónico (opcional)</label>
                  <div className="tm-input-wrap">
                    <Mail size={16} className="tm-input-icon" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="correo@ejemplo.com"
                      disabled={loading || loadingUsuario}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="tm-modal__field tm-modal__field--icon">
                  <label htmlFor="rol_id">
                    Rol <span className="formularioUsuarios__required">*</span>
                  </label>
                  <div className="tm-input-wrap tm-input-wrap--select">
                    <Shield size={16} className="tm-input-icon" />
                    <select
                      id="rol_id"
                      name="rol_id"
                      value={form.rol_id}
                      onChange={handleChange}
                      disabled={loading || loadingUsuario || loadingRoles}
                      required
                    >
                      <option value="">
                        {loadingRoles ? "Cargando..." : "Seleccione un rol"}
                      </option>
                      {roles.map((rol) => (
                        <option key={rol.rol_id || rol.id} value={rol.rol_id || rol.id}>
                          {rol.nombre_rol || rol.nombre || rol.rol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!isEditMode && (
                  <div className="tm-modal__field tm-modal__field--full">
                    <label className="formularioUsuarios__label-block">
                      Acceso a la plataforma
                    </label>
                    <div className="formularioUsuarios__modo-grid">
                      <button
                        type="button"
                        className={`formularioUsuarios__modo-card ${
                          form.modo_acceso === MODOS_ACCESO.INVITACION ? "is-active" : ""
                        }`}
                        onClick={() => seleccionarModoAcceso(MODOS_ACCESO.INVITACION)}
                        disabled={loading || loadingUsuario || !puedeEnviarInvitacion}
                      >
                        <Send size={20} />
                        <strong>Enviar invitación por correo</strong>
                        <span>
                          El usuario recibe un enlace para crear su contraseña (72 h).
                        </span>
                      </button>

                      <button
                        type="button"
                        className={`formularioUsuarios__modo-card ${
                          form.modo_acceso === MODOS_ACCESO.PASSWORD ? "is-active" : ""
                        }`}
                        onClick={() => seleccionarModoAcceso(MODOS_ACCESO.PASSWORD)}
                        disabled={loading || loadingUsuario}
                      >
                        <KeyRound size={20} />
                        <strong>Asignar contraseña manualmente</strong>
                        <span>
                          Para quien no tiene correo. Tú defines la contraseña inicial.
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {isEditMode && (
                  <p className="formularioUsuarios__hint tm-modal__field--full">
                    Deja vacío si no deseas cambiar la contraseña.
                  </p>
                )}

                {((!isEditMode && form.modo_acceso === MODOS_ACCESO.PASSWORD) || isEditMode) && (
                  <>
                    <CampoPasswordUsuario
                      id="password"
                      label={isEditMode ? "Nueva contraseña" : "Contraseña"}
                      requiredMark={
                        !isEditMode && form.modo_acceso === MODOS_ACCESO.PASSWORD
                      }
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Mín. 8 caracteres"
                      disabled={loading || loadingUsuario}
                      visible={mostrarPassword}
                      onToggleVisible={() => setMostrarPassword((p) => !p)}
                    />
                    <PanelFortalezaPassword password={form.password} />
                  </>
                )}
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
                  {loading
                    ? "Guardando..."
                    : form.modo_acceso === MODOS_ACCESO.INVITACION
                      ? "Crear y enviar invitación"
                      : "Crear usuario"}
                </button>
              )}

              {isEditMode && (
                <>
                  <button type="submit" className="btn-guardar" disabled={loading || loadingUsuario}>
                    <Save size={16} />
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                  {Number(form.estado) === ESTADO_USUARIO.INVITACION && (
                    <button
                      type="button"
                      className="btn-guardar btn-reenviar-invitacion"
                      onClick={handleReenviarInvitacion}
                      disabled={loading || loadingUsuario}
                    >
                      <Send size={16} />
                      {loading ? "Enviando..." : "Reenviar invitación"}
                    </button>
                  )}
                  {Number(form.estado) === ESTADO_USUARIO.ACTIVO && (
                    <button type="button" className="btn-desactivar" onClick={handleDesactivar}>
                      Inactivar
                    </button>
                  )}
                  {Number(form.estado) === ESTADO_USUARIO.INACTIVO && (
                    <button type="button" className="btn-activar" onClick={handleActivar}>
                      Activar
                    </button>
                  )}
                  {Number(form.estado) === ESTADO_USUARIO.INVITACION && (
                    <button type="button" className="btn-desactivar" onClick={handleDesactivar}>
                      Inactivar
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
