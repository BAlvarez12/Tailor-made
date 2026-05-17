-- ============================================================
-- Script: Tablas de cotizaciones - BeautyBell / Tailor-Made
-- Ejecutar en la base de datos: beautybell
-- ============================================================

USE beautybell;

-- ------------------------------------------------------------
-- Tabla principal de cotizaciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cotizaciones` (
  `cotizacion_id` INT NOT NULL AUTO_INCREMENT,
  `codigo_cotizacion` VARCHAR(25) NOT NULL,
  `cliente_id` INT NOT NULL,
  `cliente_prenda_id` INT NOT NULL,
  `titulo_prenda` VARCHAR(150) DEFAULT NULL,
  `tipo_prenda_nombre` VARCHAR(100) DEFAULT NULL,
  `cliente_nombre` VARCHAR(120) NOT NULL,
  `cliente_telefono` VARCHAR(30) DEFAULT NULL,
  `valor_total` DECIMAL(12,2) NOT NULL,
  `notas` TEXT DEFAULT NULL,
  `estado` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_creado` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` INT DEFAULT NULL,
  PRIMARY KEY (`cotizacion_id`),
  UNIQUE KEY `uk_codigo_cotizacion` (`codigo_cotizacion`),
  KEY `idx_cotiz_cliente` (`cliente_id`),
  KEY `idx_cotiz_prenda` (`cliente_prenda_id`),
  KEY `idx_cotiz_fecha` (`fecha_creado`),
  KEY `idx_cotiz_busqueda_nombre` (`cliente_nombre`),
  KEY `idx_cotiz_busqueda_telefono` (`cliente_telefono`),
  CONSTRAINT `fk_cotiz_cliente`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  CONSTRAINT `fk_cotiz_cliente_prenda`
    FOREIGN KEY (`cliente_prenda_id`) REFERENCES `cliente_prenda` (`cliente_prenda_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- Medidas incluidas en la cotización (snapshot al crear)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cotizacion_medidas` (
  `cotizacion_medida_id` INT NOT NULL AUTO_INCREMENT,
  `cotizacion_id` INT NOT NULL,
  `nombre_tipo_medida` VARCHAR(100) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `unidad_label` VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (`cotizacion_medida_id`),
  KEY `idx_cotiz_medida_cotizacion` (`cotizacion_id`),
  CONSTRAINT `fk_cotiz_medida_cotizacion`
    FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`cotizacion_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- Materiales incluidos en la cotización (snapshot al crear)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cotizacion_materiales` (
  `cotizacion_material_id` INT NOT NULL AUTO_INCREMENT,
  `cotizacion_id` INT NOT NULL,
  `nombre_material` VARCHAR(150) NOT NULL,
  `cantidad` DECIMAL(10,2) NOT NULL DEFAULT 1,
  `precio_unitario` DECIMAL(10,2) DEFAULT NULL,
  `observaciones` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`cotizacion_material_id`),
  KEY `idx_cotiz_material_cotizacion` (`cotizacion_id`),
  CONSTRAINT `fk_cotiz_material_cotizacion`
    FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`cotizacion_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
