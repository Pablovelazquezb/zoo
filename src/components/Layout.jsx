import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Cat, Users, Ticket, Calendar, Settings } from 'lucide-react';

export default function Layout({ children }) {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Animals', path: '/animals', icon: <Cat size={20} /> },
        { name: 'Staff', path: '/staff', icon: <Users size={20} /> },
        { name: 'Tickets', path: '/tickets', icon: <Ticket size={20} /> },
        { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside className="glass-panel" style={{
                width: '250px',
                padding: '20px',
                margin: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <div>
                    <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--color-primary)', borderRadius: '10px' }}></div>
                        <h2 style={{ fontSize: '24px', margin: 0 }}>Zoo<span style={{ color: 'var(--color-primary)' }}>Manager</span></h2>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        background: isActive ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        transition: 'all 0.3s ease',
                                        border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                                    }}
                                >
                                    {item.icon}
                                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>Logged in as</p>
                    <p style={{ margin: '5px 0 0', fontWeight: 600 }}>Admin User</p>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '20px 20px 20px 0', overflowY: 'auto' }}>
                <div className="glass-panel" style={{ minHeight: 'calc(100vh - 40px)', padding: '40px' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
