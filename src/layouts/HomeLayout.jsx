import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import BusquedaGlobal from '../components/BusquedaGlobal'
import useInactividad from '../hooks/useInactividad'
import './HomeLayout.css'

function HomeLayout() {
  // Cierra sesión tras 30 minutos sin actividad de mouse / teclado / scroll.
  useInactividad(30 * 60 * 1000)

  return (
    <div className="tm-layout">
      <Sidebar />
      <BusquedaGlobal />

      <main className="tm-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout
