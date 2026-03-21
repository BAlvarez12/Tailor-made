import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import logoTailorMade from '../assets/logo-tailor-made.png'
import { loginService } from '../services/authService'

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    usuario: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginService(form)

      console.log('Respuesta login:', data)

      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      navigate('/home')
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          'No se pudo iniciar sesión. Verifica tus credenciales.'
      )
    } finally {
      setLoading(false)
    }
  }

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
              <span className="tm-auth__eyebrow">Bienvenido</span>
              <h2>Iniciar sesión</h2>
              <p>Ingresa tus credenciales para continuar.</p>
            </div>

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
                />
              </div>

              <div className="tm-auth__field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
              </div>

              {error && <div className="tm-auth__error">{error}</div>}

              <button
                type="submit"
                className="tm-auth__button"
                disabled={loading}
              >
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
              </button>
            </form>

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