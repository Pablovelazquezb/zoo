import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users } from 'lucide-react';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('event_date', { ascending: true });
            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Upcoming Events</h1>
            {loading ? (
                <p>Loading events...</p>
            ) : events.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                    <p>No upcoming events.</p>
                </div>
            ) : (
                <div className="grid-cards">
                    {events.map(event => (
                        <div key={event.event_id} className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '5px 10px', background: 'var(--color-primary)', borderBottomLeftRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                                Upcoming
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <Calendar color="var(--color-secondary)" />
                                <h3 style={{ margin: 0 }}>
                                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
                                <Users size={16} />
                                <span>Attendance: {event.actual_attendance} / {event.max_capacity}</span>
                            </div>

                            <div style={{ marginTop: '15px', height: '6px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${(event.actual_attendance / event.max_capacity) * 100}%`,
                                    background: 'var(--color-secondary)',
                                    borderRadius: '3px'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
