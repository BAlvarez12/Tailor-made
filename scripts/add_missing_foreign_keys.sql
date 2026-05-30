-- =============================================================================
-- Tailor-made — Script para agregar foreign keys faltantes
-- =============================================================================
-- Generado tras revisar Tailor-madeV3.sql. Las tablas ya tenían FKs en:
--   clientes, cotizaciones, cotizacion_materiales, cotizacion_medidas,
--   detalle_existencias, log_operaciones, pagos_cliente (plan), permisos_rol
--   (rol), planes_pago, prendas, usuarios (rol)
--
-- Este script agrega las que FALTABAN — principalmente:
--   * usuario_creador / usuario_modif → usuarios   (audit)
--   * categoria_id → categorias_material
--   * cliente_id / tipo_prenda_id / tipo_medida_id → tablas catálogo
--   * Tablas hijas (img, medidas, materiales por prenda) → su padre con CASCADE
--   * permiso_id en permisos_rol → permisos
--   * unidad_id → unidades_medida (incluye ALTER de tipo a INT UNSIGNED)
--
-- IMPORTANTE — antes de ejecutar:
--   1. Hacé BACKUP de la BD (mysqldump --single-transaction).
--   2. Si tenés filas con valores inválidos (orphan refs), las queries de
--      "Limpieza opcional" al final del script las dejan en NULL.
--      Corré esas PRIMERO si una FK falla con error 1452.
--   3. Es seguro re-ejecutar: las queries usan checks contra information_schema
--      para no duplicar constraints (sólo crean si no existen).
-- =============================================================================

USE `tailor_made`;

SET @OLD_FK_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Helper procedure: agrega una FK sólo si no existe ya con ese nombre.
-- Evita errores al re-ejecutar el script.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_agregar_fk;
DELIMITER $$
CREATE PROCEDURE sp_agregar_fk(
  IN p_tabla       VARCHAR(64),
  IN p_constraint  VARCHAR(64),
  IN p_columna     VARCHAR(64),
  IN p_tabla_ref   VARCHAR(64),
  IN p_columna_ref VARCHAR(64),
  IN p_on_delete   VARCHAR(20),
  IN p_on_update   VARCHAR(20)
)
BEGIN
  DECLARE existe INT DEFAULT 0;
  SELECT COUNT(*) INTO existe
    FROM information_schema.TABLE_CONSTRAINTS
   WHERE CONSTRAINT_SCHEMA = DATABASE()
     AND TABLE_NAME       = p_tabla
     AND CONSTRAINT_NAME  = p_constraint
     AND CONSTRAINT_TYPE  = 'FOREIGN KEY';

  IF existe = 0 THEN
    SET @sql = CONCAT(
      'ALTER TABLE `', p_tabla, '` ',
      'ADD CONSTRAINT `', p_constraint, '` ',
      'FOREIGN KEY (`', p_columna, '`) ',
      'REFERENCES `', p_tabla_ref, '` (`', p_columna_ref, '`) ',
      'ON DELETE ', p_on_delete, ' ',
      'ON UPDATE ', p_on_update
    );
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
END$$
DELIMITER ;

-- =============================================================================
-- 1. AJUSTES DE TIPO (necesarios para que las FKs sean válidas)
-- =============================================================================
-- unidades_medida.unidad_id es INT UNSIGNED, pero las columnas hijas son
-- INT (signed). Igualamos los tipos para poder crear las FKs.
ALTER TABLE `cliente_medidas`
  MODIFY COLUMN `unidad_id` INT UNSIGNED DEFAULT NULL;

ALTER TABLE `cliente_prenda_material`
  MODIFY COLUMN `unidad_id` INT UNSIGNED DEFAULT NULL;

-- =============================================================================
-- 2. AGREGAR PRIMARY KEYS donde falten (requisito para tablas hijas limpias)
-- =============================================================================
-- materiales_img y medidas_prenda no tienen PK ni unique. Agregamos un id
-- auto-increment para mantener integridad y poder referenciarlas si hace falta.
SET @count := (SELECT COUNT(*) FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'materiales_img'
                  AND COLUMN_NAME = 'materiales_img_id');
SET @sql := IF(@count = 0,
  'ALTER TABLE `materiales_img` ADD COLUMN `materiales_img_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @count := (SELECT COUNT(*) FROM information_schema.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = 'medidas_prenda'
                  AND COLUMN_NAME = 'medida_prenda_id');
SET @sql := IF(@count = 0,
  'ALTER TABLE `medidas_prenda` ADD COLUMN `medida_prenda_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST',
  'DO 0');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- =============================================================================
-- 3. CATEGORIAS_MATERIAL
-- =============================================================================
CALL sp_agregar_fk('categorias_material', 'fk_categoria_material_usuario_creador',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 4. CLIENTE_MEDIDAS  (medidas que toma el sastre al cliente)
-- =============================================================================
CALL sp_agregar_fk('cliente_medidas', 'fk_cliente_medidas_cliente',
                   'cliente_id', 'clientes', 'cliente_id',
                   'CASCADE', 'CASCADE');

CALL sp_agregar_fk('cliente_medidas', 'fk_cliente_medidas_tipo_medida',
                   'tipo_medida_id', 'tipo_medidas', 'tipo_medida_id',
                   'RESTRICT', 'CASCADE');

CALL sp_agregar_fk('cliente_medidas', 'fk_cliente_medidas_unidad',
                   'unidad_id', 'unidades_medida', 'unidad_id',
                   'RESTRICT', 'CASCADE');

CALL sp_agregar_fk('cliente_medidas', 'fk_cliente_medidas_usuario',
                   'usuario_creado', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 5. CLIENTE_PRENDA  (prenda asociada a un cliente)
-- =============================================================================
CALL sp_agregar_fk('cliente_prenda', 'fk_cliente_prenda_cliente',
                   'cliente_id', 'clientes', 'cliente_id',
                   'CASCADE', 'CASCADE');

CALL sp_agregar_fk('cliente_prenda', 'fk_cliente_prenda_tipo_prenda',
                   'tipo_prenda_id', 'tipo_prendas', 'tipo_prendas_id',
                   'RESTRICT', 'CASCADE');

-- usuario_creador es NOT NULL — usamos RESTRICT (no SET NULL)
CALL sp_agregar_fk('cliente_prenda', 'fk_cliente_prenda_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'RESTRICT', 'CASCADE');

-- =============================================================================
-- 6. CLIENTE_PRENDA_IMG, CLIENTE_PRENDA_MATERIAL, CLIENTE_PRENDA_MEDIDAS
-- (todas hijas de cliente_prenda — CASCADE al eliminar la prenda)
-- =============================================================================
CALL sp_agregar_fk('cliente_prenda_img', 'fk_cliente_prenda_img_prenda',
                   'cliente_prenda_id', 'cliente_prenda', 'cliente_prenda_id',
                   'CASCADE', 'CASCADE');

CALL sp_agregar_fk('cliente_prenda_material', 'fk_cliente_prenda_material_prenda',
                   'cliente_prenda_id', 'cliente_prenda', 'cliente_prenda_id',
                   'CASCADE', 'CASCADE');

CALL sp_agregar_fk('cliente_prenda_material', 'fk_cliente_prenda_material_material',
                   'material_id', 'materiales', 'material_id',
                   'RESTRICT', 'CASCADE');

CALL sp_agregar_fk('cliente_prenda_material', 'fk_cliente_prenda_material_unidad',
                   'unidad_id', 'unidades_medida', 'unidad_id',
                   'RESTRICT', 'CASCADE');

CALL sp_agregar_fk('cliente_prenda_medidas', 'fk_cliente_prenda_medidas_prenda',
                   'cliente_prenda_id', 'cliente_prenda', 'cliente_prenda_id',
                   'CASCADE', 'CASCADE');

CALL sp_agregar_fk('cliente_prenda_medidas', 'fk_cliente_prenda_medidas_tipo',
                   'tipo_medida_id', 'tipo_medidas', 'tipo_medida_id',
                   'RESTRICT', 'CASCADE');

-- usuario_creado es NOT NULL en esta tabla — RESTRICT
CALL sp_agregar_fk('cliente_prenda_medidas', 'fk_cliente_prenda_medidas_usuario',
                   'usuario_creado', 'usuarios', 'usuario_id',
                   'RESTRICT', 'CASCADE');

-- =============================================================================
-- 7. COTIZACIONES — solo falta la FK del usuario creador
-- =============================================================================
CALL sp_agregar_fk('cotizaciones', 'fk_cotizaciones_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 8. DETALLE_EXISTENCIAS — falta la FK del usuario que hizo el movimiento
-- =============================================================================
CALL sp_agregar_fk('detalle_existencias', 'fk_detalle_existencias_usuario',
                   'usuario_modif', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 9. MATERIALES — categoria y usuario creador
-- =============================================================================
CALL sp_agregar_fk('materiales', 'fk_materiales_categoria',
                   'categoria_id', 'categorias_material', 'categoria_id',
                   'RESTRICT', 'CASCADE');

CALL sp_agregar_fk('materiales', 'fk_materiales_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 10. MATERIALES_IMG — hija de materiales (CASCADE al borrar el material)
-- =============================================================================
CALL sp_agregar_fk('materiales_img', 'fk_materiales_img_material',
                   'material_id', 'materiales', 'material_id',
                   'CASCADE', 'CASCADE');

-- =============================================================================
-- 11. MEDIDAS_PRENDA  (qué tipos de medida aplican a una prenda)
-- =============================================================================
CALL sp_agregar_fk('medidas_prenda', 'fk_medidas_prenda_prenda',
                   'prenda_id', 'prendas', 'prenda_id',
                   'CASCADE', 'CASCADE');

CALL sp_agregar_fk('medidas_prenda', 'fk_medidas_prenda_tipo',
                   'tipo_medida_Id', 'tipo_medidas', 'tipo_medida_id',
                   'CASCADE', 'CASCADE');

-- =============================================================================
-- 12. PAGOS_CLIENTE — falta usuario creador del recibo
-- =============================================================================
CALL sp_agregar_fk('pagos_cliente', 'fk_pagos_cliente_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 13. PASSWORD_RESET_TOKENS — falta la referencia opcional al usuario
-- =============================================================================
CALL sp_agregar_fk('password_reset_tokens', 'fk_reset_tokens_usuario',
                   'usuario_id', 'usuarios', 'usuario_id',
                   'CASCADE', 'CASCADE');

-- =============================================================================
-- 14. PERMISOS_ROL — la FK del rol existe; falta la del permiso
-- =============================================================================
CALL sp_agregar_fk('permisos_rol', 'fk_permisos_rol_permiso',
                   'permiso_id', 'permisos', 'permiso_id',
                   'CASCADE', 'CASCADE');

-- =============================================================================
-- 15. PLANES_PAGO — falta usuario creador del plan
-- =============================================================================
CALL sp_agregar_fk('planes_pago', 'fk_planes_pago_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 16. PRENDAS_IMG — hija de prendas (CASCADE al borrar la prenda)
-- =============================================================================
CALL sp_agregar_fk('prendas_img', 'fk_prendas_img_prenda',
                   'prenda_id', 'prendas', 'prenda_id',
                   'CASCADE', 'CASCADE');

-- =============================================================================
-- 17. ROLES — usuario_creador (auto-referencia indirecta vía usuarios)
-- =============================================================================
CALL sp_agregar_fk('roles', 'fk_roles_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 18. TIPO_MEDIDAS — usuario que creó el catálogo
-- =============================================================================
CALL sp_agregar_fk('tipo_medidas', 'fk_tipo_medidas_usuario',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- 19. USUARIOS — self-reference para auditar quién creó el usuario
-- =============================================================================
CALL sp_agregar_fk('usuarios', 'fk_usuarios_usuario_creador',
                   'usuario_creador', 'usuarios', 'usuario_id',
                   'SET NULL', 'CASCADE');

-- =============================================================================
-- LIMPIEZA: liberar el procedure helper y restaurar FK checks
-- =============================================================================
DROP PROCEDURE IF EXISTS sp_agregar_fk;
SET FOREIGN_KEY_CHECKS = @OLD_FK_CHECKS;

-- =============================================================================
-- LIMPIEZA OPCIONAL DE DATOS (sólo correr si una FK falla con error 1452)
-- =============================================================================
-- Si tenés filas con valores que apuntan a IDs inexistentes, los siguientes
-- UPDATE/DELETE las dejan en NULL o las eliminan según corresponda. NO se
-- ejecutan automáticamente — descomentá lo que necesites.

-- -- Audit fields (poner NULL en orphan references):
-- UPDATE categorias_material SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE cotizaciones SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE detalle_existencias SET usuario_modif = NULL
--  WHERE usuario_modif IS NOT NULL
--    AND usuario_modif NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE materiales SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE pagos_cliente SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE planes_pago SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE roles SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE tipo_medidas SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);
--
-- UPDATE usuarios SET usuario_creador = NULL
--  WHERE usuario_creador IS NOT NULL
--    AND usuario_creador NOT IN (SELECT usuario_id FROM usuarios);

-- -- Hijas con orphan references — BORRARÍAS la fila huérfana:
-- DELETE FROM cliente_prenda_img
--  WHERE cliente_prenda_id NOT IN (SELECT cliente_prenda_id FROM cliente_prenda);
--
-- DELETE FROM cliente_prenda_material
--  WHERE cliente_prenda_id NOT IN (SELECT cliente_prenda_id FROM cliente_prenda);
--
-- DELETE FROM materiales_img
--  WHERE material_id NOT IN (SELECT material_id FROM materiales);
--
-- DELETE FROM medidas_prenda
--  WHERE prenda_id NOT IN (SELECT prenda_id FROM prendas);
--
-- DELETE FROM prendas_img
--  WHERE prenda_id NOT IN (SELECT prenda_id FROM prendas);
