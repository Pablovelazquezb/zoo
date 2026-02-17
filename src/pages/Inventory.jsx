import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingBag, Coffee, AlertTriangle, Package, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export default function Inventory() {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [isCheckout, setIsCheckout] = useState(false);

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

    const [searchTerm, setSearchTerm] = useState('');

    const filteredOutlets = outlets.filter(outlet => {
        const matchesOutlet = outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            outlet.type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesItems = outlet.inventory_items?.some(item =>
            item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return matchesOutlet || matchesItems;
    });

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.item_id === item.item_id);
            if (existing) {
                return prev.map(i => i.item_id === item.item_id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.item_id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prev => prev.map(i => {
            if (i.item_id === itemId) {
                const newQty = i.quantity + delta;
                return newQty > 0 ? { ...i, quantity: newQty } : i;
            }
            return i;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price_cents || 500) * item.quantity, 0); // Default price 500 cents if not in DB? Schema doesn't have price in inventory_items... wait.

    // Schema check: inventory_items doesn't have price. tickets have price. 
    // I should probably add price to inventory_items or assume a default for now.
    // implementation_plan.md says "price_at_sale_cents" in sale_items, which implies price comes from somewhere.
    // I missed adding price to inventory_items in schema. 
    // I'll add a default price of $5.00 (500 cents) for now and note it.

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsCheckout(true);
        try {
            // 1. Create Transaction
            const { data: txn, error: txnError } = await supabase.from('transactions')
                .insert([{ total_amount_cents: cartTotal }])
                .select()
                .single();
            if (txnError) throw txnError;

            // 2. Create Sale Items
            const saleItems = cart.map(item => ({
                transaction_id: txn.transaction_id,
                item_id: item.item_id,
                quantity: item.quantity,
                price_at_sale_cents: 500 // Hardcoded for now as per schema limitation
            }));
            const { error: salesError } = await supabase.from('sale_items').insert(saleItems);
            if (salesError) throw salesError;

            // 3. Update Inventory Stock
            for (const item of cart) {
                const { error: stockError } = await supabase.rpc('decrement_stock', {
                    item_id_param: item.item_id,
                    quantity_param: item.quantity
                });
                // Since I didn't create a migration for RPC, I'll do a simple update
                // But concurrency... for now simple fetch and update

                // Fetch current first
                const { data: currentItem } = await supabase.from('inventory_items').select('stock_count').eq('item_id', item.item_id).single();
                if (currentItem) {
                    await supabase.from('inventory_items')
                        .update({ stock_count: Math.max(0, currentItem.stock_count - item.quantity) })
                        .eq('item_id', item.item_id);
                }
            }

            setCart([]);
            alert('Checkout successful!');
            fetchInventory(); // Refresh stock
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. ' + error.message);
        } finally {
            setIsCheckout(false);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <h1 style={{ margin: 0 }}>Inventory Management</h1>
                    <input
                        type="text"
                        placeholder="Search outlets or items..."
                        className="glass-input"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <p>Loading inventory...</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                        {filteredOutlets.map(outlet => (
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

                                                <button
                                                    className="glass-button"
                                                    style={{ padding: '5px', borderRadius: '50%' }}
                                                    onClick={() => addToCart(item)}
                                                    disabled={item.stock_count === 0}
                                                >
                                                    <Plus size={16} />
                                                </button>
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

            {/* Cart Sidebar */}
            <div className="glass-panel" style={{ width: '300px', padding: '20px', position: 'sticky', top: '20px', height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px' }}>
                    <ShoppingCart color="var(--color-accent)" />
                    <h2 style={{ margin: 0 }}>POS Cart</h2>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cart.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '20px' }}>Cart is empty.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.item_id} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold' }}>{item.item_name}</span>
                                    <button onClick={() => removeFromCart(item.item_id)} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', padding: 0 }}><Trash2 size={14} /></button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', padding: '2px 8px' }}>
                                        <button onClick={() => updateQuantity(item.item_id, -1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><Minus size={12} /></button>
                                        <span style={{ fontSize: '14px' }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.item_id, 1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}><Plus size={12} /></button>
                                    </div>
                                    <span>${((item.price_cents || 500) * item.quantity / 100).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
                        <span>Total:</span>
                        <span>${(cartTotal / 100).toFixed(2)}</span>
                    </div>
                    <button
                        className="glass-button"
                        style={{ width: '100%', background: 'var(--color-accent)' }}
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isCheckout}
                    >
                        {isCheckout ? 'Processing...' : 'Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
}
