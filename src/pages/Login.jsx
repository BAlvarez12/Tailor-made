import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './Login.css'
import logoTailorMade from '../assets/logo-tailor-made.png'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import {
  loginService,
  solicitarRecuperacionService,
  reenviarRecuperacionService,
  verificarCodigoRecuperacionService,
  restablecerPasswordService,
  activarCuentaService,
  validarPasswordRecuperacion,
  evaluarFortalezaPassword,
} from '../services/authService'

const VISTAS = {
  LOGIN: 'login',
  ACTIVAR_CUENTA: 'activar-cuenta',
  RECUPERAR_USUARIO: 'recuperar-usuario',
  RECUPERAR_CODIGO: 'recuperar-codigo',
  RECUPERAR_PASSWORD: 'recuperar-password',
}

const formatearTiempo = (segundos) => {
  const total = Math.max(0, segundos)
  const min = Math.floor(total / 60)
  const sec = total % 60
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
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
    codigo: '',
    tokenId: null,
    password: '',
    passwordConfirm: '',
  })
  const [activacion, setActivacion] = useState({
    usuario: '',
    tokenId: null,
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
  const [expiresAt, setExpiresAt] = useState(null)
  const [segundosRestantes, setSegundosRestantes] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [bloqueado, setBloqueado] = useState(false)

  const codigoVencido = segundosRestantes <= 0 && Boolean(expiresAt)

  useEffect(() => {
    if (searchParams.get('activar') !== '1') return

    const usuario = searchParams.get('usuario') || ''
    const tokenId = searchParams.get('tokenId')

    if (usuario && tokenId) {
      setActivacion({
        usuario,
        tokenId: Number(tokenId) || tokenId,
        password: '',
        passwordConfirm: '',
      })
      setVista(VISTAS.ACTIVAR_CUENTA)
    }
  }, [searchParams])

  useEffect(() => {
    if (!expiresAt) {
      setSegundosRestantes(0)
      return undefined
    }

    const actualizar = () => {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000)
      setSegundosRestantes(diff > 0 ? diff : 0)
    }

    actualizar()
    const intervalo = setInterval(actualizar, 1000)
    return () => clearInterval(intervalo)
  }, [expiresAt])

  const limpiarMensajes = () => {
    setError('')
    setInfo('')
  }

  const volverAlLogin = () => {
    setVista(VISTAS.LOGIN)
    setRecuperacion({
      usuario: '',
      codigo: '',
      tokenId: null,
      password: '',
      passwordConfirm: '',
    })
    setActivacion({
      usuario: '',
      tokenId: null,
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
    setExpiresAt(null)
    if (searchParams.get('activar')) {
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
    let valor = value

    if (name === 'codigo') {
      valor = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
    }

    setRecuperacion((prev) => ({ ...prev, [name]: valor }))
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

  const aplicarRespuestaCodigo = (data) => {
    if (data?.expiresAt) {
      setExpiresAt(data.expiresAt)
    }
    setInfo(
      data?.message ||
        'Si el usuario está registrado, enviamos un código a la dirección de correo asociada.'
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
      navigate('/home')
    } catch (err) {
      const data = err.response?.data
      setError(data?.message || 'No se pudo iniciar sesión. Verifica tus credenciales.')
      setBloqueado(Boolean(data?.bloqueado))
    } finally {
      setLoading(false)
    }
  }

  const handleSolicitarCodigo = async (e) => {
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
      aplicarRespuestaCodigo(data)
      setRecuperacion((prev) => ({
        ...prev,
        usuario: identificador,
        codigo: '',
        tokenId: null,
      }))
      setVista(VISTAS.RECUPERAR_CODIGO)
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  const handleReenviarCodigo = async () => {
    limpiarMensajes()
    setLoading(true)

    try {
      const data = await reenviarRecuperacionService(recuperacion.usuario.trim())
      aplicarRespuestaCodigo(data)
      setRecuperacion((prev) => ({ ...prev, codigo: '', tokenId: null }))
      setInfo(
        (data?.message || 'Código reenviado.')
      )
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo reenviar el código.')
    } finally {
      setLoading(false)
    }
  }

  const handleValidarCodigo = async (e) => {
    e.preventDefault()
    limpiarMensajes()

    if (codigoVencido) {
      setError('El código venció. Solicita uno nuevo con «Reenviar código».')
      return
    }

    const codigo = recuperacion.codigo.trim()
    if (codigo.length < 8) {
      setError('Ingresa el código alfanumérico de 8 caracteres.')
      return
    }

    setLoading(true)

    try {
      const data = await verificarCodigoRecuperacionService(
        recuperacion.usuario.trim(),
        codigo
      )

      if (data?.expiresAt) {
        setExpiresAt(data.expiresAt)
      }

      setRecuperacion((prev) => ({
        ...prev,
        usuario: data.usuario || prev.usuario,
        tokenId: data.tokenId,
      }))
      setVista(VISTAS.RECUPERAR_PASSWORD)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'El código no es válido o ya no está vigente.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRestablecerPassword = async (e) => {
    e.preventDefault()
    limpiarMensajes()

    if (codigoVencido) {
      setError('El código venció. Solicita uno nuevo con «Reenviar código».')
      return
    }

    if (!recuperacion.tokenId) {
      setError('Debes verificar el código antes de continuar.')
      setVista(VISTAS.RECUPERAR_CODIGO)
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
        codigo: recuperacion.codigo.trim(),
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
          'No se pudo restablecer la contraseña. Verifica el código e intenta de nuevo.'
      )
      if (data?.codigoInvalido) {
        setRecuperacion((prev) => ({ ...prev, tokenId: null, codigo: '' }))
        setVista(VISTAS.RECUPERAR_CODIGO)
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
      case VISTAS.RECUPERAR_CODIGO:
        return 'Verificar código'
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
        return 'Ingresa tu usuario o correo electrónico. Si la cuenta existe, enviaremos un código.'
      case VISTAS.RECUPERAR_CODIGO:
        return 'Revisa tu bandeja de entrada e ingresa el código.'
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
              <form className="tm-auth__form" onSubmit={handleSolicitarCodigo}>
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
                  cuenta. Si existe, recibirás el código en ese correo.
                </p>

                {error && <div className="tm-auth__error">{error}</div>}
                {info && <div className="tm-auth__info">{info}</div>}

                <button
                  type="submit"
                  className="tm-auth__button"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar código'}
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

            {vista === VISTAS.RECUPERAR_CODIGO && (
              <form className="tm-auth__form" onSubmit={handleValidarCodigo}>
                <div className="tm-auth__timer">
                  <span>Tiempo restante del código</span>
                  <strong className={codigoVencido ? 'is-expired' : ''}>
                    {formatearTiempo(segundosRestantes)}
                  </strong>
                  {codigoVencido && (
                    <p className="tm-auth__timer-warning">
                      El código venció. Usa «Reenviar código» para obtener uno nuevo.
                    </p>
                  )}
                </div>

                <div className="tm-auth__field">
                  <label htmlFor="rec-codigo">Código de verificación</label>
                  <input
                    id="rec-codigo"
                    type="text"
                    name="codigo"
                    value={recuperacion.codigo}
                    onChange={handleRecuperacionChange}
                    placeholder="Ingresa el código"
                    maxLength={8}
                    autoComplete="one-time-code"
                    disabled={loading}
                  />
                </div>

                {error && <div className="tm-auth__error">{error}</div>}
                {info && <div className="tm-auth__info">{info}</div>}

                <button
                  type="submit"
                  className="tm-auth__button"
                  disabled={loading || codigoVencido}
                >
                  {loading ? 'Verificando...' : 'Continuar'}
                </button>

                <button
                  type="button"
                  className="tm-auth__button tm-auth__button--secondary"
                  onClick={handleReenviarCodigo}
                  disabled={loading}
                >
                  {loading ? 'Reenviando...' : 'Reenviar código'}
                </button>

                <button
                  type="button"
                  className="tm-auth__link-button"
                  onClick={() => {
                    limpiarMensajes()
                    setVista(VISTAS.RECUPERAR_USUARIO)
                  }}
                  disabled={loading}
                >
                  Cambiar usuario o correo
                </button>
              </form>
            )}

            {vista === VISTAS.RECUPERAR_PASSWORD && (
              <form className="tm-auth__form" onSubmit={handleRestablecerPassword}>
                <div className="tm-auth__timer">
                  <span>Tiempo restante del código</span>
                  <strong className={codigoVencido ? 'is-expired' : ''}>
                    {formatearTiempo(segundosRestantes)}
                  </strong>
                </div>

                <CampoPassword
                  id="rec-password"
                  name="password"
                  label="Nueva contraseña"
                  value={recuperacion.password}
                  onChange={handleRecuperacionChange}
                  placeholder="Mín. 8 caracteres"
                  autoComplete="new-password"
                  disabled={loading || codigoVencido}
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
                  disabled={loading || codigoVencido}
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
                  disabled={loading || codigoVencido}
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
