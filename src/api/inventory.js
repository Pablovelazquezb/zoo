import { supabase } from '../lib/supabase';
import { handleSupabaseResult } from '../utils/apiHandler';

export async function getInventoryItems() {
  const result = await supabase
    .from('inventory')
    .select('*')
    .order('item_id', { ascending: true });

  return handleSupabaseResult(result);
}

export async function getShopItems(outletId) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .gt('stock_count', 0)
    .eq('outlet_id', outletId)
    .order('item_id', { ascending: true });

  if (error) throw error;
  return data || [];
}