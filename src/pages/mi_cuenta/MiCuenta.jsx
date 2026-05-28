import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Shield,
  CircleUser,
  KeyRound,
} from "lucide-react";
import {
  obtenerMiCuentaService,
  actualizarMiPerfilService,
  cambiarMiPasswordService,
} from "../../services/miCuentaService";
import "./MiCuenta.css";

export default function MiCuenta() {
  const [cuenta, setCuenta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [perfilForm, setPerfilForm] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    email: "",
  });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState("");
  const [exitoPerfil, setExitoPerfil] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    password_actual: "",
    password_nueva: "",
    password_confirmacion: "",
  });
  const [verPasswords, setVerPasswords] = useState({
    actual: false,
    nueva: false,
    confirm: false,
  });
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState("");
  const [exitoPassword, setExitoPassword] = useState("");

  useEffect(() => {
    cargarCuenta();
  }, []);

  const cargarCuenta = async () => {
    try {
      setCargando(true);
      setErrorCarga("");
      const data = await obtenerMiCuentaService();
      setCuenta(data);
      setPerfilForm({
        nombre_usuario: data.nombre_usuario || "",
        apellido_usuario: data.apellido_usuario || "",
        email: data.email || "",
      });
    } catch (err) {
      console.error("Error al cargar mi cuenta:", err);
      setErrorCarga("No se pudo cargar la información de tu cuenta.");
    } finally {
      setCargando(false);
    }
  };

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();
    setErrorPerfil("");
    setExitoPerfil("");

    try {
      setGuardandoPerfil(true);
      const resp = await actualizarMiPerfilService(perfilForm);

      const actualizado = resp?.usuario || perfilForm;
      const nuevaCuenta = { ...cuenta, ...actualizado };
      setCuenta(nuevaCuenta);

      // Sincroniza el localStorage para que el sidebar muestre los nuevos datos.
      try {
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario")) || {};
        const merged = {
          ...usuarioGuardado,
          nombre: actualizado.nombre_usuario || usuarioGuardado.nombre,
          email: actualizado.email ?? usuarioGuardado.email,
        };
        localStorage.setItem("usuario", JSON.stringify(merged));
      } catch {
        // ignorar errores de parseo
      }

      setExitoPerfil(resp?.message || "Datos actualizados correctamente.");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setErrorPerfil(
        err?.response?.data?.message || "No se pudo actualizar el perfil."
      );
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorPassword("");
    setExitoPassword("");

    if (passwordForm.password_nueva !== passwordForm.password_confirmacion) {
      setErrorPassword("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    try {
      setGuardandoPassword(true);
      const resp = await cambiarMiPasswordService(passwordForm);
      setExitoPassword(resp?.message || "Contraseña actualizada correctamente.");
      setPasswordForm({
        password_actual: "",
        password_nueva: "",
        password_confirmacion: "",
      });
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      setErrorPassword(
        err?.response?.data?.message || "No se pudo cambiar la contraseña."
      );
    } finally {
      setGuardandoPassword(false);
    }
  };

  const inicial =
    (cuenta?.nombre_usuario || cuenta?.usuario || "?").charAt(0).toUpperCase();
  const nombreCompleto =
    `${cuenta?.nombre_usuario || ""} ${cuenta?.apellido_usuario || ""}`.trim() ||
    cuenta?.usuario ||
    "Usuario";

  if (cargando) {
    return (
      <div className="tm-mi-cuenta">
        <p className="tm-mi-cuenta__state">Cargando información...</p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="tm-mi-cuenta">
        <p className="tm-mi-cuenta__state tm-mi-cuenta__state--error">
          {errorCarga}
        </p>
        <button type="button" className="tm-mc-btn" onClick={cargarCuenta}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="tm-mi-cuenta">
      <header className="tm-mi-cuenta__header">
        <div>
          <span className="tm-mi-cuenta__eyebrow">Configuración</span>
          <h1>Mi cuenta</h1>
          <p>Gestiona tus datos personales y tu contraseña.</p>
        </div>
      </header>

      <section className="tm-mi-cuenta__user-card">
        <div className="tm-mi-cuenta__avatar">{inicial}</div>
        <div className="tm-mi-cuenta__user-info">
          <strong>{nombreCompleto}</strong>
          <span className="tm-mi-cuenta__user-meta">
            <CircleUser size={14} />
            {cuenta?.usuario}
          </span>
          {cuenta?.email && (
            <span className="tm-mi-cuenta__user-meta">
              <Mail size={14} />
              {cuenta.email}
            </span>
          )}
          <span className="tm-mi-cuenta__user-meta">
            <Shield size={14} />
            {cuenta?.nombre_rol || "Sin rol"}
          </span>
        </div>
      </section>

      <div className="tm-mi-cuenta__grid">
        <section className="tm-mi-cuenta__card">
          <div className="tm-mi-cuenta__card-head">
            <User size={18} />
            <div>
              <h2>Datos personales</h2>
              <p>Actualiza tu nombre, apellido y correo electrónico.</p>
            </div>
          </div>

          <form className="tm-mi-cuenta__form" onSubmit={handlePerfilSubmit}>
            <div className="tm-mi-cuenta__field">
              <label htmlFor="nombre_usuario">
                Nombre <span className="tm-mc-required">*</span>
              </label>
              <input
                id="nombre_usuario"
                type="text"
                value={perfilForm.nombre_usuario}
                onChange={(e) =>
                  setPerfilForm({
                    ...perfilForm,
                    nombre_usuario: e.target.value,
                  })
                }
                placeholder="Tu nombre"
                required
                maxLength={50}
              />
            </div>

            <div className="tm-mi-cuenta__field">
              <label htmlFor="apellido_usuario">
                Apellido <span className="tm-mc-required">*</span>
              </label>
              <input
                id="apellido_usuario"
                type="text"
                value={perfilForm.apellido_usuario}
                onChange={(e) =>
                  setPerfilForm({
                    ...perfilForm,
                    apellido_usuario: e.target.value,
                  })
                }
                placeholder="Tu apellido"
                required
                maxLength={50}
              />
            </div>

            <div className="tm-mi-cuenta__field tm-mi-cuenta__field--wide">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={perfilForm.email}
                onChange={(e) =>
                  setPerfilForm({ ...perfilForm, email: e.target.value })
                }
                placeholder="correo@ejemplo.com"
                maxLength={120}
              />
            </div>

            {errorPerfil && (
              <p className="tm-mi-cuenta__error" role="alert">
                {errorPerfil}
              </p>
            )}
            {exitoPerfil && (
              <p className="tm-mi-cuenta__success" role="status">
                {exitoPerfil}
              </p>
            )}

            <div className="tm-mi-cuenta__actions">
              <button
                type="submit"
                className="tm-mc-btn tm-mc-btn--primary"
                disabled={guardandoPerfil}
              >
                <Save size={16} />
                {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </section>

        <section className="tm-mi-cuenta__card">
          <div className="tm-mi-cuenta__card-head">
            <KeyRound size={18} />
            <div>
              <h2>Cambiar contraseña</h2>
              <p>
                Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un
                símbolo.
              </p>
            </div>
          </div>

          <form className="tm-mi-cuenta__form" onSubmit={handlePasswordSubmit}>
            <CampoPassword
              id="password_actual"
              label="Contraseña actual"
              value={passwordForm.password_actual}
              onChange={(v) =>
                setPasswordForm({ ...passwordForm, password_actual: v })
              }
              visible={verPasswords.actual}
              onToggle={() =>
                setVerPasswords((prev) => ({ ...prev, actual: !prev.actual }))
              }
              autoComplete="current-password"
              ancho="full"
            />

            <CampoPassword
              id="password_nueva"
              label="Nueva contraseña"
              value={passwordForm.password_nueva}
              onChange={(v) =>
                setPasswordForm({ ...passwordForm, password_nueva: v })
              }
              visible={verPasswords.nueva}
              onToggle={() =>
                setVerPasswords((prev) => ({ ...prev, nueva: !prev.nueva }))
              }
              autoComplete="new-password"
            />

            <CampoPassword
              id="password_confirmacion"
              label="Confirmar nueva contraseña"
              value={passwordForm.password_confirmacion}
              onChange={(v) =>
                setPasswordForm({
                  ...passwordForm,
                  password_confirmacion: v,
                })
              }
              visible={verPasswords.confirm}
              onToggle={() =>
                setVerPasswords((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              autoComplete="new-password"
            />

            {passwordForm.password_confirmacion &&
              passwordForm.password_nueva !==
                passwordForm.password_confirmacion && (
                <p className="tm-mi-cuenta__error">
                  Las contraseñas no coinciden.
                </p>
              )}

            {errorPassword && (
              <p className="tm-mi-cuenta__error" role="alert">
                {errorPassword}
              </p>
            )}
            {exitoPassword && (
              <p className="tm-mi-cuenta__success" role="status">
                {exitoPassword}
              </p>
            )}

            <div className="tm-mi-cuenta__actions">
              <button
                type="submit"
                className="tm-mc-btn tm-mc-btn--primary"
                disabled={guardandoPassword}
              >
                <Lock size={16} />
                {guardandoPassword ? "Guardando..." : "Cambiar contraseña"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function CampoPassword({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
  ancho,
}) {
  return (
    <div
      className={`tm-mi-cuenta__field ${
        ancho === "full" ? "tm-mi-cuenta__field--wide" : ""
      }`}
    >
      <label htmlFor={id}>
        {label} <span className="tm-mc-required">*</span>
      </label>
      <div className="tm-mi-cuenta__password-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
        />
        <button
          type="button"
          className="tm-mi-cuenta__password-toggle"
          onClick={onToggle}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
