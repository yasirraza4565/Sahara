// src/components/LoginPopup.jsx

import React, { useState, useEffect } from 'react';

 
const LoginPopup = ({ onLoginSuccess, onClose }) => {
     const [isVisible, setIsVisible] = useState(false);
    
     const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

     const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

     useEffect(() => {
         const hasVisited = localStorage.getItem('hasLoggedIn');
        
        if (!hasVisited) {
             const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500); 

             return () => clearTimeout(timer);
        }
    }, []);  


    const handleLogin = (e) => {
        e.preventDefault(); 
        
   
        console.log("Attempting login with:", formData);

       
        localStorage.setItem('hasLoggedIn', 'true');
        onLoginSuccess();  
        setIsVisible(false);
    };

    const handleClose = () => {
         
        localStorage.setItem('hasLoggedIn', 'true');
        setIsVisible(false);
        onClose(); 
    };

    
    if (!isVisible) return null;

     
    return (
        <div className="login-popup-overlay">
            <div className="login-popup-content">
                <h3>Welcome to Sahara</h3>
                <p>Please log in or sign up to get exclusive offers.</p>
                
                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        name="email"  
                        placeholder="Email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        name="password"  
                        placeholder="Password" 
                        required 
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn popup-login-btn">Login</button>
                </form>

                <button onClick={handleClose} className="popup-close-btn">
                    No thanks, continue shopping &times;
                </button>
            </div>
        </div>
    );
};

export default LoginPopup;