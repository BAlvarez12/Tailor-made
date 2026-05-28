import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Users,
  FileText,
  Wallet,
  Shirt,
  Package,
  Settings,
  Search,
  Sun,
  Moon,
  LogOut,
  MoreHorizontal,
  X,
  User,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { tienePermiso } from '../utils/permisosUsuario'
import useTema from '../hooks/useTema'
import {
  MAIN_MENU_ITEMS,
  CONFIG_SUBMENU_ITEMS,
  MOBILE_NAV_KEYS,
} from '../constants/menuItems'
import './MobileNav.css'

const ICONS = {
  home: Home,
  clientes: Users,
  cotizaciones: FileText,
  pagos: Wallet,
  prendas: Shirt,
  materiales: Package,
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || {}
  } catch {
    return {}
  }
}

// Acciones rápidas que aparecen al tocar el FAB "+" centrado.
// Cada una requiere su permiso correspondiente para aparecer en el menú.
const ACCIONES_CREAR = [
  {
    key: 'cotizacion',
    label: 'Nueva cotización',
    icon: FileText,
    path: '/home/cotizaciones',
    permiso: 'crear_cotizaciones',
  },
  {
    key: 'cliente',
    label: 'Nuevo cliente',
    icon: Users,
    path: '/home/clientes',
    permiso: 'crear_clientes',
  },
  {
    key: 'prenda',
    label: 'Nueva prenda',
    icon: Shirt,
    path: '/home/prendas',
    permiso: 'crear_prendas',
  },
  {
    key: 'pago',
    label: 'Nuevo plan de pago',
    icon: Wallet,
    path: '/home/pagos',
    permiso: 'crear_plan_pagos',
  },
]

function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { tema, alternar } = useTema()
  const [sheetAbierto, setSheetAbierto] = useState(false)
  const [crearAbierto, setCrearAbierto] = useState(false)

  const usuario = getStoredUser()
  const nombreUsuario = usuario.nombre || usuario.usuario || 'Usuario'
  const nombreRol = usuario.nombre_rol || 'Sin rol'
  const inicial = nombreUsuario.charAt(0).toUpperCase()

  const accionesCrearVisibles = useMemo(
    () =>
      ACCIONES_CREAR.filter(
        (accion) => !accion.permiso || tienePermiso(accion.permiso)
      ),
    []
  )

  // Cierra cualquier panel abierto al navegar
  useEffect(() => {
    setSheetAbierto(false)
    setCrearAbierto(false)
  }, [location.pathname])

  // Bloquea scroll del body cuando hay algún panel abierto
  useEffect(() => {
    if (sheetAbierto || crearAbierto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sheetAbierto, crearAbierto])

  const handleAccionCrear = (accion) => {
    setCrearAbierto(false)
    navigate(accion.path, { state: { abrirCrear: true } })
  }

  const itemsVisibles = MAIN_MENU_ITEMS.filter(
    (item) => !item.permiso || tienePermiso(item.permiso)
  )

  const itemsBarra = itemsVisibles.filter((item) =>
    MOBILE_NAV_KEYS.includes(item.key)
  )
  const itemsExtra = itemsVisibles.filter(
    (item) => !MOBILE_NAV_KEYS.includes(item.key)
  )

  const configVisibles = CONFIG_SUBMENU_ITEMS.filter(
    (item) => !item.permiso || tienePermiso(item.permiso)
  )

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
  }

  const handleBuscar = () => {
    setSheetAbierto(false)
    window.dispatchEvent(new CustomEvent('abrir-busqueda'))
  }

  return (
    <>
      {/* ===========================
          BARRA INFERIOR FIJA
          =========================== */}
      <nav className="tm-mnav" aria-label="Navegación principal">
        {/* Items previos al FAB (mitad izquierda del bar) */}
        {itemsBarra.slice(0, Math.ceil(itemsBarra.length / 2)).map((item) => {
          const Icon = ICONS[item.key] || Home
          const active = isActive(item.path, item.exact)
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`tm-mnav__item ${active ? 'tm-mnav__item--active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* FAB central como slot real del flex: ocupa el centro del bar
            sin solapar ningún item. Solo se renderiza si el usuario tiene
            permiso para al menos una creación. */}
        {accionesCrearVisibles.length > 0 && (
          <div className="tm-mnav__fab-slot">
            <button
              type="button"
              className={`tm-mnav__fab ${crearAbierto ? 'tm-mnav__fab--abierto' : ''}`}
              onClick={() => setCrearAbierto((prev) => !prev)}
              aria-label="Crear"
              aria-expanded={crearAbierto}
            >
              <Plus size={26} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Items posteriores al FAB (mitad derecha del bar) */}
        {itemsBarra.slice(Math.ceil(itemsBarra.length / 2)).map((item) => {
          const Icon = ICONS[item.key] || Home
          const active = isActive(item.path, item.exact)
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`tm-mnav__item ${active ? 'tm-mnav__item--active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          className={`tm-mnav__item tm-mnav__more ${
            sheetAbierto ? 'tm-mnav__item--active' : ''
          }`}
          onClick={() => setSheetAbierto((prev) => !prev)}
          aria-label="Abrir más opciones"
          aria-expanded={sheetAbierto}
        >
          <MoreHorizontal size={20} />
          <span>Más</span>
        </button>
      </nav>

      {/* ===========================
          MENÚ FLOTANTE DE CREACIÓN (sobre el FAB)
          =========================== */}
      {crearAbierto && (
        <div
          className="tm-mcrear__overlay"
          onClick={() => setCrearAbierto(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`tm-mcrear ${crearAbierto ? 'tm-mcrear--abierto' : ''}`}
        role="dialog"
        aria-hidden={!crearAbierto}
        aria-label="Crear nuevo"
      >
        <div className="tm-mcrear__handle" aria-hidden="true"></div>
        <div className="tm-mcrear__header">
          <h3>Crear</h3>
          <button
            type="button"
            className="tm-mcrear__close"
            onClick={() => setCrearAbierto(false)}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        <div className="tm-mcrear__grid">
          {accionesCrearVisibles.map((accion) => {
            const Icon = accion.icon
            return (
              <button
                key={accion.key}
                type="button"
                className="tm-mcrear__option"
                onClick={() => handleAccionCrear(accion)}
              >
                <span className="tm-mcrear__option-icon">
                  <Icon size={22} />
                </span>
                <span className="tm-mcrear__option-label">{accion.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ===========================
          BOTTOM SHEET (overlay + drawer)
          =========================== */}
      {sheetAbierto && (
        <div
          className="tm-msheet__overlay"
          onClick={() => setSheetAbierto(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`tm-msheet ${sheetAbierto ? 'tm-msheet--abierto' : ''}`}
        role="dialog"
        aria-hidden={!sheetAbierto}
        aria-label="Más opciones"
      >
        <div className="tm-msheet__handle" aria-hidden="true"></div>

        <div className="tm-msheet__header">
          <h3>Menú</h3>
          <button
            type="button"
            className="tm-msheet__close"
            onClick={() => setSheetAbierto(false)}
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="tm-msheet__body">
          {/* Tarjeta de usuario */}
          <Link
            to="/home/mi-cuenta"
            className="tm-msheet__user"
            onClick={() => setSheetAbierto(false)}
          >
            <div className="tm-msheet__avatar">{inicial}</div>
            <div className="tm-msheet__user-info">
              <strong>{nombreUsuario}</strong>
              <span className="tm-msheet__rol">{nombreRol}</span>
            </div>
            <ChevronRight size={18} className="tm-msheet__chevron" />
          </Link>

          {/* Búsqueda global */}
          <button
            type="button"
            className="tm-msheet__row"
            onClick={handleBuscar}
          >
            <Search size={18} />
            <span>Buscar</span>
            <kbd className="tm-msheet__kbd">Ctrl+K</kbd>
          </button>

          {/* Items extra del menú principal */}
          {itemsExtra.length > 0 && (
            <>
              <p className="tm-msheet__section">Navegación</p>
              {itemsExtra.map((item) => {
                const Icon = ICONS[item.key] || Home
                const active = isActive(item.path, item.exact)
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`tm-msheet__row ${
                      active ? 'tm-msheet__row--active' : ''
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </>
          )}

          {/* Configuración */}
          {configVisibles.length > 0 && (
            <>
              <p className="tm-msheet__section">
                <Settings size={14} /> Configuración
              </p>
              {configVisibles.map((item) => {
                const active = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`tm-msheet__row tm-msheet__row--sub ${
                      active ? 'tm-msheet__row--active' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </>
          )}

          {/* Tema + Cerrar sesión */}
          <p className="tm-msheet__section">Cuenta</p>
          <button
            type="button"
            className="tm-msheet__row"
            onClick={() => {
              alternar()
            }}
          >
            {tema === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>
              {tema === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            </span>
          </button>

          <button
            type="button"
            className="tm-msheet__row tm-msheet__row--danger"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default MobileNav
