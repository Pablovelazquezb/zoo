import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LayoutDashboard, Cat, Users, Ticket, Calendar } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        animals: 0,
        visitors: 0,
        staff: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        try {
            // 1. Count Animals
            const { count: animalCount, error: animalError } = await supabase
                .from('animals')
                .select('*', { count: 'exact', head: true });
            if (animalError) throw animalError;

            // 2. Count Staff
            const { count: staffCount, error: staffError } = await supabase
                .from('employees')
                .select('*', { count: 'exact', head: true });
            if (staffError) throw staffError;

            // 3. Calculate Revenue (Sum of Transactions)
            const { data: transactions, error: revenueError } = await supabase
                .from('transactions')
                .select('total_amount_cents');

            if (revenueError) throw revenueError;

            const totalRevenueCents = transactions.reduce((sum, t) => sum + (t.total_amount_cents || 0), 0);

            // 4. Visitors (Estimate based on ticket sales for today - defaulting to dummy data for now as we don't have gate tracking)
            // For now, let's just count total customers
            const { count: customerCount, error: customerError } = await supabase
                .from('customers')
                .select('*', { count: 'exact', head: true });

            setStats({
                animals: animalCount || 0,
                visitors: customerCount || 0, // Using total customers as proxy for visitors
                staff: staffCount || 0,
                revenue: totalRevenueCents / 100
            });

        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="grid-cards">
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Cat size={24} color="var(--color-primary)" />
                        <h3>Total Animals</h3>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
                        {loading ? '...' : stats.animals}
                    </p>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Users size={24} color="var(--color-secondary)" />
                        <h3>Total Staff</h3>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
                        {loading ? '...' : stats.staff}
                    </p>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <LayoutDashboard size={24} color="var(--color-accent)" />
                        <h3>Total Customers</h3>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
                        {loading ? '...' : stats.visitors}
                    </p>
                </div>
                <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <Ticket size={24} color="#f59e0b" />
                        <h3>Total Revenue</h3>
                    </div>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0', color: 'var(--color-primary)' }}>
                        {loading ? '...' : `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </p>
                </div>
            </div>
        </div>
    );
}
