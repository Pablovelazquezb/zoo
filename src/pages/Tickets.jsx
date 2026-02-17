import React, { useState } from 'react';

export default function Tickets() {
    const [ticketType, setTicketType] = useState('Admission');
    const [quantity, setQuantity] = useState(1);

    return (
        <div>
            <h1>Ticketing</h1>
            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 1 }}>
                    <div className="glass-panel" style={{ padding: '30px' }}>
                        <h3>New Sale</h3>
                        <div style={{ margin: '20px 0' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Ticket Type</label>
                            <select
                                className="glass-input"
                                value={ticketType}
                                onChange={(e) => setTicketType(e.target.value)}
                            >
                                <option value="Admission">General Admission ($25.00)</option>
                                <option value="Attraction">Special Attraction ($10.00)</option>
                            </select>
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <label style={{ display: 'block', marginBottom: '8px' }}>Quantity</label>
                            <input
                                type="number"
                                className="glass-input"
                                value={quantity}
                                min="1"
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            />
                        </div>

                        <div style={{ marginTop: '30px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span>Total</span>
                                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                                    ${((ticketType === 'Admission' ? 25 : 10) * quantity).toFixed(2)}
                                </span>
                            </div>
                            <button className="glass-button" style={{ width: '100%', background: 'var(--color-primary)', color: 'white' }}>
                                Complete Sale
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <h3>Recent Transactions</h3>
                    <div className="glass-panel" style={{ padding: '20px' }}>
                        <p style={{ color: 'var(--color-text-muted)' }}>No recent transactions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
