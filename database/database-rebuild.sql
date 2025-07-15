-- Drop existing objects to start fresh--
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS classification;
DROP TYPE IF EXISTS account_type_enum;

--Create ENUM type for account_type--
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin');

--Create classification table--
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name TEXT NOT NULL
);

--Create account table--
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname TEXT NOT NULL,
  account_lastname TEXT NOT NULL,
  account_email TEXT NOT NULL UNIQUE,
  account_password TEXT NOT NULL,
  account_type account_type_enum DEFAULT 'Client'
);

-- Create inventory table--
CREATE TABLE inventory (
  inventory_id SERIAL PRIMARY KEY,
  inv_make TEXT NOT NULL,
  inv_model TEXT NOT NULL,
  inv_description TEXT,
  inv_image TEXT,
  inv_thumbnail TEXT,
  classification_id INT REFERENCES classification(classification_id)
);

--Insert classification categories--
INSERT INTO classification (classification_name)
VALUES ('Sport'), ('SUV'), ('Sedan');

--Insert sample inventory items--
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id)
VALUES 
  ('GM', 'Hummer', 'small interiors with aggressive design', '/images/hummer.jpg', '/images/hummer-thumb.jpg', 2),
  ('Ford', 'Mustang', 'a fast sporty ride', '/images/mustang.jpg', '/images/mustang-thumb.jpg', 1);

--Task 1 #4: Update Hummer description--
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--Task 1 #6: Update image paths--
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

--just to make sure the code is working--
--SELECT inv_make, inv_model, inv_image, inv_thumbnail FROM inventory;--