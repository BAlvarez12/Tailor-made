-- Tokens de recuperación de contraseña (código de un solo uso, 5 minutos)
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `token_id` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(100) NOT NULL,
  `usuario_id` INT NULL,
  `codigo_hash` VARCHAR(255) NOT NULL,
  `expira_en` DATETIME NOT NULL,
  `usado` TINYINT(1) NOT NULL DEFAULT 0,
  `invalidado` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha_creado` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  KEY `idx_reset_usuario` (`usuario`),
  KEY `idx_reset_expira` (`expira_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
