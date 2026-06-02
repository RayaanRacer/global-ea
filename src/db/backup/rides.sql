/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 8.0.45 : Database - globalea
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`globalea` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `globalea`;

/*Table structure for table `ride_location_logs` */

DROP TABLE IF EXISTS `ride_location_logs`;

CREATE TABLE `ride_location_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ride_id` int NOT NULL,
  `latitude` decimal(10,7) NOT NULL,
  `longitude` decimal(10,7) NOT NULL,
  `speed` decimal(6,2) DEFAULT NULL,
  `heading` decimal(6,2) DEFAULT NULL,
  `recorded_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `ride_location_logs_ride_idx` (`ride_id`),
  KEY `ride_location_logs_recorded_at_idx` (`recorded_at`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `ride_location_logs` */

insert  into `ride_location_logs`(`id`,`ride_id`,`latitude`,`longitude`,`speed`,`heading`,`recorded_at`) values 
(1,4,26.8815000,81.0400000,18.00,270.00,'2026-06-02 15:59:43'),
(2,4,26.8820000,81.0350000,22.00,270.00,'2026-06-02 16:00:01'),
(3,4,26.8825000,81.0300000,25.00,270.00,'2026-06-02 16:00:09'),
(4,4,26.8830000,81.0250000,28.00,270.00,'2026-06-02 16:00:16'),
(5,4,26.8835000,81.0200000,30.00,270.00,'2026-06-02 16:00:25'),
(6,4,26.8840000,81.0150000,32.00,270.00,'2026-06-02 16:00:33'),
(7,4,26.8843000,81.0100000,25.00,270.00,'2026-06-02 16:00:41'),
(8,4,26.8847000,81.0050000,20.00,270.00,'2026-06-02 16:00:52'),
(9,4,26.8849163,80.9961013,0.00,270.00,'2026-06-02 16:01:00'),
(10,5,26.8857481,80.9906196,10.00,270.00,'2026-06-02 16:33:50'),
(11,5,26.8860660,80.9854340,20.00,270.00,'2026-06-02 16:34:50'),
(12,5,26.8877420,80.9784250,20.00,270.00,'2026-06-02 16:35:50'),
(13,5,26.9093690,80.9567470,20.00,270.00,'2026-06-02 16:36:41'),
(14,5,26.9119030,80.9444310,20.00,270.00,'2026-06-02 16:37:26'),
(15,5,26.9159980,80.9378200,20.00,270.00,'2026-06-02 16:38:31');

/*Table structure for table `rides` */

DROP TABLE IF EXISTS `rides`;

CREATE TABLE `rides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rider_id` int NOT NULL,
  `pickup_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `drop_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `pickup_latitude` decimal(10,7) NOT NULL,
  `pickup_longitude` decimal(10,7) NOT NULL,
  `drop_latitude` decimal(10,7) NOT NULL,
  `drop_longitude` decimal(10,7) NOT NULL,
  `distance_km` decimal(10,2) DEFAULT NULL,
  `estimated_fare` decimal(10,2) DEFAULT NULL,
  `final_fare` decimal(10,2) DEFAULT NULL,
  `ride_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'STANDARD',
  `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'CASH',
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REQUESTED',
  `cancel_reason` text COLLATE utf8mb4_unicode_ci,
  `requested_at` timestamp NOT NULL DEFAULT (now()),
  `accepted_at` timestamp NULL DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `rides_rider_idx` (`rider_id`),
  KEY `rides_status_idx` (`status`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `rides` */

insert  into `rides`(`id`,`rider_id`,`pickup_address`,`drop_address`,`pickup_latitude`,`pickup_longitude`,`drop_latitude`,`drop_longitude`,`distance_km`,`estimated_fare`,`final_fare`,`ride_type`,`payment_method`,`payment_status`,`status`,`cancel_reason`,`requested_at`,`accepted_at`,`started_at`,`completed_at`,`cancelled_at`,`created_at`,`updated_at`) values 
(1,8,'Hazratganj, Lucknow, Uttar Pradesh','Gomti Nagar, Lucknow, Uttar Pradesh',26.8466940,80.9461660,26.8500000,81.0080000,8.50,180.00,NULL,'STANDARD','CASH','PENDING','REQUESTED',NULL,'2026-06-02 15:24:33',NULL,NULL,NULL,NULL,'2026-06-02 15:24:33','2026-06-02 15:24:33'),
(2,8,'चिनहट, Lucknow, लखनऊ, Uttar Pradesh, 226028, India','Ring Road Flyover, अलीगंज, Lucknow, लखनऊ, Uttar Pradesh, 226024, India',26.8817010,81.0433912,26.9131301,80.9390142,14.99,119.00,NULL,'STANDARD','CASH','PENDING','REQUESTED',NULL,'2026-06-02 15:36:45',NULL,NULL,NULL,NULL,'2026-06-02 15:36:45','2026-06-02 15:36:45'),
(3,7,'चिनहट, Lucknow, लखनऊ, Uttar Pradesh, 226028, India','Polytechnic Chauraha, Block D, Indira Nagar, Lucknow, लखनऊ, Uttar Pradesh, 255001, India',26.8811340,81.0437368,26.8730188,80.9958317,20.00,120.00,NULL,'STANDARD','CASH','PENDING','REQUESTED',NULL,'2026-06-02 15:38:58',NULL,NULL,NULL,NULL,'2026-06-02 15:38:58','2026-06-02 15:38:58'),
(4,9,'चिनहट, Lucknow, लखनऊ, Uttar Pradesh, 226028, India','Sector - 15, मुंशी पुलिया, Lucknow, लखनऊ, Uttar Pradesh, 255001, India',26.8812417,81.0434813,26.8849163,80.9961013,10.00,120.00,NULL,'STANDARD','CASH','PENDING','COMPLETED',NULL,'2026-06-02 15:42:13','2026-06-02 10:24:45',NULL,'2026-06-02 10:52:05',NULL,'2026-06-02 15:42:13','2026-06-02 10:52:05'),
(5,9,'Ring Road, Sector - 15, मुंशी पुलिया, Lucknow, लखनऊ, Uttar Pradesh, 255001, India','Sitapur Road, अलीगंज, Lucknow, लखनऊ, Uttar Pradesh, 226024, India',26.8848087,80.9958419,26.9128239,80.9383254,100.00,120.00,NULL,'STANDARD','CASH','PENDING','COMPLETED',NULL,'2026-06-02 16:31:22','2026-06-02 11:01:34',NULL,'2026-06-02 11:08:37',NULL,'2026-06-02 16:31:22','2026-06-02 11:08:37'),
(6,9,'NH30, Bakshi Ka Talab, लखनऊ, Uttar Pradesh, 226201, India','Jankipuram, Lucknow, लखनऊ, Uttar Pradesh, 226026, India',27.0007713,80.9183707,26.9274555,80.9362525,12.00,120.00,NULL,'STANDARD','CASH','PENDING','COMPLETED',NULL,'2026-06-02 17:08:31','2026-06-02 12:06:22',NULL,'2026-06-02 12:06:39',NULL,'2026-06-02 17:08:31','2026-06-02 12:06:39'),
(7,9,'बाबू नारायण दीन मार्ग, Hazratganj, Lucknow, लखनऊ, Uttar Pradesh, 226027, India','Radisson, 24, Cantonment Road, अमीनाबाद, Lucknow, लखनऊ, Uttar Pradesh, 226018, India',26.8445342,80.9409012,26.8452545,80.9356722,10.00,10.00,NULL,'STANDARD','CASH','PENDING','REQUESTED',NULL,'2026-06-02 17:38:52',NULL,NULL,NULL,NULL,'2026-06-02 17:38:52','2026-06-02 17:38:52'),
(8,9,'गनेश गंज, Lucknow, लखनऊ, Uttar Pradesh, 226001, India','Lohia Path, सिविल लाइंस, Lucknow, लखनऊ, Uttar Pradesh, 226027, India',26.8393265,80.9302564,26.8460658,80.9518893,10.00,12.00,NULL,'STANDARD','CASH','PENDING','REQUESTED',NULL,'2026-06-02 17:40:19',NULL,NULL,NULL,NULL,'2026-06-02 17:40:19','2026-06-02 17:40:19'),
(9,9,'Jopling Road, सिविल लाइंस, Lucknow, लखनऊ, Uttar Pradesh, 226027, India','Research Design & Standards Organisation, आलमबाग, Lucknow, लखनऊ, Uttar Pradesh, 226005, India',26.8557145,80.9585852,26.8227208,80.8943628,10.00,100.00,NULL,'STANDARD','CASH','PENDING','COMPLETED',NULL,'2026-06-02 17:48:42','2026-06-02 12:19:24',NULL,'2026-06-02 12:19:54',NULL,'2026-06-02 17:48:42','2026-06-02 12:19:54');

/*Table structure for table `user_login` */

DROP TABLE IF EXISTS `user_login`;

CREATE TABLE `user_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `user_login_user_id_users_id_fk` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `user_login` */

insert  into `user_login`(`id`,`user_id`,`email`,`password`,`created_at`,`updated_at`) values 
(1,1,'admin@global.com','$2b$10$OkbOqsvtSuX2uDHaRxeglOsKkFtSJ1i72/8mcoODEzl2aX/bXmI.G','2026-06-02 13:27:05','2026-06-02 13:27:05'),
(4,9,'rider.four@gmail.com','$2b$10$J6WkakbXQoLdo2bICfKWQe.2LnxsvLx9VrxhyrcW45BUy0mMSyGru','2026-06-02 15:41:16','2026-06-02 15:41:16');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_2fa_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `profile_image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uuid_unique` (`uuid`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_unique` (`phone`),
  KEY `users_email_idx` (`email`),
  KEY `users_phone_idx` (`phone`),
  KEY `users_role_idx` (`role`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`uuid`,`first_name`,`last_name`,`email`,`phone`,`role`,`status`,`is_email_verified`,`is_phone_verified`,`is_2fa_enabled`,`profile_image`,`last_login_at`,`created_at`,`updated_at`,`deleted_at`) values 
(1,'d4716341-c55a-455d-bb72-25d4ac11147d','Super','Admin','admin@global.com','9999999999','ADMIN','ACTIVE',1,0,0,NULL,NULL,'2026-06-02 13:27:05','2026-06-02 13:27:05',NULL),
(6,'','Rider','Two','rider.two@gmail.com','9876543211','RIDER','ACTIVE',0,0,0,NULL,NULL,'2026-06-02 14:12:30','2026-06-02 14:12:30',NULL),
(7,'03b8c65b-d046-4e47-821a-c5db8c197a32','Rider','One','rider.one@gmail.com','9876543210','RIDER','ACTIVE',0,0,0,NULL,NULL,'2026-06-02 14:14:50','2026-06-02 14:14:50',NULL),
(8,'8c2ea5b3-84d8-49e9-9fec-6229332b5bf7','Rider','hree','rider.three@gmail.com','9878679712','RIDER','ACTIVE',0,0,0,NULL,NULL,'2026-06-02 14:50:30','2026-06-02 14:50:30',NULL),
(9,'0de92bae-5c83-44fc-9052-f1ecaccd1e82','Ride','Four','rider.four@gmail.com','9878678756','RIDER','ACTIVE',0,0,0,NULL,NULL,'2026-06-02 15:41:16','2026-06-02 15:41:16',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
