import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Animals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnimals();
    }, []);

    async function fetchAnimals() {
        try {
            const { data, error } = await supabase.from('animals').select(`
        *,
        animal_zones (zone_name)
      `);
            if (error) throw error;
            setAnimals(data || []);
        } catch (error) {
            console.error('Error fetching animals:', error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Animals</h1>
                <button className="glass-button">+ Add Animal</button>
            </div>

            {loading ? (
                <p>Loading animals...</p>
            ) : animals.length === 0 ? (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    <p>No animals found. Please execute the SQL migration script to create the tables.</p>
                </div>
            ) : (
                <div className="grid-cards">
                    {animals.map(animal => (
                        <div key={animal.animal_id} className="glass-panel" style={{ padding: '20px' }}>
                            <h3 style={{ margin: '0 0 10px' }}>{animal.name}</h3>
                            <p style={{ color: 'var(--color-primary)', fontSize: '14px', marginBottom: '15px' }}>{animal.species_common_name}</p>
                            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                                <p>Age: {animal.age} years</p>
                                <p>Zone: {animal.animal_zones?.zone_name || 'Unassigned'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
