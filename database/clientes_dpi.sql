-- Ejecutar en MySQL antes de usar el campo DPI en la app

ALTER TABLE `clientes`
  ADD COLUMN `dpi` VARCHAR(20) NULL DEFAULT NULL AFTER `telefono`,
  ADD UNIQUE KEY `uk_clientes_dpi` (`dpi`);

DROP PROCEDURE IF EXISTS `sp_crearCliente`;
DELIMITER $$
CREATE PROCEDURE `sp_crearCliente`(
  IN p_nombre VARCHAR(50),
  IN p_apellido VARCHAR(50),
  IN p_telefono VARCHAR(30),
  IN p_dpi VARCHAR(20),
  IN p_usuario INT
)
BEGIN
  INSERT INTO clientes (
    nombre_cliente,
    apellido_cliente,
    telefono,
    dpi,
    fecha_creado,
    usuario_creador,
    estado
  ) VALUES (
    p_nombre,
    p_apellido,
    p_telefono,
    p_dpi,
    NOW(),
    p_usuario,
    1
  );

  SELECT LAST_INSERT_ID() AS cliente_id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_actualizarCliente`;
DELIMITER $$
CREATE PROCEDURE `sp_actualizarCliente`(
  IN p_id INT,
  IN p_nombre VARCHAR(50),
  IN p_apellido VARCHAR(50),
  IN p_telefono VARCHAR(30),
  IN p_dpi VARCHAR(20),
  IN p_estado TINYINT
)
BEGIN
  UPDATE clientes
  SET
    nombre_cliente = p_nombre,
    apellido_cliente = p_apellido,
    telefono = p_telefono,
    dpi = p_dpi,
    estado = p_estado
  WHERE cliente_id = p_id;
END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_leerClientes`;
DELIMITER $$
CREATE PROCEDURE `sp_leerClientes`()
BEGIN
  SELECT
    cliente_id,
    nombre_cliente,
    apellido_cliente,
    telefono,
    dpi,
    fecha_creado,
    usuario_creador,
    estado
  FROM clientes
  ORDER BY fecha_creado DESC, cliente_id DESC;
END$$
DELIMITER ;
