-- =====================================================================
-- Otorga TODOS los permisos a un rol (útil para tener un rol "Administrador").
-- Ejecutar DESPUÉS de seed_permisos.sql.
--
-- 1) Identifica el rol_id de tu usuario:
--    SELECT usuario_id, usuario, rol_id FROM usuarios WHERE usuario = 'TU_USUARIO';
--
-- 2) Reemplaza `1` por el rol_id correspondiente y ejecuta:
-- =====================================================================

SET @rol_id := 1;  -- <<<< cambiar al rol_id que quieras

INSERT IGNORE INTO permisos_rol (permiso_id, rol_id)
SELECT permiso_id, @rol_id FROM permisos;

-- Verificación
SELECT p.nombre_permiso
FROM permisos p
JOIN permisos_rol pr ON pr.permiso_id = p.permiso_id
WHERE pr.rol_id = @rol_id
ORDER BY p.nombre_permiso;
