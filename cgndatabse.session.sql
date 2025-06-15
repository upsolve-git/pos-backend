USE store_management;

-- CREATE TABLE Cart (
--     cart_id INT AUTO_INCREMENT PRIMARY KEY,
--     customer_id INT NOT NULL,
--     staff_id INT, -- Nullable since it’s only required if completed
--     service_id INT NOT NULL,
--     date DATE NOT NULL,
--     startTime TIME NOT NULL,
--     FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE SET NULL,
--     FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE
-- );


DELETE from Salons where salon_id = 1;