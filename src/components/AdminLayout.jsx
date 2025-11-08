// src/components/AdminLayout.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Notification from './Notification';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard'); 

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

        // If not authenticated, redirect instantly
        if (!token || isAdminFlag !== 'true') {
            navigate('/auth', { state: { message: 'Session expired or unauthorized access.', type: 'error' } });
            return;
        }
        setIsAuthenticated(true);
        
        // Display notification passed from login/redirect
        if (location.state?.message) {
             setNotification({ message: location.state.message, type: location.state.type });
             // Clear state so message doesn't reappear on refresh
             navigate(location.pathname, { replace: true, state: {} }); 
        }
    }, [navigate, location.state, location.pathname]);

    // --- Step 1 & 9: Logout Handler (Confirmation Dialog) ---
    const handleLogout = () => {
        // Step 9: Uses the browser's native confirmation dialog
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('authToken'); 
            localStorage.removeItem('isAdmin');  
            
            // Redirect to Auth page and pass the logout message via state
            navigate('/auth', { state: { message: 'You have been logged out successfully.', type: 'info' } });
        }
        // If user clicks 'No', the panel remains open.
    };

    if (!isAuthenticated) {
        return <div className="admin-loading">Checking Authorization...</div>;
    }

    return (
        // Step 1: Admin Full Page Layout (Hides global navbar/footer)
        <div className="admin-full-page">
            <Notification message={notification?.message} type={notification?.type} />
            
            <aside className="admin-sidebar">
                <h2 className="admin-logo">Sahara Admin</h2>
                
                {/* Step 3: Stylized Sidebar Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <a 
                            key={item.name}
                            href="#"
                            className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
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