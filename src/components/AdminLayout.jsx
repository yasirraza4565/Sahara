// src/components/AdminLayout.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminDashboard from '../pages/AdminDashboard';
import Notification from './Notification';
import ConfirmModal from './ConfirmModal';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [notification, setNotification] = useState(null);
    const [activeTab, setActiveTab] = useState('Dashboard'); 
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: 'fas fa-chart-line' },
        { name: 'Sales Report', icon: 'fas fa-chart-area' },
        { name: 'My Stock', icon: 'fas fa-boxes' },
        { name: 'Profile', icon: 'fas fa-user-circle' },
    ];

    // --- Logout Handler Execution ---
    const handleConfirmLogout = () => {
        setIsModalVisible(false);
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('isAdmin'); 
        navigate('/auth', { state: { message: 'You have been logged out successfully.', type: 'info' } });
    };

    // --- Opens Modal ---
    const handleOpenLogoutModal = () => {
        setIsModalVisible(true);
    };

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

    if (!isAuthenticated) {
        return <div className="admin-loading">Checking Authorization...</div>;
    }

    return (
        <div className="admin-full-page">
            <Notification message={notification?.message} type={notification?.type} />
            
            <ConfirmModal
                visible={isModalVisible}
                message="Your current admin session will be terminated. Do you want to proceed with logging out?"
                onConfirm={handleConfirmLogout}
                onCancel={() => setIsModalVisible(false)}
            />
            
            <aside className="admin-sidebar">
                <h2 className="admin-logo">Sahara Admin</h2>
                
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

                <button className="admin-logout-btn" onClick={handleOpenLogoutModal}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                </button>
            </aside>
            
            <main className="admin-main-content">
                <AdminDashboard 
                    activeTab={activeTab} 
                    setNotification={setNotification} 
                />
            </main>
        </div>
    );
};

export default AdminLayout;