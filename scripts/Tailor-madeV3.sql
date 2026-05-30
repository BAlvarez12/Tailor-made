CREATE DATABASE  IF NOT EXISTS `tailor_made` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tailor_made`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: tailor_made
-- ------------------------------------------------------
-- Server version	8.0.43

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `dpi` varchar(20) NOT NULL,
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`cliente_id`),
  UNIQUE KEY `uk_clientes_dpi` (`dpi`),
  KEY `usuario_creador_idx` (`usuario_creador`),
  CONSTRAINT `usuario_creador` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `log_operaciones`
--

DROP TABLE IF EXISTS `log_operaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_operaciones` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `accion` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entidad_id` int DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datos_antes` json DEFAULT NULL,
  `datos_despues` json DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_log_usuario` (`usuario_id`),
  KEY `idx_log_entidad` (`entidad`,`entidad_id`),
  KEY `idx_log_fecha` (`fecha`),
  KEY `idx_log_accion` (`accion`),
  CONSTRAINT `fk_log_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `login_intentos`
--

DROP TABLE IF EXISTS `login_intentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_intentos` (
  `usuario` varchar(100) NOT NULL,
  `intentos` int NOT NULL DEFAULT '0',
  `bloqueado_hasta` datetime DEFAULT NULL,
  `ultimo_intento` datetime DEFAULT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `token_id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `codigo_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_en` datetime NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `invalidado` tinyint(1) NOT NULL DEFAULT '0',
  `fecha_creado` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`token_id`),
  KEY `idx_reset_usuario` (`usuario`),
  KEY `idx_reset_expira` (`expira_en`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'tailor_made'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_actualizarCliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizarCliente`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_actualizarMedidasCliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_actualizarMedidasCliente`(
    IN p_cliente_id INT,
    IN p_tipo_medida_id INT,
    IN p_valor DECIMAL(10,2),
    IN p_usuario INT
)
BEGIN
    IF EXISTS (
        SELECT 1
        FROM cliente_medidas
        WHERE cliente_id = p_cliente_id
          AND tipo_medida_id = p_tipo_medida_id
    ) THEN

        UPDATE cliente_medidas
        SET 
            valor = p_valor,
            fecha_actualizado = NOW()
        WHERE 
            cliente_id = p_cliente_id
            AND tipo_medida_id = p_tipo_medida_id;

    ELSE

        INSERT INTO cliente_medidas(
            cliente_id,
            tipo_medida_id,
            unidad_id,
            valor,
            fecha_creado,
            fecha_actualizado,
            usuario_creado
        )
        VALUES (
            p_cliente_id,
            p_tipo_medida_id,
            2,
            p_valor,
            NOW(),
            NOW(),
            p_usuario
        );

    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crearCliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crearCliente`(
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_material` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_material`(
    IN p_categoria_id INT,
    IN p_nombre_material VARCHAR(255),
    IN p_descripcion_material TEXT,
    IN p_precio_unitario DECIMAL(10,2),
    IN p_referencia_compra VARCHAR(100),
    IN p_stock INT,
    IN p_usuario_creador INT
)
BEGIN
    DECLARE v_material_id INT;

    -- HANDLER (rollback automatico)
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al crear material';
    END;

    START TRANSACTION;

    INSERT INTO materiales (
        categoria_id,
        nombre_material,
        descripcion_material,
        precio_unitario,
        referencia_compra,
        stock,
        usuario_creador
    )
    VALUES (
        p_categoria_id,
        p_nombre_material,
        p_descripcion_material,
        p_precio_unitario,
        p_referencia_compra,
        p_stock,
        p_usuario_creador
    );

    SET v_material_id = LAST_INSERT_ID();

    COMMIT;

    SELECT v_material_id AS material_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_create_movimiento_existencias` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_create_movimiento_existencias`(
    IN p_material_id INT,
    IN p_cantidad INT,
    IN p_usuario INT
)
BEGIN
    DECLARE v_stock_actual INT;
    DECLARE v_stock_final INT;
    DECLARE v_tipo VARCHAR(10);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error en transacción';
    END;

    START TRANSACTION;

    SELECT stock INTO v_stock_actual
    FROM materiales
    WHERE material_id = p_material_id
    FOR UPDATE;

    IF v_stock_actual IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Material no existe';
    END IF;

    SET v_stock_final = v_stock_actual + p_cantidad;

    SET v_tipo = IF(p_cantidad > 0, 'ENTRADA', 'SALIDA');

    IF v_stock_final < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente';
    END IF;

    INSERT INTO detalle_existencias (
        material_id,
        cantidad,
        tipo,
        usuario_modif,
        exis_inicial,
        exis_final
    )
    VALUES (
        p_material_id,
        p_cantidad,
        v_tipo,
        p_usuario,
        v_stock_actual,
        v_stock_final
    );

    UPDATE materiales
    SET stock = v_stock_final
    WHERE material_id = p_material_id;

    COMMIT;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_delete_material` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_delete_material`(
    IN p_id INT
)
BEGIN
    UPDATE materiales
    SET estado = 0
    WHERE material_id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_categorias` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_categorias`()
BEGIN
    SELECT 
        categoria_id,
        nombre_categoria
    FROM categorias_material;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_materiales` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_materiales`()
BEGIN
    SELECT 
        m.material_id,
        m.categoria_id,
        m.nombre_material,
        m.descripcion_material,
        m.precio_unitario,
        m.referencia_compra,
        m.stock,
        c.nombre_categoria,
        SUBSTRING_INDEX(GROUP_CONCAT(img.url_img), ',', 1) AS url_img,
        GROUP_CONCAT(img.url_img) AS imagenes
    FROM materiales m
    LEFT JOIN categorias_material c 
        ON m.categoria_id = c.categoria_id
    LEFT JOIN materiales_img img 
        ON m.material_id = img.material_id
    WHERE m.estado = 1
    GROUP BY 
        m.material_id,
        m.categoria_id,
        m.nombre_material,
        m.descripcion_material,
        m.precio_unitario,
        m.referencia_compra,
        m.stock,
        c.nombre_categoria
    ORDER BY m.fecha_creado DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_leerClientes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_leerClientes`()
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
  ORDER BY nombre_cliente ASC, apellido_cliente DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_MedidasRegistroCliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_MedidasRegistroCliente`(
    IN p_cliente_id INT,
    IN p_tipo_medida_id INT,
    IN p_unidad_id INT,
    IN p_valor DECIMAL(10,2),
    IN p_usuario INT
)
BEGIN

    INSERT INTO cliente_medidas(
        cliente_id,
        tipo_medida_id,
        unidad_id,
        valor,
        fecha_creado,
        fecha_actualizado,
        usuario_creado
    )
    VALUES (
        p_cliente_id,
        p_tipo_medida_id,
        p_unidad_id,
        p_valor,
        NOW(),
        NOW(),
        p_usuario
    );

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtenerMedidasCliente` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtenerMedidasCliente`(
    IN p_cliente_id INT
)
BEGIN

    SELECT 
        m.cliente_medida_id,
        m.tipo_medida_id,
        t.nombre_tipo_medida,
        m.valor
    FROM cliente_medidas m
    INNER JOIN tipo_medidas t 
        ON m.tipo_medida_id = t.tipo_medida_id
    WHERE m.cliente_id = p_cliente_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtenerTiposMedidaActivos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtenerTiposMedidaActivos`()
BEGIN
    SELECT 
        tipo_medida_id,
        nombre_tipo_medida,
        descripcion_tipo_medida
    FROM tipo_medidas
    WHERE estado = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtener_materiales_activos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtener_materiales_activos`()
BEGIN
    SELECT
        material_id,
        categoria_id,
        nombre_material,
        descripcion_material,
        precio_unitario,
        referencia_compra,
        estado,
        fecha_creado,
        usuario_creador,
        stock
    FROM materiales
    WHERE estado = 1
    ORDER BY nombre_material DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_unidades_archive` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unidades_archive`(
    IN p_id INT
)
BEGIN
    UPDATE unidades_medida
    SET estado = 0
    WHERE unidad_id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_unidades_create` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unidades_create`(
    IN p_nombre VARCHAR(100),
    IN p_simbolo VARCHAR(20)
)
BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe
    FROM unidades_medida
    WHERE nombre_unidad = p_nombre;

    IF existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La unidad ya existe';
    ELSE
        INSERT INTO unidades_medida (nombre_unidad, simbolo_unidad, estado)
        VALUES (p_nombre, p_simbolo, 1);
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_unidades_get` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unidades_get`(
    IN p_archivados TINYINT
)
BEGIN
    IF p_archivados = 1 THEN
        SELECT unidad_id, nombre_unidad, simbolo_unidad, estado
        FROM unidades_medida
        WHERE estado = 0
        ORDER BY nombre_unidad ASC;
    ELSE
        SELECT unidad_id, nombre_unidad, simbolo_unidad, estado
        FROM unidades_medida
        WHERE estado = 1
        ORDER BY nombre_unidad ASC;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_unidades_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unidades_update`(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_simbolo VARCHAR(20)
)
BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe
    FROM unidades_medida
    WHERE nombre_unidad = p_nombre
      AND unidad_id <> p_id;

    IF existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La unidad ya existe';
    ELSE
        UPDATE unidades_medida
        SET nombre_unidad = p_nombre,
            simbolo_unidad = p_simbolo
        WHERE unidad_id = p_id;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-29 21:01:51
