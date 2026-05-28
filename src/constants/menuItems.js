// Catálogo de items del menú compartido entre Sidebar (desktop) y MobileNav (mobile).
// Los iconos se importan en cada componente para no atar este módulo a lucide-react.

export const MAIN_MENU_ITEMS = [
  { key: 'home',          label: 'Home',          path: '/home',                 exact: true },
  { key: 'clientes',      label: 'Clientes',      path: '/home/clientes',        exact: true,  permiso: 'ver_clientes' },
  { key: 'cotizaciones',  label: 'Cotizaciones',  path: '/home/cotizaciones',    exact: true,  permiso: 'ver_cotizaciones' },
  { key: 'pagos',         label: 'Pagos',         path: '/home/pagos',           exact: true,  permiso: 'ver_plan_pagos' },
  { key: 'prendas',       label: 'Prendas',       path: '/home/prendas',         exact: false, permiso: 'ver_prendas' },
  { key: 'materiales',    label: 'Materiales',    path: '/home/materiales',      exact: false, permiso: 'ver_materiales' },
]

export const CONFIG_SUBMENU_ITEMS = [
  { label: 'Usuarios',           path: '/home/configuracion/usuarios',     permiso: 'ver_usuarios' },
  { label: 'Roles y permisos',   path: '/home/configuracion/roles',        permiso: 'ver_roles' },
  { label: 'Unidades de medida', path: '/home/configuracion/unidades',     permiso: 'ver_unidades_medidas' },
  { label: 'Tipos de medida',    path: '/home/configuracion/tipo-medidas', permiso: 'ver_tipo_medidas' },
  { label: 'Tipos de prenda',    path: '/home/configuracion/tipo-prendas', permiso: 'ver_tipo_prendas' },
]

// Keys de los items que aparecen en la barra inferior de mobile.
// Los que NO esten aqui se van al bottom sheet "Mas".
// NOTA: el centro del bar lo ocupa el FAB "+" (crear), por eso solo
// caben 3 items aquí (3 + FAB + "Más" = 5 slots con el FAB centrado).
// "cotizaciones" sigue siendo accesible desde el sheet "Más" y desde el
// menú del FAB ("Nueva cotización").
export const MOBILE_NAV_KEYS = ['home', 'clientes', 'pagos']
