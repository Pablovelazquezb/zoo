import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Animals() {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [zones, setZones] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        species_common_name: '',
        species_binomial: '',
        age: '',
        zone_id: ''
    });

    useEffect(() => {
        fetchAnimals();
        fetchZones();
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

    async function fetchZones() {
        const { data } = await supabase.from('animal_zones').select('*');
        if (data) setZones(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            // 1. Create a Health Record first (required for animal)
            // Ideally this would be a transaction, but we'll do sequential for now
            const { data: healthRecord, error: healthError } = await supabase
                .from('health_records')
                .insert([{ vet_id: null }]) // No vet assigned initially
                .select()
                .single();

            if (healthError) throw healthError;

            // 2. Create Animal
            const { error: animalError } = await supabase
                .from('animals')
                .insert([{
                    ...formData,
                    age: parseInt(formData.age),
                    zone_id: parseInt(formData.zone_id),
                    health_record_id: healthRecord.record_id
                }]);

            if (animalError) throw animalError;

            setShowForm(false);
            setFormData({ name: '', species_common_name: '', species_binomial: '', age: '', zone_id: '' });
            fetchAnimals(); // Refresh list
        } catch (error) {
            console.error('Error adding animal:', error);
            alert('Failed to add animal. See console.');
        }
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>Animals</h1>
                <button
                    className="glass-button"
                    onClick={() => setShowForm(!showForm)}
                    style={{ background: showForm ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)' }}
                >
                    {showForm ? 'Cancel' : '+ Add Animal'}
                </button>
            </div>

            {showForm && (
                <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px', border: '1px solid var(--color-primary)' }}>
                    <h3>New Animal Profile</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                            <input required className="glass-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Common Species Name</label>
                            <input required className="glass-input" value={formData.species_common_name} onChange={e => setFormData({ ...formData, species_common_name: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Scientific Name</label>
                            <input className="glass-input" value={formData.species_binomial} onChange={e => setFormData({ ...formData, species_binomial: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Age (Years)</label>
                            <input required type="number" className="glass-input" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Zone</label>
                            <select required className="glass-input" value={formData.zone_id} onChange={e => setFormData({ ...formData, zone_id: e.target.value })}>
                                <option value="">Select Zone...</option>
                                {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                            <button type="submit" className="glass-button" style={{ background: 'var(--color-primary)', width: '100%' }}>Save Animal</button>
                        </div>
                    </form>
                </div>
            )}

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
