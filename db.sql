-- CREATE DATABASE store_management;

USE store_management;

-- -- Step 1: Delete entries from the 'users' table that are referenced in the 'staff' table
-- -- DELETE FROM Appointments

-- -- Step 2: Drop the 'staff' table to recreate it with changes
-- DROP TABLE IF EXISTS Staff;

-- -- Step 3: Recreate the 'staff' table with the updated structure
-- CREATE TABLE Staff (
--     staff_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     hourlyWage DECIMAL(10, 2) NOT NULL,
--     service_id INT NOT NULL,
--     available BOOLEAN NOT NULL DEFAULT TRUE,
--     FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );


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
--     salon_id INT NOT NULL,
--     user_id INT NOT NULL,
--     hourlyWage DECIMAL(10, 2) NOT NULL,
--     service_id INT NOT NULL,
--     available BOOLEAN NOT NULL DEFAULT TRUE,
--     FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );



-- CREATE TABLE Services (
--     service_id INT AUTO_INCREMENT PRIMARY KEY,
--     salon_id INT NOT NULL,
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

-- INSERT INTO Services (name, description, duration, price, commissionRate, limitPerDay)
-- VALUES 
-- ('Nail Polish Removal', 'Professional nail polish removal with care and precision.', 30, 20.00, 10.00, 20),
-- ('Haircut', 'Expert haircut tailored to your style and preference.', 45, 50.00, 15.00, 15),
-- ('Facial Treatment', 'Relaxing facial treatment to rejuvenate your skin.', 60, 75.00, 20.00, 10),
-- ('Massage Therapy', 'Full-body massage for relaxation and stress relief.', 90, 120.00, 25.00, 8),
-- ('Manicure', 'Comprehensive manicure service with polish and shaping.', 60, 35.00, 12.00, 15),
-- ('Pedicure', 'Deluxe pedicure for soft and beautiful feet.', 75, 45.00, 12.00, 12),
-- ('Hair Coloring', 'Custom hair coloring services with premium dyes.', 120, 150.00, 18.00, 5),
-- ('Makeup Application', 'Professional makeup application for special occasions.', 60, 85.00, 20.00, 10),
-- ('Body Scrub', 'Exfoliating body scrub for soft and smooth skin.', 45, 40.00, 10.00, 10),
-- ('Eyebrow Shaping', 'Perfectly shaped eyebrows to complement your look.', 20, 15.00, 5.00, 25);


-- -- Insert admin user
-- INSERT INTO users (role, first_name, last_name, phone_number, email, password, dob, status, is_subscribed)
-- VALUES 
-- ('admin', 'Alice', 'Smith', '1634567890', 'alice.admin@example.com', 'hashed_password1', '1985-06-15', 'active', TRUE);

-- -- Insert staff users
-- INSERT INTO users (role, first_name, last_name, phone_number, email, password, dob, status, is_subscribed)
-- VALUES 
-- ('staff', 'Bob', 'Johnson', '1234557891', 'bob.staff@example.com', 'hashed_password2', '1990-08-20', 'active', FALSE),
-- ('staff', 'Charlie', 'Brown', '1234568892', 'charlie.staff@example.com', 'hashed_password3', '1992-12-05', 'active', FALSE);


-- -- Assuming user IDs 2 and 3 correspond to Bob and Charlie in the users table
-- INSERT INTO Staff (user_id, hourlyWage, specialisation, available)
-- VALUES 
-- (3, 25.00, 'Hair Stylist', TRUE),
-- (4, 20.00, 'Massage Therapist', TRUE);



-- SELECT staff_id, user_id, available 
-- FROM Staff 
-- WHERE service_id = ? AND available = TRUE;

INSERT INTO users (role, first_name, last_name, phone_number, email, password, dob, status, is_subscribed) VALUES
('staff', 'Alice', 'Smith', '1234566890', 'alice.smith@example.com', 'password123', '1985-06-15', 'active', FALSE),
('staff', 'Bob', 'Johnson', '1234567891', 'bob.johnson@example.com', 'password123', '1990-07-20', 'active', TRUE),
('staff', 'Charlie', 'Brown', '1234567892', 'charlie.brown@example.com', 'password123', '1988-03-25', 'active', FALSE),
('staff', 'Diana', 'Miller', '1234567893', 'diana.miller@example.com', 'password123', '1992-08-10', 'active', TRUE),
('staff', 'Eve', 'Davis', '1234567894', 'eve.davis@example.com', 'password123', '1987-09-12', 'active', TRUE),

('staff', 'Frank', 'Wilson', '1234567895', 'frank.wilson@example.com', 'password123', '1989-01-14', 'active', FALSE),
('staff', 'Grace', 'Taylor', '1234567896', 'grace.taylor@example.com', 'password123', '1993-05-18', 'active', TRUE),
('staff', 'Hank', 'Anderson', '1234567897', 'hank.anderson@example.com', 'password123', '1986-11-22', 'active', FALSE),
('staff', 'Ivy', 'Thomas', '1234567898', 'ivy.thomas@example.com', 'password123', '1991-04-30', 'active', TRUE),
('staff', 'Jack', 'White', '1234567899', 'jack.white@example.com', 'password123', '1994-02-06', 'active', TRUE),

('staff', 'Kate', 'Martin', '1234567800', 'kate.martin@example.com', 'password123', '1983-03-11', 'active', FALSE),
('staff', 'Leo', 'Garcia', '1234567801', 'leo.garcia@example.com', 'password123', '1988-06-24', 'active', TRUE),
('staff', 'Mia', 'Martinez', '1234567802', 'mia.martinez@example.com', 'password123', '1995-12-19', 'active', TRUE),
('staff', 'Nina', 'Robinson', '1234567803', 'nina.robinson@example.com', 'password123', '1990-10-05', 'active', FALSE),
('staff', 'Oscar', 'Clark', '1234567804', 'oscar.clark@example.com', 'password123', '1992-08-08', 'active', TRUE),

('staff', 'Paul', 'Rodriguez', '1234567805', 'paul.rodriguez@example.com', 'password123', '1987-09-15', 'active', TRUE),
('staff', 'Quinn', 'Lewis', '1234567806', 'quinn.lewis@example.com', 'password123', '1985-11-29', 'active', FALSE),
('staff', 'Ruby', 'Lee', '1234567807', 'ruby.lee@example.com', 'password123', '1993-07-03', 'active', TRUE),
('staff', 'Steve', 'Walker', '1234567808', 'steve.walker@example.com', 'password123', '1986-04-16', 'active', TRUE),
('staff', 'Tina', 'Hall', '1234567809', 'tina.hall@example.com', 'password123', '1991-01-09', 'active', TRUE);


INSERT INTO Staff (user_id, hourlyWage, service_id, available) VALUES
(1, 15.00, 1, TRUE),
(2, 16.50, 1, TRUE),
(3, 14.75, 1, TRUE),
(4, 17.00, 1, TRUE),
(5, 15.25, 1, FALSE),

(6, 18.00, 2, TRUE),
(7, 19.00, 2, TRUE),
(8, 17.50, 2, TRUE),
(9, 16.00, 2, TRUE),
(10, 15.75, 2, FALSE),

(11, 20.00, 3, TRUE),
(12, 21.00, 3, TRUE),
(13, 19.50, 3, TRUE),
(14, 18.75, 3, FALSE),
(15, 22.00, 3, TRUE),

(16, 23.00, 4, TRUE),
(17, 24.50, 4, FALSE),
(18, 22.75, 4, TRUE),
(19, 21.25, 4, TRUE),
(20, 20.50, 4, TRUE),

(21, 25.00, 5, TRUE),
(22, 26.00, 5, FALSE),
(23, 24.75, 5, TRUE),
(24, 23.50, 5, TRUE),
(25, 22.25, 5, TRUE);
