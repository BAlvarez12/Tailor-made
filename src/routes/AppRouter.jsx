import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import PageUsuarios from '../pages/usuarios/pageusuario'
import ProtectedRoute from './ProtectedRoute'
import HomeLayout from '../layouts/HomeLayout'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="configuracion/usuarios" element={<PageUsuarios />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter