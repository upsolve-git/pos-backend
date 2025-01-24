-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS store_management;
USE store_management;

-- Step 1: Create the `Salons` table
CREATE TABLE Salons (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Auto-incrementing ID
    salon_name VARCHAR(255) NOT NULL, -- Salon Name
    owner_name VARCHAR(255) NOT NULL, -- Owner Name
    contact_email VARCHAR(255) NOT NULL, -- Contact Email
    contact_mobile VARCHAR(15) NOT NULL, -- Contact Mobile
    bank_account VARCHAR(255) NOT NULL, -- Bank Account
    number_of_systems INT NOT NULL DEFAULT 0, -- Number of Systems
    price_per_system DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- Price per System
    password VARCHAR(255) NOT NULL, -- Password (hashed)
    confirm_password VARCHAR(255) NOT NULL, -- Confirm Password (for form validation; typically not stored)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record Creation Timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last Update Timestamp
);


-- Step 2: Create the `Users` table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('admin', 'staff', 'customer') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    is_subscribed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 3: Create the `Services` table with salon reference
CREATE TABLE Services (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    salon_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT NOT NULL, -- Duration in minutes
    price DECIMAL(10, 2) NOT NULL,
    commissionRate DECIMAL(5, 2) NOT NULL, -- Commission rate as a percentage
    limitPerDay INT NOT NULL,
    FOREIGN KEY (salon_id) REFERENCES Salons(id) ON DELETE CASCADE
);

-- Step 4: Create the `Staff` table with user and salon reference
CREATE TABLE Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    salon_id INT NOT NULL,
    hourlyWage DECIMAL(10, 2) NOT NULL,
    service_id INT NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (salon_id) REFERENCES Salons(salon_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
);

-- Step 5: Create the `Appointments` table
CREATE TABLE Appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    staff_id INT, -- Nullable since it’s only required if completed
    service_id INT NOT NULL,
    date DATE NOT NULL,
    startTime TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    paymentStatus ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
);

-- Step 6: Create the `Slots` table
CREATE TABLE Slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id INT,
    staff_id INT,
    start_time DATETIME,
    end_time DATETIME,
    status ENUM('available', 'booked', 'completed') DEFAULT 'available',
    FOREIGN KEY (service_id) REFERENCES Services(service_id),
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
);

-- Step 7: Insert sample data into the `Salons` table
INSERT INTO Salons (name, location, contact_email, contact_phone)
VALUES
('Elegant Salon', '123 Main St', 'contact@elegantsalon.com', '1234567890'),
('Luxury Spa', '456 Elm St', 'contact@luxuryspa.com', '0987654321');

-- Step 8: Insert sample data into the `Services` table
INSERT INTO Services (salon_id, name, description, duration, price, commissionRate, limitPerDay)
VALUES
(1, 'Nail Polish Removal', 'Professional nail polish removal with care and precision.', 30, 20.00, 10.00, 20),
(1, 'Haircut', 'Expert haircut tailored to your style and preference.', 45, 50.00, 15.00, 15),
(2, 'Facial Treatment', 'Relaxing facial treatment to rejuvenate your skin.', 60, 75.00, 20.00, 10),
(2, 'Massage Therapy', 'Full-body massage for relaxation and stress relief.', 90, 120.00, 25.00, 8);

-- Step 9: Insert sample data into the `Users` table
INSERT INTO Users (role, first_name, last_name, phone_number, email, password, dob, status, is_subscribed)
VALUES
('admin', 'Alice', 'Admin', '1122334455', 'alice.admin@example.com', 'hashed_password1', '1985-06-15', TRUE),
('staff', 'Bob', 'Johnson', '1234567891', 'bob.johnson@example.com', 'hashed_password2', '1990-07-20', TRUE),
('staff', 'Charlie', 'Brown', '1234567892', 'charlie.brown@example.com', 'hashed_password3', '1988-03-25', FALSE);

-- Step 10: Insert sample data into the `Staff` table
INSERT INTO Staff (user_id, salon_id, hourlyWage, service_id, available)
VALUES
(2, 1, 15.00, 1, TRUE),
(3, 2, 18.00, 3, TRUE);
