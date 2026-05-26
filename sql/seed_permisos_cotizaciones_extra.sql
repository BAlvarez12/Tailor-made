-- =====================================================================
-- Permisos adicionales para edición y anulación de cotizaciones.
-- Idempotente: se puede correr varias veces sin duplicar.
-- =====================================================================

INSERT IGNORE INTO permisos (nombre_permiso) VALUES
  ('editar_cotizaciones'),
  ('anular_cotizaciones');

-- Opcional: otorgar estos permisos al rol Administrador (cambia el rol_id).
-- SET @rol_id := 1;
-- INSERT IGNORE INTO permisos_rol (permiso_id, rol_id)
-- SELECT permiso_id, @rol_id FROM permisos
-- WHERE nombre_permiso IN ('editar_cotizaciones', 'anular_cotizaciones');

SELECT permiso_id, nombre_permiso
FROM permisos
WHERE nombre_permiso IN ('editar_cotizaciones', 'anular_cotizaciones');
