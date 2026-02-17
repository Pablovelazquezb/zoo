import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Stethoscope, Briefcase, Shield } from 'lucide-react';

export default function Staff() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    async function fetchStaff() {
        try {
            // Fetch employees with their department and join with role tables
            // Supabase basic joining is a bit different, we'll fetch base employees + depts first
            const { data: employees, error } = await supabase
                .from('employees')
                .select(`
          *,
          departments!employees_dept_id_fkey (dept_name),
          vets (license_no, specialty),
          animal_caretakers (specialization_species),
          managers (office_location)
        `);

            if (error) throw error;
            setStaff(employees || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    }

    const getRoleIcon = (deptName) => {
        switch (deptName) {
            case 'Veterinary Services': return <Stethoscope size={20} color="var(--color-primary)" />;
            case 'Administration': return <Briefcase size={20} color="var(--color-secondary)" />;
            case 'Security': return <Shield size={20} color="var(--color-accent)" />;
            default: return <User size={20} color="var(--color-text-muted)" />;
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredStaff = staff.filter(person =>
        person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.departments?.dept_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <h1 style={{ margin: 0 }}>Staff Management</h1>
                    <input
                        type="text"
                        placeholder="Search staff..."
                        className="glass-input"
                        style={{ maxWidth: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="glass-button">+ Add Staff</button>
            </div>

            {loading ? (
                <p>Loading staff...</p>
            ) : (
                <div className="grid-cards">
                    {filteredStaff.map(person => (
                        <div key={person.employee_id} className="glass-panel" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px' }}>{person.first_name} {person.last_name}</h3>
                                    <span style={{
                                        fontSize: '12px',
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: 'var(--color-text-muted)'
                                    }}>
                                        {person.departments?.dept_name || 'Unassigned'}
                                    </span>
                                </div>
                                {getRoleIcon(person.departments?.dept_name)}
                            </div>

                            <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p>Shift: {person.shift_timeframe}</p>

                                {/* Role Specific Details */}
                                {person.vets && (
                                    <div style={{ color: 'var(--color-primary)' }}>
                                        <p>Vet License: {person.vets.license_no}</p>
                                        <p>Specialty: {person.vets.specialty}</p>
                                    </div>
                                )}
                                {person.animal_caretakers && (
                                    <div style={{ color: 'var(--color-text)' }}>
                                        <p>Specialization: {person.animal_caretakers.specialization_species}</p>
                                    </div>
                                )}
                                {person.managers && (
                                    <p>Office: {person.managers.office_location}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
