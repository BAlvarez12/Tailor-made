CREATE DATABASE  IF NOT EXISTS `beautybell` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `beautybell`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: beautybell
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;FV
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
-- Dumping data for table `categorias_material`
--

LOCK TABLES `categorias_material` WRITE;
/*!40000 ALTER TABLE `categorias_material` DISABLE KEYS */;
INSERT INTO `categorias_material` VALUES (9,'Telas principales','Telas base para la confección de prendas','2026-03-21 10:34:49',1),(10,'Forros','Materiales internos para acabado de prendas','2026-03-21 10:34:49',1),(11,'Entretelas y refuerzos','Materiales para dar estructura y firmeza','2026-03-21 10:34:49',1),(12,'Hilos','Hilos utilizados en costura y bordado','2026-03-21 10:34:49',1),(13,'Botones y cierres','Elementos de cierre y ajuste para prendas','2026-03-21 10:34:49',1),(14,'Elásticos y cintas','Materiales flexibles y decorativos para ajuste','2026-03-21 10:34:49',1),(15,'Encajes y adornos','Elementos decorativos para prendas','2026-03-21 10:34:49',1),(16,'Estructura y volumen','Materiales para dar forma y volumen','2026-03-21 10:34:49',1),(17,'Patronaje y corte','Materiales auxiliares para diseño y corte','2026-03-21 10:34:49',1),(18,'Herrajes','Accesorios metálicos para confección','2026-03-21 10:34:49',1),(19,'Acabados','Materiales para terminación y presentación final','2026-03-21 10:34:49',1);
/*!40000 ALTER TABLE `categorias_material` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_medidas`
--

LOCK TABLES `cliente_medidas` WRITE;
/*!40000 ALTER TABLE `cliente_medidas` DISABLE KEYS */;
INSERT INTO `cliente_medidas` VALUES (46,7,1,2,1.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(47,7,2,2,2.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(48,7,3,2,3.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(49,7,4,2,4.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(50,7,5,2,5.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(51,7,6,2,6.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(52,7,7,2,7.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(53,7,8,2,8.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(54,7,9,2,9.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(55,7,10,2,1.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(56,7,11,2,2.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(57,7,12,2,3.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(58,7,13,2,4.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(59,7,14,2,5.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(60,7,15,2,6.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(61,7,16,2,7.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(62,7,17,2,8.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(63,7,18,2,9.00,'2026-04-08 17:09:01',1,'2026-04-08 17:09:01'),(64,8,2,2,1.00,'2026-04-08 17:33:57',1,'2026-04-08 17:33:57'),(65,8,4,2,2.00,'2026-04-08 17:33:57',1,'2026-04-08 17:33:57'),(66,8,6,2,3.00,'2026-04-08 17:33:57',1,'2026-04-08 17:33:57'),(67,8,8,2,4.00,'2026-04-08 17:33:57',1,'2026-04-08 17:33:57'),(68,8,10,2,5.00,'2026-04-08 17:33:57',1,'2026-04-08 17:33:57'),(69,9,2,2,1.00,'2026-04-08 17:50:41',1,'2026-04-08 17:51:47'),(70,9,3,2,2.00,'2026-04-08 17:51:03',1,'2026-04-08 17:51:47'),(71,9,4,2,3.00,'2026-04-08 17:51:03',1,'2026-04-08 17:51:47'),(72,9,5,2,4.00,'2026-04-08 17:51:03',1,'2026-04-08 17:51:47'),(73,9,6,2,5.00,'2026-04-08 17:51:03',1,'2026-04-08 17:51:47'),(74,9,7,2,2.00,'2026-04-08 17:51:47',1,'2026-04-08 17:51:47'),(75,9,8,2,3.00,'2026-04-08 17:51:47',1,'2026-04-08 17:51:47'),(76,16,2,2,2.00,'2026-04-08 18:30:53',1,'2026-04-08 18:30:53'),(77,16,4,2,3.00,'2026-04-08 18:30:53',1,'2026-04-08 18:30:53'),(78,16,6,2,5.00,'2026-04-08 18:30:53',1,'2026-04-08 18:30:53'),(79,16,9,2,5.00,'2026-04-08 18:30:53',1,'2026-04-08 18:30:53'),(80,17,3,2,2.00,'2026-04-08 18:33:57',1,'2026-04-08 18:33:57'),(81,17,5,2,9.00,'2026-04-08 18:33:57',1,'2026-04-08 18:33:57'),(82,18,3,2,5.00,'2026-04-08 18:34:24',1,'2026-04-08 18:34:24'),(83,18,12,2,7.00,'2026-04-08 18:34:24',1,'2026-04-08 18:34:24');
/*!40000 ALTER TABLE `cliente_medidas` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_prenda`
--

LOCK TABLES `cliente_prenda` WRITE;
/*!40000 ALTER TABLE `cliente_prenda` DISABLE KEYS */;
INSERT INTO `cliente_prenda` VALUES (3,1,2,'Camisa de lona con botones plasticos y bolsas a la izquierda',1,'2026-03-21 11:38:56',1),(4,3,3,'Vestido color vino',1,'2026-03-21 11:56:39',1),(5,1,2,'Camisola del real madrid',1,'2026-03-21 12:41:06',1);
/*!40000 ALTER TABLE `cliente_prenda` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `cliente_prenda_img`
--

LOCK TABLES `cliente_prenda_img` WRITE;
/*!40000 ALTER TABLE `cliente_prenda_img` DISABLE KEYS */;
INSERT INTO `cliente_prenda_img` VALUES (3,'/uploads/prendas/1774114736381_11114_CAM120_AZUL_CAMISA_CUELLO_NORMAL_AZUL_MARINO_MANGA_CORTA_E.webp'),(3,'/uploads/prendas/1774114736384_1-6926.webp'),(4,'/uploads/prendas/1774115799656_00100035963_XM.webp'),(5,'/uploads/prendas/1774118466132_1-6926.webp'),(5,'/uploads/prendas/1774118466134_11114_CAM120_AZUL_CAMISA_CUELLO_NORMAL_AZUL_MARINO_MANGA_CORTA_E.webp');
/*!40000 ALTER TABLE `cliente_prenda_img` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_prenda_material`
--

LOCK TABLES `cliente_prenda_material` WRITE;
/*!40000 ALTER TABLE `cliente_prenda_material` DISABLE KEYS */;
INSERT INTO `cliente_prenda_material` VALUES (1,3,23,1,1,'','2026-03-21 11:38:56','1'),(2,4,33,1,1,'','2026-03-21 11:56:40','1');
/*!40000 ALTER TABLE `cliente_prenda_material` ENABLE KEYS */;
UNLOCK TABLES;

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
  `unidad_id` int NOT NULL,
  `valor` decimal(10,2) DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creado` int NOT NULL,
  PRIMARY KEY (`cliente_medida_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_prenda_medidas`
--

LOCK TABLES `cliente_prenda_medidas` WRITE;
/*!40000 ALTER TABLE `cliente_prenda_medidas` DISABLE KEYS */;
INSERT INTO `cliente_prenda_medidas` VALUES (3,3,7,1,1.00,'2026-03-21 11:38:56',1),(4,4,5,1,5.00,'2026-03-21 11:56:40',1),(6,5,6,1,2.50,'2026-03-21 13:57:02',1),(7,5,15,1,6.20,'2026-03-21 13:57:02',1);
/*!40000 ALTER TABLE `cliente_prenda_medidas` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Bryann','Osorio','78541245',0,'2026-03-21 09:58:29',1),(2,'Marlon','Herrera','87451245',1,'2026-03-21 09:58:55',1),(3,'Patrick','Maldonado','65451223',1,'2026-03-21 09:59:15',1),(4,'Chat','GPT','12345678',1,'2026-04-08 14:30:13',1),(5,'Cliente 1','Cliente 1','12345678',1,'2026-04-08 15:36:44',1),(6,'Cliente2','Cliente2','12345678',1,'2026-04-08 15:38:39',1),(7,'Prueba1','Prueba1','12345678',1,'2026-04-08 17:08:48',1),(8,'Nellys','Lopez','12345678',1,'2026-04-08 17:25:20',1),(9,'tests','test','12345678',1,'2026-04-08 17:50:32',1),(10,'Alejandro','Lopez','12345678',1,'2026-04-08 18:10:22',1),(11,'Alejandro','Lopez','12345678',1,'2026-04-08 18:14:39',1),(12,'Wilber','Uscap','12345678',1,'2026-04-08 18:15:23',1),(13,'Wilber','Uscap','12345678',1,'2026-04-08 18:16:49',1),(14,'tesssssssssssssssssss','tttttttt','12345678',1,'2026-04-08 18:17:37',1),(15,'tesssssssssssssssssss','tttttttt','12345678',1,'2026-04-08 18:19:39',1),(16,'TWWWWWWWWWW','tttttttt','12345678',1,'2026-04-08 18:21:04',1),(17,'hana','lu','87654321',1,'2026-04-08 18:32:09',1),(18,'tm','tom','87654321',1,'2026-04-08 18:34:12',1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `detalle_existencias`
--

LOCK TABLES `detalle_existencias` WRITE;
/*!40000 ALTER TABLE `detalle_existencias` DISABLE KEYS */;
INSERT INTO `detalle_existencias` VALUES (1,59,11,'ENTRADA','2026-03-28 00:20:32',NULL,NULL,NULL),(2,59,-6,'SALIDA','2026-03-28 00:26:07',NULL,NULL,NULL),(3,68,6,'ENTRADA','2026-03-28 17:30:50',4,NULL,NULL),(4,68,-8,'SALIDA','2026-03-28 17:41:19',4,18,10),(5,69,3,'ENTRADA','2026-03-28 17:59:04',4,3,6),(6,70,4,'ENTRADA','2026-03-28 18:16:07',4,1,5),(7,73,-29,'SALIDA','2026-03-30 23:39:54',4,99,70),(8,74,10,'ENTRADA','2026-04-04 12:23:00',3,100,110),(9,74,-5,'SALIDA','2026-04-04 12:23:52',3,110,105),(10,74,-105,'SALIDA','2026-04-04 12:25:03',3,105,0),(11,74,5,'ENTRADA','2026-04-04 12:25:26',3,0,5),(12,75,-5,'SALIDA','2026-04-04 18:03:28',4,10,5),(13,75,5,'ENTRADA','2026-04-04 18:07:31',4,5,10),(14,75,-5,'SALIDA','2026-04-04 18:07:40',4,10,5),(15,75,-1,'SALIDA','2026-04-04 18:09:34',4,5,4),(16,75,1,'ENTRADA','2026-04-04 18:22:15',4,4,5),(17,75,-1,'SALIDA','2026-04-04 18:23:07',4,5,4),(18,75,1,'ENTRADA','2026-04-04 18:26:29',4,4,5),(19,75,-1,'SALIDA','2026-04-04 18:26:41',4,5,4),(20,75,1,'ENTRADA','2026-04-04 18:34:43',4,4,5),(21,76,3,'ENTRADA','2026-04-04 23:59:07',4,2,5),(22,76,5,'ENTRADA','2026-04-04 23:59:24',4,5,10),(23,76,-2,'SALIDA','2026-04-04 23:59:33',4,10,8),(24,78,3,'ENTRADA','2026-04-05 00:55:26',3,2,5),(25,78,47,'ENTRADA','2026-04-07 22:48:21',3,5,52),(26,78,47,'ENTRADA','2026-04-07 22:48:21',3,5,52),(27,78,47,'ENTRADA','2026-04-07 22:48:21',3,5,52),(28,78,47,'ENTRADA','2026-04-07 22:48:21',3,52,99),(29,78,36,'ENTRADA','2026-04-07 23:46:18',3,99,135),(30,78,65,'ENTRADA','2026-04-07 23:56:08',3,135,200),(31,78,-5,'SALIDA','2026-04-07 23:57:14',3,200,195),(32,1,7,'ENTRADA','2026-04-08 00:27:19',3,0,7);
/*!40000 ALTER TABLE `detalle_existencias` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (1,9,'Algodón','Tela suave y transpirable',35.00,'TEL-ALG-001',0,'2026-03-21 10:35:35',1,7),(2,9,'Lino','Tela fresca y ligera',48.00,'TEL-LIN-001',0,'2026-03-21 10:35:35',1,0),(3,9,'Popelina','Tela fina usada en camisas y blusas',32.00,'TEL-POP-001',0,'2026-03-21 10:35:35',1,0),(4,9,'Gabardina','Tela resistente para pantalones y sacos',55.00,'TEL-GAB-001',0,'2026-03-21 10:35:35',1,0),(5,9,'Satín','Tela brillante para vestidos y detalles',42.00,'TEL-SAT-001',0,'2026-03-21 10:35:35',1,0),(6,9,'Chifón','Tela ligera y transparente',46.00,'TEL-CHI-001',0,'2026-03-21 10:35:35',1,0),(7,9,'Denim','Tela fuerte tipo mezclilla',58.00,'TEL-DEN-001',0,'2026-03-21 10:35:35',1,0),(8,9,'Licra','Tela elástica para prendas ajustadas',40.00,'TEL-LIC-001',0,'2026-03-21 10:35:35',1,0),(9,10,'Forro poliéster','Forro ligero de poliéster',18.00,'FOR-POL-001',0,'2026-03-21 10:35:35',1,0),(10,10,'Forro satinado','Forro con acabado brillante',22.00,'FOR-SAT-001',0,'2026-03-21 10:35:35',1,0),(11,10,'Tafeta','Tela usada como forro y estructura ligera',24.00,'FOR-TAF-001',0,'2026-03-21 10:35:35',1,0),(12,10,'Acetato','Forro suave para prendas formales',20.00,'FOR-ACE-001',0,'2026-03-21 10:35:35',1,0),(13,11,'Entretela fusible','Entretela adhesiva para estructura',16.00,'ENT-FUS-001',0,'2026-03-21 10:35:35',1,0),(14,11,'Entretela no fusible','Entretela sin adhesivo',15.00,'ENT-NOF-001',0,'2026-03-21 10:35:35',1,0),(15,11,'Pellón','Refuerzo textil para varias áreas de la prenda',12.00,'ENT-PEL-001',0,'2026-03-21 10:35:35',1,0),(16,11,'Hombreras','Accesorio para dar forma a hombros',10.00,'ENT-HOM-001',0,'2026-03-21 10:35:35',1,0),(17,11,'Refuerzo para cuello','Material rígido para cuellos',14.00,'ENT-CUE-001',0,'2026-03-21 10:35:35',1,0),(18,12,'Hilo poliéster','Hilo resistente de uso general',8.00,'HIL-POL-001',0,'2026-03-21 10:35:35',1,0),(19,12,'Hilo algodón','Hilo de algodón para costura ligera',7.00,'HIL-ALG-001',0,'2026-03-21 10:35:35',1,0),(20,12,'Hilo overlock','Hilo especial para máquina overlock',9.50,'HIL-OVR-001',0,'2026-03-21 10:35:35',1,0),(21,12,'Hilo para bordar','Hilo decorativo para bordados',11.00,'HIL-BOR-001',0,'2026-03-21 10:35:35',1,0),(22,12,'Hilo elástico','Hilo flexible para costuras elásticas',12.50,'HIL-ELA-001',0,'2026-03-21 10:35:35',1,0),(23,13,'Botón plástico','Botón estándar de plástico',1.50,'BOC-BPL-001',0,'2026-03-21 10:35:35',1,0),(24,13,'Botón metálico','Botón decorativo metálico',2.50,'BOC-BMT-001',0,'2026-03-21 10:35:35',1,0),(25,13,'Cierre invisible','Cierre oculto para vestidos y faldas',6.00,'BOC-CIN-001',0,'2026-03-21 10:35:35',1,0),(26,13,'Cierre metálico','Cierre resistente de metal',7.50,'BOC-CMT-001',0,'2026-03-21 10:35:35',1,0),(27,13,'Broche de presión','Broche para cierre rápido',2.00,'BOC-BRP-001',0,'2026-03-21 10:35:35',1,0),(28,13,'Velcro','Sistema de cierre adhesivo textil',5.00,'BOC-VEL-001',0,'2026-03-21 10:35:35',1,0),(29,14,'Elástico delgado','Elástico fino para mangas y detalles',4.00,'ELC-EDL-001',0,'2026-03-21 10:35:35',1,0),(30,14,'Elástico grueso','Elástico para cintura y soporte',6.50,'ELC-EGR-001',0,'2026-03-21 10:35:35',1,0),(31,14,'Bies','Cinta para remates y acabados',3.50,'ELC-BIE-001',0,'2026-03-21 10:35:35',1,0),(32,14,'Cinta de raso','Cinta decorativa satinada',4.50,'ELC-RAS-001',0,'2026-03-21 10:35:35',1,0),(33,14,'Cordón','Cordón para ajuste o decoración',3.00,'ELC-COR-001',0,'2026-03-21 10:35:35',1,0),(34,15,'Encaje','Adorno textil decorativo',9.00,'EYA-ENC-001',0,'2026-03-21 10:35:35',1,0),(35,15,'Guipur','Encaje grueso decorativo',12.00,'EYA-GUI-001',0,'2026-03-21 10:35:35',1,0),(36,15,'Lentejuelas','Adorno brillante para prendas',8.00,'EYA-LEN-001',0,'2026-03-21 10:35:35',1,0),(37,15,'Perlas decorativas','Perlas para adorno en prendas',10.00,'EYA-PER-001',0,'2026-03-21 10:35:35',1,0),(38,15,'Aplicación bordada','Parche bordado decorativo',11.00,'EYA-APB-001',0,'2026-03-21 10:35:35',1,0),(39,16,'Crinolina','Material para dar volumen a faldas',14.00,'ESV-CRI-001',0,'2026-03-21 10:35:35',1,0),(40,16,'Tul rígido','Tul con firmeza para estructura',13.00,'ESV-TUL-001',0,'2026-03-21 10:35:35',1,0),(41,16,'Guata','Material de relleno para volumen',17.00,'ESV-GUA-001',0,'2026-03-21 10:35:35',1,0),(42,16,'Ballenas plásticas','Varillas para corsetería y estructura',15.00,'ESV-BPL-001',0,'2026-03-21 10:35:35',1,0),(43,16,'Copas para busto','Copas para vestidos o blusas',18.00,'ESV-COP-001',0,'2026-03-21 10:35:35',1,0),(44,17,'Papel para moldes','Papel especial para patrones',5.00,'PAC-PMO-001',0,'2026-03-21 10:35:35',1,0),(45,17,'Papel kraft','Papel resistente para diseño de moldes',4.50,'PAC-KRA-001',0,'2026-03-21 10:35:35',1,0),(46,17,'Cartón para patrones','Cartón grueso para patrones duraderos',7.00,'PAC-CAR-001',0,'2026-03-21 10:35:35',1,0),(47,17,'Tiza de sastre','Tiza para marcar tela',2.00,'PAC-TIZ-001',0,'2026-03-21 10:35:35',1,0),(48,17,'Jaboncillo','Marcador suave para tela',2.50,'PAC-JAB-001',0,'2026-03-21 10:35:35',1,0),(49,18,'Hebilla metálica','Hebilla para cinturones y ajustes',6.00,'HER-HEB-001',0,'2026-03-21 10:35:35',1,0),(50,18,'Argolla metálica','Argolla para tirantes o detalles',3.50,'HER-ARG-001',0,'2026-03-21 10:35:35',1,0),(51,18,'Ojal metálico','Ojal reforzado de metal',1.75,'HER-OJA-001',0,'2026-03-21 10:35:35',1,0),(52,18,'Remache','Pieza metálica para fijación',1.20,'HER-REM-001',0,'2026-03-21 10:35:35',1,0),(53,18,'Ajustador metálico','Pieza para regular tirantes o cintas',2.25,'HER-AJU-001',0,'2026-03-21 10:35:35',1,0),(54,19,'Etiqueta de talla','Etiqueta para talla de la prenda',0.80,'ACA-ETA-001',0,'2026-03-21 10:35:35',1,0),(55,19,'Etiqueta de marca','Etiqueta con marca del taller o negocio',1.00,'ACA-ETM-001',0,'2026-03-21 10:35:35',1,0),(56,19,'Etiqueta de composición','Etiqueta con materiales de la prenda',0.90,'ACA-ETC-001',0,'2026-03-21 10:35:35',1,0),(57,19,'Adhesivo textil','Pegamento para telas y acabados',9.00,'ACA-ADT-001',0,'2026-03-21 10:35:35',1,0),(58,19,'Cinta doble cara textil','Cinta adhesiva para ajustes temporales',7.50,'ACA-CDT-001',0,'2026-03-21 10:35:35',1,0),(59,17,'moldes','Prueba',1.00,'MOl343ew2',0,NULL,1,6),(60,9,'Nelly','Prueba',100.00,'N-3423',0,NULL,1,1),(61,11,'Prueba101','prueba101.',20.00,'VAR-01',0,'2026-03-28 01:22:13',1,5),(62,12,'Hilo rojo','Prueba103',5.00,'CO-k939',0,'2026-03-28 16:18:30',NULL,5),(63,11,'Algodón','Prueba104',35.00,'Al-w34',0,'2026-03-28 16:22:52',NULL,7),(64,10,'Algodón','prueba5',95.00,'TEL-ALG-0',0,'2026-03-28 16:41:57',4,6),(65,12,'Hilo azul','Prueba106',0.12,'He4t',0,'2026-03-28 16:55:12',4,2),(66,17,'Lui','Prueba107',10.00,'El124',0,'2026-03-28 17:11:22',4,1),(67,17,'Miguel','Prueba108',10.00,'El125',0,'2026-03-28 17:12:17',4,2),(68,12,'Hilo Jade','Prueba108',21.00,'JA34',0,'2026-03-28 17:20:08',4,10),(69,12,'hilo naranja','Prueba109',2.00,'H945',0,'2026-03-28 17:58:52',4,6),(70,12,'prueba110','prueba110',8.00,'prueba10',0,'2026-03-28 18:09:58',4,5),(71,12,'hilo ','prueba111',31.00,'34wt',0,'2026-03-28 18:20:55',4,6),(72,12,'Hilo','Preuba112',7.80,'CO23',0,'2026-03-30 23:16:41',4,4),(73,12,'HiloP','prueba112',0.75,'H-Prue',0,'2026-03-30 23:37:17',4,70),(74,10,'Algodón','Prueba113',200.00,'AL9w6',0,'2026-04-04 12:09:04',3,5),(75,15,'Encaje','Prueba114',50.50,'En3w89',1,'2026-04-04 12:32:38',3,5),(76,15,'encaje2','Prueba114',10.00,'EN3w4',1,'2026-04-04 20:25:51',4,8),(77,12,'Cono','',3.00,'C34',1,'2026-04-05 00:13:19',4,1),(78,10,'ConoVer','Prueba116',2.00,'CO45',1,'2026-04-05 00:17:06',4,5);
/*!40000 ALTER TABLE `materiales` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `materiales_img`
--

LOCK TABLES `materiales_img` WRITE;
/*!40000 ALTER TABLE `materiales_img` DISABLE KEYS */;
INSERT INTO `materiales_img` VALUES (59,'1774598858227-prueba.jpg'),(60,'1774679393267-R.jpg'),(61,'1774682533302-R.jpg'),(62,'1774736310988-prueba.jpg'),(63,'1774736572912-prueba.jpg'),(64,'1774737717012-prueba.jpg'),(65,'1774738512125-R.jpg'),(66,'1774739482974-R.jpg'),(67,'1774739537373-R.jpg'),(68,'1774740008626-jade.jpg'),(69,'1774742332916-naranja.jpg'),(71,'1774743655717-verde_oscuro.jpg'),(72,'1774934201109-celeste.jpg'),(73,'1774935437541-blanco.jpg'),(74,'1775326144474-61lcDBp0UIL._AC_UF894,1000_QL80_.jpg'),(75,'1775327558744-encaje.jpg'),(76,'1775355951197-encaje.jpg'),(77,'1775369599785-celeste.jpg'),(78,'1775369826825-verde_oscuro.jpg'),(78,'1775369826825-naranja.jpg'),(78,'1775369826825-prueba.jpg'),(78,'1775369826840-R.jpg');
/*!40000 ALTER TABLE `materiales_img` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `medidas_prenda`
--

LOCK TABLES `medidas_prenda` WRITE;
/*!40000 ALTER TABLE `medidas_prenda` DISABLE KEYS */;
INSERT INTO `medidas_prenda` VALUES (1,1),(1,3),(1,4),(1,14),(1,15),(1,16),(1,17),(1,18),(2,1),(2,2),(2,3),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,15),(3,1),(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),(3,10),(3,11),(3,12),(3,13),(3,15);
/*!40000 ALTER TABLE `medidas_prenda` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `permisos_rol`
--

LOCK TABLES `permisos_rol` WRITE;
/*!40000 ALTER TABLE `permisos_rol` DISABLE KEYS */;
/*!40000 ALTER TABLE `permisos_rol` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `prendas`
--

LOCK TABLES `prendas` WRITE;
/*!40000 ALTER TABLE `prendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `prendas` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `prendas_img`
--

LOCK TABLES `prendas_img` WRITE;
/*!40000 ALTER TABLE `prendas_img` DISABLE KEYS */;
/*!40000 ALTER TABLE `prendas_img` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Administrador',1,NULL);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_medidas`
--

LOCK TABLES `tipo_medidas` WRITE;
/*!40000 ALTER TABLE `tipo_medidas` DISABLE KEYS */;
INSERT INTO `tipo_medidas` VALUES (1,'Largossssss','Largo de la prenda',0,'2026-03-20 19:34:28',1),(2,'Busto','Busto de la persona',1,'2026-03-20 19:35:03',1),(3,'Cintura','La cintura del cliente',1,'2026-03-20 20:20:37',1),(4,'Cadera','Cadera de la persona',1,'2026-03-20 20:32:51',5),(5,'Hombro','Medida del hombro',1,'2026-03-20 20:42:20',5),(6,'Talle','Medida del talle',1,'2026-03-20 20:42:20',5),(7,'Sisa','Medida de la sisa',1,'2026-03-20 20:42:20',5),(8,'Largo de manga','Medida del largo de la manga',1,'2026-03-20 20:42:20',5),(9,'Grueso de manga','Medida del grosor de la manga',1,'2026-03-20 20:42:20',5),(10,'Escote','Medida del escote',1,'2026-03-20 20:42:20',5),(11,'Largo de busto','Medida del largo del busto',1,'2026-03-20 20:42:20',5),(12,'Ancho de espalda','Medida del ancho de espalda',1,'2026-03-20 20:42:20',5),(13,'Ancho delantero','Medida del ancho delantero',1,'2026-03-20 20:42:20',5),(14,'Tiro','Medida del tiro',1,'2026-03-20 20:42:20',5),(15,'Ruedo','Medida del ruedo',1,'2026-03-20 20:42:20',5),(16,'Rodilla','Medida de la rodilla',1,'2026-03-20 20:42:20',5),(17,'Largo de rodilla','Medida del largo hasta la rodilla',1,'2026-03-20 20:42:20',5),(18,'Largo de fijazo','Medida del largo de fijazo',1,'2026-03-20 20:42:20',5),(19,'Nelly osorio','Ajim',1,'2026-03-28 09:51:47',5),(20,'Hola Nelly XD','',1,'2026-03-28 09:53:01',5),(21,'Hola chamo','Esto es un video para youtub',1,'2026-03-28 10:10:41',5),(22,'aaaaaaaaaaaaaaaaaaaaaaaaa','a',1,'2026-04-08 00:17:03',3),(23,'11111111111111111111100000000','1',1,'2026-04-08 00:30:44',3);
/*!40000 ALTER TABLE `tipo_medidas` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `tipo_prendas`
--

LOCK TABLES `tipo_prendas` WRITE;
/*!40000 ALTER TABLE `tipo_prendas` DISABLE KEYS */;
INSERT INTO `tipo_prendas` VALUES (1,'Pantalon',1),(2,'Camisa',1),(3,'Vestido',1),(4,'Blusa',1),(5,'Camiseta',1),(6,'Falda',1),(7,'Brazalete',1),(8,'Bryann Alvarez',1);
/*!40000 ALTER TABLE `tipo_prendas` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `unidades_medida`
--

LOCK TABLES `unidades_medida` WRITE;
/*!40000 ALTER TABLE `unidades_medida` DISABLE KEYS */;
INSERT INTO `unidades_medida` VALUES (1,'Centímetros','cm',1),(2,'Pulgadassssss','pulga',1),(3,'asfadfafadf','asdfadfaf',1),(4,'aaaaaaaaaaaaaaaaaaa','asdfad',1);
/*!40000 ALTER TABLE `unidades_medida` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Bryann','Alvarez','balvarez','$2b$10$FRmykqJ96zXoe4GJALZV5.Bcg2ioOyywJWGF5Cu9a3bO6Sk/HLh7y','balvarez@gmail.com',1,1,NULL,NULL),(3,'Nelly','Lopez','nlopez','$2b$10$C3C1DzU5JcU/eAWHnUVGIOFxfJPqW7PZD8wggT6fHJe5qb6XhotvK','nlopez@gmail.com',1,1,'2026-03-14 11:46:59',1),(4,'Luis','Ajim','lajim','$2b$10$.leW11H9fZBZ4d/sHgWTveZqhjWNbKSMSoxSHBammHpEepQHA1Pvi','lajim@gmail.com',1,1,'2026-03-14 11:50:34',1),(5,'Christian','Garcia','cgarcia','$2b$10$gSeG1dWYS0D634pC1xNPaucq3M57PlARAOJ3JECA9ZhKdScWNebV6','christian@gmail.com',1,1,'2026-03-14 11:52:46',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'beautybell'
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
    IN p_cliente_id INT,
    IN p_nombre VARCHAR(50),
    IN p_apellido VARCHAR(50),
    IN p_telefono VARCHAR(30),
    IN p_estado INT
)
BEGIN
    UPDATE clientes
    SET 
        nombre_cliente = p_nombre,
        apellido_cliente = p_apellido,
        telefono = p_telefono,
        estado = p_estado
    WHERE cliente_id = p_cliente_id;
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
    IN p_usuario INT
)
BEGIN
    INSERT INTO clientes(
        nombre_cliente,
        apellido_cliente,
        telefono,
        estado,
        fecha_creado,
        usuario_creador
    )
    VALUES (
        p_nombre,
        p_apellido,
        p_telefono,
        1,
        NOW(),
        p_usuario
    );

    SELECT LAST_INSERT_ID() AS cliente_id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_crearClientePrendaGeneral` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crearClientePrendaGeneral`(
    IN p_cliente_id INT,
    IN p_prenda_id INT
)
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM cliente_prenda 
        WHERE id_cliente = p_cliente_id 
        AND id_prenda = p_prenda_id
    ) THEN

        INSERT INTO cliente_prenda (id_cliente, id_prenda)
        VALUES (p_cliente_id, p_prenda_id);

    END IF;
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
        estado
    FROM clientes;
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_obtenerClientesActivos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtenerClientesActivos`()
BEGIN
    SELECT 
        cliente_id,
        nombre_cliente,
        apellido_cliente
    FROM clientes
    WHERE estado = 1;
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_medidas_archive` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_medidas_archive`(
    IN p_id INT
)
BEGIN
    UPDATE tipo_medidas
    SET estado = 0
    WHERE tipo_medida_id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_medidas_create` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_medidas_create`(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_usuario INT
)
BEGIN
    DECLARE existe INT;

    SELECT COUNT(*) INTO existe 
    FROM tipo_medidas 
    WHERE nombre_tipo_medida = p_nombre;

    IF existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El tipo ya existe';
    ELSE
        INSERT INTO tipo_medidas 
        (nombre_tipo_medida, descripcion_tipo_medida, fecha_creado, usuario_creador, estado)
        VALUES (p_nombre, p_descripcion, NOW(), p_usuario, 1);
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_medidas_get` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_medidas_get`(IN p_archivados BOOLEAN)
BEGIN
    IF p_archivados = TRUE THEN
        SELECT * 
        FROM tipo_medidas 
        WHERE estado = 0;
    ELSE
        SELECT * 
        FROM tipo_medidas 
        WHERE estado = 1;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_medidas_por_prenda` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_medidas_por_prenda`(
    IN p_prenda_id INT
)
BEGIN
    SELECT DISTINCT
        tm.tipo_medida_id,
        tm.nombre_tipo_medida,
        tm.descripcion_tipo_medida,
        tm.fecha_creado,
        tm.usuario_creador
    FROM medidas_prenda mp
    INNER JOIN tipo_medidas tm
        ON tm.tipo_medida_id = mp.tipo_medida_id
    INNER JOIN tipo_prendas tp
        ON tp.tipo_prendas_id = mp.prenda_id
    WHERE mp.prenda_id = p_prenda_id
      AND tp.estado = 1
    ORDER BY tm.nombre_tipo_medida ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_medidas_restore` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_medidas_restore`(
    IN p_id INT
)
BEGIN
    UPDATE tipo_medidas
    SET estado = 1
    WHERE tipo_medida_id = p_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_tipo_medidas_update` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_tipo_medidas_update`(
    IN p_id INT,
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT
)
BEGIN
    UPDATE tipo_medidas
    SET nombre_tipo_medida = p_nombre,
        descripcion_tipo_medida = p_descripcion
    WHERE tipo_medida_id = p_id;
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_unidades_restore` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unidades_restore`(
    IN p_id INT
)
BEGIN
    UPDATE unidades_medida
    SET estado = 1
    WHERE unidad_id = p_id;
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
/*!50003 DROP PROCEDURE IF EXISTS `sp_update_material` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_update_material`(
    IN p_id INT,
    IN p_nombre_material VARCHAR(255),
    IN p_descripcion_material TEXT,
    IN p_categoria_id INT,
    IN p_precio_unitario DECIMAL(10,2),
    IN p_referencia_compra VARCHAR(100),
    IN p_stock INT
)
BEGIN
    UPDATE materiales SET
        nombre_material = p_nombre_material,
        descripcion_material = p_descripcion_material,
        categoria_id = p_categoria_id,
        precio_unitario = p_precio_unitario,
        referencia_compra = p_referencia_compra,
        stock = p_stock
    WHERE material_id = p_id;
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

-- Dump completed on 2026-04-08 21:25:10
