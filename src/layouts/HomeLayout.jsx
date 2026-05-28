import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
import BusquedaGlobal from '../components/BusquedaGlobal'
import useInactividad from '../hooks/useInactividad'
import './HomeLayout.css'

function HomeLayout() {
  // Cierra sesión tras 30 minutos sin actividad de mouse / teclado / scroll.
  useInactividad(30 * 60 * 1000)

  return (
    <div className="tm-layout">
      {/* Desktop: sidebar lateral fijo */}
      <Sidebar />

      {/* Mobile/Tablet: barra inferior con bottom sheet */}
      <MobileNav />

      <BusquedaGlobal />

      <main className="tm-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout
