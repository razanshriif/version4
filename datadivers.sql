-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: datadivers
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_user`
--

DROP TABLE IF EXISTS `_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `passwd` varchar(255) DEFAULT NULL,
  `role` varchar(20) NOT NULL,
  `status` enum('ACTIVE','PENDING','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_user`
--

LOCK TABLES `_user` WRITE;
/*!40000 ALTER TABLE `_user` DISABLE KEYS */;
INSERT INTO `_user` VALUES (1,'test1@mail.com','Test','User','password123','CLIENT','ACTIVE'),(2,'amine@gmail.com','Test','User','amine123','CLIENT','ACTIVE'),(52,'test@gmail.com','Test','User','$2a$10$TqdVX4/yT3CWwHr11k8GhONvLEvs326xWwdr4y3LwCBJMSxGoVcby','CLIENT','ACTIVE'),(53,'amine@gmail.com','amine','bm','$2a$10$yrPibzYVaoTrudUeo60P7.SUkEwTfcbCV0kLPyoUFRpeTa9slcf5G','ADMIN','ACTIVE'),(54,'admin@gmail.com','Admin','admin','$2a$10$FnQHo2A3i35TLx3jmEjLrOZJoMetfXKyjl2SyjKyUasrgkjHgHS/i','ADMIN','ACTIVE'),(55,'mohamed@gmail.com','mohamed amine','Ben Moussa','$2a$10$PtgGBUKspIgA4YvY5KleEeXyTAiRF1SsiM2qCUaX21TAMdBfGnLXe','ADMIN','ACTIVE'),(56,'razan@gmail.com','razan','cherif','$2a$10$JcP.rcsXZB.WbgBReME3cObP4chdmWtnTAy1IKPsMxmUClcVHR8Lu','ADMIN','REJECTED'),(57,'benmoussa.mohamedamine.04@gmail.com','mohamed amine','Ben Moussa','$2a$10$1IuIWp3tvNJPhnO7mG8RSuNZSy5UegiHeQVBpA3js7k2YTQ9FAZv2','CLIENT','PENDING'),(58,'benmoussa.mohamedamine.04@gmail.com','mohamed amine','Ben Moussa','$2a$10$zG65ojH7CgVlqaECXHT50uMtiGNC7QgqiTjIeAQ1rMMZvHDe6AYy6','CLIENT','ACTIVE'),(59,'golden@gmail.com','golden','chips','$2a$10$peCqUC7BIWbryyC5CT43tOTrYzO1brX5OBUQhz2Zji91H0Ok7ZMGm','CLIENT','ACTIVE'),(60,'benmoussa.mohamedamine.04@gmail.com','mohamed amine','Ben Moussa','$2a$10$YRI.yIfbtJBTXLK.i0eUp.QHS3MXVc9vIiSrQ2unKwwj6ZS2UPvMu','CLIENT','ACTIVE'),(61,'mohamed@gmail.com','','','$2a$10$ejOlQN06KCZf2N91atq62..QmR/kkEEIVCc.kbJfrnY3w7Tj8SiuS','CLIENT','ACTIVE'),(62,'test@gmail.com','test','test','$2a$10$B4UH4btJID2/LCx5lry3MOsUEcMlgB80rr64B0e4gFwR.zpQr4jOu','CLIENT','REJECTED'),(63,'test2@gmail.com','test2','test','$2a$10$4n.bbU3fYYCH1fAKNuTQz.8LC3JkrDfFMLDA1XhUG.eddzZKi0sSe','CLIENT','ACTIVE'),(64,'rami@gmail.com','rami','55','$2a$10$6rcN5ilBKiy95uyC7T3nCe183wpMLI4yPAK/FA5RLLrWKKK.BBsXm','CLIENT','ACTIVE'),(65,'amal@gmail.com','amal','bm','$2a$10$qnuwSlI8TFULvKv.RKSvluvSY/pyc18c2zriorKsvaIhzCZijpig2','CLIENT','PENDING'),(66,'test2@gmail.com','teste2','test2','$2a$10$gUXqx68S9zWIusIL.dkHtOWnpSBXHQO.cgQ1ySd9llDDnYRSlgCpC','CLIENT','REJECTED'),(67,'razan@gmail.com','teste2','test2','$2a$10$FclBlbVkd3249OjjhxdIY.rv3MRpNgrID/vU8I/eUDHzEcNVuUFgu','CLIENT','PENDING'),(68,'medamine@gmail.com','MED_Amine','bm','$2a$10$NphiL2daoeuzObb/ANscEuKD89nNJuagLfBT3LjydPWFu6nbv8zCi','ADMIN','ACTIVE'),(69,'gias@gmail.com','gias2','gias2','$2a$10$uirvsOnSymnlqOnFy3rLZewThFTQLFivsuzvIxKbXG.HNAFt7wEly','CLIENT','ACTIVE'),(70,'gias3@gmail.com','gias3','gias3','$2a$10$mDMNZBnMYWjwS5snAGCVIeo803C/c/DvZSkI1DO7PR.BmgJazv9jq','CLIENT','ACTIVE'),(71,'commercial @gmail.com','commercial ','commercial','$2a$10$ZuL3LvCu/4A6M8dtjfn.1ur8XVYUvsG.qGeZj/VQgdKqGM95xjWUa','COMMERCIAL','ACTIVE'),(72,'hakim@gmail.com','hakim','hakim','$2a$10$LArtJvNXfWXOutHZf2ZfTuhHmAUOMJiT0ioe6qyz5948ElFYqeRKW','COMMERCIAL','ACTIVE'),(73,'rami@gmail.com','rami','55','$2a$10$yXjXikl1nZ84svBbAiyDAO0xLf3FaJzewsEflK7gACkxeJq1MHwUO','CLIENT','PENDING'),(74,'benmoussa.mohamedamine.04@gmail.com','benmoussa','amine','$2a$10$wlgbeW1piYxk0xQ8ZRx/7ehwUTtC1FYRN.ggTpIbnin5GKeV8mRie','CLIENT','ACTIVE'),(75,'benmoussa.mohamedamine.04@gmail.com','benmoussa','amine','$2a$10$TasXvoTj72JCgXaKy1UiVepatxNTBA.5tWQc8ybZjqfz48VG679EK','CLIENT','PENDING'),(76,'test@gmail.com','test ','test','$2a$10$n5340S4iwWQd9iQRQBVudOk6btVbDIRVMtnnCAYG3h1ywRo.Hf.tO','CLIENT','ACTIVE'),(77,'test1@mail.com','Test','User','$2a$10$lU8Io.2837AqU6XGl.zcAumYrMr6XkdPVNELAcdyqb0jWZNww4Rr6','CLIENT','PENDING'),(78,'lilas@gmail.com','lilas','lilas','$2a$10$8lEJkXWEu8kbPFFc0XkI4.BmM30dlatPA2EohATXbCpWowrDMhyjq','CLIENT','PENDING'),(79,'lilas@gmail.com','lilas','lilas','$2a$10$MtsTmofeLuwuTTWmtgnEMuFvDVoNXuiNjrBWp2m9ixmANm2PiWji2','CLIENT','ACTIVE'),(80,'razanshriif@gmail.com','Razan','Shriif','$2a$10$0tBccA58dMgOgcaK8.Q5qugQMMrqmtF7xhVPqVI2Jobnv2c6a5HVC','ADMIN','ACTIVE'),(81,'gipa@gmail.com','gipa','gipa','$2a$10$kQJfT9c2ZtDf1pQ6kg5ECOGUeo0kk9SgQPkz0EkVfwlQarNjg4.3a','CLIENT','PENDING'),(82,'delice@gmail.com','delice','delice','$2a$10$qlQlEGqJZucBDRaFs8c3Wun0mX12wjQTD.LptRpYfPXMaZdF5eX02','CLIENT','PENDING'),(83,'delice@gmail.com','delice','delice','$2a$10$IHIElbaU9KPYeHd/.pxgvuK3u/YylpY8.MOOiuLKugB5CCXPAL.mS','CLIENT','PENDING'),(84,'delice@gmail.com','delice','delice','$2a$10$FTO3GqcCMnpr7Hnq8Eu9TuFWB/b3XcAaiWoXs/YR/BL4yrKIzp/.y','CLIENT','PENDING'),(85,'gipa@gmail.com','gipa','gipa','$2a$10$EoyeJKPA.liM3WWkJbaoEeGuztxsEM0m15UpD81r3lGgUifxKA6Hq','CLIENT','REJECTED'),(86,'gipa@gmail.com','gipa','gipa','$2a$10$ByOUtA00JfLahocqiPXIw.FO6G2bMQfbr8z4QQUNmBTkAjSTlVg1y','CLIENT','REJECTED');
/*!40000 ALTER TABLE `_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_user_seq`
--

DROP TABLE IF EXISTS `_user_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_user_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_user_seq`
--

LOCK TABLES `_user_seq` WRITE;
/*!40000 ALTER TABLE `_user_seq` DISABLE KEYS */;
INSERT INTO `_user_seq` VALUES (151);
/*!40000 ALTER TABLE `_user_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `article` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `achat` double NOT NULL,
  `code_article` varchar(255) DEFAULT NULL,
  `prix_unitaire` double NOT NULL,
  `quantite_minimum` double NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `type_de_marchandise` int NOT NULL,
  `type_de_remorque` varchar(255) DEFAULT NULL,
  `unite` varchar(255) DEFAULT NULL,
  `vente` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (16,'Marchandise Température Ambiante',0,'T-001',0,1,'Logistique',1,'Standard','Palette',0),(17,'Marchandise Réfrigérée (0°C à 4°C)',0,'T-002',0,1,'Logistique',1,'Frigo','Palette',0),(18,'Marchandise Surgelée (-25°C à -18°C)',0,'T-003',0,1,'Logistique',1,'Frigo','Palette',0),(19,'Marchandise Fragile',0,'T-004',0,1,'Logistique',2,'Standard','Colis',0),(20,'Marchandise Industrielle Lourde',0,'T-005',0,1,'Logistique',3,'Plateau','Palette',0),(21,'Marchandise ADR (Dangereuse)',0,'T-006',0,1,'Logistique',4,'ADR','Colis',0);
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `code` bigint NOT NULL AUTO_INCREMENT,
  `adresse` varchar(255) DEFAULT NULL,
  `civilite` varchar(255) DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `code_iso` bigint DEFAULT NULL,
  `codeclient` varchar(255) DEFAULT NULL,
  `codepostal` int DEFAULT NULL,
  `confiere` bit(1) NOT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `id_edi` varchar(255) DEFAULT NULL,
  `id_tva` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `numero_portable` varchar(255) DEFAULT NULL,
  `pays` varchar(255) DEFAULT NULL,
  `s_type` varchar(255) DEFAULT NULL,
  `service` varchar(255) DEFAULT NULL,
  `site_exploitation` varchar(255) DEFAULT NULL,
  `societe_facturation` varchar(255) DEFAULT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `ville` varchar(255) DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `profile_completed` bit(1) NOT NULL,
  `registration_approved` bit(1) NOT NULL,
  PRIMARY KEY (`code`),
  KEY `FKdalcyawmjey4rhj90whgu8uw5` (`owner_id`),
  CONSTRAINT `FKdalcyawmjey4rhj90whgu8uw5` FOREIGN KEY (`owner_id`) REFERENCES `_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (2,'GROMBALIA','TUN','AZIZA',0,'05',8040,_binary '','','','','0','123','MAGAZIN AZIZA GROM','72885662','TUN','','MAG','GROM','AZIZA','CONFIRME','','MAG','NABEUL',NULL,_binary '\0',_binary '\0'),(3,'GROMBALIA','TUN','ANWAR',0,'03',45,_binary '\0','','','','0','0','ANWAR','72885662','TUN','','MAG','GROM','ANWAR','CONFIRME','','MAG','NABEUL',70,_binary '\0',_binary '\0'),(4,'belli','TUN','aziza',20025,'456',8005,_binary '\0','','','','555','475','aziza','72885662','TUN','','MAG','belli','aziza','CONFIRME','','MAG','NABEUL',69,_binary '\0',_binary '\0'),(5,'BAR','TUN','GIAS',0,'499',8005,_binary '','','','','0','0','GIAS2','72885600','TUN','','GIAS','BAR','Gias2','CONFIRME','','MAG','NABEUL',NULL,_binary '',_binary '\0');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
-- Famous Tunisian clients linked to razanshriif (owner_id=80)
INSERT INTO `client` (code,adresse,civilite,client,code_iso,codeclient,codepostal,confiere,contact,email,fax,id_edi,id_tva,nom,numero_portable,pays,s_type,service,site_exploitation,societe_facturation,statut,telephone,type,ville,owner_id,profile_completed,registration_approved) VALUES
(6,'Zone Industrielle La Charguia','TUN','DELICE',7,'DELICE',1080,1,'Direction Logistique','logistique@groupe-delice.com.tn','71960011','TN-FOOD-001','1234567A','Groupe Delice Danone','98765432','TUN','Agroalimentaire','DISTRIBUTION','TUN','Groupe Delice Danone','CONFIRME','71960000','INDUSTRIE','TUNIS',80,1,1),
(7,'Route de Sfax - Ben Arous','TUN','POULINA',8,'POULINA',2013,1,'Service Transport','transport@poulina.com.tn','71389001','TN-IND-002','2345678B','Poulina Group Holding','96011234','TUN','Industrie','FRET','BEN_AROUS','Poulina Group Holding','CONFIRME','71389000','INDUSTRIE','BEN AROUS',80,1,1),
(8,'Aeroport Tunis-Carthage','TUN','TUNISAIR',9,'TUNISAIR',2035,1,'Fret et Cargo','cargo@tunisair.com.tn','71700001','TN-AIR-003','3456789C','Tunisair Express Cargo','98001234','TUN','Aerien','FRET','TUNIS','Tunisair','CONFIRME','71700000','FRET','TUNIS',80,1,1),
(9,'Route de Tunis - Sfax','TUN','OCT',10,'OCT',3000,1,'Responsable Achats','achats@oct.com.tn','74231001','TN-CEREAL-004','4567890D','Office des Cereales de Tunis','97654321','TUN','Agroalimentaire','DISTRIBUTION','SFX','OCT S.A.','CONFIRME','74231000','INDUSTRIE','SFAX',80,1,1),
(10,'Zone Industrielle Ksar Said','TUN','STIA',11,'STIA',2010,1,'Direction Achat','achats@stia.com.tn','71651001','TN-AUTO-005','5678901E','Societe Tunisienne Industrielle Automobile','91234567','TUN','Automobile','FRET','MANOUBA','STIA','CONFIRME','71651000','INDUSTRIE','MANOUBA',80,1,1),
(11,'Boulevard Mohammed V','TUN','SFAXIEN',12,'SFAXGROUPE',3000,1,'Charge Export','export@sfaxgroupe.tn','74222334','TN-FOOD-006','6789012F','Groupe Sfaxien Agro','96555666','TUN','Agroalimentaire','EXPORT','SFX','Groupe Sfaxien','CONFIRME','74222333','EXPORT','SFAX',80,1,1),
(12,'ZI Jebel Jelloud','TUN','SOTUVER',13,'SOTUVER',1019,1,'Responsable Logistique','logistique@sotuver.tn','71401001','TN-GLASS-007','7890123G','SOTUVER Verre Emballage','95100200','TUN','Verre Emballage','FRET','JELLOUD','SOTUVER','CONFIRME','71401000','INDUSTRIE','TUNIS',80,1,1);
UNLOCK TABLES;

--
-- Table structure for table `commentaire`
--

DROP TABLE IF EXISTS `commentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaire` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contenue` varchar(255) DEFAULT NULL,
  `ordre_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9liby42dlooikmned3w53xpea` (`ordre_id`),
  CONSTRAINT `FK9liby42dlooikmned3w53xpea` FOREIGN KEY (`ordre_id`) REFERENCES `ordre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentaire`
--

LOCK TABLES `commentaire` WRITE;
/*!40000 ALTER TABLE `commentaire` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `km` int NOT NULL,
  `camion` varchar(255) DEFAULT NULL,
  `chauff` varchar(255) DEFAULT NULL,
  `date_saisi` varchar(255) DEFAULT NULL,
  `name_event` varchar(255) DEFAULT NULL,
  `voycle` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_read` bit(1) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `timestamp` datetime(6) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,_binary '\0','Création d\'un nouveau client :3clinen1par :Adminadmin','2026-01-18 15:38:59.501680','Client'),(2,_binary '\0','Création d\'un nouveau client :5MAGAZIN AZIZA GROMpar :mohamed amineBen Moussa','2026-01-18 15:45:31.115783','Client'),(3,_binary '\0','Nouvelle inscription : amal bm','2026-01-23 23:12:25.784539','Inscription'),(4,_binary '\0','Nouvelle inscription : teste2 test2','2026-01-27 10:09:48.911199','Inscription'),(5,_binary '\0','Nouvelle inscription : teste2 test2','2026-01-27 10:15:05.884899','Inscription'),(6,_binary '\0','Nouvelle inscription : MED_Amine bm','2026-01-27 10:18:18.848772','Inscription'),(7,_binary '\0','Nouvelle inscription : gias2 gias2','2026-01-27 10:22:58.195052','Inscription'),(8,_binary '\0','Nouvelle inscription : gias3 gias3','2026-01-27 10:38:13.007603','Inscription'),(9,_binary '\0','Supprission du client d\'ID:1','2026-01-27 12:43:13.145698','Client'),(10,_binary '\0','Suppression d client :1clinen1par :MED_Aminebm','2026-01-27 12:43:13.145698','Client'),(11,_binary '\0','Création d\'un nouveau client :123ANWARpar :MED_Aminebm','2026-01-29 14:42:42.721702','Client'),(12,_binary '\0','Création d\'un nouveau client :123azizapar :gias2gias2','2026-01-29 16:13:34.080785','Client'),(13,_binary '\0','Création d\'un nouveau client :10GIAS2par :gias3gias3','2026-02-10 10:25:33.961556','Client'),(14,_binary '\0','Nouvelle inscription : commercial  commercial','2026-02-11 15:41:48.681028','Inscription'),(15,_binary '\0','Nouvelle inscription : hakim hakim','2026-02-11 15:45:42.112788','Inscription'),(16,_binary '\0','Nouvelle inscription : rami 55','2026-02-13 08:36:00.256734','Inscription'),(17,_binary '\0','Nouvelle inscription : benmoussa amine','2026-02-13 08:48:24.746430','Inscription'),(18,_binary '\0','Nouvelle inscription : benmoussa amine','2026-02-13 08:48:24.815395','Inscription'),(19,_binary '\0','Nouvelle inscription : test  test','2026-02-13 10:07:06.837917','Inscription'),(20,_binary '\0','Nouvelle inscription : Test User','2026-02-23 10:29:39.226256','Inscription'),(21,_binary '\0','Nouvelle inscription : lilas lilas','2026-02-23 11:49:47.754741','Inscription'),(22,_binary '\0','Nouvelle inscription : lilas lilas','2026-02-23 11:49:49.663957','Inscription'),(23,_binary '\0','Nouvelle inscription : gipa gipa','2026-02-26 02:29:59.351921','Inscription'),(24,_binary '\0','Nouvelle inscription : delice delice','2026-02-26 02:43:49.684965','Inscription'),(25,_binary '\0','Nouvelle inscription : delice delice','2026-02-26 02:44:35.066289','Inscription'),(26,_binary '\0','Nouvelle inscription : delice delice','2026-02-26 02:44:36.478750','Inscription'),(27,_binary '\0','Nouvelle inscription : gipa gipa','2026-02-26 02:45:56.942770','Inscription'),(28,_binary '\0','Nouvelle inscription : gipa gipa','2026-02-26 02:47:58.081875','Inscription');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_counter`
--

DROP TABLE IF EXISTS `order_counter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_counter` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `current_value` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_counter`
--

LOCK TABLES `order_counter` WRITE;
/*!40000 ALTER TABLE `order_counter` DISABLE KEYS */;
INSERT INTO `order_counter` VALUES (1,2);
/*!40000 ALTER TABLE `order_counter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordre`
--

DROP TABLE IF EXISTS `ordre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordre` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `camion` varchar(255) DEFAULT NULL,
  `chargement_adr1` varchar(255) DEFAULT NULL,
  `chargement_adr2` varchar(255) DEFAULT NULL,
  `chargement_date` datetime(6) DEFAULT NULL,
  `chargement_nom` varchar(255) DEFAULT NULL,
  `chargement_ville` varchar(255) DEFAULT NULL,
  `chauffeur` varchar(255) DEFAULT NULL,
  `client` varchar(255) DEFAULT NULL,
  `code_article` varchar(255) DEFAULT NULL,
  `codeclientcharg` varchar(255) DEFAULT NULL,
  `codeclientliv` varchar(255) DEFAULT NULL,
  `codepostalliv` varchar(255) DEFAULT NULL,
  `commentaires` varbinary(255) DEFAULT NULL,
  `date_saisie` datetime(6) NOT NULL,
  `datevoy` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `events` varbinary(255) DEFAULT NULL,
  `idedi` varchar(255) DEFAULT NULL,
  `livraison_adr1` varchar(255) DEFAULT NULL,
  `livraison_adr2` varchar(255) DEFAULT NULL,
  `livraison_date` datetime(6) DEFAULT NULL,
  `livraison_nom` varchar(255) DEFAULT NULL,
  `livraison_ville` varchar(255) DEFAULT NULL,
  `longueur` double DEFAULT NULL,
  `nombre_colis` int DEFAULT NULL,
  `nombre_palettes` int DEFAULT NULL,
  `nomclient` varchar(255) DEFAULT NULL,
  `order_number` varchar(255) DEFAULT NULL,
  `poids` double DEFAULT NULL,
  `siteclient` varchar(255) DEFAULT NULL,
  `statut` enum('CHARGE','EN_COURS_DE_CHARGEMENT','EN_COURS_DE_LIVRAISON','FIN','LIVRE','NON_CONFIRME','NON_LIVRE','NON_PLANIFIE','PLANIFIE') DEFAULT NULL,
  `telchauffeur` varchar(255) DEFAULT NULL,
  `volume` double DEFAULT NULL,
  `voycle` varchar(255) DEFAULT NULL,
  `trancking_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKbp72caacwuxpqcyojget4w1n0` (`trancking_id`),
  CONSTRAINT `FK8er32dkvp6jsqapq2rsuahmvu` FOREIGN KEY (`trancking_id`) REFERENCES `tranck` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordre`
--

LOCK TABLES `ordre` WRITE;
/*!40000 ALTER TABLE `ordre` DISABLE KEYS */;
INSERT INTO `ordre` VALUES (1,NULL,'GROMBALIA','','2026-02-10 02:00:00.000000','ANWAR','NABEUL',NULL,'03','TN-AGRO-003','03','03','45',_binary '�\�\0sr\0java.util.ArrayListx�\��\�a�\0I\0sizexp\0\0\0\0w\0\0\0\0x','2026-02-10 10:18:18.239000',NULL,'Dattes Deglet Nour (Ravier 500g)',NULL,'0','GROMBALIA','','2026-02-17 14:00:00.000000','ANWAR','NABEUL',0,2,5,'ANWAR','DIV0000001',17,'BKS','CHARGE',NULL,8,NULL,1),(2,NULL,'BAR','','2026-02-10 12:00:00.000000','GIAS2','NABEUL',NULL,'03','TN-AGRO-002','499','03','45',_binary '�\�\0sr\0java.util.ArrayListx�\��\�a�\0I\0sizexp\0\0\0\0w\0\0\0\0x','2026-02-10 10:37:03.109000',NULL,'Huile d\'Olive Extra Vierge (Bouteille 1L)',NULL,'0','GROMBALIA','','2026-02-10 17:00:00.000000','ANWAR','NABEUL',0,1,44,'ANWAR','DIV0000002',22,'BKS','NON_PLANIFIE',NULL,55,NULL,2);
/*!40000 ALTER TABLE `ordre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tranck`
--

DROP TABLE IF EXISTS `tranck`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tranck` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `chargement` bit(1) DEFAULT NULL,
  `delivery_dated` datetime(6) DEFAULT NULL,
  `delivery_datef` datetime(6) DEFAULT NULL,
  `depart` bit(1) DEFAULT NULL,
  `departure_date_time` datetime(6) DEFAULT NULL,
  `livraison` bit(1) DEFAULT NULL,
  `loading_dated` datetime(6) DEFAULT NULL,
  `loading_datef` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tranck`
--

LOCK TABLES `tranck` WRITE;
/*!40000 ALTER TABLE `tranck` DISABLE KEYS */;
INSERT INTO `tranck` VALUES (1,_binary '\0',NULL,NULL,_binary '\0',NULL,_binary '\0',NULL,NULL),(2,_binary '\0',NULL,NULL,_binary '\0',NULL,_binary '\0',NULL,NULL);
/*!40000 ALTER TABLE `tranck` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-02  9:57:56
