-- MySQL dump 10.13  Distrib 8.0.29, for macos12.2 (x86_64)
--
-- Host: localhost    Database: chapelAttendance
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `all_attendance`
--

DROP TABLE IF EXISTS `all_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `all_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `displayTitle` varchar(50) DEFAULT NULL,
  `parentGroup` varchar(50) DEFAULT NULL,
  `dateCreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `parentGroupValue` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `all_attendance`
--

LOCK TABLES `all_attendance` WRITE;
/*!40000 ALTER TABLE `all_attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `all_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attendance_Totals`
--

DROP TABLE IF EXISTS `Attendance_Totals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attendance_Totals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupName` varchar(50) DEFAULT NULL,
  `displayTitle` varchar(50) DEFAULT NULL,
  `dateCreated` datetime DEFAULT CURRENT_TIMESTAMP,
  `totalChildren` int DEFAULT NULL,
  `totalYouth` int DEFAULT NULL,
  `totalAdults` int DEFAULT NULL,
  `totalMembers` int DEFAULT NULL,
  `totalVisitors` int DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `totalCount` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendance_Totals`
--

LOCK TABLES `Attendance_Totals` WRITE;
/*!40000 ALTER TABLE `Attendance_Totals` DISABLE KEYS */;
/*!40000 ALTER TABLE `Attendance_Totals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attendants`
--

DROP TABLE IF EXISTS `Attendants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Attendants` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `firstName` varchar(40) DEFAULT NULL,
  `lastName` varchar(40) DEFAULT NULL,
  `age` varchar(30) DEFAULT NULL,
  `memberType` varchar(30) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attendants`
--

LOCK TABLES `Attendants` WRITE;
/*!40000 ALTER TABLE `Attendants` DISABLE KEYS */;
INSERT INTO `Attendants` VALUES (2,'Winnie','Ace','adult','member',1),(3,'Chris','Adams','adult','member',1),(4,'Cindy','Amoroso','adult','member',1),(5,'John','Amoroso','adult','member',1),(6,'Linda','Apel','adult','member',1),(7,'Scott','Apel','adult','member',1),(8,'Chris','Banks','adult','member',1),(9,'Whitney','Banks','adult','member',1),(10,'Donna','Barkley','adult','member',1),(11,'Paul','Barkley','adult','member',1),(12,'Cathy ','Beatty ','adult','member',1),(13,'Jeremy','Bowser','adult','member',1),(14,'Tara','Bowser','adult','member',1),(15,'Cassidy','Bowser','adult','member',1),(16,'Rylee','Bowser','adult','member',1),(17,'Rachel','Brosnahan','adult','member',1),(18,'Matt','Brosnahan','adult','member',1),(19,'Tammy','Bucklew','adult','member',1),(20,'Gloria','Burk','adult','member',1),(21,'Rebecca','Burroway','adult','member',1),(22,'Aaron','Burroway','adult','member',1),(23,'Anna','Busch','adult','member',1),(24,'Eli','Busch','adult','member',1),(25,'Kent','Cannon','adult','member',1),(26,'Keri','Cannon','adult','member',1),(27,'Brittany','Owens','adult','member',1),(28,'Megan','Owens','adult','member',1),(29,'Ethan','Owens','adult','member',1),(30,'Romeo','Chiu','adult','member',1),(31,'Desiree','Chiu','youth','member',1),(32,'Ryan','Chiu','adult','member',1),(33,'Chris','Clark','adult','member',1),(34,'Judy','Clark','adult','member',1),(35,'Christine','Clark','adult','member',1),(36,'Silas','Clark','adult','member',1),(37,'Christian','Clark','youth','member',1),(38,'Alissa','Cooper','adult','member',1),(39,'Earl','Cross','adult','member',1),(40,'Phyllis','Cross','adult','member',1),(41,'A.J.','Custer','adult','member',1),(42,'Michele','Custer','adult','member',1),(43,'Drew','Custer','youth','member',1),(44,'Katherine (Kat)','Custer','adult','member',1),(45,'Dave','Defibaugh','adult','member',1),(46,'Linda','Defibaugh','adult','member',1),(47,'Thomas','Dingman','adult','member',1),(48,'Doug','Elder','adult','member',1),(49,'Janet','Elder','adult','member',1),(50,'Simeon','Elder','youth','member',1),(51,'Travis','Elder','adult','member',1),(52,'Lauren','Elder','adult','member',1),(53,'Timothy','Farkas','adult','member',1),(54,'Karen','Farkas','adult','member',1),(55,'Daniella','Farkas','youth','member',1),(56,'Lois','Gregg','adult','member',1),(57,'Lori','Graham','adult','member',1),(58,'Steve','Hanna','adult','member',1),(59,'Leona','Hanna','adult','member',1),(60,'Robin','Hanna','adult','member',1),(61,'Joe','Hanna','adult','member',1),(62,'Libby','Hansford','adult','member',1),(63,'Linda','Hansford','adult','member',1),(64,'Alivia','Hartsfield','youth','member',1),(65,'Emma','Hawke','youth','member',1),(66,'Denise','Hiles','adult','member',1),(67,'Charlie (Chuck)','Hoffman','adult','member',1),(68,'Liz','Hoffman','adult','member',1),(69,'Mark','Hoffman','adult','member',1),(70,'Debbie','Hoffman','adult','member',1),(71,'Janie','Jack','adult','member',1),(72,'Barbara','Jones','adult','member',1),(73,'Butch','Jones','adult','member',1),(74,'Bob','Joyce','adult','member',1),(75,'Robin','Moore-Joyce','adult','member',1),(76,'Terry','Kaylor','adult','member',1),(77,'Larry ','King','adult','member',1),(78,'Joe','Kuzma','adult','member',1),(79,'Hazel','Kuzma','adult','member',1),(80,'Betsy','Lander','adult','member',1),(81,'David','Letzelter','adult','member',1),(82,'Robin','Letzelter','adult','member',1),(83,'Linda','Madison','adult','member',1),(84,'Bonnie','Marzik','adult','member',1),(85,'Anita','Matthews','adult','member',1),(86,'Jared (Willie)','Matthews','adult','member',1),(87,'Blake','Matthews','adult','member',1),(88,'Megan','Matthews','adult','member',1),(89,'Jim','McCormick','adult','member',1),(90,'Connie','McFadden','adult','member',1),(91,'Steven','McFadden','adult','member',1),(92,'Randy','Miller','adult','member',1),(93,'Linda','Miller','adult','member',1),(94,'Bette','Moore','adult','member',1),(95,'Russ','Moore','adult','member',1),(96,'Diane','Moore','adult','member',1),(97,'Marie','Nevel','adult','member',1),(98,'Nancy','Newbury','adult','member',1),(99,'Paul','Newbury','adult','member',1),(100,'Hannah','Newbury','adult','member',1),(101,'Michael','Newbury','adult','member',1),(102,'Daniel','Newbury','adult','member',1),(103,'Barbara','Oliphant','adult','member',1),(104,'James','Oliphant','adult','member',1),(105,'Charlie','Pearce','adult','member',1),(106,'Mellisha','Pearce','adult','member',1),(107,'Kyle','Pearce','adult','member',1),(108,'Luke','Pearce','adult','member',1),(109,'Ben','Renfrew','adult','member',1),(110,'Dylan','Renfrew','adult','member',1),(111,'Jordan','Renfrew','adult','member',1),(112,'Joyce','Riddle','adult','member',1),(113,'Joshua','Rodgers','adult','member',1),(114,'Staci','Rodgers','adult','member',1),(115,'Jordan','Rodgers','youth','member',1),(116,'Kyra','Rodgers','youth','member',1),(117,'Richard (Dick)','Rodgers','adult','member',1),(118,'Shelby','Rodgers','adult','member',1),(119,'Becky','Savage','adult','member',1),(120,'Dale','Savage','adult','member',1),(121,'Darlene','Savage','adult','member',1),(122,'Charlaine','Sienicki','adult','member',1),(123,'Carol','Sloan','adult','member',1),(124,'Greg','Sloan','adult','member',1),(125,'Andrew','Smith','adult','member',1),(126,'Bill','Smith','adult','member',1),(127,'Betty','Smith','adult','member',1),(128,'Paul','Troutman','adult','member',1),(129,'MaryLou','Troutman','adult','member',1),(130,'Shawn','Watson','adult','member',1),(131,'Rebecca (Becky)','Watson','adult','member',1),(132,'Gage','Watson','adult','member',1),(133,'Mason','Watson','adult','member',1),(134,'Michael','Welton','adult','member',1),(135,'Tiffany','Welton','adult','member',1),(136,'Beth','Wilkins','adult','member',1),(137,'Gary','Witherup','adult','member',1),(138,'Wilma','Wolfe','adult','member',1);
/*!40000 ALTER TABLE `Attendants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_names`
--

DROP TABLE IF EXISTS `group_names`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_names` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `age_group` varchar(50) DEFAULT NULL,
  `displayName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_names`
--

LOCK TABLES `group_names` WRITE;
/*!40000 ALTER TABLE `group_names` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_names` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-31 15:48:26
