-- =====================================================================
-- Permisos adicionales para edición y anulación de cotizaciones.
-- Idempotente: se puede correr varias veces sin duplicar.
-- =====================================================================

INSERT IGNORE INTO permisos (nombre_permiso) VALUES
  ('editar_cotizaciones'),
  ('anular_cotizaciones');


SELECT permiso_id, nombre_permiso
FROM permisos
WHERE nombre_permiso IN ('editar_cotizaciones', 'anular_cotizaciones');
