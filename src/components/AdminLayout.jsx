// src/components/AdminLayout.jsx (Corrected Final Version)

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Notification from './Notification';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard'); // Controls the content being shown
    
    // Sidebar items must match the 'case' statements in AdminDashboard's renderContent
    const navItems = [
        { name: 'Dashboard', icon: 'fas fa-chart-line' },
        { name: 'Sales Report', icon: 'fas fa-chart-area' },
        { name: 'My Stock', icon: 'fas fa-boxes' },
        { name: 'Profile', icon: 'fas fa-user-circle' },
    ];

    // --- Authorization Check and Message Display ---
    useEffect(() => {
        const token = localStorage.getItem('authToken'); 
        const isAdminFlag = localStorage.getItem('isAdmin'); 

        if (!token || isAdminFlag !== 'true') {
            navigate('/auth', { state: { message: 'Session expired or unauthorized access.', type: 'error' } });
            return;
        }
        setIsAuthenticated(true);
        
        if (location.state?.message) {
             setNotification({ message: location.state.message, type: location.state.type });
             navigate(location.pathname, { replace: true, state: {} });
        }
    }, [navigate, location.state, location.pathname]);

    // --- Logout Handler (Confirmation Dialog) ---
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('authToken'); 
            localStorage.removeItem('isAdmin');  
            navigate('/auth', { state: { message: 'You have been logged out successfully.', type: 'info' } });
        }
    };

    if (!isAuthenticated) {
        return <div className="admin-loading">Checking Authorization...</div>;
    }

    return (
        <div className="admin-full-page">
            <Notification message={notification?.message} type={notification?.type} />
            
            <aside className="admin-sidebar">
                <h2 className="admin-logo">Sahara Admin</h2>
                
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <a 
                            key={item.name}
                            // FIX: Removed the empty href attribute that was causing syntax issues
                            href="#" 
                            className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
                            // This sets the state in AdminLayout, which is passed to AdminDashboard
                            onClick={() => setActiveTab(item.name)} 
                        >
                            <i className={item.icon}></i> {item.name}
                        </a>
                    ))}
                </nav>

                <button className="admin-logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </aside>
            
            <main className="admin-main-content">
                {/* AdminDashboard receives the current tab and setter function */}
                <AdminDashboard 
                    activeTab={activeTab} 
                    setNotification={setNotification} 
                />
            </main>
        </div>
    );
};

export default AdminLayout;