-- =========================================================
-- Wanderlust Tours & Travels - MySQL Database Schema
-- Ready for XAMPP phpMyAdmin (http://localhost/phpmyadmin)
-- =========================================================

CREATE DATABASE IF NOT EXISTS `wanderlust_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wanderlust_db`;

-- 1. Bookings Table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `package_id` VARCHAR(64) DEFAULT NULL,
  `package_title` VARCHAR(255) DEFAULT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `travelers_count` INT DEFAULT 1,
  `total_amount` DECIMAL(10,2) DEFAULT 0.00,
  `payment_status` VARCHAR(50) DEFAULT 'Pending',
  `booking_status` VARCHAR(50) DEFAULT 'Confirmed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `raw_data` LONGTEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tour Packages Table
CREATE TABLE IF NOT EXISTS `packages` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `duration` VARCHAR(50) DEFAULT NULL,
  `base_price` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'Popular',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Seed Packages
INSERT INTO `packages` (`id`, `title`, `destination`, `duration`, `base_price`, `category`) VALUES
('kashmir-paradise', 'Kashmir Paradise: Valley of Romance & Snow', 'Kashmir', '6D/5N', 24999.00, 'Domestic'),
('dubai-luxury', 'Dubai Luxury & Desert Safari Marvels', 'Dubai', '5D/4N', 39999.00, 'International'),
('swiss-alps-tour', 'Swiss Alps Grand Tour: Zurich & Lucerne', 'Switzerland', '7D/6N', 89999.00, 'International'),
('goa-beach-delight', 'Goa Coastal & Heritage Boutique Stay', 'Goa', '4D/3N', 14999.00, 'Domestic'),
('kerala-backwaters', 'Kerala Backwaters & Munnar Tea Estates', 'Kerala', '6D/5N', 21999.00, 'Domestic'),
('spiti-expedition', 'Spiti Valley High-Altitude 4x4 Expedition', 'Himachal', '8D/7N', 28499.00, 'Adventure')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- 3. Customer Inquiries Table
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `destination` VARCHAR(100) DEFAULT NULL,
  `message` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Application Settings Table
CREATE TABLE IF NOT EXISTS `app_settings` (
  `key_name` VARCHAR(100) NOT NULL PRIMARY KEY,
  `key_value` TEXT DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `app_settings` (`key_name`, `key_value`) VALUES
('admin_whatsapp', '918792658635'),
('upi_id', '6364848532@upi')
ON DUPLICATE KEY UPDATE `key_value` = VALUES(`key_value`);

-- 5. Registered Customers Table (Login & Registration)
CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NOT NULL,
  `country_code` VARCHAR(10) DEFAULT '+91',
  `password` VARCHAR(255) NOT NULL,
  `loyalty_tier` VARCHAR(50) DEFAULT 'Silver Voyager',
  `loyalty_points` INT DEFAULT 500,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Seed Demo Customers
INSERT INTO `customers` (`id`, `name`, `email`, `phone`, `country_code`, `password`, `loyalty_tier`, `loyalty_points`) VALUES
('USR-DEMO-1', 'Aarav Sharma', 'aarav.sharma@example.com', '9876543210', '+91', '123456', 'Gold Explorer', 1250),
('USR-DEMO-2', 'Sarah Jenkins', 'sarah.j@travelworld.com', '7911123456', '+44', '123456', 'Platinum Connoisseur', 3800)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
