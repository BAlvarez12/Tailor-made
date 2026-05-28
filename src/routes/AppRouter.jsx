import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import PageUsuarios from "../pages/usuarios/paginaUsuarios";
import Clientes from "../pages/clientes/clientes";
import FichaCliente from "../pages/clientes/FichaCliente";
import Unidades from "../pages/unidades/unidades";
import TipoMedidas from "../pages/tipo_medidas/tipoMedidas";
import TipoPrendas from "../pages/tipo_prendas/tipoPrendas";
import MiCuenta from "../pages/mi_cuenta/MiCuenta";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
import HomeLayout from "../layouts/HomeLayout";
import Materiales from "../pages/materiales/Materiales";
import PrendasPage from "../pages/prendas/PagePrendas";
import ImgPrendas from "../pages/prendas/ImgPrendas";
import Cotizaciones from "../pages/cotizaciones/Cotizaciones";
import Pagos from "../pages/pagos/Pagos";
import PaginaRoles from "../pages/roles/PaginaRoles";

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

        <Route path="mi-cuenta" element={<MiCuenta />} />

        <Route
          path="prendas"
          element={
            <PermissionRoute codigo="ver_prendas">
              <PrendasPage />
            </PermissionRoute>
          }
        />
        <Route
          path="prendas/:id/imagenes"
          element={
            <PermissionRoute codigo="ver_prendas">
              <ImgPrendas />
            </PermissionRoute>
          }
        />
        <Route
          path="materiales"
          element={
            <PermissionRoute codigo="ver_materiales">
              <Materiales />
            </PermissionRoute>
          }
        />
        <Route
          path="clientes"
          element={
            <PermissionRoute codigo="ver_clientes">
              <Clientes />
            </PermissionRoute>
          }
        />
        <Route
          path="clientes/:id"
          element={
            <PermissionRoute codigo="ver_clientes">
              <FichaCliente />
            </PermissionRoute>
          }
        />
        <Route
          path="cotizaciones"
          element={
            <PermissionRoute codigo="ver_cotizaciones">
              <Cotizaciones />
            </PermissionRoute>
          }
        />
        <Route
          path="pagos"
          element={
            <PermissionRoute codigo="ver_plan_pagos">
              <Pagos />
            </PermissionRoute>
          }
        />

        <Route
          path="configuracion/usuarios"
          element={
            <PermissionRoute codigo="ver_usuarios">
              <PageUsuarios />
            </PermissionRoute>
          }
        />
        <Route
          path="configuracion/unidades"
          element={
            <PermissionRoute codigo="ver_unidades_medidas">
              <Unidades />
            </PermissionRoute>
          }
        />
        <Route
          path="configuracion/tipo-medidas"
          element={
            <PermissionRoute codigo="ver_tipo_medidas">
              <TipoMedidas />
            </PermissionRoute>
          }
        />
        <Route
          path="configuracion/tipo-prendas"
          element={
            <PermissionRoute codigo="ver_tipo_prendas">
              <TipoPrendas />
            </PermissionRoute>
          }
        />
        <Route
          path="configuracion/roles"
          element={
            <PermissionRoute codigo="ver_roles">
              <PaginaRoles />
            </PermissionRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
