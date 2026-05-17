import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const MAIN_MENU_ITEMS = [
  { label: 'Home', path: '/home', exact: true },
  { label: 'Clientes', path: '/home/clientes', exact: true },
  { label: 'Cotizaciones', path: '/home/cotizaciones', exact: true },
  { label: 'Pagos', path: '/home/pagos', exact: true },
  { label: 'Prendas', path: '/home/prendas', exact: false },
  { label: 'Materiales', path: '/home/materiales', exact: false }
]

const CONFIG_SUBMENU_ITEMS = [
  { label: 'Usuarios', path: '/home/configuracion/usuarios' },
  { label: 'Unidades de medida', path: '/home/configuracion/unidades' },
  { label: 'Tipos de medida', path: '/home/configuracion/tipo-medidas' }
]

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || {}
  } catch {
    return {}
  }
}

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState({})

  const usuario = getStoredUser()
  const nombreUsuario = usuario.nombre || usuario.usuario || 'Usuario'
  const inicial = nombreUsuario.charAt(0).toUpperCase()

  const isActive = (path) => location.pathname === path
  const isGroupActive = (basePath) => location.pathname.startsWith(basePath)

  const isConfigOpen = openMenus.config ?? isGroupActive('/home/configuracion')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const handleNavigate = (path) => {
    navigate(path)
  }

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }))
  }

  const getItemClassName = (item) => {
    const active = item.exact ? isActive(item.path) : isGroupActive(item.path)
    return `tm-sidebar__item ${active ? 'tm-sidebar__item--active' : ''}`
  }

  return (
    <aside className="tm-sidebar">
      <div className="tm-sidebar__menu">
        <div className="tm-sidebar__brand">
          <h2>Tailor-Made</h2>
        </div>

        <nav className="tm-sidebar__nav">
          {MAIN_MENU_ITEMS.map((item) => (
            <button
              key={item.path}
              type="button"
              className={getItemClassName(item)}
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}

          <div className="tm-sidebar__group">
            <button
              type="button"
              className={`tm-sidebar__item tm-sidebar__item--with-arrow ${
                isGroupActive('/home/configuracion') ? 'tm-sidebar__item--active' : ''
              }`}
              onClick={() => toggleMenu('config')}
            >
              <span>Configuración</span>
              <span className={`tm-sidebar__arrow ${isConfigOpen ? 'tm-sidebar__arrow--open' : ''}`}>
                ▾
              </span>
            </button>

            {isConfigOpen && (
              <div className="tm-sidebar__submenu">
                {CONFIG_SUBMENU_ITEMS.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    className={`tm-sidebar__subitem ${
                      isActive(item.path) ? 'tm-sidebar__subitem--active' : ''
                    }`}
                    onClick={() => handleNavigate(item.path)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="tm-sidebar__footer">
        <div className="tm-sidebar__user-box">
          <div className="tm-sidebar__avatar">{inicial}</div>

          <div className="tm-sidebar__user-info">
            <strong>{nombreUsuario}</strong>
            <span>Sesión activa</span>
          </div>

          <button
            type="button"
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