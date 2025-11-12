// src/components/LoginPopup.jsx
import React, { useState, useEffect } from 'react';

const LoginPopup = ({ onLoginSuccess, onClose }) => {
  // --- Check if user is already authenticated ---
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    // If already logged in, do not render the popup
    return null;
  }

  // --- Local State ---
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // --- Handle Input Change ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Show Popup After Small Delay ---
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasLoggedIn');
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500); // 0.5s delay before showing
      return () => clearTimeout(timer);
    }
  }, []);

  // --- Handle Login Submission ---
  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Attempting login with:', formData);

    // Simulate login success — you can replace this with a real backend call
    localStorage.setItem('hasLoggedIn', 'true');

    // Optional callback to parent component
    if (onLoginSuccess) onLoginSuccess();

    setIsVisible(false);
  };

  // --- Handle Close (Skip Popup) ---
  const handleClose = () => {
    localStorage.setItem('hasLoggedIn', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  // --- Hide Popup if not visible ---
  if (!isVisible) return null;

  // --- Popup JSX ---
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
          <button type="submit" className="btn popup-login-btn">
            Login
          </button>
        </form>

        <button onClick={handleClose} className="popup-close-btn">
          No thanks, continue shopping &times;
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
