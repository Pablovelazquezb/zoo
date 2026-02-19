-- Create a function to decrement stock safely
CREATE OR REPLACE FUNCTION decrement_stock(item_id_param INT, quantity_param INT)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory_items
  SET stock_count = stock_count - quantity_param
  WHERE item_id = item_id_param;
END;
$$ LANGUAGE plpgsql;
