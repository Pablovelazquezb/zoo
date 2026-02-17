import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Coffee, AlertTriangle, Package } from 'lucide-react';

export default function Inventory() {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    async function fetchInventory() {
        try {
            const { data, error } = await supabase
                .from('retail_outlets')
                .select(`
          *,
          inventory_items (*)
        `);

            if (error) throw error;
            setOutlets(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Inventory Management</h1>

            {loading ? (
                <p>Loading inventory...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                    {outlets.map(outlet => (
                        <div key={outlet.outlet_id} className="glass-panel" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                                {outlet.type === 'Food' ? <Coffee color="var(--color-primary)" /> : <ShoppingBag color="var(--color-secondary)" />}
                                <h2 style={{ margin: 0, fontSize: '20px' }}>{outlet.name}</h2>
                                <span style={{
                                    marginLeft: 'auto',
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.1)'
                                }}>
                                    {outlet.type}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {outlet.inventory_items?.map(item => (
                                    <div key={item.item_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Package size={16} color="var(--color-text-muted)" />
                                            <span>{item.item_name}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontWeight: 'bold', fontSize: '18px', display: 'block' }}>{item.stock_count}</span>
                                                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Stock</span>
                                            </div>

                                            {item.stock_count <= item.restock_threshold && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-accent)', background: 'rgba(244, 63, 94, 0.1)', padding: '5px 8px', borderRadius: '6px' }}>
                                                    <AlertTriangle size={14} />
                                                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Low</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {outlet.inventory_items?.length === 0 && <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>No items in stock.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
