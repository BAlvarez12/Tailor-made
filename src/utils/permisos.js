// Catálogo de permisos del sistema.
//
// `codigo` es el identificador interno (snake_case) usado en BD y en
// validaciones de código.  `etiqueta` es el nombre que ve el usuario en el
// formulario de asignación de permisos del rol.
//
// Para agregar un permiso nuevo: añadirlo aquí Y al seed SQL
// (backend/Tailor-made/sql/seed_permisos.sql) para que exista en la tabla.

export const CATEGORIAS_PERMISOS = [
  {
    id: "clientes",
    nombre: "Clientes",
    permisos: [
      { codigo: "ver_clientes", etiqueta: "Ver clientes" },
      { codigo: "crear_clientes", etiqueta: "Crear clientes" },
      { codigo: "editar_clientes", etiqueta: "Editar clientes" },
      { codigo: "actualizar_medidas_cliente", etiqueta: "Actualizar medidas del cliente" },
    ],
  },
  {
    id: "cotizaciones",
    nombre: "Cotizaciones",
    permisos: [
      { codigo: "ver_cotizaciones", etiqueta: "Ver cotizaciones" },
      { codigo: "crear_cotizaciones", etiqueta: "Crear cotizaciones" },
      { codigo: "editar_cotizaciones", etiqueta: "Editar cotizaciones" },
      { codigo: "anular_cotizaciones", etiqueta: "Anular cotizaciones" },
      { codigo: "generar_pdf_cotizacion", etiqueta: "Generar PDF de cotización" },
      { codigo: "enviar_whatsapp_cotizacion", etiqueta: "Enviar cotización por WhatsApp" },
      { codigo: "generar_plan_pagos_cotizacion", etiqueta: "Generar plan de pagos desde cotización" },
    ],
  },
  {
    id: "plan_pagos",
    nombre: "Plan de pagos",
    permisos: [
      { codigo: "ver_plan_pagos", etiqueta: "Ver planes de pago" },
      { codigo: "crear_plan_pagos", etiqueta: "Crear plan de pagos" },
      { codigo: "generar_abono_plan_pagos", etiqueta: "Registrar abono a plan de pagos" },
    ],
  },
  {
    id: "prendas",
    nombre: "Prendas",
    permisos: [
      { codigo: "ver_prendas", etiqueta: "Ver prendas" },
      { codigo: "crear_prendas", etiqueta: "Crear prendas" },
      { codigo: "editar_prendas", etiqueta: "Editar prendas" },
    ],
  },
  {
    id: "materiales",
    nombre: "Materiales",
    permisos: [
      { codigo: "ver_materiales", etiqueta: "Ver materiales" },
      { codigo: "crear_materiales", etiqueta: "Crear materiales" },
      { codigo: "editar_materiales", etiqueta: "Editar materiales" },
      { codigo: "existencias-materiales", etiqueta: "Gestionar existencias de materiales" },
    ],
  },
  {
    id: "categorias_materiales",
    nombre: "Categorías de materiales",
    permisos: [
      { codigo: "ver_categoria_materiales", etiqueta: "Ver categorías de materiales" },
      { codigo: "crear_categoria_materiales", etiqueta: "Crear categorías de materiales" },
      { codigo: "editar_categoria_materiales", etiqueta: "Editar categorías de materiales" },
    ],
  },
  {
    id: "usuarios",
    nombre: "Usuarios",
    permisos: [
      { codigo: "ver_usuarios", etiqueta: "Ver usuarios" },
      { codigo: "crear_usuarios", etiqueta: "Crear usuarios" },
      { codigo: "editar_usuarios", etiqueta: "Editar usuarios" },
    ],
  },
  {
    id: "unidades_medidas",
    nombre: "Unidades de medida",
    permisos: [
      { codigo: "ver_unidades_medidas", etiqueta: "Ver unidades de medida" },
      { codigo: "crear_unidades_medidas", etiqueta: "Crear unidades de medida" },
      { codigo: "editar_unidades_medidas", etiqueta: "Editar unidades de medida" },
    ],
  },
  {
    id: "tipo_medidas",
    nombre: "Tipos de medida",
    permisos: [
      { codigo: "ver_tipo_medidas", etiqueta: "Ver tipos de medida" },
      { codigo: "crear_tipo_medidas", etiqueta: "Crear tipos de medida" },
      { codigo: "editar_tipo_medidas", etiqueta: "Editar tipos de medida" },
    ],
  },
  {
    id: "tipo_prendas",
    nombre: "Tipos de prenda",
    permisos: [
      { codigo: "ver_tipo_prendas", etiqueta: "Ver tipos de prenda" },
      { codigo: "crear_tipo_prendas", etiqueta: "Crear tipos de prenda" },
      { codigo: "editar_tipo_prendas", etiqueta: "Editar tipos de prenda" },
    ],
  },
  {
    id: "roles",
    nombre: "Roles y permisos",
    permisos: [
      { codigo: "ver_roles", etiqueta: "Ver roles" },
      { codigo: "crear_roles", etiqueta: "Crear roles" },
      { codigo: "editar_roles", etiqueta: "Editar roles" },
      { codigo: "asignar_permiso_roles", etiqueta: "Asignar permisos a roles" },
    ],
  },
];

// Aplana el catálogo a una lista de { codigo, etiqueta, categoria }.
export const TODOS_LOS_PERMISOS = CATEGORIAS_PERMISOS.flatMap((cat) =>
  cat.permisos.map((p) => ({ ...p, categoria: cat.nombre }))
);

// Resuelve un código de permiso a su etiqueta visible.
export const etiquetaPermiso = (codigo) => {
  const found = TODOS_LOS_PERMISOS.find((p) => p.codigo === codigo);
  return found ? found.etiqueta : codigo;
};
