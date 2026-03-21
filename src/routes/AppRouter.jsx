  import { Routes, Route, Navigate } from 'react-router-dom'
  import Login from '../pages/Login'
  import Home from '../pages/Home'
  import PageUsuarios from '../pages/usuarios/pageusuario'
  import Pedidos from '../pages/pedidos/Pedidos'
  import ProtectedRoute from './ProtectedRoute'
  import HomeLayout from '../layouts/HomeLayout'
  import CrearPedido from '../pages/pedidos/CrearPedido'
  import Materiales from '../pages/materiales/Materiales'
  import CrearMaterial from '../pages/materiales/CrearMateriales'

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
    <Route path="pedidos" element={<Pedidos />} />
    
    <Route path="materiales" element={<Materiales />} />
    <Route path="materiales/crear" element={<CrearMaterial />} />
    <Route path="configuracion/usuarios" element={<PageUsuarios />} />
  </Route>


  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
    )
  }

  export default AppRouter