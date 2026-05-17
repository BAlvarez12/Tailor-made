
CREATE TABLE IF NOT EXISTS `planes_pago` (
  `plan_pago_id` INT NOT NULL AUTO_INCREMENT,
  `codigo_plan` VARCHAR(25) NOT NULL,
  `cotizacion_id` INT NOT NULL,
  `cliente_id` INT NOT NULL,
  `codigo_cotizacion` VARCHAR(25) NOT NULL,
  `cliente_nombre` VARCHAR(120) NOT NULL,
  `cliente_telefono` VARCHAR(30) DEFAULT NULL,
  `valor_cotizacion_original` DECIMAL(12,2) NOT NULL,
  `valor_a_cobrar` DECIMAL(12,2) NOT NULL,
  `cantidad_pagos` INT NOT NULL DEFAULT 1,
  `valor_anticipo` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_abonado` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `saldo_pendiente` DECIMAL(12,2) NOT NULL,
  `notas` TEXT DEFAULT NULL,
  `estado` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_creado` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` INT DEFAULT NULL,
  PRIMARY KEY (`plan_pago_id`),
  UNIQUE KEY `uk_codigo_plan` (`codigo_plan`),
  UNIQUE KEY `uk_plan_cotizacion` (`cotizacion_id`),
  KEY `idx_plan_cliente` (`cliente_id`),
  KEY `idx_plan_fecha` (`fecha_creado`),
  CONSTRAINT `fk_plan_cotizacion`
    FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`cotizacion_id`),
  CONSTRAINT `fk_plan_cliente`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ------------------------------------------------------------
-- Pagos registrados (recibos / abonos)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `pagos_cliente` (
  `pago_cliente_id` INT NOT NULL AUTO_INCREMENT,
  `plan_pago_id` INT NOT NULL,
  `codigo_recibo` VARCHAR(25) NOT NULL,
  `monto` DECIMAL(12,2) NOT NULL,
  `numero_transferencia` VARCHAR(80) DEFAULT NULL,
  `tipo_pago` ENUM('anticipo','abono','otro') NOT NULL DEFAULT 'abono',
  `notas` TEXT DEFAULT NULL,
  `fecha_pago` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_registro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` INT DEFAULT NULL,
  PRIMARY KEY (`pago_cliente_id`),
  UNIQUE KEY `uk_codigo_recibo` (`codigo_recibo`),
  KEY `idx_pago_plan` (`plan_pago_id`),
  KEY `idx_pago_fecha` (`fecha_pago`),
  CONSTRAINT `fk_pago_plan`
    FOREIGN KEY (`plan_pago_id`) REFERENCES `planes_pago` (`plan_pago_id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
