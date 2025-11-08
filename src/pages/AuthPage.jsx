// src/pages/AuthPage.jsx
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import Notification from '../components/Notification'; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useContext(CartContext);

  const BACKEND_URL = 'http://localhost:5000/api';

  // Show any messages passed via location.state (e.g. logout or login-success)
  useEffect(() => {
    if (location.state?.message) {
      setNotification({ message: location.state.message, type: location.state.type || 'info' });
      // Clear the location state so the message doesn't reappear on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, location.pathname, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? `${BACKEND_URL}/login` : `${BACKEND_URL}/register`;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };

    console.log(`Sending ${isLogin ? 'Login' : 'Registration'} Payload:`, payload);

    try {
      const response = await axios.post(endpoint, payload);

      if (isLogin) {
        const { token, isAdmin } = response.data;
        if (!token) throw new Error('No token received from server');

        // Store auth details
        localStorage.setItem('authToken', token);
        localStorage.setItem('isAdmin', isAdmin);
        clearCart();

        // Navigate to home and show success message via location.state
        navigate('/', { state: { message: 'Login successful!', type: 'success' } });
      } else {
        // On successful registration, show inline notification and switch to login
        setNotification({ message: 'Sign Up successful! Please log in.', type: 'success' });
        setIsLogin(true);
        // keep the email to help user log in, clear name & password
        setFormData({ name: '', email: formData.email, password: '' });
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An unknown error occurred.';
      setNotification({ message: `Authentication failed: ${message}`, type: 'error' });
      console.error('Auth Error:', error);
    }
  };

  return (
    <div className='auth-page'>
      <Notification message={notification?.message} type={notification?.type} />

      <div className='auth-form-container'>
        <h2>{isLogin ? 'Customer Login' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type='text'
              name='name'
              placeholder='Full Name'
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type='email'
            name='email'
            placeholder='Email Address'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type='submit' className='btn auth-submit-btn'>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className='auth-toggle'>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setNotification(null); // clear existing notifications when toggling
            }}
            className='toggle-link'
            role='button'
            tabIndex={0}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;