import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {}

  const nombreUsuario = usuario.nombre || usuario.usuario || 'Usuario'
  const inicial = nombreUsuario.charAt(0).toUpperCase()

  const [openMenus, setOpenMenus] = useState({})

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const goTo = (path) => {
    navigate(path)
  }

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }))
  }

  const isActive = (path) => location.pathname === path
  const isGroupActive = (base) => location.pathname.startsWith(base)

  // 🔥 CORRECCIÓN (AQUÍ ESTABA EL ERROR)
  const isMaterialesActive = isGroupActive('/home/materiales')

  return (
    <aside className="tm-sidebar">
      <div className="tm-sidebar__menu">
        <div className="tm-sidebar__brand">
          <h2>Tailor-Made</h2>
        </div>

        <nav className="tm-sidebar__nav">

          {/* HOME */}
          <button
            className={`tm-sidebar__item ${isActive('/home') ? 'tm-sidebar__item--active' : ''}`}
            type="button"
            onClick={() => goTo('/home')}
          >
            Home
          </button>

          {/* CLIENTES */}
          <button
            className={`tm-sidebar__item ${isActive('/home/clientes') ? 'tm-sidebar__item--active' : ''}`}
            type="button"
            onClick={() => goTo('/home/clientes')}
          >
            Clientes
          </button>

          {/* COTIZACIONES */}
          <button
            className={`tm-sidebar__item ${isActive('/home/cotizaciones') ? 'tm-sidebar__item--active' : ''}`}
            type="button"
            onClick={() => goTo('/home/cotizaciones')}
          >
            Cotizaciones
          </button>

          
          {/* PEDIDOS */}
          <button
            className={`tm-sidebar__item ${
            isGroupActive('/home/pedidos') ? 'tm-sidebar__item--active' : ''
            }`}
            type="button"
            onClick={() => goTo('/home/pedidos')}
          >
            Pedidos
          </button>

          {/* ✅ MATERIALES (FIXED) */}
          <button
            className={`tm-sidebar__item ${isMaterialesActive ? 'tm-sidebar__item--active' : ''}`}
            type="button"
            onClick={() => goTo('/home/materiales')}
          >
            Materiales
          </button>

          {/* CONFIGURACIÓN */}
          <div className="tm-sidebar__group">
            <button
              className={`tm-sidebar__item tm-sidebar__item--with-arrow ${
                isGroupActive('/home/configuracion') ? 'tm-sidebar__item--active' : ''
              }`}
              type="button"
              onClick={() => toggleMenu('config')}
            >
              <span>Configuración</span>
              <span className={`tm-sidebar__arrow ${
                (openMenus['config'] ?? isGroupActive('/home/configuracion')) ? 'tm-sidebar__arrow--open' : ''
              }`}>
                ▾
              </span>
            </button>

            {(openMenus['config'] ?? isGroupActive('/home/configuracion')) && (
              <div className="tm-sidebar__submenu">
                <button
                  className={`tm-sidebar__subitem ${
                    isActive('/home/configuracion/usuarios') ? 'tm-sidebar__subitem--active' : ''
                  }`}
                  onClick={() => goTo('/home/configuracion/usuarios')}
                >
                  Usuarios
                </button>
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
            className="tm-sidebar__logout"
            type="button"
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