-- Ejecutar en la base de datos del proyecto
CREATE TABLE IF NOT EXISTS `login_intentos` (
  `usuario` VARCHAR(100) NOT NULL,
  `intentos` INT NOT NULL DEFAULT 0,
  `bloqueado_hasta` DATETIME NULL DEFAULT NULL,
  `ultimo_intento` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
