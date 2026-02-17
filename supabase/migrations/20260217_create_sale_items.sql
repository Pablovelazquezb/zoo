-- Migration: Create sale_items table
CREATE TABLE sale_items (
  sale_item_id SERIAL PRIMARY KEY,
  transaction_id INT REFERENCES transactions(transaction_id),
  item_id INT REFERENCES inventory_items(item_id),
  quantity INT NOT NULL,
  price_at_sale_cents INT NOT NULL
);
