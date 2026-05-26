-- =====================================================================
-- Constraints únicos para prevenir duplicados a nivel BD.
-- Cierra race conditions que la validación de aplicación no puede prevenir.
--
-- IMPORTANTE: Antes de ejecutar, asegúrate de que NO hay duplicados existentes.
-- Si los hay, el ALTER falla con "Duplicate entry...". En ese caso:
--   1) Identifica duplicados con las queries del bloque "VERIFICACIÓN" abajo.
--   2) Resuélvelos manualmente (mergear, renombrar, borrar).
--   3) Reintenta este script.
--
-- Si la constraint ya existe, MySQL devuelve "Duplicate key name" — es seguro
-- ignorar ese error específico.
-- =====================================================================

-- VERIFICACIÓN (correr ANTES de los ALTER):
--   SELECT dpi, COUNT(*) c FROM clientes GROUP BY dpi HAVING c > 1;
--   SELECT usuario, COUNT(*) c FROM usuarios GROUP BY usuario HAVING c > 1;
--   SELECT email, COUNT(*) c FROM usuarios GROUP BY email HAVING c > 1;
--   SELECT nombre_rol, COUNT(*) c FROM roles GROUP BY nombre_rol HAVING c > 1;

ALTER TABLE clientes
  ADD UNIQUE KEY uk_clientes_dpi (dpi);

ALTER TABLE usuarios
  ADD UNIQUE KEY uk_usuarios_usuario (usuario);

ALTER TABLE usuarios
  ADD UNIQUE KEY uk_usuarios_email (email);

ALTER TABLE roles
  ADD UNIQUE KEY uk_roles_nombre (nombre_rol);

-- Verificación final (debe listar las 4 constraints):
SHOW INDEX FROM clientes WHERE Key_name = 'uk_clientes_dpi';
SHOW INDEX FROM usuarios WHERE Key_name IN ('uk_usuarios_usuario', 'uk_usuarios_email');
SHOW INDEX FROM roles WHERE Key_name = 'uk_roles_nombre';
