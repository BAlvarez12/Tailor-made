CREATE DATABASE  IF NOT EXISTS `beautybell` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `beautybell`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: beautybell
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Dumping data for table `categorias_material`
--

LOCK TABLES `categorias_material` WRITE;
/*!40000 ALTER TABLE `categorias_material` DISABLE KEYS */;
INSERT INTO `categorias_material` VALUES (9,'Telas principales','Telas base para la confección de prendas','2026-03-21 10:34:49',1),(10,'Forros','Materiales internos para acabado de prendas','2026-03-21 10:34:49',1),(11,'Entretelas y refuerzos','Materiales para dar estructura y firmeza','2026-03-21 10:34:49',1),(12,'Hilos','Hilos utilizados en costura y bordado','2026-03-21 10:34:49',1),(13,'Botones y cierres','Elementos de cierre y ajuste para prendas','2026-03-21 10:34:49',1),(14,'Elásticos y cintas','Materiales flexibles y decorativos para ajuste','2026-03-21 10:34:49',1),(15,'Encajes y adornos','Elementos decorativos para prendas','2026-03-21 10:34:49',1),(16,'Estructura y volumen','Materiales para dar forma y volumen','2026-03-21 10:34:49',1),(17,'Patronaje y corte','Materiales auxiliares para diseño y corte','2026-03-21 10:34:49',1),(18,'Herrajes','Accesorios metálicos para confección','2026-03-21 10:34:49',1),(19,'Acabados','Materiales para terminación y presentación final','2026-03-21 10:34:49',1);
/*!40000 ALTER TABLE `categorias_material` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Bryann','Osorio','78541245',1,'2026-03-21 09:58:29',1),(2,'Marlon','Herrera','87451245',1,'2026-03-21 09:58:55',1),(3,'Patrick','Maldonado','65451223',1,'2026-03-21 09:59:15',1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
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
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  `stock` int DEFAULT NULL,
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (1,9,'Algodón','Tela suave y transpirable',35.00,'TEL-ALG-001',1,'2026-03-21 10:35:35',1,0),(2,9,'Lino','Tela fresca y ligera',48.00,'TEL-LIN-001',1,'2026-03-21 10:35:35',1,0),(3,9,'Popelina','Tela fina usada en camisas y blusas',32.00,'TEL-POP-001',1,'2026-03-21 10:35:35',1,0),(4,9,'Gabardina','Tela resistente para pantalones y sacos',55.00,'TEL-GAB-001',1,'2026-03-21 10:35:35',1,0),(5,9,'Satín','Tela brillante para vestidos y detalles',42.00,'TEL-SAT-001',1,'2026-03-21 10:35:35',1,0),(6,9,'Chifón','Tela ligera y transparente',46.00,'TEL-CHI-001',1,'2026-03-21 10:35:35',1,0),(7,9,'Denim','Tela fuerte tipo mezclilla',58.00,'TEL-DEN-001',1,'2026-03-21 10:35:35',1,0),(8,9,'Licra','Tela elástica para prendas ajustadas',40.00,'TEL-LIC-001',1,'2026-03-21 10:35:35',1,0),(9,10,'Forro poliéster','Forro ligero de poliéster',18.00,'FOR-POL-001',1,'2026-03-21 10:35:35',1,0),(10,10,'Forro satinado','Forro con acabado brillante',22.00,'FOR-SAT-001',1,'2026-03-21 10:35:35',1,0),(11,10,'Tafeta','Tela usada como forro y estructura ligera',24.00,'FOR-TAF-001',1,'2026-03-21 10:35:35',1,0),(12,10,'Acetato','Forro suave para prendas formales',20.00,'FOR-ACE-001',1,'2026-03-21 10:35:35',1,0),(13,11,'Entretela fusible','Entretela adhesiva para estructura',16.00,'ENT-FUS-001',1,'2026-03-21 10:35:35',1,0),(14,11,'Entretela no fusible','Entretela sin adhesivo',15.00,'ENT-NOF-001',1,'2026-03-21 10:35:35',1,0),(15,11,'Pellón','Refuerzo textil para varias áreas de la prenda',12.00,'ENT-PEL-001',1,'2026-03-21 10:35:35',1,0),(16,11,'Hombreras','Accesorio para dar forma a hombros',10.00,'ENT-HOM-001',1,'2026-03-21 10:35:35',1,0),(17,11,'Refuerzo para cuello','Material rígido para cuellos',14.00,'ENT-CUE-001',1,'2026-03-21 10:35:35',1,0),(18,12,'Hilo poliéster','Hilo resistente de uso general',8.00,'HIL-POL-001',1,'2026-03-21 10:35:35',1,0),(19,12,'Hilo algodón','Hilo de algodón para costura ligera',7.00,'HIL-ALG-001',1,'2026-03-21 10:35:35',1,0),(20,12,'Hilo overlock','Hilo especial para máquina overlock',9.50,'HIL-OVR-001',1,'2026-03-21 10:35:35',1,0),(21,12,'Hilo para bordar','Hilo decorativo para bordados',11.00,'HIL-BOR-001',1,'2026-03-21 10:35:35',1,0),(22,12,'Hilo elástico','Hilo flexible para costuras elásticas',12.50,'HIL-ELA-001',1,'2026-03-21 10:35:35',1,0),(23,13,'Botón plástico','Botón estándar de plástico',1.50,'BOC-BPL-001',1,'2026-03-21 10:35:35',1,0),(24,13,'Botón metálico','Botón decorativo metálico',2.50,'BOC-BMT-001',1,'2026-03-21 10:35:35',1,0),(25,13,'Cierre invisible','Cierre oculto para vestidos y faldas',6.00,'BOC-CIN-001',1,'2026-03-21 10:35:35',1,0),(26,13,'Cierre metálico','Cierre resistente de metal',7.50,'BOC-CMT-001',1,'2026-03-21 10:35:35',1,0),(27,13,'Broche de presión','Broche para cierre rápido',2.00,'BOC-BRP-001',1,'2026-03-21 10:35:35',1,0),(28,13,'Velcro','Sistema de cierre adhesivo textil',5.00,'BOC-VEL-001',1,'2026-03-21 10:35:35',1,0),(29,14,'Elástico delgado','Elástico fino para mangas y detalles',4.00,'ELC-EDL-001',1,'2026-03-21 10:35:35',1,0),(30,14,'Elástico grueso','Elástico para cintura y soporte',6.50,'ELC-EGR-001',1,'2026-03-21 10:35:35',1,0),(31,14,'Bies','Cinta para remates y acabados',3.50,'ELC-BIE-001',1,'2026-03-21 10:35:35',1,0),(32,14,'Cinta de raso','Cinta decorativa satinada',4.50,'ELC-RAS-001',1,'2026-03-21 10:35:35',1,0),(33,14,'Cordón','Cordón para ajuste o decoración',3.00,'ELC-COR-001',1,'2026-03-21 10:35:35',1,0),(34,15,'Encaje','Adorno textil decorativo',9.00,'EYA-ENC-001',1,'2026-03-21 10:35:35',1,0),(35,15,'Guipur','Encaje grueso decorativo',12.00,'EYA-GUI-001',1,'2026-03-21 10:35:35',1,0),(36,15,'Lentejuelas','Adorno brillante para prendas',8.00,'EYA-LEN-001',1,'2026-03-21 10:35:35',1,0),(37,15,'Perlas decorativas','Perlas para adorno en prendas',10.00,'EYA-PER-001',1,'2026-03-21 10:35:35',1,0),(38,15,'Aplicación bordada','Parche bordado decorativo',11.00,'EYA-APB-001',1,'2026-03-21 10:35:35',1,0),(39,16,'Crinolina','Material para dar volumen a faldas',14.00,'ESV-CRI-001',1,'2026-03-21 10:35:35',1,0),(40,16,'Tul rígido','Tul con firmeza para estructura',13.00,'ESV-TUL-001',1,'2026-03-21 10:35:35',1,0),(41,16,'Guata','Material de relleno para volumen',17.00,'ESV-GUA-001',1,'2026-03-21 10:35:35',1,0),(42,16,'Ballenas plásticas','Varillas para corsetería y estructura',15.00,'ESV-BPL-001',1,'2026-03-21 10:35:35',1,0),(43,16,'Copas para busto','Copas para vestidos o blusas',18.00,'ESV-COP-001',1,'2026-03-21 10:35:35',1,0),(44,17,'Papel para moldes','Papel especial para patrones',5.00,'PAC-PMO-001',1,'2026-03-21 10:35:35',1,0),(45,17,'Papel kraft','Papel resistente para diseño de moldes',4.50,'PAC-KRA-001',1,'2026-03-21 10:35:35',1,0),(46,17,'Cartón para patrones','Cartón grueso para patrones duraderos',7.00,'PAC-CAR-001',1,'2026-03-21 10:35:35',1,0),(47,17,'Tiza de sastre','Tiza para marcar tela',2.00,'PAC-TIZ-001',1,'2026-03-21 10:35:35',1,0),(48,17,'Jaboncillo','Marcador suave para tela',2.50,'PAC-JAB-001',1,'2026-03-21 10:35:35',1,0),(49,18,'Hebilla metálica','Hebilla para cinturones y ajustes',6.00,'HER-HEB-001',1,'2026-03-21 10:35:35',1,0),(50,18,'Argolla metálica','Argolla para tirantes o detalles',3.50,'HER-ARG-001',1,'2026-03-21 10:35:35',1,0),(51,18,'Ojal metálico','Ojal reforzado de metal',1.75,'HER-OJA-001',1,'2026-03-21 10:35:35',1,0),(52,18,'Remache','Pieza metálica para fijación',1.20,'HER-REM-001',1,'2026-03-21 10:35:35',1,0),(53,18,'Ajustador metálico','Pieza para regular tirantes o cintas',2.25,'HER-AJU-001',1,'2026-03-21 10:35:35',1,0),(54,19,'Etiqueta de talla','Etiqueta para talla de la prenda',0.80,'ACA-ETA-001',1,'2026-03-21 10:35:35',1,0),(55,19,'Etiqueta de marca','Etiqueta con marca del taller o negocio',1.00,'ACA-ETM-001',1,'2026-03-21 10:35:35',1,0),(56,19,'Etiqueta de composición','Etiqueta con materiales de la prenda',0.90,'ACA-ETC-001',1,'2026-03-21 10:35:35',1,0),(57,19,'Adhesivo textil','Pegamento para telas y acabados',9.00,'ACA-ADT-001',1,'2026-03-21 10:35:35',1,0),(58,19,'Cinta doble cara textil','Cinta adhesiva para ajustes temporales',7.50,'ACA-CDT-001',1,'2026-03-21 10:35:35',1,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_medidas`
--

LOCK TABLES `tipo_medidas` WRITE;
/*!40000 ALTER TABLE `tipo_medidas` DISABLE KEYS */;
INSERT INTO `tipo_medidas` VALUES (1,'Largo','Largo de la prenda',1,'2026-03-20 19:34:28',1),(2,'Busto','Busto de la persona',0,'2026-03-20 19:35:03',1),(3,'Cintura','La cintura del cliente',1,'2026-03-20 20:20:37',1),(4,'Cadera','Cadera de la persona',1,'2026-03-20 20:32:51',5),(5,'Hombro','Medida del hombro',1,'2026-03-20 20:42:20',5),(6,'Talle','Medida del talle',1,'2026-03-20 20:42:20',5),(7,'Sisa','Medida de la sisa',1,'2026-03-20 20:42:20',5),(8,'Largo de manga','Medida del largo de la manga',1,'2026-03-20 20:42:20',5),(9,'Grueso de manga','Medida del grosor de la manga',1,'2026-03-20 20:42:20',5),(10,'Escote','Medida del escote',1,'2026-03-20 20:42:20',5),(11,'Largo de busto','Medida del largo del busto',1,'2026-03-20 20:42:20',5),(12,'Ancho de espalda','Medida del ancho de espalda',1,'2026-03-20 20:42:20',5),(13,'Ancho delantero','Medida del ancho delantero',1,'2026-03-20 20:42:20',5),(14,'Tiro','Medida del tiro',1,'2026-03-20 20:42:20',5),(15,'Ruedo','Medida del ruedo',1,'2026-03-20 20:42:20',5),(16,'Rodilla','Medida de la rodilla',1,'2026-03-20 20:42:20',5),(17,'Largo de rodilla','Medida del largo hasta la rodilla',1,'2026-03-20 20:42:20',5),(18,'Largo de fijazo','Medida del largo de fijazo',1,'2026-03-20 20:42:20',5),(19,'Nelly osorio','Ajim',1,'2026-03-28 09:51:47',5),(20,'Hola Nelly XD','',1,'2026-03-28 09:53:01',5),(21,'Hola chamo','Esto es un video para youtub',1,'2026-03-28 10:10:41',5);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades_medida`
--

LOCK TABLES `unidades_medida` WRITE;
/*!40000 ALTER TABLE `unidades_medida` DISABLE KEYS */;
INSERT INTO `unidades_medida` VALUES (1,'Centímetros','cm',1),(2,'Pulgadas','pulg',1);
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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-28 17:14:29
