-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 01, 2024 at 09:02 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `help1`
--

-- --------------------------------------------------------

--
-- Table structure for table `base`
--

DROP TABLE IF EXISTS `base`;
CREATE TABLE IF NOT EXISTS `base` (
  `base_id` int NOT NULL AUTO_INCREMENT,
  `base_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  PRIMARY KEY (`base_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `base`
--

INSERT INTO `base` (`base_id`, `base_name`, `latitude`, `longitude`) VALUES
(1, 'base', 38.27385299, 21.75714880);

-- --------------------------------------------------------

--
-- Table structure for table `cargo`
--

DROP TABLE IF EXISTS `cargo`;
CREATE TABLE IF NOT EXISTS `cargo` (
  `cargo_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`cargo_id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cargo`
--

INSERT INTO `cargo` (`cargo_id`, `user_id`, `item_id`, `quantity`) VALUES
(13, 33, 23, 25),
(14, 33, 13, 90),
(15, 33, 10, 22),
(16, 33, 5, 12),
(17, 33, 218, 10),
(18, 48, 2, 40),
(19, 48, 10, 5),
(20, 47, 6, 0),
(21, 47, 6, 12),
(22, 47, 3, 5),
(23, 47, 7, 15);

-- --------------------------------------------------------

--
-- Table structure for table `citizen_responses`
--

DROP TABLE IF EXISTS `citizen_responses`;
CREATE TABLE IF NOT EXISTS `citizen_responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `citizen_id` int NOT NULL,
  `item_id` int NOT NULL,
  `response_details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` enum('pending','accepted','cancelled','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `taken_over_by` int DEFAULT NULL,
  `people` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `citizen_responses`
--

INSERT INTO `citizen_responses` (`id`, `citizen_id`, `item_id`, `response_details`, `status`, `created_at`, `taken_over_by`, `people`) VALUES
(44, 1, 1, 'I can provide these', 'cancelled', '2023-11-14 16:01:22', NULL, NULL),
(45, 1, 4, 'I can provide these', 'cancelled', '2023-11-14 16:01:22', NULL, NULL),
(49, 1, 5, 'come get these items asked ', 'accepted', '2023-11-15 15:08:38', 41, NULL),
(50, 1, 7, 'come get these items asked ', 'pending', '2023-11-15 15:08:38', NULL, NULL),
(51, 1, 4, 'Can provide cool scarfs', 'accepted', '2023-11-15 15:11:25', 47, NULL),
(53, 39, 13, 'my', 'accepted', '2024-02-07 08:14:27', 33, NULL),
(54, 39, 23, '', 'accepted', '2024-02-09 10:35:40', 48, NULL),
(55, 39, 10, '', 'accepted', '2024-02-09 10:35:49', 48, NULL),
(56, 39, 1, '', 'accepted', '2024-02-09 10:35:52', 48, NULL),
(57, 44, 224, '', 'completed', '2024-09-30 11:49:56', 44, NULL),
(58, 44, 214, '', 'completed', '2024-09-30 11:49:56', 44, NULL),
(59, 44, 211, '', 'accepted', '2024-09-30 11:49:56', 44, NULL),
(60, 44, 226, '', 'accepted', '2024-09-30 11:49:56', 44, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `disaster_type`
--

DROP TABLE IF EXISTS `disaster_type`;
CREATE TABLE IF NOT EXISTS `disaster_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `disaster_type`
--

INSERT INTO `disaster_type` (`id`, `name`) VALUES
(1, 'Heavy rain (flood)'),
(2, 'Drought'),
(3, 'Heat wave'),
(4, 'Cold weather'),
(5, 'Earthquake'),
(6, 'Wildfire');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `disaster_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `quantity` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `disaster_id` (`disaster_id`)
) ENGINE=InnoDB AUTO_INCREMENT=227 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `disaster_id`, `name`, `description`, `quantity`) VALUES
(2, 2, 'Water Bottle', 'Essential for survival and hydration', 936),
(3, 2, 'Food', 'Non-perishable food items for sustenance', 992),
(4, 3, 'Cool scarf', 'Provides a cooling effect when wet and worn around the neck', 1000),
(5, 3, 'Cool wristlets', 'Wearable cooling accessories for the wrists', 988),
(6, 3, 'Fan', 'Portable hand-held or battery-operated fans', 988),
(7, 3, 'Cooling pads', 'Gel pads that can be cooled and applied to the body for heat relief. ', 985),
(8, 4, 'Winter hat', 'Insulated hats to retain body heat', 1000),
(9, 4, 'Winter gloves', 'Gloves designed to keep hands warm in cold conditions', 1000),
(10, 4, 'Scarf', 'To protect against cold winds and retain heat', 973),
(11, 4, 'Winter socks', 'Thick socks for warmth', 960),
(12, 4, 'Warm tent', 'Insulated and weather-resistant shelter', 1000),
(13, 4, 'Hot pack', 'Chemical or rechargeable packs that provide heat', 910),
(14, 4, 'Thermos', 'Insulated container to keep liquids hot', 1010),
(15, 5, 'Silver blanket', 'Reflective blankets to retain body heat and for shock prevention', 1000),
(16, 5, 'Helmet', 'Protective headgear to prevent injury from debris', 1000),
(17, 5, 'Disposable toilet', 'Hygienic solutions for sanitation needs', 1000),
(18, 5, 'Self-generated flashlight', 'Flashlights with a hand crank or other self-charging mechanisms', 1000),
(19, 6, 'Respirators or Dust Masks', 'Masks to filter out particulate matter from smoke', 1000),
(20, 6, 'First Aid Kits', 'Kits with supplies to treat burns and injuries', 1000),
(21, 6, 'Burn Ointments and Dressings', 'Specialized first aid for burn treatment', 1000),
(22, 6, 'Emergency Blankets', 'To provide warmth and protection from elements', 1000),
(23, 6, 'Bottled Water', 'For hydration when in need', 975),
(24, 6, 'Non-perishable Food', 'Food that requires no cooking and has a long shelf life', 1000),
(25, 6, 'Fire Extinguishers', 'Small, portable extinguishers for initial response', 1000),
(26, 6, 'Flashlights and Batteries', 'For visibility during power outages', 1000),
(27, 6, 'Portable Radios', 'To receive emergency broadcasts', 1000),
(28, 6, 'Eye Drops', 'To relieve eye irritation from smoke', 1000),
(29, 6, 'Wet Wipes', 'For personal hygiene when water access is limited', 1000),
(30, 6, 'Change of Clothing', 'Including protective clothing and sturdy shoes', 1000),
(31, 6, 'Work Gloves', 'To protect hands during cleanup and debris removal', 1000),
(49, 3, 'Electrolyte tabs', 'Very strong electrolyte tabs that get disolved in water designed to hydrate instantly. Pack of 10', 1000),
(50, 1, 'Mattress', 'Dry mattress for people whose households have been flooded', 1000),
(211, 1, 'Cleaning Kit', 'Complete set for household cleanliness', 800),
(212, 2, 'Insulated Water Flask', 'Keeps liquids at desired temperature', 650),
(213, 2, 'Canned Goods', 'Preserved food items, ready-to-eat', 1200),
(214, 3, 'Neck Cooler', 'Useful for heatwaves, easy to activate', 750),
(215, 3, 'Wristbands', 'Cooling wristbands, fashionable and functional', 980),
(216, 3, 'Electric Fan', 'Rechargeable personal fan with stand', 500),
(217, 3, 'Chill Mats', 'Multipurpose cooling gel mats', 870),
(218, 4, 'Beanie', 'Woolen headwear for chilly weather', 920),
(219, 4, 'Mittens', 'Woolen hand coverings for snowy days', 840),
(220, 4, 'Neck Gaiter', 'Versatile neck and face covering', 990),
(221, 4, 'Thermal Socks', 'Socks with thermal insulation for extra warmth', 760),
(222, 4, 'Expedition Tent', 'High resistance against extreme weather conditions', 450),
(223, 4, 'Heat Packs', 'Instant heat with the snap of a button', 980),
(224, 4, 'Vacuum Flask', 'Vacuum-sealed flask for hot beverages', 670),
(225, 5, 'Thermal Blanket', 'Space blankets to prevent hypothermia', 900),
(226, 5, 'Safety Helmet', 'Construction-grade head protection', 860);

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
CREATE TABLE IF NOT EXISTS `requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `people` int NOT NULL,
  `status` enum('accepted','pending','cancelled','completed') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `taken_over_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `item_id`, `people`, `status`, `created_at`, `details`, `taken_over_by`) VALUES
(15, 1, 2, 12, 'pending', '2023-11-15 14:02:38', 'water bottles X 12', NULL),
(16, 1, 7, 12, 'pending', '2023-11-15 14:02:59', '12 cooling pads', NULL),
(17, 1, 6, 12, 'accepted', '2023-11-15 15:07:49', 'fan for 12 people', 47),
(18, 1, 5, 12, 'accepted', '2023-11-15 15:08:08', 'for 12 people', 33),
(20, 1, 3, 3, 'accepted', '2023-11-19 15:03:30', '', 47),
(22, 6, 20, 55, 'accepted', '2023-11-21 20:46:28', 'We are short on first aid kits', 41),
(23, 39, 17, 3, 'accepted', '2024-02-03 07:13:47', 'test', 33),
(24, 39, 23, 5, 'accepted', '2024-02-08 10:17:57', 'water', 48);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `role` enum('admin','emt','citizen') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `name`, `phone`, `latitude`, `longitude`, `role`) VALUES
(1, 'chris', 'chris@proton.me', '$2y$10$rwotopywDak73OLwU2crD.dbc0gznLKipscyrtvZVxnCMKuydced2', 'Chris', '6912345678', 37.98276893, 23.72480392, 'citizen'),
(2, 'maria', 'maria@gmail.com', '$2y$10$dUSfPa6wkKcr6bWPisb5jeM0M60O90dnV.TUEKfoFI6uwPr7HhszC', 'Maria', NULL, NULL, NULL, 'citizen'),
(3, 'kwstas', 'kwstas@gmail.com', '$2y$10$8MeLkIWsboeW0OX/LAbYpuBavQ2qV3KQjeAY3H.Aq4NxRkrksVdaq', 'Kwstas', NULL, NULL, NULL, 'citizen'),
(4, 'user', 'user@proton.me', '$2y$10$s6tQ0lw4iqBuGal335uHsO3hJXnLX6wfCvOB.b5ynu6SwycsLCpS6', 'user', NULL, 37.56829000, 22.80528000, 'citizen'),
(5, 'vasilis', 'vasilis@gmail.com', '$2y$10$96PzGW8rd8BxjlwJ06tphOPx4d5LR9nRPLhjP0K3ZrdgREwz3d53q', 'Vasilis', NULL, NULL, NULL, 'citizen'),
(6, 'dimitris', 'dimitris@gmail.com', '$2y$10$9z3xaW2ZT8QMor136mtJz.E/sjlUg4uQXaAwMVj2Gkd2t8bXwSKd.', 'Dimitris', NULL, 37.99775500, 23.72480392, 'citizen'),
(7, 'giorgos', 'giorgos@hotmail.com', '$2y$10$g2bC1m/JjUgLE/cVeKUowuudD1EJRZbwNx3yY.HZbIGPJBWnGMOK2', 'Giorgos', NULL, NULL, NULL, 'citizen'),
(32, 'admin', 'admin@alally.com', '$2y$10$sw1QU/6XwxE8HSjhiR/KsO.CzX/4HUif1abcjW9MBR2E4R0XfO2d.', 'admin', '', 37.98276893, 23.72480392, 'admin'),
(33, 'emt', 'emt@alally.com', '$2y$10$BtfvAEPmeWLSXPFczPndR.kv.O45PPgHtYZg2UTCfHWe37V664Jfm', 'emt', '6955555555', 38.27359855, 21.75744653, 'emt'),
(39, 'giannos', 'vasileios6@gmail.com', '$2y$10$03nCkNn6B9d7MV84KatZse10fCdNUHI9JeDha/8rNATsDnSZM8ty.', 'giannos', '34543543', 38.18206898, 20.57052630, 'citizen'),
(41, 'rescuer2', 'rescuer2@gmail.com', '$2y$10$N4g6ktsxobkA7vm5YaPPz.E6h0/CF7ijyIhCevNalSyINs7MII/CS', 'rescuer2', '6912345567', 38.15737306, 23.98979429, 'emt'),
(42, 'fara', 'chfara@gmail.com', '$2y$10$Fqs2SAnLUXgYEa1ns.nhnu7n8WNureF7qZArou5UP5uO3qpEuqPwq', 'fara', '6970728989', 38.14583764, 23.77868677, 'citizen'),
(43, 'panos', 'panosuser@gmail.com', '$2y$10$esthzxM8mz/VXof3hRD/peuvqjIm9XLkb61FnMUHUtme10EVgfBku', 'panos', '69887900990', 39.14142061, 20.69335746, 'citizen'),
(44, 'chrisci', 'cichristos@gmail.com', '$2y$10$UM5G8mFJBglvhppeGlkYxe4D.0H0FgN1iHVR.4bR6zDLq2oIjj0A6', 'Christos Mc', '', 35.21084368, 24.67198330, 'citizen'),
(45, 'aggeliki', 'aggeliki@gmail.com', '$2y$10$xNOJrXhYp6owtGK67Ipwnuxwy7F.Z9i/dOQckK2eJ7eSXYdDjOxEO', 'Aggeliki', '', 38.10982823, 24.33715839, 'citizen'),
(46, 'fillipos', 'fillipos@gmail.com', '$2y$10$AwLaL060iDO4A1YNUZAC/uibeR7tzxCvm6cQxRgFtFB1QgysUsptq', 'Fillipos', '', 39.83479032, 21.80175919, 'citizen'),
(47, 'recuser', 'rescueruser@gmail.com', '$2y$10$EYBKjoB6vrUtZ8k7dgIR4uQ6D9.sF8I.IMO9i0tCif.cG/akSacZq', 'Rescuer User', '6987654321', 38.13453231, 23.53991205, 'emt'),
(48, 'bill', 'billrec@gmail.com', '$2y$10$rCo.DwrKcToqe.oim7qDTOmGN06XBqtdsmUZ0sWM8Bg2nKkn2OQ6G', 'Bill Resc', '6912340987', 38.27358297, 21.75706517, 'emt');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cargo`
--
ALTER TABLE `cargo`
  ADD CONSTRAINT `cargo_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `cargo_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`disaster_id`) REFERENCES `disaster_type` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
