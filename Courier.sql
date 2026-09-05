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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
INSERT INTO `agents` VALUES (11,_binary '','Manager','Agent_afbce016-ae16-4eca-ba56-c78887e7ff06.jpg',1,55),(12,_binary '','Manager','Dhaka_Central_Hub_79566dc7-2658-46db-b1b4-a2fdd9a5f38c.jpg',13,58),(13,_binary '','Manager','Faridpur-agent_409a2fb5-df3a-4257-97e9-caeafa8b449c.jpg',6,60),(14,_binary '','Manager','Agent_Dhanmondi_3ea3279e-7d7c-4b57-8460-d1155bd6238c.jpg',2,61);
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (29,'asfsdfhds dsfds.m sdfsdf dsm, Faridpur Sadar, Faridpur, Dhaka, Bangladesh','2026-05-31','MALE','customer_8e42d718-0f48-4828-ad2e-ce9e1d49d8ee.jpg',6,56),(30,'8/10 Sir Syed Road, Iqbal Road, flat-2A, Mohammadpur, Mirpur Model, Dhaka, Dhaka, Bangladesh','2026-06-03','MALE','Muhammad_Emran_Hossain_8ae42eb8-07e7-420d-9913-f70da56f193a.jpg',1,57),(31,'sdfsdfs, Mathbaria , Pirojpur, Barishal, Bangladesh','2006-07-02','MALE',NULL,12,63),(32,'Mymensingh','2000-06-14','Male',NULL,10,64);
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcel_history`
--

LOCK TABLES `parcel_history` WRITE;
/*!40000 ALTER TABLE `parcel_history` DISABLE KEYS */;
INSERT INTO `parcel_history` VALUES (1,'2026-06-25 16:22:43.916389','Mirpur Model Hub','Parcel booked at Mirpur Model Hub by agent Agent','PENDING',1,NULL),(2,'2026-06-25 16:29:36.735144','Mirpur Hub','sfdghjgfds','PICKED_UP',1,NULL),(3,'2026-06-25 17:32:49.326977','Sonadanga Hub','Parcel booked at Sonadanga Hub by agent Agent','PENDING',2,NULL),(4,'2026-06-25 18:05:23.139860','Kushtia Sadar Hub','Parcel booked at Kushtia Sadar Hub by agent Agent','PENDING',3,NULL),(5,'2026-06-25 18:16:15.273536','Khulna Sadar Hub','Parcel booked at Khulna Sadar Hub by agent Agent','PENDING',4,NULL),(6,'2026-06-25 18:21:41.763809','Khulna Sadar Hub','Parcel booked at Khulna Sadar Hub by agent Agent','PENDING',5,NULL),(7,'2026-06-25 18:25:32.157542','Khulna Sadar Hub','Parcel booked at Khulna Sadar Hub by agent Agent','PENDING',6,NULL),(8,'2026-06-25 18:27:20.116469','Sonadanga Hub','Parcel booked at Sonadanga Hub by agent Agent','PENDING',7,NULL),(9,'2026-06-25 18:30:33.414890','Mirpur Model Hub','Parcel booked at Mirpur Model Hub by agent Agent','PENDING',8,NULL),(10,'2026-06-25 18:37:01.994207','Khulna Sadar Hub','Parcel booked at Khulna Sadar Hub by agent Agent','PENDING',9,NULL),(11,'2026-06-27 14:49:23.098864','DHK-Central','12233','IN_TRANSIT',2,NULL),(12,'2026-06-27 15:38:23.267293','gfdgfdg','dfgdfgdfgdf','IN_TRANSIT',2,NULL),(13,'2026-06-27 15:50:48.577421','Dhaka Central Hub','Transfer','IN_TRANSIT',8,NULL),(14,'2026-06-27 16:38:22.856531','Out For Delevary ','','OUT_FOR_DELIVERY',2,7),(15,'2026-06-27 18:05:57.373078','jfkljdsfd','dfsdfsdfsd','OUT_FOR_DELIVERY',1,7),(16,'2026-06-27 18:43:09.069542','Destination','','DELIVERED',2,NULL),(17,'2026-06-27 18:46:48.515739','DHK-Central','','IN_TRANSIT',9,NULL),(18,'2026-06-27 18:47:36.589669','','','IN_TRANSIT',9,NULL),(19,'2026-06-27 18:47:58.384053','Out for Delevary','','OUT_FOR_DELIVERY',9,7),(20,'2026-06-27 18:48:19.798337','NA','Na','DELIVERED',9,NULL),(21,'2026-06-28 15:13:50.077339','bsdghufsdf','dsfsfgdsfsd','OUT_FOR_DELIVERY',8,7),(22,'2026-06-28 15:14:33.956507','Central Hub','na','IN_TRANSIT',8,NULL),(23,'2026-06-28 16:05:00.988287','Central Hub','na','IN_TRANSIT',8,NULL),(24,'2026-06-28 16:06:57.023754','Mirpur Model Hub','Parcel booked at Mirpur Model Hub by agent Agent','PENDING',10,NULL),(25,'2026-06-28 16:14:45.129305','Central Hub ','Dispatched from Mirpur Model → Motijheel','IN_TRANSIT',10,NULL),(26,'2026-06-28 17:04:11.224895','Motijheel','Dispatched from Motijheel → Faridpur Sadar','IN_TRANSIT',10,NULL),(27,'2026-06-28 17:05:41.169372','Faridpur Sadar','Assigned to rider Rider-Faridpur (Bike)','OUT_FOR_DELIVERY',10,NULL),(28,'2026-06-28 17:06:26.878150','','Delivered successfully','DELIVERED',10,NULL),(29,'2026-06-28 18:20:45.361928','Dhanmondi Hub','Parcel booked successfully','PENDING',11,NULL),(30,'2026-06-28 18:24:30.333911','SDFGH','sdfdssd','PICKED_UP',11,NULL),(31,'2026-06-29 18:15:32.405766','Gulshan Hub','Parcel booked successfully','PENDING',12,NULL),(32,'2026-07-01 18:47:21.229252','Mirpur Model','Assigned to rider Rider (Bicycle)','OUT_FOR_DELIVERY',8,NULL),(33,'2026-07-01 18:48:08.647495','','Delivered successfully','DELIVERED',8,NULL),(34,'2026-07-01 18:51:21.208167','','','PENDING',10,NULL),(35,'2026-07-02 15:54:22.579813','sdfds','sdfdsfsd','PICKED_UP',10,NULL),(36,'2026-07-02 17:50:11.883123','Mirpur Model Hub','Parcel booked successfully','PENDING',13,NULL),(37,'2026-07-02 18:20:54.640917','','','PICKED_UP',13,7),(38,'2026-07-02 18:35:02.935524','','','PENDING',13,NULL),(39,'2026-07-02 18:36:24.640665','Mirpur Model Hub','Parcel booked successfully','PENDING',14,NULL),(40,'2026-07-02 18:36:38.115347','Mirpur Model','Assigned to rider Rider (Bicycle)','PICKED_UP',14,NULL),(41,'2026-07-15 18:18:19.951024','Dhanmondi Hub','Parcel booked successfully','PENDING',15,NULL),(42,'2026-07-15 18:19:33.149397','Dhanmondi','Assigned to rider Rider (Bicycle)','PICKED_UP',15,NULL),(43,'2026-07-15 18:20:21.320638','Dhanmondi','Dispatched from Dhanmondi → Motijheel','IN_TRANSIT',15,NULL),(44,'2026-07-15 18:20:53.367555','Motijheel','Dispatched from Motijheel → Faridpur Sadar','IN_TRANSIT',15,NULL),(45,'2026-07-15 18:21:54.690718','Faridpur Sadar','Assigned to rider Rider (Bicycle)','OUT_FOR_DELIVERY',15,NULL),(46,'2026-07-15 18:22:24.182632','','Delivered successfully','DELIVERED',15,NULL),(47,'2026-07-15 18:23:49.823881','Mirpur Model Hub','Parcel booked at Mirpur Model Hub by agent Agent Dhanmondi','PENDING',16,NULL),(48,'2026-07-27 15:37:44.867884','Main Hub','Parcel booked successfully','PENDING',17,NULL),(49,'2026-07-27 16:31:15.376637','Main Hub','Parcel booked successfully','PENDING',18,NULL),(50,'2026-07-27 16:36:20.712024','Main Hub','Parcel booked successfully','PENDING',19,NULL),(51,'2026-07-28 14:40:54.849722','Mirpur Model Hub','Parcel booked successfully','PENDING',20,NULL),(52,'2026-08-16 16:51:06.408407','','Status updated','IN_TRANSIT',10,8),(53,'2026-08-16 16:51:38.537711','','Status updated','OUT_FOR_DELIVERY',10,8),(54,'2026-08-16 16:51:59.690342','','Status updated','DELIVERED',10,8),(55,'2026-08-16 16:54:51.975458','Mirpur Model Hub','Parcel booked successfully','PENDING',21,NULL),(56,'2026-08-16 16:57:06.517906','Mirpur','Assigned to rider Rider (Bicycle)','PICKED_UP',21,NULL),(57,'2026-08-16 16:57:38.632562','','Status updated','IN_TRANSIT',21,7),(58,'2026-08-16 16:58:07.865643','Mirpur Model','Dispatched from Mirpur Model → Motijheel','IN_TRANSIT',21,NULL),(59,'2026-08-16 17:00:12.711647','Faridpur Sadar','Dispatched from Faridpur Sadar → Faridpur Sadar','IN_TRANSIT',21,NULL),(60,'2026-08-16 17:02:29.778576','Faridpur Sadar','Assigned to rider Rider-Faridpur (Bike)','OUT_FOR_DELIVERY',21,NULL),(61,'2026-08-16 17:03:56.959274','','Status updated','DELIVERED',21,8),(62,'2026-08-18 16:45:27.578282','Dhanmondi Hub','Parcel booked successfully','PENDING',22,NULL),(63,'2026-08-18 17:35:58.719646','Dhanmondi Hub','Parcel booked successfully','PENDING',23,NULL),(64,'2026-08-18 18:29:26.384793','Dhanmondi','Cancelled by customer','CANCELLED',23,NULL),(65,'2026-08-20 17:09:26.095976','','Status updated','IN_TRANSIT',14,7),(66,'2026-08-20 17:09:31.746617','','Status updated','OUT_FOR_DELIVERY',14,7),(67,'2026-08-20 17:09:34.840323','','Status updated','DELIVERED',14,7);
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
  `payment_method` enum('BKASH','COD','NAGAD','PREPAID','SSLCOMMERZ','CASH') DEFAULT NULL,
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
  `current_hub_ps_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK80qlyxi2aorgfyh7p1710ol89` (`agent_id`),
  KEY `FK22sohliin55ltc0p4jyhw6bu2` (`customer_id`),
  KEY `FK1k9ufqglxleorry6erb0s73fw` (`destination_ps_id`),
  KEY `FKjui7oiqbgemkmh2puuw1sy4m1` (`origin_ps_id`),
  KEY `FKja0i92qggq24pq88ty5985qit` (`rider_id`),
  KEY `FKju6nn83p691ha7ere8lu2dmax` (`current_hub_ps_id`),
  CONSTRAINT `FK1k9ufqglxleorry6erb0s73fw` FOREIGN KEY (`destination_ps_id`) REFERENCES `policestations` (`id`),
  CONSTRAINT `FK22sohliin55ltc0p4jyhw6bu2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK80qlyxi2aorgfyh7p1710ol89` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`id`),
  CONSTRAINT `FKja0i92qggq24pq88ty5985qit` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`),
  CONSTRAINT `FKju6nn83p691ha7ere8lu2dmax` FOREIGN KEY (`current_hub_ps_id`) REFERENCES `policestations` (`id`),
  CONSTRAINT `FKjui7oiqbgemkmh2puuw1sy4m1` FOREIGN KEY (`origin_ps_id`) REFERENCES `policestations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parcels`
--

LOCK TABLES `parcels` WRITE;
/*!40000 ALTER TABLE `parcels` DISABLE KEYS */;
INSERT INTO `parcels` VALUES (1,'AGENT',0,'2026-06-25 16:22:43.825107',60,'Official Documents','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Shibganj, Bogura','Jamal Hossain','01987654321','Mirpur 10, Dhaka','Karim Ahmed','01812345678','STANDARD','Handle Carefully','OUT_FOR_DELIVERY','TRN-1782382963817','2026-06-27 18:05:57.407159',0.5,11,NULL,5,1,7,NULL),(2,'AGENT',500,'2026-06-25 17:32:49.301867',67.5,'sdsfsf','2026-06-28','DOCUMENT','COD','PAID','NORMAL','Test','Test1','012345678910','dfsasdas sa das','Test','0123456789','STANDARD','fdsfsdfsd','DELIVERED','TRN-1782387169300','2026-06-27 18:43:09.101799',0.5,11,NULL,1,9,NULL,NULL),(3,'AGENT',500,'2026-06-25 18:05:23.122909',67.5,'sdfsf','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Test','Test','0123456789','','Test','0123456789','STANDARD','sdfsfsd','PENDING','TRN-1782389123121','2026-06-25 18:05:23.122909',0.5,11,NULL,3,10,NULL,NULL),(4,'AGENT',1000,'2026-06-25 18:16:15.262580',75,'sdfs','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','Test','0123456789','STANDARD','fsdfsd','PENDING','TRN-1782389775261','2026-06-25 18:16:15.262580',0.5,11,NULL,2,8,NULL,NULL),(5,'AGENT',5000,'2026-06-25 18:21:41.761787',135,'asdf','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','Test','0123456789','STANDARD','sdfsdfsdsdfsd','PENDING','TRN-1782390101761','2026-06-25 18:21:41.761787',0.5,11,NULL,3,8,NULL,NULL),(6,'AGENT',5000,'2026-06-25 18:25:32.155699',135,'cbc','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','Test','0123456789','STANDARD','cvbcv','PENDING','TRN-1782390332154','2026-06-25 18:25:32.155699',0.5,11,NULL,7,8,NULL,NULL),(7,'AGENT',0,'2026-06-25 18:27:20.115499',60,'','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','Test','0123456789','STANDARD','','PENDING','TRN-1782390440115','2026-06-25 18:27:20.115499',0.5,11,NULL,2,9,NULL,NULL),(8,'AGENT',50000,'2026-06-25 18:30:33.410822',810,'','2026-06-28','DOCUMENT','COD','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','Test','0123456789','STANDARD','','DELIVERED','TRN-1782390633410','2026-07-01 18:48:08.650463',0.5,11,NULL,11,1,7,13),(9,'AGENT',0,'2026-06-25 18:37:01.986205',60,'fgfdghfd','2026-06-28','DOCUMENT','BKASH','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','Test','0123456789','STANDARD','gdgfdgdfgfd','DELIVERED','TRN-1782391021986','2026-06-27 18:48:19.800331',0.5,11,NULL,1,8,NULL,NULL),(10,'AGENT',0,'2026-06-28 16:06:57.016471',60,'na','2026-07-01','DOCUMENT','BKASH','PENDING','NORMAL','Test','Test-2','0123456789','dfsasdas sa das','Test-1','0123456789','STANDARD','na','DELIVERED','TRN-1782641217015','2026-08-16 16:51:59.695314',0.1,11,NULL,6,1,8,6),(11,'ONLINE',0,'2026-06-28 18:20:45.332971',60,'','2026-07-01','DOCUMENT','CASH','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','customer','12345678910','STANDARD','','PICKED_UP','TRN-1782649245330','2026-06-28 18:24:30.339889',0.1,NULL,29,8,2,NULL,NULL),(12,'ONLINE',0,'2026-06-29 18:15:32.345062',60,'','2026-07-02','DOCUMENT','CASH','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','customer','12345678910','STANDARD','','PENDING','TRN-1782735332340','2026-06-29 18:15:32.345062',0.1,NULL,29,7,3,NULL,NULL),(13,'ONLINE',0,'2026-07-02 17:50:11.866157',60,'','2026-07-05','DOCUMENT','CASH','PENDING','NORMAL','fghfghfghfghfg','Muhammad Jakaria','dfgjhfgh','sdfgfjhkm,','customer','12345678910','STANDARD','','PENDING','TRN-1782993011865','2026-07-02 18:35:02.961123',0.5,NULL,29,8,1,7,NULL),(14,'ONLINE',0,'2026-07-02 18:36:24.638641',60,'','2026-07-05','DOCUMENT','CASH','PENDING','NORMAL','Muhammad Jakaria','Muhammad Jakaria','dfgjhfgh','sdfgfjhkm,','Muhammad Jakaria','12345678910','STANDARD','','DELIVERED','TRN-1782995784637','2026-08-20 17:09:34.843322',0.5,NULL,29,7,1,7,NULL),(15,'ONLINE',0,'2026-07-15 18:18:19.923041',60,'','2026-07-18','DOCUMENT','CASH','PENDING','NORMAL','Test','Test','0123456789','dfsasdas sa das','TEST','0123456789','STANDARD','','DELIVERED','TRN-1784117899920','2026-07-15 18:22:24.184625',0.1,NULL,29,6,2,7,6),(16,'AGENT',0,'2026-07-15 18:23:49.820848',60,'','2026-07-18','DOCUMENT','CASH','PENDING','NORMAL','gdfgdf','dfgdf','dfgfd','gfdgdfgfd','sdgfhfd','gdfgdfgfd','STANDARD','','PENDING','TRN-1784118229820','2026-07-15 18:23:49.820848',0.1,14,NULL,8,1,NULL,NULL),(17,'ONLINE',500,'2026-07-27 15:37:44.807073',67.5,'','2026-07-30','DOCUMENT','COD','PENDING','NORMAL','asdas','asdas','565','asda','dsadas','4545','STANDARD','','PENDING','TRN-1785145064800','2026-07-27 15:37:44.807073',0.5,NULL,30,NULL,NULL,NULL,NULL),(18,'ONLINE',1000,'2026-07-27 16:31:15.362472',75,'','2026-07-30','DOCUMENT','COD','PENDING','NORMAL','dfgdfgfgfd','dgdfgfd','88888','dfgdf','fdgdfg','56565','STANDARD','','PENDING','TRN-1785148275361','2026-07-27 16:31:15.362472',0.5,NULL,30,6,NULL,NULL,NULL),(19,'ONLINE',0,'2026-07-27 16:36:20.706043',60,'','2026-07-30','DOCUMENT','BKASH','PENDING','NORMAL','dfgdfgdfgdf','dsfgfdgdfgdf','26546545','sdfsdfsdfsd','fdsfsdfsdfs','454545','STANDARD','','PENDING','TRN-1785148580706','2026-07-27 16:36:20.706043',0.5,NULL,30,13,NULL,NULL,NULL),(20,'ONLINE',5000,'2026-07-28 14:40:54.796219',135,'','2026-07-31','DOCUMENT','COD','PENDING','NORMAL','ssss, Khulna Sadar, Khulna, Khulna, Bangladesh','ssss','22222','aaaaa, Mirpur Model, Dhaka, Dhaka, Bangladesh','aaa','1111','STANDARD','','PENDING','TRN-1785228054792','2026-07-28 14:40:54.796219',0.5,NULL,30,8,1,NULL,NULL),(21,'ONLINE',0,'2026-08-16 16:54:51.971482',60,'asdfsfsd','2026-08-19','DOCUMENT','CASH','PENDING','NORMAL','gguyguy','sdfgfdg','14454','fdgfgdfgdf','customer','12345678910','STANDARD','sdfsd','DELIVERED','TRN-1786877691970','2026-08-16 17:03:56.963277',0.5,NULL,29,6,1,8,6),(22,'ONLINE',500,'2026-08-18 16:45:27.537599',48.5,'dgddf','2026-08-21','PRODUCT','CASH','PENDING','NORMAL','sfdsfs','sfsdfsf','dfdsf','sfsfsf','customer','12345678910','STANDARD','dfgdfgdf','PENDING','TRN-1787049927533','2026-08-18 16:45:27.538599',1,NULL,29,8,2,NULL,NULL),(23,'ONLINE',0,'2026-08-18 17:35:58.713623',41,'sf','2026-08-21','PRODUCT','CASH','PENDING','NORMAL','sdfsd, Bheramara, Kushtia, Khulna, Bangladesh','sddsf','sdf','sdfsfsdf sdfsfsd, Dhanmondi, Dhaka, Dhaka, Bangladesh','customer','12345678910','STANDARD','sdfsd','CANCELLED','TRN-1787052958713','2026-08-18 18:29:26.400789',1,NULL,29,11,2,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `policestations`
--

LOCK TABLES `policestations` WRITE;
/*!40000 ALTER TABLE `policestations` DISABLE KEYS */;
INSERT INTO `policestations` VALUES (1,_binary '','Mirpur Model','মিরপুর মডেল','1216',1),(2,_binary '','Dhanmondi','ধানমন্ডি','1209',1),(3,_binary '','Gulshan','গুলশান','1212',1),(4,_binary '','Gazipur Sadar','গাজীপুর সদর','1700',3),(5,_binary '','Tongi','টঙ্গী','1710',3),(6,_binary '','Faridpur Sadar','ফরিদপুর সদর','7800',2),(7,_binary '','Boalmari','বোয়ালমারী','7860',2),(8,_binary '','Khulna Sadar','খুলনা সদর','9000',7),(9,_binary '','Sonadanga','সোনাডাঙ্গা','9100',7),(10,_binary '','Kushtia Sadar','কুষ্টিয়া সদর','7000',8),(11,_binary '','Bheramara','ভেড়ামারা','7040',8),(12,_binary '','Mathbaria ','মঠবাড়িয়া','8560',13),(13,_binary '','Motijheel','মতিঝিল','1000',1);
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
INSERT INTO `rider_zones` VALUES (7,1),(7,2),(7,3),(8,6),(8,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `riders`
--

LOCK TABLES `riders` WRITE;
/*!40000 ALTER TABLE `riders` DISABLE KEYS */;
INSERT INTO `riders` VALUES (7,_binary '','Rider_5bf0a902-b2a5-456d-826b-5ac631c02b36.jpg','123456',0,0,0,'Prince Torento','Bicycle',54),(8,_binary '','Rider-Faridpur_da57489b-81f2-4ea9-82a9-eeabbca6c8d2.jpg','2112121212',0,0,0,'Prince Torento','Bike',59);
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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (54,'rider@gmail.com','Rider','$2a$10$ep/.IKrHfk78RP6NCjjQIuquQbPWgR9FdfnrCVmbPoREN4XJ5GuPi','123456','RIDER',NULL,_binary ''),(55,'Agent@gmail.com','Agent','$2a$10$GrkJs7uaqoIdMy/ai1cw.enlDTyzAb6nBmP8yT0aBrhRXr.tv11IG','987654321','AGENT',1,_binary ''),(56,'customer@gmail.com','customer','$2a$10$C1HApcSU.QJ7oICLTH3cdewg2UXqZZQuo0RAlGEostfh.PUAtTCf2','12345678910','CUSTOMER',6,_binary ''),(57,'hsstanvir@gmail.com','Muhammad Emran Hossain','$2a$10$vTabyeNEPRTesU6/WSduHeSRYKOn2SMwbjqK4aAVKovMVdXe3i.Im','01730482403','CUSTOMER',1,_binary ''),(58,'dhk-central@example.com','Dhaka Central Hub','$2a$10$Jb1bKpuPuMWjabUIw8u/be32K8j6nQ274CiETrbqdtjzwrugBKzPq','000000011','AGENT',13,_binary ''),(59,'rider-faridpur@gmail.com','Rider-Faridpur','$2a$10$kMQwVkqAq.mtxsRIuJtf4u/.BBtpA7eDXzu5PQz4mUms4MmtclUAO','01234567','RIDER',NULL,_binary ''),(60,'agent-faridpur@example.com','Faridpur-agent','$2a$10$dBCyxgBrK0AnRyIwddf91uLMld2YbMTIoKHGkK5keCDnxxdBnr2rm','852852852','AGENT',6,_binary ''),(61,'agent-dhanmondi@example.com','Agent Dhanmondi','$2a$10$7Zij4Dg40ITUQaAIOtPYGeRWPH1Juxt3T3WCKqhiMjO/r2avws8qq','111111111111111111','AGENT',2,_binary ''),(62,'admin@example.com','Admin','$2a$10$7Zij4Dg40ITUQaAIOtPYGeRWPH1Juxt3T3WCKqhiMjO/r2avws8qq','123321123','ADMIN',NULL,_binary ''),(63,'badrulaminidb69@gmail.com','Badrul Amin','$2a$10$hjJPxFbg.zYCVC.T2VWrC.qFQEr7Fpx0JsY6op2sYudT1YVMCcaVK','1122','CUSTOMER',12,_binary ''),(64,'1dffd@gmail.com','Md Tanvir ','$2a$10$qNvUrlba1fmCR0Vl2x7pDeun84gdb.lAeDIlm.RuWC5AZZyZZcnuC','8888','CUSTOMER',10,_binary '\0');
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

-- Dump completed on 2026-09-05 18:51:52
