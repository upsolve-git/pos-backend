-- CREATE DATABASE store_management;

USE store_management;

-- CREATE TABLE users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     role ENUM('admin', 'staff', 'customer') NOT NULL,
--     first_name VARCHAR(50) NOT NULL,
--     last_name VARCHAR(50) NOT NULL,
--     phone_number VARCHAR(15) UNIQUE NOT NULL,
--     email VARCHAR(100) UNIQUE NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     dob DATE NOT NULL,
--     status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
--     is_subscribed BOOLEAN NOT NULL DEFAULT FALSE
-- );
-- CREATE TABLE Staff (
--     staff_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     hourlyWage DECIMAL(10, 2) NOT NULL,
--     specialisation VARCHAR(100),
--     available BOOLEAN NOT NULL DEFAULT TRUE,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );



-- CREATE TABLE Services (
--     service_id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     description TEXT,
--     duration INT NOT NULL, -- Duration in minutes
--     price DECIMAL(10, 2) NOT NULL,
--     commissionRate DECIMAL(5, 2) NOT NULL, -- Commission rate as a percentage
--     limitPerDay INT NOT NULL
-- );

-- CREATE TABLE Appointments (
--     appointment_id INT AUTO_INCREMENT PRIMARY KEY,
--     customer_id INT NOT NULL,
--     staff_id INT, -- Nullable since it’s only required if completed
--     service_id INT NOT NULL,
--     date DATE NOT NULL,
--     startTime TIME NOT NULL,
--     status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
--     paymentStatus ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
--     FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL,
--     FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
-- );

-- CREATE TABLE slots (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     service_id INT,
--     staff_id INT,
--     start_time DATETIME,
--     end_time DATETIME,
--     status ENUM('available', 'booked', 'completed') DEFAULT 'available',
--     FOREIGN KEY (service_id) REFERENCES services(id),
--     FOREIGN KEY (staff_id) REFERENCES users(id)
-- );

INSERT INTO Services (name, description, duration, price, commissionRate, limitPerDay)
VALUES 
('Nail Polish Removal', 'Professional nail polish removal with care and precision.', 30, 20.00, 10.00, 20),
('Haircut', 'Expert haircut tailored to your style and preference.', 45, 50.00, 15.00, 15),
('Facial Treatment', 'Relaxing facial treatment to rejuvenate your skin.', 60, 75.00, 20.00, 10),
('Massage Therapy', 'Full-body massage for relaxation and stress relief.', 90, 120.00, 25.00, 8),
('Manicure', 'Comprehensive manicure service with polish and shaping.', 60, 35.00, 12.00, 15),
('Pedicure', 'Deluxe pedicure for soft and beautiful feet.', 75, 45.00, 12.00, 12),
('Hair Coloring', 'Custom hair coloring services with premium dyes.', 120, 150.00, 18.00, 5),
('Makeup Application', 'Professional makeup application for special occasions.', 60, 85.00, 20.00, 10),
('Body Scrub', 'Exfoliating body scrub for soft and smooth skin.', 45, 40.00, 10.00, 10),
('Eyebrow Shaping', 'Perfectly shaped eyebrows to complement your look.', 20, 15.00, 5.00, 25);
