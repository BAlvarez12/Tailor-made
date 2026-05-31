import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Login.css'
import logoTailorMade from '../assets/logo-tailor-made.png'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import {
  loginService,
  solicitarRecuperacionService,
  reenviarRecuperacionService,
  verificarEnlaceRecuperacionService,
  restablecerPasswordService,
  activarCuentaService,
  validarPasswordRecuperacion,
  evaluarFortalezaPassword,
} from '../services/authService'

const VISTAS = {
  LOGIN: 'login',
  ACTIVAR_CUENTA: 'activar-cuenta',
  RECUPERAR_USUARIO: 'recuperar-usuario',
  RECUPERAR_ENVIADO: 'recuperar-enviado',
  RECUPERAR_PASSWORD: 'recuperar-password',
}

const REGLAS_PASSWORD_LABELS = [
  { key: 'minimo8', label: 'Mínimo 8 caracteres' },
  { key: 'minuscula', label: 'Una letra minúscula' },
  { key: 'mayuscula', label: 'Una letra mayúscula' },
  { key: 'numero', label: 'Al menos un número' },
  { key: 'simbolo', label: 'Al menos un símbolo' },
]

function CampoPassword({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  visible,
  onToggleVisible,
}) {
  return (
    <div className="tm-auth__field tm-auth__field--password">
      <label htmlFor={id}>{label}</label>
      <div className="tm-auth__password-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        <button
          type="button"
          className="tm-auth__password-toggle"
          onClick={onToggleVisible}
          disabled={disabled}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}

function PanelFortalezaPassword({ password }) {
  const analisis = useMemo(() => evaluarFortalezaPassword(password), [password])

  if (!password) return null

  const anchoBarra =
    analisis.nivel === 'alta' ? '100%' : analisis.nivel === 'media' ? '66%' : '33%'

  return (
    <div className={`tm-auth__strength tm-auth__strength--${analisis.nivel}`}>
      <div className="tm-auth__strength-header">
        <span>Seguridad de la contraseña</span>
        <strong>{analisis.etiqueta}</strong>
      </div>
      <div className="tm-auth__strength-track">
        <div
          className="tm-auth__strength-fill"
          style={{ width: anchoBarra }}
        />
      </div>
      <ul className="tm-auth__strength-rules">
        {REGLAS_PASSWORD_LABELS.map((regla) => {
          const cumple = analisis.reglas[regla.key]
          return (
            <li key={regla.key} className={cumple ? 'is-ok' : 'is-pending'}>
              {cumple ? <Check size={14} /> : <X size={14} />}
              {regla.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Login() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [vista, setVista] = useState(VISTAS.LOGIN)
  const [form, setForm] = useState({ usuario: '', password: '' })
  const [recuperacion, setRecuperacion] = useState({
    usuario: '',
    token: '',
    tokenId: null,
    password: '',
    passwordConfirm: '',
  })
  const [verificandoEnlace, setVerificandoEnlace] = useState(false)
  const [enlaceInvalido, setEnlaceInvalido] = useState(false)
  const [activacion, setActivacion] = useState({
    usuario: '',
    tokenId: null,
    token: '',
    password: '',
    passwordConfirm: '',
  })
  const [mostrarPassword, setMostrarPassword] = useState({
    login: false,
    nueva: false,
    confirmar: false,
    activarNueva: false,
    activarConfirmar: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [bloqueado, setBloqueado] = useState(false)
  const [iniciandoSesion, setIniciandoSesion] = useState(false)

  useEffect(() => {
    if (searchParams.get('activar') !== '1') return

    const usuario = searchParams.get('usuario') || ''
    const tokenId = searchParams.get('tokenId')
    const token = searchParams.get('token') || ''

    if (usuario && tokenId) {
      setActivacion({
        usuario,
        tokenId: Number(tokenId) || tokenId,
        token,
        password: '',
        passwordConfirm: '',
      })
      setVista(VISTAS.ACTIVAR_CUENTA)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.get('recuperar') !== '1') return

    const usuario = searchParams.get('usuario') || ''
    const tokenId = searchParams.get('tokenId')
    const token = searchParams.get('token')

    if (!usuario || !tokenId || !token) return

    setRecuperacion({
      usuario,
      token,
      tokenId: Number(tokenId) || tokenId,
      password: '',
      passwordConfirm: '',
    })
    setVista(VISTAS.RECUPERAR_PASSWORD)
    setEnlaceInvalido(false)
    setVerificandoEnlace(true)
    setError('')
    setInfo('')

    verificarEnlaceRecuperacionService({
      identificador: usuario,
      tokenId,
      token,
    })
      .then((data) => {
        setRecuperacion((prev) => ({
          ...prev,
          usuario: data?.usuario || prev.usuario,
        }))
      })
      .catch((err) => {
        setEnlaceInvalido(true)
        setError(
          err.response?.data?.message ||
            'El enlace no es válido, ya venció o fue utilizado. Solicita uno nuevo.'
        )
      })
      .finally(() => {
        setVerificandoEnlace(false)
      })
  }, [searchParams])

  const limpiarMensajes = () => {
    setError('')
    setInfo('')
  }

  const volverAlLogin = () => {
    setVista(VISTAS.LOGIN)
    setRecuperacion({
      usuario: '',
      token: '',
      tokenId: null,
      password: '',
      passwordConfirm: '',
    })
    setActivacion({
      usuario: '',
      tokenId: null,
      token: '',
      password: '',
      passwordConfirm: '',
    })
    setMostrarPassword({
      login: false,
      nueva: false,
      confirmar: false,
      activarNueva: false,
      activarConfirmar: false,
    })
    setEnlaceInvalido(false)
    setVerificandoEnlace(false)
    if (searchParams.get('activar') || searchParams.get('recuperar')) {
      setSearchParams({}, { replace: true })
    }
    limpiarMensajes()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    limpiarMensajes()
    if (bloqueado) setBloqueado(false)
  }

  const handleRecuperacionChange = (e) => {
    const { name, value } = e.target
    setRecuperacion((prev) => ({ ...prev, [name]: value }))
    limpiarMensajes()
  }

  const handleActivacionChange = (e) => {
    const { name, value } = e.target
    setActivacion((prev) => ({ ...prev, [name]: value }))
    limpiarMensajes()
  }

  const handleActivarCuenta = async (e) => {
    e.preventDefault()
    limpiarMensajes()

    const errorPassword = validarPasswordRecuperacion(activacion.password)
    if (errorPassword) {
      setError(errorPassword)
      return
    }

    if (activacion.password !== activacion.passwordConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const data = await activarCuentaService({
        usuario: activacion.usuario,
        tokenId: activacion.tokenId,
        token: activacion.token,
        password: activacion.password,
        passwordConfirm: activacion.passwordConfirm,
      })

      setInfo(data?.message || 'Cuenta activada correctamente.')
      setForm((prev) => ({
        ...prev,
        usuario: activacion.usuario,
        password: '',
      }))
      volverAlLogin()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'No se pudo activar la cuenta. El enlace puede haber vencido.'
      )
    } finally {
      setLoading(false)
    }
  }

  const aplicarRespuestaEnlace = (data) => {
    setInfo(
      data?.message ||
        'Si el usuario está registrado, enviamos un enlace para restablecer la contraseña al correo asociado.'
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (bloqueado) return

    limpiarMensajes()
    setLoading(true)

    try {
      const data = await loginService(form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      setIniciandoSesion(true)
      setTimeout(() => {
        navigate('/home')
      }, 2000)
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || 'No se pudo iniciar sesión. Verifica tus credenciales.')
      setBloqueado(Boolean(data?.bloqueado))
      setLoading(false)
    }
  }

  const handleSolicitarEnlace = async (e) => {
    e.preventDefault()
    limpiarMensajes()
    setLoading(true)

    try {
      const identificador = recuperacion.usuario.trim()
      if (!identificador) {
        setError('Ingresa tu usuario o correo electrónico.')
        return
      }

      const data = await solicitarRecuperacionService(identificador)
      aplicarRespuestaEnlace(data)
      setRecuperacion((prev) => ({
        ...prev,
        usuario: identificador,
        token: '',
        tokenId: null,
      }))
      setVista(VISTAS.RECUPERAR_ENVIADO)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  const handleReenviarEnlace = async () => {
    limpiarMensajes()
    setLoading(true)

    try {
      const data = await reenviarRecuperacionService(recuperacion.usuario.trim())
      aplicarRespuestaEnlace(data)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo reenviar el enlace.')
    } finally {
      setLoading(false)
    }
  }

  const handleRestablecerPassword = async (e) => {
    e.preventDefault()
    limpiarMensajes()

    if (enlaceInvalido || !recuperacion.tokenId || !recuperacion.token) {
      setError('El enlace no es válido o ya venció. Solicita uno nuevo.')
      return
    }

    const errorPassword = validarPasswordRecuperacion(recuperacion.password)
    if (errorPassword) {
      setError(errorPassword)
      return
    }

    if (recuperacion.password !== recuperacion.passwordConfirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      const data = await restablecerPasswordService({
        identificador: recuperacion.usuario.trim(),
        usuario: recuperacion.usuario.trim(),
        token: recuperacion.token,
        tokenId: recuperacion.tokenId,
        password: recuperacion.password,
        passwordConfirm: recuperacion.passwordConfirm,
      })

      setInfo(data?.message || 'Contraseña actualizada correctamente.')
      setForm((prev) => ({
        ...prev,
        usuario: recuperacion.usuario.trim(),
        password: '',
      }))
      volverAlLogin()
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.message ||
          'No se pudo restablecer la contraseña. El enlace puede haber vencido.'
      )
      if (data?.enlaceInvalido) {
        setEnlaceInvalido(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const tituloVista = useMemo(() => {
    switch (vista) {
      case VISTAS.ACTIVAR_CUENTA:
        return 'Activar cuenta'
      case VISTAS.RECUPERAR_USUARIO:
        return 'Recuperar acceso'
      case VISTAS.RECUPERAR_ENVIADO:
        return 'Revisa tu correo'
      case VISTAS.RECUPERAR_PASSWORD:
        return 'Nueva contraseña'
      default:
        return 'Iniciar sesión'
    }
  }, [vista])

  const subtituloVista = useMemo(() => {
    switch (vista) {
      case VISTAS.ACTIVAR_CUENTA:
        return 'Configura tu contraseña para acceder a Tailor-Made.'
      case VISTAS.RECUPERAR_USUARIO:
        return 'Ingresa tu usuario o correo electrónico. Si la cuenta existe, enviaremos un enlace.'
      case VISTAS.RECUPERAR_ENVIADO:
        return 'Te enviamos un enlace para crear una nueva contraseña.'
      case VISTAS.RECUPERAR_PASSWORD:
        return 'Crea una contraseña segura y confírmala para finalizar.'
      default:
        return 'Ingresa tus credenciales para continuar.'
    }
  }, [vista])

  const eyebrowVista = useMemo(() => {
    if (vista === VISTAS.LOGIN) return 'Bienvenido'
    if (vista === VISTAS.ACTIVAR_CUENTA) return 'Invitación'
    return 'Recuperación'
  }, [vista])

  return (
    <div className="tm-auth">
      {iniciandoSesion && (
        <div className="tm-loader-overlay" role="status" aria-live="polite">
          <div className="tm-loader-content">
            <svg
              className="tm-loader-svg"
              viewBox="0 0 320 140"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="tm-thread-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>

              {/* Línea guía de la tela */}
              <line
                x1="30" y1="95" x2="290" y2="95"
                stroke="#475569"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.4"
              />

              {/* Puntada en zigzag que se va dibujando */}
              <path
                className="tm-loader-stitches"
                d="M 30 95 L 47 80 L 64 95 L 81 80 L 98 95 L 115 80 L 132 95 L 149 80 L 166 95 L 183 80 L 200 95 L 217 80 L 234 95 L 251 80 L 268 95 L 285 80 L 290 95"
                stroke="url(#tm-thread-grad)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Aguja con hilo */}
              <g className="tm-loader-needle">
                <path
                  d="M 0 -28 Q -14 -38, -28 -30"
                  stroke="#a78bfa"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <line
                  x1="0" y1="-28" x2="0" y2="6"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="0" cy="-26" rx="2.5" ry="3.5"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1.2"
                />
                <polygon
                  points="0,8 -1.5,4 1.5,4"
                  fill="#7c3aed"
                />
              </g>

              {/* Carrete de hilo girando */}
              <g className="tm-loader-spool" transform="translate(295, 40)">
                <ellipse cx="0" cy="-10" rx="14" ry="3" fill="#475569" />
                <rect x="-12" y="-10" width="24" height="20" rx="2" fill="url(#tm-thread-grad)" />
                <ellipse cx="0" cy="10" rx="14" ry="3" fill="#475569" />
                <line x1="-10" y1="-6" x2="10" y2="-6" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />
                <line x1="-10" y1="0" x2="10" y2="0" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />
                <line x1="-10" y1="6" x2="10" y2="6" stroke="#1e293b" strokeWidth="0.5" opacity="0.3" />
              </g>
            </svg>

            <h3 className="tm-loader-title">
              Iniciando costuras<span className="tm-loader-dots">
                <span>.</span><span>.</span><span>.</span>
              </span>
            </h3>
            <p className="tm-loader-subtitle">Preparando tu espacio de trabajo</p>
          </div>
        </div>
      )}

      <div className="tm-auth__layout">
        <section className="tm-auth__showcase">
          <div className="tm-auth__bg-shape tm-auth__bg-shape--one"></div>
          <div className="tm-auth__bg-shape tm-auth__bg-shape--two"></div>
          <div className="tm-auth__grid"></div>

          <div className="tm-auth__showcase-content">
            <div className="tm-auth__logo-wrap">
              <img
                src={logoTailorMade}
                alt="Tailor-Made"
                className="tm-auth__logo"
              />
            </div>

            <div className="tm-auth__copy">
              <h1>Acceso a tu plataforma</h1>
              <p>
                Un espacio moderno para gestionar tu operación con orden,
                claridad y una experiencia profesional.
              </p>
            </div>
          </div>
        </section>

        <section className="tm-auth__panel">
          <div className="tm-auth__card">
            {/* Logo solo visible en mobile (oculto en desktop por CSS) */}
            <div className="tm-auth__brand">
              <img
                src={logoTailorMade}
                alt="Tailor-Made"
                className="tm-auth__brand-logo"
              />
            </div>

            <div className="tm-auth__header">
              <span className="tm-auth__eyebrow">{eyebrowVista}</span>
              <h2>{tituloVista}</h2>
              <p>{subtituloVista}</p>
            </div>

            {vista === VISTAS.ACTIVAR_CUENTA && (
              <form className="tm-auth__form" onSubmit={handleActivarCuenta}>
                <div className="tm-auth__field">
                  <label htmlFor="act-usuario">Usuario</label>
                  <input
                    id="act-usuario"
                    type="text"
                    name="usuario"
                    value={activacion.usuario}
                    readOnly
                    disabled
                  />
                </div>

                <CampoPassword
                  id="act-password"
                  name="password"
                  label="Contraseña"
                  value={activacion.password}
                  onChange={handleActivacionChange}
                  placeholder="Mín. 8 caracteres"
                  autoComplete="new-password"
                  disabled={loading}
                  visible={mostrarPassword.activarNueva}
                  onToggleVisible={() =>
                    setMostrarPassword((prev) => ({
                      ...prev,
                      activarNueva: !prev.activarNueva,
                    }))
                  }
                />

                <PanelFortalezaPassword password={activacion.password} />

                <CampoPassword
                  id="act-password-confirm"
                  name="passwordConfirm"
                  label="Confirmar contraseña"
                  value={activacion.passwordConfirm}
                  onChange={handleActivacionChange}
                  placeholder="Repite la contraseña"
                  autoComplete="new-password"
                  disabled={loading}
                  visible={mostrarPassword.activarConfirmar}
                  onToggleVisible={() =>
                    setMostrarPassword((prev) => ({
                      ...prev,
                      activarConfirmar: !prev.activarConfirmar,
                    }))
                  }
                />

                {activacion.passwordConfirm &&
                  activacion.password !== activacion.passwordConfirm && (
                    <p className="tm-auth__match-error">Las contraseñas no coinciden.</p>
                  )}

                <p className="tm-auth__hint">
                  Este enlace es válido por 72 horas. Si venció, pide al administrador
                  que reenvíe la invitación.
                </p>

                {error && <div className="tm-auth__error">{error}</div>}
                {info && <div className="tm-auth__info">{info}</div>}

                <button type="submit" className="tm-auth__button" disabled={loading}>
                  {loading ? 'Activando...' : 'Activar cuenta'}
                </button>

                <button
                  type="button"
                  className="tm-auth__link-button"
                  onClick={volverAlLogin}
                  disabled={loading}
                >
                  Volver al inicio de sesión
                </button>
              </form>
            )}

            {vista === VISTAS.LOGIN && (
              <form className="tm-auth__form" onSubmit={handleSubmit}>
                <div className="tm-auth__field">
                  <label htmlFor="usuario">Usuario</label>
                  <input
                    id="usuario"
                    type="text"
                    name="usuario"
                    value={form.usuario}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                    autoComplete="username"
                    disabled={bloqueado || loading}
                  />
                </div>

                <CampoPassword
                  id="password"
                  name="password"
                  label="Contraseña"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  disabled={bloqueado || loading}
                  visible={mostrarPassword.login}
                  onToggleVisible={() =>
                    setMostrarPassword((prev) => ({ ...prev, login: !prev.login }))
                  }
                />

                {error && <div className="tm-auth__error">{error}</div>}
                {info && <div className="tm-auth__info">{info}</div>}

                <button
                  type="submit"
                  className="tm-auth__button"
                  disabled={loading || bloqueado}
                >
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>

                <button
                  type="button"
                  className="tm-auth__link-button"
                  onClick={() => {
                    limpiarMensajes()
                    setRecuperacion((prev) => ({
                      ...prev,
                      usuario: form.usuario,
                    }))
                    setVista(VISTAS.RECUPERAR_USUARIO)
                  }}
                  disabled={loading}
                >
                  Olvidé mi contraseña
                </button>
              </form>
            )}

            {vista === VISTAS.RECUPERAR_USUARIO && (
              <form className="tm-auth__form" onSubmit={handleSolicitarEnlace}>
                <div className="tm-auth__field">
                  <label htmlFor="rec-usuario">Usuario o correo electrónico</label>
                  <input
                    id="rec-usuario"
                    type="text"
                    name="usuario"
                    value={recuperacion.usuario}
                    onChange={handleRecuperacionChange}
                    placeholder="usuario o correo@ejemplo.com"
                    autoComplete="username email"
                    disabled={loading}
                  />
                </div>

                <p className="tm-auth__hint">
                  Puedes usar tu nombre de usuario o el correo registrado en la
                  cuenta. Si existe, recibirás un enlace en ese correo para
                  crear una nueva contraseña.
                </p>

                {error && <div className="tm-auth__error">{error}</div>}
                {info && <div className="tm-auth__info">{info}</div>}

                <button
                  type="submit"
                  className="tm-auth__button"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>

                <button
                  type="button"
                  className="tm-auth__link-button"
                  onClick={volverAlLogin}
                  disabled={loading}
                >
                  Volver al inicio de sesión
                </button>
              </form>
            )}

            {vista === VISTAS.RECUPERAR_ENVIADO && (
              <div className="tm-auth__form">
                <p className="tm-auth__hint">
                  Si la cuenta existe, enviamos un enlace para restablecer la
                  contraseña al correo asociado. Ábrelo desde el mismo
                  dispositivo y crea tu nueva contraseña. El enlace es válido por
                  <strong> 30 minutos</strong> y solo puede usarse una vez.
                </p>

                <p className="tm-auth__hint">
                  ¿No te llegó? Revisa la carpeta de spam o solicita un nuevo
                  enlace.
                </p>

                {error && <div className="tm-auth__error">{error}</div>}
                {info && <div className="tm-auth__info">{info}</div>}

                <button
                  type="button"
                  className="tm-auth__button tm-auth__button--secondary"
                  onClick={handleReenviarEnlace}
                  disabled={loading}
                >
                  {loading ? 'Reenviando...' : 'Reenviar enlace'}
                </button>

                <button
                  type="button"
                  className="tm-auth__link-button"
                  onClick={volverAlLogin}
                  disabled={loading}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            )}

            {vista === VISTAS.RECUPERAR_PASSWORD && (
              <form className="tm-auth__form" onSubmit={handleRestablecerPassword}>
                {verificandoEnlace && (
                  <p className="tm-auth__hint">Validando el enlace…</p>
                )}

                {enlaceInvalido ? (
                  <>
                    {error && <div className="tm-auth__error">{error}</div>}
                    <button
                      type="button"
                      className="tm-auth__button"
                      onClick={() => {
                        limpiarMensajes()
                        setEnlaceInvalido(false)
                        setVista(VISTAS.RECUPERAR_USUARIO)
                      }}
                      disabled={loading}
                    >
                      Solicitar un nuevo enlace
                    </button>
                    <button
                      type="button"
                      className="tm-auth__link-button"
                      onClick={volverAlLogin}
                      disabled={loading}
                    >
                      Volver al inicio de sesión
                    </button>
                  </>
                ) : (
                  <>
                    <CampoPassword
                      id="rec-password"
                      name="password"
                      label="Nueva contraseña"
                      value={recuperacion.password}
                      onChange={handleRecuperacionChange}
                      placeholder="Mín. 8 caracteres"
                      autoComplete="new-password"
                      disabled={loading || verificandoEnlace}
                      visible={mostrarPassword.nueva}
                      onToggleVisible={() =>
                        setMostrarPassword((prev) => ({ ...prev, nueva: !prev.nueva }))
                      }
                    />

                    <PanelFortalezaPassword password={recuperacion.password} />

                    <CampoPassword
                      id="rec-password-confirm"
                      name="passwordConfirm"
                      label="Confirmar contraseña"
                      value={recuperacion.passwordConfirm}
                      onChange={handleRecuperacionChange}
                      placeholder="Repite la contraseña"
                      autoComplete="new-password"
                      disabled={loading || verificandoEnlace}
                      visible={mostrarPassword.confirmar}
                      onToggleVisible={() =>
                        setMostrarPassword((prev) => ({
                          ...prev,
                          confirmar: !prev.confirmar,
                        }))
                      }
                    />

                    {recuperacion.passwordConfirm &&
                      recuperacion.password !== recuperacion.passwordConfirm && (
                        <p className="tm-auth__match-error">Las contraseñas no coinciden.</p>
                      )}

                    {error && <div className="tm-auth__error">{error}</div>}
                    {info && <div className="tm-auth__info">{info}</div>}

                    <button
                      type="submit"
                      className="tm-auth__button"
                      disabled={loading || verificandoEnlace}
                    >
                      {loading ? 'Guardando...' : 'Restablecer contraseña'}
                    </button>

                    <button
                      type="button"
                      className="tm-auth__link-button"
                      onClick={volverAlLogin}
                      disabled={loading}
                    >
                      Volver al inicio de sesión
                    </button>
                  </>
                )}
              </form>
            )}

            <p className="tm-auth__powered">
              Powered by <span>Ingeniosos S.A.</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
