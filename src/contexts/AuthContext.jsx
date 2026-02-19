import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user);
                checkUserRole(session.user);
            } else {
                setUser(null);
                setRole(null);
                setLoading(false);
            }
        }).catch(err => {
            console.error("Session init error:", err);
            setLoading(false);
        });

        // Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                setUser(session.user);
                await checkUserRole(session.user);
            } else {
                setUser(null);
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function checkUserRole(currentUser) {
        // SUPER ADMIN FALLBACK
        if (currentUser.email === 'admin@zoo.com') {
            setRole('admin');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('employees')
                .select('dept_id, departments(dept_name)')
                .eq('user_id', currentUser.id)
                .single();

            if (data) {
                if (data.departments?.dept_name === 'Administration') setRole('admin');
                else if (data.departments?.dept_name.includes('Manager')) setRole('manager');
                else setRole('employee');
            } else {
                setRole('employee');
            }
        } catch (e) {
            console.error("Error fetching role", e);
            setRole('employee');
        } finally {
            setLoading(false);
        }
    }

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        role,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
