-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: courier
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
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `police_station_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKica2nnf6jymrt09bvuv7e4mai` (`user_id`),
  KEY `FKdn9qwmbe5l8g108vefpkw6g14` (`police_station_id`),
  CONSTRAINT `FK2vh8rg4inh3scgcguimya35my` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKdn9qwmbe5l8g108vefpkw6g14` FOREIGN KEY (`police_station_id`) REFERENCES `policestations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
INSERT INTO `agents` VALUES (11,_binary '','Manager','Agent_afbce016-ae16-4eca-ba56-c78887e7ff06.jpg',1,55);
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `code` varchar(3) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK5dhgnik9p8t72kaktdb8kd8dt` (`code`),
  UNIQUE KEY `UK1pyiwrqimi3hnl3vtgsypj5r` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,_binary '','BD','Bangladesh','+880'),(2,_binary '\0','PK','Pakistan','+92'),(3,_binary '','IN','India','+91'),(4,_binary '','US','United States','+1'),(5,_binary '','GB','United Kingdom','+44'),(6,_binary '','CA','Canada','+1'),(7,_binary '','AU','Australia','+61'),(8,_binary '','AE','United Arab Emirates','+971'),(9,_binary '','SA','Saudi Arabia','+966'),(10,_binary '','QA','Qatar','+974'),(11,_binary '','KW','Kuwait','+965'),(12,_binary '','OM','Oman','+968'),(13,_binary '','BH','Bahrain','+973'),(14,_binary '','MY','Malaysia','+60'),(15,_binary '','SG','Singapore','+65'),(16,_binary '','TH','Thailand','+66'),(17,_binary '','JP','Japan','+81'),(18,_binary '','KR','South Korea','+82'),(19,_binary '','CN','China','+86'),(20,_binary '','DE','Germany','+49'),(21,_binary '','FR','France','+33'),(22,_binary '','IT','Italy','+39'),(23,_binary '','ES','Spain','+34'),(24,_binary '','NL','Netherlands','+31'),(25,_binary '','NZ','New Zealand','+64');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `police_station_id` bigint DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeuat1oase6eqv195jvb71a93s` (`user_id`),
  KEY `FK2jlyb2c45nw0h6a2qdhf6ckep` (`police_station_id`),
  CONSTRAINT `FK2jlyb2c45nw0h6a2qdhf6ckep` FOREIGN KEY (`police_station_id`) REFERENCES `policestations` (`id`),
  CONSTRAINT `FKrh1g1a20omjmn6kurd35o3eit` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `district_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `name_bn` varchar(255) DEFAULT NULL,
  `division_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl374uao5cplc8w347pn93svoc` (`division_id`),
  CONSTRAINT `FKl374uao5cplc8w347pn93svoc` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,_binary '',NULL,'Dhaka','ঢাকা',1),(2,_binary '',NULL,'Faridpur','ফরিদপুর',1),(3,_binary '',NULL,'Gazipur','গাজীপুর',1),(4,_binary '',NULL,'Gopalganj','গোপালগঞ্জ',1),(5,_binary '',NULL,'Kishoreganj','কিশোরগঞ্জ',1),(6,_binary '',NULL,'Madaripur','মাদারীপুর',1),(7,_binary '',NULL,'Khulna','খুলনা',4),(8,_binary '',NULL,'Kushtia','কুষ্টিয়া',4),(9,_binary '',NULL,'Magura','মাগুরা',4),(10,_binary '',NULL,'Meherpur','মেহেরপুর',4),(11,_binary '',NULL,'Narail','নড়াইল',4),(12,_binary '',NULL,'Satkhira','সাতক্ষীরা',4),(13,_binary '','','Pirojpur','পিরোজপুর',5),(14,_binary '','','Lakshmipur','লক্ষ্মীপুর',2);
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `name_bn` varchar(255) DEFAULT NULL,
  `country_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2o4cg3xxx0ea0mapwhjr7racp` (`country_id`),
  CONSTRAINT `FK2o4cg3xxx0ea0mapwhjr7racp` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisions`
--

LOCK TABLES `divisions` WRITE;
/*!40000 ALTER TABLE `divisions` DISABLE KEYS */;
INSERT INTO `divisions` VALUES (1,_binary '','Dhaka','ঢাকা',1),(2,_binary '','Chattogram','চট্টগ্রাম',1),(3,_binary '','Rajshahi','রাজশাহী',1),(4,_binary '','Khulna','খুলনা',1),(5,_binary '','Barishal','বরিশাল',1),(6,_binary '','Sylhet','সিলেট',1),(7,_binary '','Rangpur','রংপুর',1),(8,_binary '','Mymensingh','ময়মনসিংহ',1),(10,_binary '','Cumilla','কুমিল্লা',1);
/*!40000 ALTER TABLE `divisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcel_history`
--

DROP TABLE IF EXISTS `parcel_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcel_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `parcel_id` bigint NOT NULL,
  `performed_by_rider_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKk21ormkd1utw6nlf0r8447iiu` (`parcel_id`),
  KEY `FK5lqx5mrcfqltx5xfo6q3t0jk9` (`performed_by_rider_id`),
  CONSTRAINT `FK5lqx5mrcfqltx5xfo6q3t0jk9` FOREIGN KEY (`performed_by_rider_id`) REFERENCES `riders` (`id`),
  CONSTRAINT `FKk21ormkd1utw6nlf0r8447iiu` FOREIGN KEY (`parcel_id`) REFERENCES `parcels` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcel_history`
--

LOCK TABLES `parcel_history` WRITE;
/*!40000 ALTER TABLE `parcel_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `parcel_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parcels`
--

DROP TABLE IF EXISTS `parcels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parcels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_source` enum('AGENT','ONLINE') DEFAULT NULL,
  `cod_amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `delivery_charge` double DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `estimated_delivery` date DEFAULT NULL,
  `parcel_type` enum('DOCUMENT','FRAGILE','HEAVY','PERISHABLE','PRODUCT') DEFAULT NULL,
  `payment_method` enum('BKASH','COD','NAGAD','PREPAID','SSLCOMMERZ') DEFAULT NULL,
  `payment_status` enum('FAILED','PAID','PENDING','REFUNDED') DEFAULT NULL,
  `priority` enum('HIGH','NORMAL','URGENT') DEFAULT NULL,
  `receiver_address` varchar(255) DEFAULT NULL,
  `receiver_name` varchar(255) DEFAULT NULL,
  `receiver_phone` varchar(255) DEFAULT NULL,
  `sender_address` varchar(255) DEFAULT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `sender_phone` varchar(255) DEFAULT NULL,
  `service_type` enum('EXPRESS','OVERNIGHT','SAME_DAY','STANDARD') DEFAULT NULL,
  `special_instructions` varchar(255) DEFAULT NULL,
  `status` enum('CANCELLED','DELIVERED','IN_TRANSIT','OUT_FOR_DELIVERY','PENDING','PICKED_UP','RETURNED') DEFAULT NULL,
  `tracking_code` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `agent_id` bigint DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  `destination_ps_id` bigint DEFAULT NULL,
  `origin_ps_id` bigint DEFAULT NULL,
  `rider_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK80qlyxi2aorgfyh7p1710ol89` (`agent_id`),
  KEY `FK22sohliin55ltc0p4jyhw6bu2` (`customer_id`),
  KEY `FK1k9ufqglxleorry6erb0s73fw` (`destination_ps_id`),
  KEY `FKjui7oiqbgemkmh2puuw1sy4m1` (`origin_ps_id`),
  KEY `FKja0i92qggq24pq88ty5985qit` (`rider_id`),
  CONSTRAINT `FK1k9ufqglxleorry6erb0s73fw` FOREIGN KEY (`destination_ps_id`) REFERENCES `policestations` (`id`),
  CONSTRAINT `FK22sohliin55ltc0p4jyhw6bu2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK80qlyxi2aorgfyh7p1710ol89` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`),
  CONSTRAINT `FKja0i92qggq24pq88ty5985qit` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`),
  CONSTRAINT `FKjui7oiqbgemkmh2puuw1sy4m1` FOREIGN KEY (`origin_ps_id`) REFERENCES `policestations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcels`
--

LOCK TABLES `parcels` WRITE;
/*!40000 ALTER TABLE `parcels` DISABLE KEYS */;
/*!40000 ALTER TABLE `parcels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `policestations`
--

DROP TABLE IF EXISTS `policestations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `policestations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `name_bn` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `district_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa8qg39gnjde9t8dc8m9a4qbsb` (`district_id`),
  CONSTRAINT `FKa8qg39gnjde9t8dc8m9a4qbsb` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policestations`
--

LOCK TABLES `policestations` WRITE;
/*!40000 ALTER TABLE `policestations` DISABLE KEYS */;
INSERT INTO `policestations` VALUES (1,_binary '','Mirpur Model','মিরপুর মডেল','1216',1),(2,_binary '','Dhanmondi','ধানমন্ডি','1209',1),(3,_binary '','Gulshan','গুলশান','1212',1),(4,_binary '','Gazipur Sadar','গাজীপুর সদর','1700',3),(5,_binary '','Tongi','টঙ্গী','1710',3),(6,_binary '','Faridpur Sadar','ফরিদপুর সদর','7800',2),(7,_binary '','Boalmari','বোয়ালমারী','7860',2),(8,_binary '','Khulna Sadar','খুলনা সদর','9000',7),(9,_binary '','Sonadanga','সোনাডাঙ্গা','9100',7),(10,_binary '','Kushtia Sadar','কুষ্টিয়া সদর','7000',8),(11,_binary '','Bheramara','ভেড়ামারা','7040',8),(12,_binary '','Mathbaria ','মঠবাড়িয়া','8560',13);
/*!40000 ALTER TABLE `policestations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider_zones`
--

DROP TABLE IF EXISTS `rider_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rider_zones` (
  `rider_id` bigint NOT NULL,
  `police_station_id` bigint NOT NULL,
  PRIMARY KEY (`rider_id`,`police_station_id`),
  KEY `FKg8kfxpj6fjqk55nty3oghoaq2` (`police_station_id`),
  CONSTRAINT `FKb0ji2abd8xd06vgbpu307bsbx` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`),
  CONSTRAINT `FKg8kfxpj6fjqk55nty3oghoaq2` FOREIGN KEY (`police_station_id`) REFERENCES `policestations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rider_zones`
--

LOCK TABLES `rider_zones` WRITE;
/*!40000 ALTER TABLE `rider_zones` DISABLE KEYS */;
INSERT INTO `rider_zones` VALUES (7,1),(7,2),(7,3);
/*!40000 ALTER TABLE `rider_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `riders`
--

DROP TABLE IF EXISTS `riders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `riders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `nid_number` varchar(255) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `total_deliveries` int DEFAULT NULL,
  `total_earnings` double DEFAULT NULL,
  `vehicle_number` varchar(255) DEFAULT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKmd7hraff9l3eqaeoixojtwp6l` (`user_id`),
  CONSTRAINT `FKil1ejbdvowvv4imr2lf8o29mn` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riders`
--

LOCK TABLES `riders` WRITE;
/*!40000 ALTER TABLE `riders` DISABLE KEYS */;
INSERT INTO `riders` VALUES (7,_binary '','Rider_5bf0a902-b2a5-456d-826b-5ac631c02b36.jpg','123456',0,0,0,'Prince Torento','Bicycle',54);
/*!40000 ALTER TABLE `riders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','AGENT','CUSTOMER','RIDER') DEFAULT NULL,
  `police_station_id` bigint DEFAULT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`),
  KEY `FKipgo66qij29k0c5viibscm8y6` (`police_station_id`),
  CONSTRAINT `FKipgo66qij29k0c5viibscm8y6` FOREIGN KEY (`police_station_id`) REFERENCES `policestations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (54,'rider@gmail.com','Rider','$2a$10$ep/.IKrHfk78RP6NCjjQIuquQbPWgR9FdfnrCVmbPoREN4XJ5GuPi','123456','RIDER',NULL,_binary '\0'),(55,'Agent@gmail.com','Agent','$2a$10$GrkJs7uaqoIdMy/ai1cw.enlDTyzAb6nBmP8yT0aBrhRXr.tv11IG','987654321','AGENT',1,_binary '\0');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-21 18:52:28
