-- Core Zoo Entities

-- Geography
CREATE TABLE animal_zones (
  zone_id SERIAL PRIMARY KEY,
  zone_name TEXT NOT NULL,
  location_description TEXT
);

-- Departments (Circular dependency with Employees, creating first without FK)
CREATE TABLE departments (
  dept_id SERIAL PRIMARY KEY,
  dept_name TEXT NOT NULL,
  manager_id INT
);

-- Human Resources (Base Table)
CREATE TABLE employees (
  employee_id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  contact_info TEXT,
  pay_rate_cents INT NOT NULL, -- Stored in cents
  shift_timeframe TEXT,
  dept_id INT REFERENCES departments(dept_id)
);

-- Add foreign key for manager_id in departments
ALTER TABLE departments
ADD CONSTRAINT fk_manager
FOREIGN KEY (manager_id) REFERENCES employees(employee_id);

-- Role Specifics: Vets
CREATE TABLE vets (
  employee_id INT PRIMARY KEY REFERENCES employees(employee_id),
  license_no TEXT NOT NULL,
  specialty TEXT
);

-- Role Specifics: Animal Caretakers
-- referencing animal_id which doesn't exist yet. Creating table first.
CREATE TABLE animal_caretakers (
  employee_id INT PRIMARY KEY REFERENCES employees(employee_id),
  specialization_species TEXT,
  assigned_animal_id INT -- FK added later
);

-- Role Specifics: Managers
CREATE TABLE managers (
  employee_id INT PRIMARY KEY REFERENCES employees(employee_id),
  office_location TEXT
);

-- Health Records
CREATE TABLE health_records (
  record_id SERIAL PRIMARY KEY,
  vet_id INT REFERENCES vets(employee_id)
);

-- Animals
CREATE TABLE animals (
  animal_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  species_common_name TEXT NOT NULL,
  species_binomial TEXT,
  age INT,
  zone_id INT REFERENCES animal_zones(zone_id),
  health_record_id INT UNIQUE REFERENCES health_records(record_id)
);

-- Add missing FK for Animal Caretakers
ALTER TABLE animal_caretakers
ADD CONSTRAINT fk_assigned_animal
FOREIGN KEY (assigned_animal_id) REFERENCES animals(animal_id);

-- Medical History
CREATE TABLE medical_history (
  history_id SERIAL PRIMARY KEY,
  record_id INT REFERENCES health_records(record_id),
  injury TEXT,
  disease TEXT,
  date_treated DATE,
  animal_age_at_treatment INT
);

-- Operations & Revenue

-- Customers
CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  age INT,
  gender TEXT,
  is_member BOOLEAN DEFAULT FALSE
);

-- Events
CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  event_date DATE,
  max_capacity INT CHECK (max_capacity <= 150),
  actual_attendance INT
);

-- Transactions (Not explicitly defined in prompt but referenced by Tickets)
-- Creating a simple transactions table
CREATE TABLE transactions (
  transaction_id SERIAL PRIMARY KEY,
  transaction_date TIMESTAMP DEFAULT NOW(),
  total_amount_cents INT
);

-- Tickets
CREATE TABLE tickets (
  ticket_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(customer_id),
  type TEXT CHECK (type IN ('Admission', 'Attraction')),
  event_id INT REFERENCES events(event_id),
  price_cents INT NOT NULL,
  transaction_id INT REFERENCES transactions(transaction_id)
);

-- Retail & Inventory

-- Retail Outlets
CREATE TABLE retail_outlets (
  outlet_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('Gift', 'Food'))
);

-- Inventory Items
CREATE TABLE inventory_items (
  item_id SERIAL PRIMARY KEY,
  outlet_id INT REFERENCES retail_outlets(outlet_id),
  item_name TEXT NOT NULL,
  stock_count INT NOT NULL DEFAULT 0,
  restock_threshold INT NOT NULL DEFAULT 10,
  is_low_stock BOOLEAN GENERATED ALWAYS AS (stock_count <= restock_threshold) STORED
);

-- Event Assignments
CREATE TABLE event_assignments (
  assignment_id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(event_id),
  employee_id INT REFERENCES employees(employee_id),
  animal_id INT REFERENCES animals(animal_id)
);

-- Retail Sales
CREATE TABLE sale_items (
  sale_item_id SERIAL PRIMARY KEY,
  transaction_id INT REFERENCES transactions(transaction_id),
  item_id INT REFERENCES inventory_items(item_id),
  quantity INT NOT NULL,
  price_at_sale_cents INT NOT NULL
);
