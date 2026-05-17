-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: tailor-made
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias_material`
--

DROP TABLE IF EXISTS `categorias_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias_material` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre_categoria` varchar(100) DEFAULT NULL,
  `descripcion_categoria` varchar(300) DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente_medidas`
--

DROP TABLE IF EXISTS `cliente_medidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_medidas` (
  `cliente_medida_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `tipo_medida_id` int DEFAULT NULL,
  `unidad_id` int DEFAULT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `fecha_creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creado` int DEFAULT NULL,
  `fecha_actualizado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cliente_medida_id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente_prenda`
--

DROP TABLE IF EXISTS `cliente_prenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_prenda` (
  `cliente_prenda_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `tipo_prenda_id` int NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int NOT NULL,
  PRIMARY KEY (`cliente_prenda_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente_prenda_img`
--

DROP TABLE IF EXISTS `cliente_prenda_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_prenda_img` (
  `cliente_prenda_id` int DEFAULT NULL,
  `url_img` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente_prenda_material`
--

DROP TABLE IF EXISTS `cliente_prenda_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_prenda_material` (
  `cliente_p_material_id` int NOT NULL AUTO_INCREMENT,
  `cliente_prenda_id` int DEFAULT NULL,
  `material_id` int DEFAULT NULL,
  `cantidad` decimal(10,0) DEFAULT NULL,
  `unidad_id` int DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cliente_p_material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente_prenda_medidas`
--

DROP TABLE IF EXISTS `cliente_prenda_medidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente_prenda_medidas` (
  `cliente_medida_id` int NOT NULL AUTO_INCREMENT,
  `cliente_prenda_id` int NOT NULL,
  `tipo_medida_id` int NOT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creado` int NOT NULL,
  PRIMARY KEY (`cliente_medida_id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `cliente_id` int NOT NULL AUTO_INCREMENT,
  `nombre_cliente` varchar(50) DEFAULT NULL,
  `apellido_cliente` varchar(50) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`cliente_id`),
  KEY `usuario_creador_idx` (`usuario_creador`),
  CONSTRAINT `usuario_creador` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cotizacion_materiales`
--

DROP TABLE IF EXISTS `cotizacion_materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_materiales` (
  `cotizacion_material_id` int NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int NOT NULL,
  `nombre_material` varchar(150) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT '1.00',
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cotizacion_material_id`),
  KEY `idx_cotiz_material_cotizacion` (`cotizacion_id`),
  CONSTRAINT `fk_cotiz_material_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`cotizacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cotizacion_medidas`
--

DROP TABLE IF EXISTS `cotizacion_medidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion_medidas` (
  `cotizacion_medida_id` int NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int NOT NULL,
  `nombre_tipo_medida` varchar(100) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `unidad_label` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cotizacion_medida_id`),
  KEY `idx_cotiz_medida_cotizacion` (`cotizacion_id`),
  CONSTRAINT `fk_cotiz_medida_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`cotizacion_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cotizaciones`
--

DROP TABLE IF EXISTS `cotizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizaciones` (
  `cotizacion_id` int NOT NULL AUTO_INCREMENT,
  `codigo_cotizacion` varchar(25) NOT NULL,
  `cliente_id` int NOT NULL,
  `cliente_prenda_id` int NOT NULL,
  `titulo_prenda` varchar(150) DEFAULT NULL,
  `tipo_prenda_nombre` varchar(100) DEFAULT NULL,
  `cliente_nombre` varchar(120) NOT NULL,
  `cliente_telefono` varchar(30) DEFAULT NULL,
  `valor_total` decimal(12,2) NOT NULL,
  `notas` text,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`cotizacion_id`),
  UNIQUE KEY `uk_codigo_cotizacion` (`codigo_cotizacion`),
  KEY `idx_cotiz_cliente` (`cliente_id`),
  KEY `idx_cotiz_prenda` (`cliente_prenda_id`),
  KEY `idx_cotiz_fecha` (`fecha_creado`),
  KEY `idx_cotiz_busqueda_nombre` (`cliente_nombre`),
  KEY `idx_cotiz_busqueda_telefono` (`cliente_telefono`),
  CONSTRAINT `fk_cotiz_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  CONSTRAINT `fk_cotiz_cliente_prenda` FOREIGN KEY (`cliente_prenda_id`) REFERENCES `cliente_prenda` (`cliente_prenda_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_existencias`
--

DROP TABLE IF EXISTS `detalle_existencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_existencias` (
  `detalle_id` int NOT NULL AUTO_INCREMENT,
  `material_id` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `tipo` varchar(10) DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_modif` int DEFAULT NULL,
  `exis_inicial` int DEFAULT NULL,
  `exis_final` int DEFAULT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `fk_material` (`material_id`),
  CONSTRAINT `fk_material` FOREIGN KEY (`material_id`) REFERENCES `materiales` (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `materiales`
--

DROP TABLE IF EXISTS `materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales` (
  `material_id` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int DEFAULT NULL,
  `nombre_material` varchar(150) DEFAULT NULL,
  `descripcion_material` text,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `referencia_compra` varchar(200) DEFAULT NULL,
  `estado` tinyint NOT NULL DEFAULT '1',
  `fecha_creado` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` int DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `materiales_img`
--

DROP TABLE IF EXISTS `materiales_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materiales_img` (
  `material_id` int NOT NULL,
  `url_img` varchar(800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `medidas_prenda`
--

DROP TABLE IF EXISTS `medidas_prenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medidas_prenda` (
  `prenda_id` int NOT NULL,
  `tipo_medida_Id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pagos_cliente`
--

DROP TABLE IF EXISTS `pagos_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos_cliente` (
  `pago_cliente_id` int NOT NULL AUTO_INCREMENT,
  `plan_pago_id` int NOT NULL,
  `codigo_recibo` varchar(25) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `numero_transferencia` varchar(80) DEFAULT NULL,
  `tipo_pago` enum('anticipo','abono','otro') NOT NULL DEFAULT 'abono',
  `notas` text,
  `fecha_pago` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_registro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`pago_cliente_id`),
  UNIQUE KEY `uk_codigo_recibo` (`codigo_recibo`),
  KEY `idx_pago_plan` (`plan_pago_id`),
  KEY `idx_pago_fecha` (`fecha_pago`),
  CONSTRAINT `fk_pago_plan` FOREIGN KEY (`plan_pago_id`) REFERENCES `planes_pago` (`plan_pago_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `permiso_id` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`permiso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permisos_rol`
--

DROP TABLE IF EXISTS `permisos_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos_rol` (
  `permiso_id` int NOT NULL,
  `rol_id` int DEFAULT NULL,
  PRIMARY KEY (`permiso_id`),
  KEY `permisos_rol_idx` (`rol_id`),
  CONSTRAINT `permisos_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `planes_pago`
--

DROP TABLE IF EXISTS `planes_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planes_pago` (
  `plan_pago_id` int NOT NULL AUTO_INCREMENT,
  `codigo_plan` varchar(25) NOT NULL,
  `cotizacion_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `codigo_cotizacion` varchar(25) NOT NULL,
  `cliente_nombre` varchar(120) NOT NULL,
  `cliente_telefono` varchar(30) DEFAULT NULL,
  `valor_cotizacion_original` decimal(12,2) NOT NULL,
  `valor_a_cobrar` decimal(12,2) NOT NULL,
  `cantidad_pagos` int NOT NULL DEFAULT '1',
  `valor_anticipo` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_abonado` decimal(12,2) NOT NULL DEFAULT '0.00',
  `saldo_pendiente` decimal(12,2) NOT NULL,
  `notas` text,
  `estado` tinyint(1) NOT NULL DEFAULT '1',
  `fecha_creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`plan_pago_id`),
  UNIQUE KEY `uk_codigo_plan` (`codigo_plan`),
  UNIQUE KEY `uk_plan_cotizacion` (`cotizacion_id`),
  KEY `idx_plan_cliente` (`cliente_id`),
  KEY `idx_plan_fecha` (`fecha_creado`),
  CONSTRAINT `fk_plan_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  CONSTRAINT `fk_plan_cotizacion` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`cotizacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prendas`
--

DROP TABLE IF EXISTS `prendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prendas` (
  `prenda_id` int NOT NULL AUTO_INCREMENT,
  `nombre_prenda` varchar(100) DEFAULT NULL,
  `descripcion_prenda` varchar(255) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`prenda_id`),
  KEY `usuario_creador_idx` (`usuario_creador`),
  CONSTRAINT `usuario_creador2` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prendas_img`
--

DROP TABLE IF EXISTS `prendas_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prendas_img` (
  `prendas_img_id` int NOT NULL AUTO_INCREMENT,
  `prenda_id` int NOT NULL,
  `url_img` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`prendas_img_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_medidas`
--

DROP TABLE IF EXISTS `tipo_medidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_medidas` (
  `tipo_medida_id` int NOT NULL AUTO_INCREMENT,
  `nombre_tipo_medida` varchar(100) DEFAULT NULL,
  `descripcion_tipo_medida` varchar(300) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`tipo_medida_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tipo_prendas`
--

DROP TABLE IF EXISTS `tipo_prendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_prendas` (
  `tipo_prendas_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  PRIMARY KEY (`tipo_prendas_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `unidades_medida`
--

DROP TABLE IF EXISTS `unidades_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidades_medida` (
  `unidad_id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_unidad` varchar(20) NOT NULL,
  `simbolo_unidad` varchar(10) NOT NULL,
  `estado` int DEFAULT NULL,
  PRIMARY KEY (`unidad_id`),
  UNIQUE KEY `nombre` (`nombre_unidad`),
  UNIQUE KEY `simbolo` (`simbolo_unidad`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(45) DEFAULT NULL,
  `apellido_usuario` varchar(45) DEFAULT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `estado` int DEFAULT NULL,
  `rol_id` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  KEY `rol_idx` (`rol_id`),
  CONSTRAINT `rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-17  0:29:39
