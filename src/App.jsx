import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import Staff from './pages/Staff';
import Tickets from './pages/Tickets';
import Events from './pages/Events';
import Inventory from './pages/Inventory';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout><PrivateRoute /></Layout>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/events" element={<Events />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
