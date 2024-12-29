-- CREATE DATABASE store_management;

-- USE store_management;

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


-- CREATE TABLE services (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     description TEXT,
--     price DECIMAL(10, 2),
--     duration INT NOT NULL
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

-- CREATE TABLE appointments (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     customer_id INT,
--     slot_id INT,
--     service_id INT,
--     status ENUM('pending', 'confirmed', 'canceled') DEFAULT 'pending',
--     FOREIGN KEY (customer_id) REFERENCES users(id),
--     FOREIGN KEY (slot_id) REFERENCES slots(id),
--     FOREIGN KEY (service_id) REFERENCES services(id)
-- );
