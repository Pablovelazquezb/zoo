-- Seed Data for Zoo App

-- 1. Geography (Zones)
INSERT INTO animal_zones (zone_name, location_description) VALUES
('Savanna', 'Open plains for African wildlife'),
('Rainforest', 'Dense vegetation and high humidity'),
('Arctic', 'Cold enclosure with ice and water features'),
('Reptile House', 'Temperature controlled indoor facility');

-- 2. Human Resources (Employees & Departments)
-- Departments
INSERT INTO departments (dept_name) VALUES
('Veterinary Services'),
('Animal Care'),
('Administration'),
('Security');

-- Employees (Base)
-- Note: inserting pay_rate_cents (e.g., 250000 = $2500.00)
INSERT INTO employees (first_name, last_name, contact_info, pay_rate_cents, shift_timeframe, dept_id) VALUES
('Sarah', 'Connor', 'sarah@zoo.com', 450000, '08:00-16:00', 1), -- Vet
('Alan', 'Grant', 'alan@zoo.com', 380000, '07:00-15:00', 2), -- Caretaker
('Ellie', 'Sattler', 'ellie@zoo.com', 390000, '07:00-15:00', 2), -- Caretaker
('John', 'Hammond', 'john@zoo.com', 800000, '09:00-17:00', 3), -- Manager
('Robert', 'Muldoon', 'robert@zoo.com', 350000, '18:00-06:00', 4); -- Security (Generic)

-- Update Departments with Managers
UPDATE departments SET manager_id = 4 WHERE dept_name = 'Administration';
UPDATE departments SET manager_id = 1 WHERE dept_name = 'Veterinary Services';

-- Role Specifics
-- Vets
INSERT INTO vets (employee_id, license_no, specialty) VALUES
(1, 'VET-998877', 'Large Mammals');

-- Managers
INSERT INTO managers (employee_id, office_location) VALUES
(4, 'Admin Building, Create Suite');

-- 3. Animals & Health
-- Health Records (for animals to be inserted)
INSERT INTO health_records (vet_id) VALUES
(1), (1), (1); 

-- Animals
INSERT INTO animals (name, species_common_name, species_binomial, age, zone_id, health_record_id) VALUES
('Leo', 'African Lion', 'Panthera leo', 5, 1, 1),
('Burt', 'Polar Bear', 'Ursus maritimus', 8, 3, 2),
('Sly', 'Green Anaconda', 'Eunectes murinus', 4, 4, 3);

-- Animal Caretakers (Assigning animals now that they exist)
INSERT INTO animal_caretakers (employee_id, specialization_species, assigned_animal_id) VALUES
(2, 'Large Carnivores', 1), -- Alan cares for Leo
(3, 'Reptiles', 3);        -- Ellie cares for Sly

-- Medical History
INSERT INTO medical_history (record_id, injury, disease, date_treated, animal_age_at_treatment) VALUES
(1, 'Minor scratch on paw', NULL, '2025-11-15', 5),
(2, NULL, 'Seasonal Allergies', '2025-06-10', 7);

-- 4. Operations & Revenue
-- Customers
INSERT INTO customers (age, gender, is_member) VALUES
(34, 'Male', TRUE),
(28, 'Female', FALSE),
(8, 'Male', FALSE),
(65, 'Female', TRUE);

-- Events
INSERT INTO events (event_date, max_capacity, actual_attendance) VALUES
('2026-03-15', 50, 0),
('2026-03-20', 100, 0);

-- Retail Outlets
INSERT INTO retail_outlets (name, type) VALUES
('Safari Gift Shop', 'Gift'),
('Jungle Cafe', 'Food');

-- Inventory
INSERT INTO inventory_items (outlet_id, item_name, stock_count, restock_threshold) VALUES
(1, 'Plush Lion', 150, 20),
(1, 'Zoo T-Shirt', 8, 15), -- Low stock!
(2, 'Cheeseburger', 50, 10),
(2, 'Soda', 200, 30);
