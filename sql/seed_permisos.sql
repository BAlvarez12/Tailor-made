-- =====================================================================
-- Seed de la tabla `permisos` con los 33 códigos del sistema.
-- Ejecutar una vez en la base de datos `tailor_made`.
-- Es idempotente: se puede correr varias veces sin duplicar.
-- =====================================================================

-- 1) Asegurar que el código del permiso sea único antes de insertar.
--    Si ya existe la constraint, este ALTER puede fallar — ignorarlo.
ALTER TABLE permisos
  ADD UNIQUE KEY uk_permisos_nombre (nombre_permiso);

-- 2) Insertar todos los permisos del sistema.
INSERT IGNORE INTO permisos (nombre_permiso) VALUES
  ('crear_clientes'),
  ('editar_clientes'),
  ('ver_clientes'),
  ('actualizar_medidas_cliente'),
  ('ver_cotizaciones'),
  ('crear_cotizaciones'),
  ('generar_pdf_cotizacion'),
  ('enviar_whatsapp_cotizacion'),
  ('generar_plan_pagos_cotizacion'),
  ('crear_plan_pagos'),
  ('ver_plan_pagos'),
  ('generar_abono_plan_pagos'),
  ('crear_prendas'),
  ('ver_prendas'),
  ('editar_prendas'),
  ('crear_materiales'),
  ('editar_materiales'),
  ('existencias-materiales'),
  ('ver_materiales'),
  ('crear_categoria_materiales'),
  ('editar_categoria_materiales'),
  ('ver_categoria_materiales'),
  ('crear_usuarios'),
  ('editar_usuarios'),
  ('ver_usuarios'),
  ('crear_unidades_medidas'),
  ('editar_unidades_medidas'),
  ('ver_unidades_medidas'),
  ('crear_tipo_medidas'),
  ('editar_tipo_medidas'),
  ('ver_tipo_medidas'),
  ('ver_roles'),
  ('editar_roles'),
  ('crear_roles'),
  ('asignar_permiso_roles');

-- 3) Verificación
SELECT permiso_id, nombre_permiso FROM permisos ORDER BY permiso_id;
