import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, LogOut } from 'lucide-react'
import { tienePermiso } from '../utils/permisosUsuario'
import useTema from '../hooks/useTema'
import './Sidebar.css'

const MAIN_MENU_ITEMS = [
  { label: 'Home', path: '/home', exact: true },
  { label: 'Clientes', path: '/home/clientes', exact: true, permiso: 'ver_clientes' },
  { label: 'Cotizaciones', path: '/home/cotizaciones', exact: true, permiso: 'ver_cotizaciones' },
  { label: 'Pagos', path: '/home/pagos', exact: true, permiso: 'ver_plan_pagos' },
  { label: 'Prendas', path: '/home/prendas', exact: false, permiso: 'ver_prendas' },
  { label: 'Materiales', path: '/home/materiales', exact: false, permiso: 'ver_materiales' }
]

const CONFIG_SUBMENU_ITEMS = [
  { label: 'Usuarios', path: '/home/configuracion/usuarios', permiso: 'ver_usuarios' },
  { label: 'Roles y permisos', path: '/home/configuracion/roles', permiso: 'ver_roles' },
  { label: 'Unidades de medida', path: '/home/configuracion/unidades', permiso: 'ver_unidades_medidas' },
  { label: 'Tipos de medida', path: '/home/configuracion/tipo-medidas', permiso: 'ver_tipo_medidas' }
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
  const { tema, alternar } = useTema()

  const usuario = getStoredUser()
  const nombreUsuario = usuario.nombre || usuario.usuario || 'Usuario'
  const nombreRol = usuario.nombre_rol || 'Sin rol'
  const inicial = nombreUsuario.charAt(0).toUpperCase()

  const mainItemsVisibles = MAIN_MENU_ITEMS.filter(
    (item) => !item.permiso || tienePermiso(item.permiso)
  )
  const configItemsVisibles = CONFIG_SUBMENU_ITEMS.filter(
    (item) => !item.permiso || tienePermiso(item.permiso)
  )
  const mostrarConfiguracion = configItemsVisibles.length > 0

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

  const handleAbrirBusqueda = () => {
    window.dispatchEvent(new CustomEvent('abrir-busqueda'))
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

        <button
          type="button"
          className="tm-sidebar__search-trigger"
          onClick={handleAbrirBusqueda}
          title="Buscar (Ctrl+K)"
        >
          <Search size={16} />
          <span>Buscar...</span>
          <kbd className="tm-sidebar__kbd">Ctrl+K</kbd>
        </button>

        <nav className="tm-sidebar__nav">
          {mainItemsVisibles.map((item) => (
            <button
              key={item.path}
              type="button"
              className={getItemClassName(item)}
              onClick={() => handleNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}

          {mostrarConfiguracion && (
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
                  {configItemsVisibles.map((item) => (
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
          )}
        </nav>
      </div>

      <div className="tm-sidebar__footer">
        <div className="tm-sidebar__user-box">
          <div className="tm-sidebar__avatar">{inicial}</div>

          <div className="tm-sidebar__user-info">
            <strong>{nombreUsuario}</strong>
            <span className="tm-sidebar__user-rol">{nombreRol}</span>
          </div>
        </div>

        <div className="tm-sidebar__footer-actions">
          <button
            type="button"
            className="tm-sidebar__icon-btn"
            onClick={alternar}
            title={tema === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            aria-label="Cambiar tema"
          >
            {tema === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="tm-sidebar__logout"
            onClick={handleLogout}
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
