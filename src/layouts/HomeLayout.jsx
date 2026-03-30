import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import './HomeLayout.css'

function HomeLayout() {
  return (
    <div className="tm-layout">
      <Sidebar />

      <main className="tm-layout__content">
        <Outlet />
      </main>
    </div>
  )
}

export default HomeLayout