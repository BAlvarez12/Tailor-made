  import { Routes, Route, Navigate } from 'react-router-dom';
  import Login from '../pages/Login';
  import Home from '../pages/Home';
  import PageUsuarios from '../pages/usuarios/pageusuario';
  import Clientes from '../pages/clientes/clientes';
  import Unidades from '../pages/unidades/unidades';
  import TipoMedidas from '../pages/tipo_medidas/tipo_medidas';
  import ProtectedRoute from './ProtectedRoute';
  import HomeLayout from '../layouts/HomeLayout';
  import Materiales from '../pages/materiales/Materiales';
  import PrendasPage from "../pages/prendas/PagePrendas";
  import ViewPrendas from "../pages/prendas/viewPrendas";
  import EditarPrendas from "../pages/prendas/EditarPrendas";
  import ImgPrendas from "../pages/Prendas/ImgPrendas";


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
    <Route path="prendas" element={<PrendasPage />} />
    <Route path="prendas/editar/:id" element={<EditarPrendas />} />
    <Route path="prendas/:id/imagenes" element={<ImgPrendas />} />
    <Route path="materiales" element={<Materiales />} />
    <Route path="configuracion/usuarios" element={<PageUsuarios />} />
    <Route path="configuracion/unidades" element={<Unidades />} /> 
    <Route path="configuracion/tipo-medidas" element={<TipoMedidas />} />
    <Route path="clientes" element={<Clientes />} />
  </Route>


  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
    )
  }

  export default AppRouter