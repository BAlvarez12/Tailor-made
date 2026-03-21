import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}

  const [configOpen, setConfigOpen] = useState(
    location.pathname.startsWith('/home/configuracion')
  )

  const nombreUsuario = usuario.nombre || usuario.usuario || 'Usuario'
  const inicial = nombreUsuario.charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const goTo = (path) => {
    navigate(path)
  }

  const isActive = (path) => location.pathname === path
  const isConfigActive = location.pathname.startsWith('/home/configuracion')

  return (
    <aside className="tm-sidebar">
      <div className="tm-sidebar__menu">
        <div className="tm-sidebar__brand">
          <h2>Tailor-Made</h2>
        </div>

        <nav className="tm-sidebar__nav">

          <button
            className={`tm-sidebar__item ${isActive('/home') ? 'tm-sidebar__item--active' : ''}`}
            onClick={() => goTo('/home')}
          >
            Home
          </button>

          <button
            className={`tm-sidebar__item ${isActive('/home/clientes') ? 'tm-sidebar__item--active' : ''}`}
            onClick={() => goTo('/home/clientes')}
          >
            Clientes
          </button>

          <button
            className={`tm-sidebar__item ${isActive('/home/cotizaciones') ? 'tm-sidebar__item--active' : ''}`}
            onClick={() => goTo('/home/cotizaciones')}
          >
            Cotizaciones
          </button>

          <button
            className={`tm-sidebar__item ${isActive('/home/pedidos') ? 'tm-sidebar__item--active' : ''}`}
            onClick={() => goTo('/home/pedidos')}
          >
            Pedidos
          </button>

          {/* CONFIGURACIÓN */}
          <div className="tm-sidebar__group">
            <button
              className={`tm-sidebar__item tm-sidebar__item--with-arrow ${isConfigActive ? 'tm-sidebar__item--active' : ''}`}
              onClick={() => setConfigOpen(!configOpen)}
            >
              <span>Configuración</span>
              <span className={`tm-sidebar__arrow ${configOpen ? 'tm-sidebar__arrow--open' : ''}`}>
                ▾
              </span>
            </button>

            {configOpen && (
              <div className="tm-sidebar__submenu">

                <button
                  className={`tm-sidebar__subitem ${
                    isActive('/home/configuracion/usuarios')
                      ? 'tm-sidebar__subitem--active'
                      : ''
                  }`}
                  onClick={() => goTo('/home/configuracion/usuarios')}
                >
                  Usuarios
                </button>

                <button
                  className={`tm-sidebar__subitem ${
                    isActive('/home/configuracion/unidades')
                      ? 'tm-sidebar__subitem--active'
                      : ''
                  }`}
                  onClick={() => goTo('/home/configuracion/unidades')}
                >
                  Unidades de medida
                </button>

                <button
                  className={`tm-sidebar__subitem ${
                    isActive('/home/configuracion/tipo-medidas')
                      ? 'tm-sidebar__subitem--active'
                      : ''
                  }`}
                  onClick={() => goTo('/home/configuracion/tipo-medidas')}
                >
                  Tipos de medida
                </button>

              </div>
            )}
          </div>

        </nav>
      </div>

      {/* FOOTER */}
      <div className="tm-sidebar__footer">
        <div className="tm-sidebar__user-box">
          <div className="tm-sidebar__avatar">{inicial}</div>

          <div className="tm-sidebar__user-info">
            <strong>{nombreUsuario}</strong>
            <span>Sesión activa</span>
          </div>

          <button
            className="tm-sidebar__logout"
            onClick={handleLogout}
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar