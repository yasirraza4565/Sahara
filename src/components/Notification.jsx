// src/components/Notification.jsx
import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, duration = 3000 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    if (!visible) return null;

    const style = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor: type === 'success' ? '#2ecc71' : '#e74c3c',
        color: 'white',
        zIndex: 10000,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 0.5s ease-out, fadeOut 0.5s ease-in 2.5s forwards', // CSS animation names
    };

    return <div style={style}>{message}</div>;
};

export default Notification;