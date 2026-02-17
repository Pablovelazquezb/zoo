import React from 'react';

export default function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="grid-cards">
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Total Animals</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>124</p>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Daily Visitors</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>1,432</p>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Active Staff</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>45</p>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <h3>Revenue (Today)</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: 'var(--color-primary)' }}>$4,250</p>
                </div>
            </div>
        </div>
    );
}
