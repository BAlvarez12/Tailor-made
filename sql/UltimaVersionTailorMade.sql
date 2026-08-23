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
-- Dumping data for table `categorias_material`
--

LOCK TABLES `categorias_material` WRITE;
/*!40000 ALTER TABLE `categorias_material` DISABLE KEYS */;
INSERT INTO `categorias_material` VALUES (20,'Hilo','Todos los tipos de hilo',NULL,NULL),(21,'Botones','Todos los tipos de botones',NULL,NULL),(22,'Cierres','Todos los cierres a utilizar en las prendas',NULL,NULL),(23,'Tela amarilla','tela suave color amarillo','2026-05-24 15:16:04',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=221 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_medidas`
--

LOCK TABLES `cliente_medidas` WRITE;
/*!40000 ALTER TABLE `cliente_medidas` DISABLE KEYS */;
INSERT INTO `cliente_medidas` VALUES (158,21,25,2,78.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(159,21,26,2,78.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(160,21,27,2,78.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(161,21,28,2,78.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(162,21,29,2,21.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(163,21,30,2,78.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(164,21,31,2,70.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(165,21,32,2,54.00,'2026-05-17 07:49:49',1,'2026-05-17 07:49:49'),(166,22,25,2,56.00,'2026-05-17 11:42:51',1,'2026-05-17 11:42:51'),(167,22,28,2,788.00,'2026-05-17 11:42:52',1,'2026-05-17 11:42:52'),(168,22,30,2,75.00,'2026-05-17 11:42:52',1,'2026-05-17 11:42:52'),(169,22,31,2,7.00,'2026-05-17 11:42:52',1,'2026-05-17 11:42:52'),(170,22,32,2,87.00,'2026-05-17 11:42:52',1,'2026-05-17 11:42:52'),(171,22,33,2,87.00,'2026-05-17 11:42:52',1,'2026-05-17 11:42:52'),(172,22,34,2,87.00,'2026-05-17 11:42:52',1,'2026-05-17 11:42:52'),(173,26,25,2,12.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(174,26,26,2,21.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(175,26,27,2,6.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(176,26,28,2,67.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(177,26,29,2,67.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(178,26,30,2,676.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(179,26,31,2,65.00,'2026-05-24 20:55:58',1,'2026-05-24 20:55:58'),(180,36,25,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(181,36,26,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(182,36,27,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(183,36,28,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(184,36,29,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(185,36,30,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(186,36,31,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(187,36,32,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(188,36,33,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(189,36,34,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(190,36,35,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(191,36,36,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(192,36,37,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(193,36,38,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(194,36,39,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(195,36,40,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(196,36,41,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(197,36,42,2,7.00,'2026-05-25 17:37:53',1,'2026-05-25 17:37:53'),(198,35,25,2,1.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(199,35,26,2,1.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(200,35,27,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(201,35,28,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(202,35,29,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(203,35,30,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(204,35,31,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(205,35,32,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(206,35,33,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(207,35,34,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(208,35,35,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(209,35,36,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(210,35,37,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(211,35,38,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(212,35,39,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(213,35,40,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27'),(214,35,41,2,4.00,'2026-05-27 00:20:27',1,'2026-05-27 00:20:27');
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_prenda`
--

LOCK TABLES `cliente_prenda` WRITE;
/*!40000 ALTER TABLE `cliente_prenda` DISABLE KEYS */;
INSERT INTO `cliente_prenda` VALUES (18,21,9,'Pantalon de lona de color negro',1,'2026-05-17 07:53:18',1),(19,21,15,'FALDA',1,'2026-05-17 11:50:13',1),(20,22,9,'Pantalon',1,'2026-05-24 10:10:00',1),(21,22,15,'Pantalon',1,'2026-05-24 11:32:50',1),(22,21,15,'Falda acampanada',1,'2026-05-24 12:09:49',1),(23,26,14,'Vestido blanco',1,'2026-05-24 20:56:09',1),(24,36,11,'Vestido de novia',1,'2026-05-25 17:47:49',1),(25,22,10,'Falda acampanada',1,'2026-05-25 23:40:30',1),(26,35,10,'Vestido blanco',1,'2026-05-27 00:20:58',1);
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
INSERT INTO `cliente_prenda_img` VALUES (19,'/uploads/prendas/1779040213720_Blusa.webp'),(20,'/uploads/prendas/1779639000791_Pantalon_de_lona.jpg'),(24,'/uploads/prendas/1779752868986_9b49-hisane-alma-novia-1-476x595.jpg'),(24,'/uploads/prendas/1779752868987_Vestido-novia-de-encanje.webp'),(25,'/uploads/prendas/1779774030129_51B0-nz9VL_AC_UY1000_.jpg'),(25,'/uploads/prendas/1779774030131_green-three-piece-suit-with-white-band-collar-shirt.jpg'),(23,'/uploads/prendas/1779774443307_D_NQ_NP_937341-MLM84245154284_052025-O-v.webp'),(23,'/uploads/prendas/1779774443309_41Bc1mTKW7L_AC_.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_prenda_material`
--

LOCK TABLES `cliente_prenda_material` WRITE;
/*!40000 ALTER TABLE `cliente_prenda_material` DISABLE KEYS */;
INSERT INTO `cliente_prenda_material` VALUES (30,20,79,1,NULL,'','2026-05-24 10:10:01','1'),(31,21,79,2,NULL,'','2026-05-24 11:32:51','1'),(32,22,79,1,NULL,'','2026-05-24 12:09:50','1'),(34,24,80,3,NULL,'','2026-05-25 17:47:49','1'),(35,24,81,3,NULL,'','2026-05-25 17:47:49','1'),(36,24,79,3,NULL,'','2026-05-25 17:47:49','1'),(37,23,79,1,NULL,'','2026-05-25 23:47:23','1'),(38,26,80,1,NULL,'','2026-05-27 00:20:59','1'),(39,26,81,1,NULL,'','2026-05-27 00:20:59','1'),(40,26,79,1,NULL,'','2026-05-27 00:20:59','1');
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
  `valor` decimal(10,2) DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creado` int NOT NULL,
  PRIMARY KEY (`cliente_medida_id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente_prenda_medidas`
--

LOCK TABLES `cliente_prenda_medidas` WRITE;
/*!40000 ALTER TABLE `cliente_prenda_medidas` DISABLE KEYS */;
INSERT INTO `cliente_prenda_medidas` VALUES (93,18,26,78.00,'2026-05-17 07:53:19',1),(94,18,29,21.00,'2026-05-17 07:53:19',1),(95,18,28,78.00,'2026-05-17 07:53:19',1),(96,18,27,78.00,'2026-05-17 07:53:19',1),(97,18,25,78.00,'2026-05-17 07:53:19',1),(98,18,30,78.00,'2026-05-17 07:53:19',1),(99,19,28,78.00,'2026-05-17 11:50:14',1),(100,19,27,78.00,'2026-05-17 11:50:14',1),(101,19,25,78.00,'2026-05-17 11:50:14',1),(102,20,28,788.00,'2026-05-24 10:10:01',1),(103,20,34,87.00,'2026-05-24 10:10:01',1),(104,20,33,87.00,'2026-05-24 10:10:01',1),(105,21,30,75.00,'2026-05-24 11:32:51',1),(106,21,33,87.00,'2026-05-24 11:32:51',1),(107,21,25,56.00,'2026-05-24 11:32:51',1),(108,22,28,78.00,'2026-05-24 12:09:50',1),(109,22,31,70.00,'2026-05-24 12:09:50',1),(113,24,36,7.00,'2026-05-25 17:47:49',1),(114,24,37,7.00,'2026-05-25 17:47:49',1),(115,24,26,7.00,'2026-05-25 17:47:49',1),(116,24,27,7.00,'2026-05-25 17:47:49',1),(117,24,29,7.00,'2026-05-25 17:47:49',1),(118,24,28,7.00,'2026-05-25 17:47:49',1),(119,24,25,7.00,'2026-05-25 17:47:49',1),(120,24,40,7.00,'2026-05-25 17:47:49',1),(121,24,41,7.00,'2026-05-25 17:47:49',1),(122,24,32,7.00,'2026-05-25 17:47:49',1),(123,25,28,788.00,'2026-05-25 23:40:30',1),(124,25,31,7.00,'2026-05-25 23:40:30',1),(125,25,34,87.00,'2026-05-25 23:40:30',1),(126,25,30,75.00,'2026-05-25 23:40:30',1),(127,23,28,67.00,'2026-05-25 23:47:23',1),(128,23,30,676.00,'2026-05-25 23:47:23',1),(129,23,27,6.00,'2026-05-25 23:47:23',1),(130,26,36,4.00,'2026-05-27 00:20:59',1),(131,26,37,4.00,'2026-05-27 00:20:59',1),(132,26,26,1.00,'2026-05-27 00:20:59',1),(133,26,28,4.00,'2026-05-27 00:20:59',1),(134,26,29,4.00,'2026-05-27 00:20:59',1),(135,26,25,1.00,'2026-05-27 00:20:59',1),(136,26,41,4.00,'2026-05-27 00:20:59',1);
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
  `dpi` varchar(20) NOT NULL,
  `estado` int DEFAULT NULL,
  `fecha_creado` datetime DEFAULT NULL,
  `usuario_creador` int DEFAULT NULL,
  PRIMARY KEY (`cliente_id`),
  UNIQUE KEY `uk_clientes_dpi` (`dpi`),
  KEY `usuario_creador_idx` (`usuario_creador`),
  CONSTRAINT `usuario_creador` FOREIGN KEY (`usuario_creador`) REFERENCES `usuarios` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (21,'Nelly','Lopez','35588336','8782743726342',1,'2026-05-17 07:38:11',1),(22,'Carolina Samael','Lopez','12345678','7648389734857',1,'2026-05-17 11:42:10',1),(23,'Marlon Jose','Perez','7865453','1231235634273',1,'2026-05-24 19:44:29',1),(24,'Saul','Isdromio','23746212','3286478263486',1,'2026-05-24 19:44:58',1),(25,'Karla','Maldina','67352632','2376478126472',1,'2026-05-24 19:46:57',1),(26,'Nazareth Lisa','Yunet','87563412','2374678236478',1,'2026-05-24 19:47:49',1),(27,'Yulisa','Herrera Perez','76983456','2374782364782',1,'2026-05-24 19:48:07',1),(28,'Sofia','Kimen','78563489','3276583467826',1,'2026-05-24 19:48:23',1),(29,'Xiaver','Jolito','23356212','1234675267354',1,'2026-05-24 19:48:39',1),(30,'Zulema','Ginebra','45653456','2354687236784',1,'2026-05-24 19:49:08',1),(31,'Carlos Gushi','Kerrera','56436576','3274672364872',1,'2026-05-24 19:51:55',1),(32,'Sandra','Julion','7654667','6372864872364',1,'2026-05-24 19:52:20',1),(33,'Cristina','Kabana','73436734','7326587346785',1,'2026-05-24 19:52:35',1),(34,'Sanman','Luakuj','76345352','3624567235476',1,'2026-05-24 19:53:05',1),(35,'Runia','Kira','7788767','8934798748953',1,'2026-05-25 13:34:55',1),(36,'Lalo Gilberto','Batrez',NULL,'6467634753476',1,'2026-05-25 17:19:16',1),(37,'Maria','Karol',NULL,'3483874658734',1,'2026-05-27 00:15:19',1),(41,'CARLOS','Karol',NULL,'4895674985764',1,'2026-05-30 12:47:35',1),(42,'jose11','lopez1','9087654','1111111111111',0,'2026-07-26 10:18:50',1);
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_materiales`
--

LOCK TABLES `cotizacion_materiales` WRITE;
/*!40000 ALTER TABLE `cotizacion_materiales` DISABLE KEYS */;
INSERT INTO `cotizacion_materiales` VALUES (8,5,'Hilos',1.00,5.60,NULL),(9,6,'Hilos',2.00,5.60,NULL),(10,7,'Hilos',1.00,5.60,NULL),(11,8,'Hilos',3.00,5.60,NULL),(12,8,'Pelium con pegamento',3.00,10.00,NULL),(13,8,'Pelium con pegamento',3.00,0.00,NULL),(14,9,'Hilos',3.00,5.60,NULL),(15,9,'Pelium con pegamento',3.00,10.00,NULL),(16,9,'Pelium con pegamento',3.00,0.00,NULL),(17,10,'Hilos',3.00,5.60,NULL),(18,10,'Pelium con pegamento',3.00,10.00,NULL),(19,10,'Pelium con pegamento',3.00,0.00,NULL),(20,11,'Hilos',3.00,5.60,NULL),(21,11,'Pelium con pegamento',3.00,10.00,NULL),(22,11,'Pelium con pegamento',3.00,0.00,NULL);
/*!40000 ALTER TABLE `cotizacion_materiales` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion_medidas`
--

LOCK TABLES `cotizacion_medidas` WRITE;
/*!40000 ALTER TABLE `cotizacion_medidas` DISABLE KEYS */;
INSERT INTO `cotizacion_medidas` VALUES (15,3,'Busto',78.00,NULL),(16,3,'Cadera',78.00,NULL),(17,3,'Cintura',78.00,NULL),(18,3,'Hombro',21.00,NULL),(19,3,'Largo',78.00,NULL),(20,3,'Talle',78.00,NULL),(21,4,'Cadera',78.00,NULL),(22,4,'Cintura',78.00,NULL),(23,4,'Largo',78.00,NULL),(24,5,'Cadera',788.00,NULL),(25,5,'Escote',87.00,NULL),(26,5,'Grueso de manga',87.00,NULL),(27,6,'Grueso de manga',87.00,NULL),(28,6,'Largo',56.00,NULL),(29,6,'Talle',75.00,NULL),(30,7,'Cadera',78.00,NULL),(31,7,'Sisa',70.00,NULL),(32,8,'Ancho de espalda',7.00,NULL),(33,8,'Ancho delantero',7.00,NULL),(34,8,'Busto',7.00,NULL),(35,8,'Cadera',7.00,NULL),(36,8,'Cintura',7.00,NULL),(37,8,'Hombro',7.00,NULL),(38,8,'Largo',7.00,NULL),(39,8,'Largo de manga',7.00,NULL),(40,8,'Largo de rodilla',7.00,NULL),(41,8,'Rodilla',7.00,NULL),(42,9,'Ancho de espalda',7.00,NULL),(43,9,'Ancho delantero',7.00,NULL),(44,9,'Busto',7.00,NULL),(45,9,'Cadera',7.00,NULL),(46,9,'Cintura',7.00,NULL),(47,9,'Hombro',7.00,NULL),(48,9,'Largo',7.00,NULL),(49,9,'Largo de manga',7.00,NULL),(50,9,'Largo de rodilla',7.00,NULL),(51,9,'Rodilla',7.00,NULL),(52,10,'Ancho de espalda',7.00,NULL),(53,10,'Ancho delantero',7.00,NULL),(54,10,'Busto',7.00,NULL),(55,10,'Cadera',7.00,NULL),(56,10,'Cintura',7.00,NULL),(57,10,'Hombro',7.00,NULL),(58,10,'Largo',7.00,NULL),(59,10,'Largo de manga',7.00,NULL),(60,10,'Largo de rodilla',7.00,NULL),(61,10,'Rodilla',7.00,NULL),(62,11,'Ancho de espalda',7.00,NULL),(63,11,'Ancho delantero',7.00,NULL),(64,11,'Busto',7.00,NULL),(65,11,'Cadera',7.00,NULL),(66,11,'Cintura',7.00,NULL),(67,11,'Hombro',7.00,NULL),(68,11,'Largo',7.00,NULL),(69,11,'Largo de manga',7.00,NULL),(70,11,'Largo de rodilla',7.00,NULL),(71,11,'Rodilla',7.00,NULL);
/*!40000 ALTER TABLE `cotizacion_medidas` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizaciones`
--

LOCK TABLES `cotizaciones` WRITE;
/*!40000 ALTER TABLE `cotizaciones` DISABLE KEYS */;
INSERT INTO `cotizaciones` VALUES (3,'COT-2026-00001',21,18,'Pantalon de lona de color negro','Pantalon','Nelly Lopez','7698-9076',500.00,NULL,1,'2026-05-17 07:53:59',1),(4,'COT-2026-00002',21,19,'FALDA','Falda','Nelly Lopez','7698-9076',1200.00,NULL,1,'2026-05-17 11:57:43',1),(5,'COT-2026-00003',22,20,'Pantalon','Pantalon','CAROLINAS LOPEZ','12345678',1200.00,NULL,1,'2026-05-24 10:10:14',1),(6,'COT-2026-00004',22,21,'Pantalon','Falda','CAROLINAS LOPEZ','12345678',780.00,NULL,1,'2026-05-24 11:33:05',1),(7,'COT-2026-00005',21,22,'Falda acampanada','Falda','Nelly Lopez','35588336',500.00,NULL,1,'2026-05-24 12:10:23',1),(8,'COT-2026-00006',36,24,'Vestido de novia','Vestido','Lalo Gilberto Batrez',NULL,3409.00,NULL,0,'2026-05-25 17:48:20',1),(9,'COT-2026-00007',36,24,'Vestido de novia','Vestido','Lalo Gilberto Batrez',NULL,3409.00,NULL,0,'2026-05-25 17:48:37',1),(10,'COT-2026-00008',36,24,'Vestido de novia','Vestido','Lalo Gilberto Batrez',NULL,5000.00,NULL,0,'2026-05-25 17:48:41',1),(11,'COT-2026-00009',36,24,'Vestido de novia','Vestido','Lalo Gilberto Batrez',NULL,4000.00,'para que es esto',1,'2026-07-26 10:20:12',1);
/*!40000 ALTER TABLE `cotizaciones` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_existencias`
--

LOCK TABLES `detalle_existencias` WRITE;
/*!40000 ALTER TABLE `detalle_existencias` DISABLE KEYS */;
INSERT INTO `detalle_existencias` VALUES (33,79,-4,'SALIDA','2026-05-24 10:08:14',1,15,11),(34,79,4,'ENTRADA','2026-05-24 10:08:36',1,11,15);
/*!40000 ALTER TABLE `detalle_existencias` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_operaciones`
--

LOCK TABLES `log_operaciones` WRITE;
/*!40000 ALTER TABLE `log_operaciones` DISABLE KEYS */;
INSERT INTO `log_operaciones` VALUES (1,1,'crear','cliente',36,'Cliente Lalo Gilberto Batrez creado',NULL,'{\"dpi\": \"6467634753476\", \"nombre\": \"Lalo Gilberto\", \"apellido\": \"Batrez\", \"telefono\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:19:16'),(2,1,'activar','cliente',36,'Cliente Lalo Gilberto Batrez activado',NULL,'{\"dpi\": \"6467634753476\", \"estado\": 1, \"nombre\": \"Lalo Gilberto\", \"apellido\": \"Batrez\", \"telefono\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:25:12'),(3,1,'crear','medidas_cliente',36,'Se guardaron 18 medidas del cliente #36',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:37:53'),(4,1,'crear','prenda',24,'Prenda \"Vestido de novia\" creada para cliente #36',NULL,'{\"titulo\": \"Vestido de novia\", \"medidas\": 10, \"imagenes\": 2, \"cliente_id\": 36, \"materiales\": 3, \"tipo_prenda_id\": 11}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:47:49'),(5,1,'crear','cotizacion',8,'Cotización COT-2026-00006 creada para cliente Lalo Gilberto Batrez (Q 3409.00)',NULL,'{\"cliente_id\": 36, \"valor_total\": 3409, \"cliente_prenda_id\": 24, \"codigo_cotizacion\": \"COT-2026-00006\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:48:20'),(6,1,'crear','cotizacion',9,'Cotización COT-2026-00007 creada para cliente Lalo Gilberto Batrez (Q 3409.00)',NULL,'{\"cliente_id\": 36, \"valor_total\": 3409, \"cliente_prenda_id\": 24, \"codigo_cotizacion\": \"COT-2026-00007\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:48:37'),(7,1,'crear','cotizacion',10,'Cotización COT-2026-00008 creada para cliente Lalo Gilberto Batrez (Q 3409.00)',NULL,'{\"cliente_id\": 36, \"valor_total\": 3409, \"cliente_prenda_id\": 24, \"codigo_cotizacion\": \"COT-2026-00008\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-25 23:48:41'),(8,1,'editar','rol',2,'Rol \"administrador\" editado (35 permisos)',NULL,'{\"nombre_rol\": \"administrador\", \"permiso_ids\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:00:09'),(9,1,'editar','rol',2,'Rol \"administrador\" editado (35 permisos)',NULL,'{\"nombre_rol\": \"administrador\", \"permiso_ids\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:00:58'),(10,1,'editar','rol',2,'Rol \"administrador\" editado (37 permisos)',NULL,'{\"nombre_rol\": \"administrador\", \"permiso_ids\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:02:11'),(11,1,'editar','cotizacion',10,'Cotización COT-2026-00008 editada (Q 3409.00 → Q 5000.00)','{\"valor_total\": \"3409.00\"}','{\"notas\": null, \"valor_total\": 5000}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:44:56'),(12,1,'inactivar','cotizacion',10,'Cotización COT-2026-00008 anulada — Motivo: El cliente decidió no continuar',NULL,'{\"estado\": 0, \"motivo\": \"El cliente decidió no continuar\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:45:22'),(13,1,'inactivar','cotizacion',9,'Cotización COT-2026-00007 anulada — Motivo: El cliente decidió no continuar',NULL,'{\"estado\": 0, \"motivo\": \"El cliente decidió no continuar\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:45:48'),(14,1,'inactivar','cotizacion',8,'Cotización COT-2026-00006 anulada — Motivo: El cliente no quiere continuar',NULL,'{\"estado\": 0, \"motivo\": \"El cliente no quiere continuar\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 00:48:08'),(15,1,'editar','rol',2,'Rol \"administrador\" editado (40 permisos)',NULL,'{\"nombre_rol\": \"administrador\", \"permiso_ids\": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 40, 41, 42]}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 05:23:56'),(16,1,'crear','prenda',25,'Prenda \"Falda acampanada\" creada para cliente #22',NULL,'{\"titulo\": \"Falda acampanada\", \"medidas\": 4, \"imagenes\": 2, \"cliente_id\": 22, \"materiales\": 0, \"tipo_prenda_id\": 10}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 05:40:30'),(17,1,'editar','prenda',23,'Prenda \"Vestido blanco\" (#23) editada',NULL,'{\"titulo\": \"Vestido blanco\", \"cliente_id\": 26, \"tipo_prenda_id\": 14}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-26 05:47:23'),(18,1,'crear','cliente',37,'Cliente Maria Karol creado',NULL,'{\"dpi\": \"3483874658734\", \"nombre\": \"Maria\", \"apellido\": \"Karol\", \"telefono\": null}','::1','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','2026-05-27 06:15:19'),(19,1,'crear','medidas_cliente',35,'Se guardaron 17 medidas del cliente #35',NULL,NULL,'::1','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','2026-05-27 06:20:27'),(20,1,'crear','prenda',26,'Prenda \"Vestido blanco\" creada para cliente #35',NULL,'{\"titulo\": \"Vestido blanco\", \"medidas\": 7, \"imagenes\": 0, \"cliente_id\": 35, \"materiales\": 3, \"tipo_prenda_id\": 10}','::1','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','2026-05-27 06:20:58'),(21,1,'crear','material',82,'Material \"Pelium con pegamento\" creado',NULL,'{\"stock\": 1, \"imagenes\": 1, \"categoria_id\": \"20\", \"nombre_material\": \"Pelium con pegamento\", \"precio_unitario\": \"0\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 03:34:36'),(22,1,'crear','cliente',38,'Cliente QA_TEST Refactor creado',NULL,'{\"dpi\": \"1780164885016\", \"nombre\": \"QA_TEST\", \"apellido\": \"Refactor\", \"telefono\": \"12345678\"}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(23,NULL,'activar','cliente',38,'Cliente QA_TEST_UPD Refactor activado',NULL,'{\"dpi\": \"1780164885016\", \"estado\": 1, \"nombre\": \"QA_TEST_UPD\", \"apellido\": \"Refactor\", \"telefono\": \"87654321\"}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(24,1,'crear','medidas_cliente',38,'Se guardaron 1 medidas del cliente #38',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(25,1,'editar','medidas_cliente',38,'Se actualizaron 1 medidas del cliente #38',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(26,1,'editar','medidas_cliente',38,'Se actualizaron 1 medidas del cliente #38',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(27,1,'crear','material',83,'Material \"QA_MAT_1780164885016\" creado',NULL,'{\"stock\": 5, \"imagenes\": 0, \"categoria_id\": 20, \"nombre_material\": \"QA_MAT_1780164885016\", \"precio_unitario\": \"10.50\"}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(28,NULL,'editar','material',83,'Material \"QA_MAT_UPD_1780164885016\" editado',NULL,'{\"categoria_id\": 20, \"nombre_material\": \"QA_MAT_UPD_1780164885016\", \"precio_unitario\": \"12\", \"imagenes_agregadas\": 0, \"imagenes_eliminadas\": 0}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(29,1,'editar','existencia_material',83,'Movimiento de existencias (ingreso de 3) en material #83',NULL,'{\"cantidad\": 3, \"material_id\": 83}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(30,NULL,'eliminar','material',83,'Material #83 desactivado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(31,1,'crear','unidad_medida',NULL,'Unidad de medida \"QA_U_1780164885016\" creada',NULL,'{\"nombre_unidad\": \"QA_U_1780164885016\", \"simbolo_unidad\": \"qu\"}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(32,NULL,'archivar','unidad_medida',7,'Unidad de medida #7 archivada',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(33,NULL,'restaurar','unidad_medida',7,'Unidad de medida #7 restaurada',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(34,1,'crear','tipo_medida',NULL,'Tipo de medida \"QA_T_1780164885016\" creado',NULL,'{\"nombre_tipo_medida\": \"QA_T_1780164885016\", \"descripcion_tipo_medida\": \"qa\"}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(35,NULL,'editar','tipo_medida',43,'Tipo de medida \"QA_T_1780164885016_UPD\" editado',NULL,'{\"nombre_tipo_medida\": \"QA_T_1780164885016_UPD\", \"descripcion_tipo_medida\": \"qa2\"}','127.0.0.1',NULL,'2026-05-30 18:14:45'),(36,NULL,'archivar','tipo_medida',43,'Tipo de medida #43 archivado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(37,NULL,'restaurar','tipo_medida',43,'Tipo de medida #43 restaurado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:14:45'),(38,1,'crear','cliente',39,'Cliente QA_TEST Refactor creado',NULL,'{\"dpi\": \"1780164941296\", \"nombre\": \"QA_TEST\", \"apellido\": \"Refactor\", \"telefono\": \"12345678\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(39,NULL,'activar','cliente',39,'Cliente QA_TEST_UPD Refactor activado',NULL,'{\"dpi\": \"1780164941296\", \"estado\": 1, \"nombre\": \"QA_TEST_UPD\", \"apellido\": \"Refactor\", \"telefono\": \"87654321\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(40,1,'crear','medidas_cliente',39,'Se guardaron 1 medidas del cliente #39',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(41,1,'editar','medidas_cliente',39,'Se actualizaron 1 medidas del cliente #39',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(42,1,'editar','medidas_cliente',39,'Se actualizaron 1 medidas del cliente #39',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(43,1,'crear','material',84,'Material \"QA_MAT_1780164941296\" creado',NULL,'{\"stock\": 5, \"imagenes\": 0, \"categoria_id\": 20, \"nombre_material\": \"QA_MAT_1780164941296\", \"precio_unitario\": \"10.50\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(44,NULL,'editar','material',84,'Material \"QA_MAT_UPD_1780164941296\" editado',NULL,'{\"categoria_id\": 20, \"nombre_material\": \"QA_MAT_UPD_1780164941296\", \"precio_unitario\": \"12\", \"imagenes_agregadas\": 0, \"imagenes_eliminadas\": 0}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(45,1,'editar','existencia_material',84,'Movimiento de existencias (ingreso de 3) en material #84',NULL,'{\"cantidad\": 3, \"material_id\": 84}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(46,NULL,'eliminar','material',84,'Material #84 desactivado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(47,1,'crear','unidad_medida',NULL,'Unidad de medida \"QA_U_1780164941296\" creada',NULL,'{\"nombre_unidad\": \"QA_U_1780164941296\", \"simbolo_unidad\": \"qu\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(48,NULL,'editar','unidad_medida',8,'Unidad de medida \"QA_U_1780164941296X\" editada',NULL,'{\"nombre_unidad\": \"QA_U_1780164941296X\", \"simbolo_unidad\": \"q2\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(49,NULL,'archivar','unidad_medida',8,'Unidad de medida #8 archivada',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(50,NULL,'restaurar','unidad_medida',8,'Unidad de medida #8 restaurada',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(51,1,'crear','tipo_medida',NULL,'Tipo de medida \"QA_T_1780164941296\" creado',NULL,'{\"nombre_tipo_medida\": \"QA_T_1780164941296\", \"descripcion_tipo_medida\": \"qa\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(52,NULL,'editar','tipo_medida',44,'Tipo de medida \"QA_T_1780164941296_UPD\" editado',NULL,'{\"nombre_tipo_medida\": \"QA_T_1780164941296_UPD\", \"descripcion_tipo_medida\": \"qa2\"}','127.0.0.1',NULL,'2026-05-30 18:15:41'),(53,NULL,'archivar','tipo_medida',44,'Tipo de medida #44 archivado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(54,NULL,'restaurar','tipo_medida',44,'Tipo de medida #44 restaurado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:15:41'),(55,1,'crear','cliente',40,'Cliente QA_TEST Refactor creado',NULL,'{\"dpi\": \"1780165232202\", \"nombre\": \"QA_TEST\", \"apellido\": \"Refactor\", \"telefono\": \"12345678\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(56,NULL,'activar','cliente',40,'Cliente QA_TEST_UPD Refactor activado',NULL,'{\"dpi\": \"1780165232202\", \"estado\": 1, \"nombre\": \"QA_TEST_UPD\", \"apellido\": \"Refactor\", \"telefono\": \"87654321\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(57,1,'crear','medidas_cliente',40,'Se guardaron 1 medidas del cliente #40',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(58,1,'editar','medidas_cliente',40,'Se actualizaron 1 medidas del cliente #40',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(59,1,'editar','medidas_cliente',40,'Se actualizaron 1 medidas del cliente #40',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(60,1,'crear','material',85,'Material \"QA_MAT_1780165232202\" creado',NULL,'{\"stock\": 5, \"imagenes\": 0, \"categoria_id\": 20, \"nombre_material\": \"QA_MAT_1780165232202\", \"precio_unitario\": \"10.50\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(61,NULL,'editar','material',85,'Material \"QA_MAT_UPD_1780165232202\" editado',NULL,'{\"categoria_id\": 20, \"nombre_material\": \"QA_MAT_UPD_1780165232202\", \"precio_unitario\": \"12\", \"imagenes_agregadas\": 0, \"imagenes_eliminadas\": 0}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(62,1,'editar','existencia_material',85,'Movimiento de existencias (ingreso de 3) en material #85',NULL,'{\"cantidad\": 3, \"material_id\": 85}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(63,NULL,'eliminar','material',85,'Material #85 desactivado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(64,1,'crear','unidad_medida',NULL,'Unidad de medida \"QA_U_1780165232202\" creada',NULL,'{\"nombre_unidad\": \"QA_U_1780165232202\", \"simbolo_unidad\": \"qu\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(65,NULL,'editar','unidad_medida',9,'Unidad de medida \"QA_U_1780165232202X\" editada',NULL,'{\"nombre_unidad\": \"QA_U_1780165232202X\", \"simbolo_unidad\": \"q2\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(66,NULL,'archivar','unidad_medida',9,'Unidad de medida #9 archivada',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(67,NULL,'restaurar','unidad_medida',9,'Unidad de medida #9 restaurada',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(68,1,'crear','tipo_medida',NULL,'Tipo de medida \"QA_T_1780165232202\" creado',NULL,'{\"nombre_tipo_medida\": \"QA_T_1780165232202\", \"descripcion_tipo_medida\": \"qa\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(69,NULL,'editar','tipo_medida',45,'Tipo de medida \"QA_T_1780165232202_UPD\" editado',NULL,'{\"nombre_tipo_medida\": \"QA_T_1780165232202_UPD\", \"descripcion_tipo_medida\": \"qa2\"}','127.0.0.1',NULL,'2026-05-30 18:20:32'),(70,NULL,'archivar','tipo_medida',45,'Tipo de medida #45 archivado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(71,NULL,'restaurar','tipo_medida',45,'Tipo de medida #45 restaurado',NULL,NULL,'127.0.0.1',NULL,'2026-05-30 18:20:32'),(72,1,'editar','categoria_material',21,'Categoría de material \"Botones\" editada',NULL,'{\"nombre\": \"Botones\", \"descripcion\": \"Todos los tipos de botones\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:25:25'),(73,1,'crear','material',86,'Material \"Boton plastico rojo\" creado',NULL,'{\"stock\": 1, \"imagenes\": 1, \"categoria_id\": \"21\", \"nombre_material\": \"Boton plastico rojo\", \"precio_unitario\": \"0\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:25:46'),(74,1,'editar','material',86,'Material \"Boton plastico rojo\" editado',NULL,'{\"categoria_id\": \"21\", \"nombre_material\": \"Boton plastico rojo\", \"precio_unitario\": \"0.00\", \"imagenes_agregadas\": 0, \"imagenes_eliminadas\": 0}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:26:05'),(75,1,'activar','cliente',37,'Cliente Maria Karol activado',NULL,'{\"dpi\": \"3483874658734\", \"estado\": 1, \"nombre\": \"Maria\", \"apellido\": \"Karol\", \"telefono\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:26:47'),(76,1,'editar','mi_cuenta',1,'El usuario #1 actualizó sus datos personales',NULL,'{\"email\": \"bryanjose845@gmail.com\", \"nombre_usuario\": \"Silvestre\", \"apellido_usuario\": \"Yumio\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:31:29'),(77,1,'editar','mi_cuenta',1,'El usuario #1 actualizó sus datos personales',NULL,'{\"email\": \"bryasnjose845@gmail.com\", \"nombre_usuario\": \"Silvestre\", \"apellido_usuario\": \"Yumio\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:31:41'),(78,1,'editar','mi_cuenta',1,'El usuario #1 actualizó sus datos personales',NULL,'{\"email\": \"bryanjose845@gmail.com\", \"nombre_usuario\": \"Silvestre\", \"apellido_usuario\": \"Yumio\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:31:46'),(79,1,'editar','mi_cuenta_password',1,'El usuario #1 cambió su contraseña',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:32:15'),(80,1,'editar','mi_cuenta_password',1,'El usuario #1 cambió su contraseña',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:32:51'),(81,1,'activar','cliente',37,'Cliente Maria Karol activado',NULL,'{\"dpi\": \"3483874658734\", \"estado\": 1, \"nombre\": \"Maria\", \"apellido\": \"Karol\", \"telefono\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:33:19'),(82,1,'activar','cliente',37,'Cliente Maria Karol activado',NULL,'{\"dpi\": \"3483874658734\", \"estado\": 1, \"nombre\": \"Maria\", \"apellido\": \"Karol\", \"telefono\": null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-30 18:46:55'),(83,1,'activar','cliente',37,'Cliente Maria Karol activado',NULL,'{\"dpi\": \"3483874658734\", \"estado\": 1, \"nombre\": \"Maria\", \"apellido\": \"Karol\", \"telefono\": null}','::1','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','2026-05-30 18:47:19'),(84,1,'crear','cliente',41,'Cliente CARLOS Karol creado',NULL,'{\"dpi\": \"4895674985764\", \"nombre\": \"CARLOS\", \"apellido\": \"Karol\", \"telefono\": null}','::1','Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36','2026-05-30 18:47:35'),(85,1,'crear','usuario',14,'Usuario \"luajim\" (Luis Ajim) creado',NULL,'{\"email\": \"ajimluismi@gmail.com\", \"nombre\": \"Luis\", \"usuario\": \"luajim\", \"apellido\": \"Ajim\", \"modo_acceso\": \"password\", \"invitacionEnviada\": false}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-31 16:25:41'),(86,14,'editar','mi_cuenta_password',14,'El usuario #14 cambió su contraseña',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-31 16:27:13'),(87,14,'crear','plan_pago',6,'Plan de pago PAG-2026-00004 creado',NULL,'{\"anticipo_id\": null, \"codigo_plan\": \"PAG-2026-00004\", \"cotizacion_id\": 5}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-31 16:28:21'),(88,14,'crear','pago',13,'Pago REC-2026-00007 registrado (Q 1200.00, saldo: Q 0.00)',NULL,'{\"tipo\": \"abono\", \"monto\": 1200, \"plan_pago_id\": 6, \"codigo_recibo\": \"REC-2026-00007\", \"total_abonado\": 1200, \"saldo_pendiente\": 0}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-31 16:28:47'),(89,1,'crear','cliente',42,'Cliente jose11 lopez1 creado',NULL,'{\"dpi\": \"1111111111111\", \"nombre\": \"jose11\", \"apellido\": \"lopez1\", \"telefono\": \"9087654\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-26 16:18:50'),(90,1,'inactivar','cliente',42,'Cliente jose11 lopez1 inactivado',NULL,'{\"dpi\": \"1111111111111\", \"estado\": 0, \"nombre\": \"jose11\", \"apellido\": \"lopez1\", \"telefono\": \"9087654\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-26 16:19:17'),(91,1,'crear','cotizacion',11,'Cotización COT-2026-00009 creada para cliente Lalo Gilberto Batrez (Q 4000.00)',NULL,'{\"cliente_id\": 36, \"valor_total\": 4000, \"cliente_prenda_id\": 24, \"codigo_cotizacion\": \"COT-2026-00009\"}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-26 16:20:12'),(92,1,'crear','plan_pago',7,'Plan de pago PAG-2026-00005 creado',NULL,'{\"anticipo_id\": null, \"codigo_plan\": \"PAG-2026-00005\", \"cotizacion_id\": 11}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-26 16:25:27'),(93,1,'crear','pago',14,'Pago REC-2026-00008 registrado (Q 1000.00, saldo: Q 3000.00)',NULL,'{\"tipo\": \"abono\", \"monto\": 1000, \"plan_pago_id\": 7, \"codigo_recibo\": \"REC-2026-00008\", \"total_abonado\": 1000, \"saldo_pendiente\": 3000}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-26 16:26:57'),(94,1,'eliminar','material',79,'Material #79 desactivado',NULL,NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36','2026-07-26 16:30:31');
/*!40000 ALTER TABLE `log_operaciones` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `login_intentos`
--

LOCK TABLES `login_intentos` WRITE;
/*!40000 ALTER TABLE `login_intentos` DISABLE KEYS */;
INSERT INTO `login_intentos` VALUES ('admin\' OR \'1\'=\'1',2,NULL,'2026-05-26 00:01:31'),('admin\'--',1,NULL,'2026-05-25 23:54:54'),('balvarez',0,NULL,NULL),('cgarcia',0,NULL,NULL),('lajim',0,NULL,'2026-05-24 11:53:58'),('luajim',0,NULL,NULL),('test_demo',3,'2026-05-26 00:09:56','2026-05-25 23:54:56'),('x\' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11 --',1,NULL,'2026-05-25 23:54:54'),('x\'; DROP TABLE usuarios; --',1,NULL,'2026-05-25 23:54:55');
/*!40000 ALTER TABLE `login_intentos` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (79,20,'Hilos','',5.60,'Comprado en mercado villa hermosa',0,'2026-05-24 10:07:53',1,15),(80,20,'Pelium con pegamento','',10.00,'Centro comercial zona 9',1,'2026-05-25 13:13:21',1,1),(81,20,'Pelium con pegamento','',0.00,'',1,'2026-05-25 13:26:48',1,1),(82,20,'Pelium con pegamento','',0.00,'',1,'2026-05-29 21:34:36',1,1),(86,21,'Boton plastico rojo','',0.00,'',1,'2026-05-30 12:25:46',1,1);
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
INSERT INTO `materiales_img` VALUES (79,'1779638873442-Hilo rosado.avif'),(80,'1779736401472-Hilo rosado.avif'),(82,'1780112076347-Pantalon de lona 2.jpg'),(86,'1780165546031-71d8mrvg12L._AC_UF894,1000_QL80_.jpg');
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
/*!40000 ALTER TABLE `medidas_prenda` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos_cliente`
--

LOCK TABLES `pagos_cliente` WRITE;
/*!40000 ALTER TABLE `pagos_cliente` DISABLE KEYS */;
INSERT INTO `pagos_cliente` VALUES (7,3,'REC-2026-00001',100.00,'66776','abono',NULL,'2026-05-17 07:54:55','2026-05-17 07:54:55',1),(8,4,'REC-2026-00002',100.00,'7548745','anticipo','Anticipo inicial del plan de pago','2026-05-17 11:59:06','2026-05-17 11:59:06',1),(9,4,'REC-2026-00003',550.00,'76783645','abono',NULL,'2026-05-17 11:59:41','2026-05-17 11:59:41',1),(10,4,'REC-2026-00004',200.00,'75657','abono',NULL,'2026-05-17 12:00:28','2026-05-17 12:00:28',1),(11,4,'REC-2026-00005',350.00,'7575','abono',NULL,'2026-05-17 12:00:44','2026-05-17 12:00:44',1),(12,5,'REC-2026-00006',500.00,'67676','anticipo','Anticipo inicial del plan de pago','2026-05-21 00:00:00','2026-05-24 11:33:50',1),(13,6,'REC-2026-00007',1200.00,'78676678','abono',NULL,'2026-05-31 00:00:00','2026-05-31 10:28:47',14),(14,7,'REC-2026-00008',1000.00,'12234556','abono',NULL,'2026-07-26 00:00:00','2026-07-26 10:26:57',1);
/*!40000 ALTER TABLE `pagos_cliente` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,'cgarcia',11,'$2b$10$7NgXN4MbL9P/LBXFo8lCheHkhnObpb2JFbGS2tl8aLt/VKPRSr6FS','2026-05-24 21:13:14',1,0,'2026-05-24 21:08:13'),(2,'balvarez',1,'$2b$10$E3umVJOUeypP9x/cqXch3exCf0GFY8Qe/ORxxQEzrb5zi4lcPjafq','2026-05-24 21:17:25',1,1,'2026-05-24 21:12:25'),(3,'balvarez',1,'$2b$10$3mkCLlc/58IIWvNwo40q9uMQUvEZPIt.bQRbhzwpj7cpxzbzmXiSO','2026-05-24 21:27:31',0,1,'2026-05-24 21:22:30'),(4,'balvarez',1,'$2b$10$URpmCGuVdlkH2cWrNI9oGOAw7vBXvkzzLrp2B6D3cfuJabr4OYinW','2026-05-24 21:28:11',0,1,'2026-05-24 21:23:11'),(5,'balvarez',1,'$2b$10$CPC7BvIEA1TU8Ah5Qg32POG4DBFgu6XTSo2SBwmlUT9f3w2yfNiN2','2026-05-24 21:36:33',0,1,'2026-05-24 21:31:33'),(6,'balvarez',1,'$2b$10$AOt3NLwdDwuNk3ZpUQPYQe70ipZ0rPoL5woiFanWOQJc2W8771/vK','2026-05-24 21:37:22',1,1,'2026-05-24 21:32:22'),(7,'balvarez',1,'$2b$10$Ox76k5U.F.rK5aWwnnG6MuiDaJh3Ryvg43i/X9PEeSBm0gXQI27EO','2026-05-24 21:38:47',0,1,'2026-05-24 21:33:47'),(8,'balvarez',1,'$2b$10$9rc6Y6xqn.AqcXwowzKzc.6wFPLMGRhVnfwT96Rjc2XisM2z8xcrO','2026-05-24 21:38:54',0,1,'2026-05-24 21:33:53'),(9,'balvarez',1,'$2b$10$mInAtzSndi/kGRgQeGordu3abCHtCay8hccBUuCVIjGWzrIiY9J46','2026-05-24 21:39:34',0,1,'2026-05-24 21:34:34'),(10,'balvarez',1,'$2b$10$GmezFuEiH5XGY2215jUm3eWUQP6cGI7CbFbemB6JNbHY26fd9bS0u','2026-05-24 21:43:35',0,0,'2026-05-24 21:38:34'),(11,'nlopez',12,'$2b$10$.aAoo8agFuwsp5aTAeUGPudcCNWzZzKYUniWdsPUxwKlsPKPs0P1u','2026-05-27 22:06:11',0,0,'2026-05-24 22:06:11'),(12,'omanuelperez',13,'$2b$10$hBBLVVOXnFewKMkp0JOd8uq1DTkUk4ocsvpuR3ws.9dkrzTByLzDW','2026-05-27 22:19:38',0,1,'2026-05-24 22:19:37'),(13,'omanuelperez',13,'$2b$10$kJ4lOlCyVxr4Os3nMIuCKuClpnHdm9SY3uxYTXMOrZT5EJ1fAADjm','2026-05-28 00:43:16',1,1,'2026-05-25 00:43:16'),(14,'luajim',14,'$2b$10$A9dLvuiSPd1aRK4qZIF7r.Ehv7rhxlrvCj8us1BdwwlDZEEOHecPK','2026-05-31 10:55:46',1,1,'2026-05-31 10:25:46');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,'crear_clientes'),(2,'editar_clientes'),(3,'ver_clientes'),(4,'actualizar_medidas_cliente'),(5,'ver_cotizaciones'),(6,'crear_cotizaciones'),(7,'generar_pdf_cotizacion'),(8,'enviar_whatsapp_cotizacion'),(9,'generar_plan_pagos_cotizacion'),(10,'crear_plan_pagos'),(11,'ver_plan_pagos'),(12,'generar_abono_plan_pagos'),(13,'crear_prendas'),(14,'ver_prendas'),(15,'editar_prendas'),(16,'crear_materiales'),(17,'editar_materiales'),(18,'existencias-materiales'),(19,'ver_materiales'),(20,'crear_categoria_materiales'),(21,'editar_categoria_materiales'),(22,'ver_categoria_materiales'),(23,'crear_usuarios'),(24,'editar_usuarios'),(25,'ver_usuarios'),(26,'crear_unidades_medidas'),(27,'editar_unidades_medidas'),(28,'ver_unidades_medidas'),(29,'crear_tipo_medidas'),(30,'editar_tipo_medidas'),(31,'ver_tipo_medidas'),(32,'ver_roles'),(33,'editar_roles'),(34,'crear_roles'),(35,'asignar_permiso_roles'),(36,'editar_cotizaciones'),(37,'anular_cotizaciones'),(40,'ver_tipo_prendas'),(41,'crear_tipo_prendas'),(42,'editar_tipo_prendas');
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
INSERT INTO `permisos_rol` VALUES (1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2),(26,2),(27,2),(28,2),(29,2),(30,2),(31,2),(32,2),(33,2),(34,2),(35,2),(36,2),(37,2),(40,2),(41,2),(42,2);
/*!40000 ALTER TABLE `permisos_rol` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planes_pago`
--

LOCK TABLES `planes_pago` WRITE;
/*!40000 ALTER TABLE `planes_pago` DISABLE KEYS */;
INSERT INTO `planes_pago` VALUES (3,'PAG-2026-00001',3,21,'COT-2026-00001','Nelly Lopez','7698-9076',500.00,500.00,5,0.00,100.00,400.00,NULL,1,'2026-05-17 07:54:40',1),(4,'PAG-2026-00002',4,21,'COT-2026-00002','Nelly Lopez','7698-9076',1200.00,1200.00,3,100.00,1200.00,0.00,NULL,1,'2026-05-17 11:59:06',1),(5,'PAG-2026-00003',6,22,'COT-2026-00004','CAROLINAS LOPEZ','12345678',780.00,780.00,2,500.00,500.00,280.00,NULL,1,'2026-05-24 11:33:50',1),(6,'PAG-2026-00004',5,22,'COT-2026-00003','CAROLINAS LOPEZ','12345678',1200.00,1200.00,1,0.00,1200.00,0.00,NULL,1,'2026-05-31 10:28:21',14),(7,'PAG-2026-00005',11,36,'COT-2026-00009','Lalo Gilberto Batrez',NULL,4000.00,4000.00,10,0.00,1000.00,3000.00,NULL,1,'2026-07-26 10:25:27',1);
/*!40000 ALTER TABLE `planes_pago` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (2,'administrador',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_medidas`
--

LOCK TABLES `tipo_medidas` WRITE;
/*!40000 ALTER TABLE `tipo_medidas` DISABLE KEYS */;
INSERT INTO `tipo_medidas` VALUES (25,'Largo','Largo de la prenda',1,NULL,NULL),(26,'Busto','Busto de la persona',1,NULL,NULL),(27,'Cintura','La cintura del cliente',1,NULL,NULL),(28,'Cadera','Cadera de la persona',1,NULL,NULL),(29,'Hombro','Medida del hombro',1,NULL,NULL),(30,'Talle','Medida del talle',1,NULL,NULL),(31,'Sisa','Medida de la sisa',1,NULL,NULL),(32,'Largo de manga','Medida del largo de la manga',1,NULL,NULL),(33,'Grueso de manga','Medida del grosor de la manga',1,NULL,NULL),(34,'Escote','Medida del escote',1,NULL,NULL),(35,'Largo de busto','Medida del largo del busto',1,NULL,NULL),(36,'Ancho de espalda','Medida del ancho de espalda',1,NULL,NULL),(37,'Ancho delantero','Medida del ancho delantero',1,NULL,NULL),(38,'Tiro','Medida del tiro',1,NULL,NULL),(39,'Ruedo','Medida del ruedo',1,NULL,NULL),(40,'Rodilla','Medida de la rodilla',1,NULL,NULL),(41,'Largo de rodilla','Medida del largo hasta la rodilla',1,NULL,NULL),(42,'Largo de fijazo','Medida del largo de fijazo',1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_prendas`
--

LOCK TABLES `tipo_prendas` WRITE;
/*!40000 ALTER TABLE `tipo_prendas` DISABLE KEYS */;
INSERT INTO `tipo_prendas` VALUES (9,'Pantalon',1),(10,'Blusa',1),(11,'Vestido',1),(12,'Pantalon de lona',1),(13,'Pantalon de tela',1),(14,'Chaleco',1),(15,'Falda',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades_medida`
--

LOCK TABLES `unidades_medida` WRITE;
/*!40000 ALTER TABLE `unidades_medida` DISABLE KEYS */;
INSERT INTO `unidades_medida` VALUES (5,'Pulgadas','Pulg',0),(6,'Metros','m',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Silvestre','Yumio','balvarez','$2b$10$R29KwxRSestS1FhzNiQNNuzPKUK5pyap9ET119CsIHiuABgssrxPC','bryanjose845@gmail.com',1,2,NULL,1),(10,'Luis','Ajim','lajim','$2b$10$cgxGVv1YLnl4s3LvsowcguVcdUbcn43TFSBxz1W.PuF4uAYQDdueW','lajim@gmail.com',0,2,NULL,NULL),(11,'Christian','Garcia','cgarcia','$2b$10$WQ09N5bgP7KIp7PT497uyOzPloa3epe1kS5494TM2XDNGK3duzyvO','christian300r@gmail.com',1,2,'2026-05-24 21:04:29',1),(12,'Nelly','Lopez','nlopez','$2b$10$zc421oR.gJCSsbNWQbf0JunaQncaKcEa2fvZO2Z4yArGnXLC/r1tO','lopez.nelly.nelly87@gmail.com',1,2,'2026-05-24 22:06:11',1),(13,'Osorio Jose','Manuel Perez','omanuelperez','$2b$10$O94A/onf6e36apxr2ruB2.BgkVxFxTlgTwlfv/QsKWpPOE.QQOigy','bryanalvarez702@gmail.com',1,2,'2026-05-24 22:19:37',1),(14,'Luis','Ajim','luajim','$2b$10$KAVydJheKFeBJKxTuroyI.DHf0FESROcifoGFqAC7ilpduaV6W7ou','ajimluismi@gmail.com',1,2,'2026-05-31 10:25:41',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'tailor_made'
--

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

-- Dump completed on 2026-08-22 20:55:46
