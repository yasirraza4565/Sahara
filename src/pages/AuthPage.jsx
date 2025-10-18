import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  const BACKEND_URL = 'http://localhost:5000/api';

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

    console.log("Sending Login Payload:", payload);

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (isLogin) {
        const token = response.data.token;
        if (!token) throw new Error("No token received from server");

        localStorage.setItem('authToken', token);
        localStorage.setItem('hasLoggedIn', 'true');

        alert('🎉 Login successful!');
        navigate('/');
      } else {
        alert('✅ Sign Up successful! Please log in now.');
        setIsLogin(true);
      }

    } catch (error) {
      const message = error.response?.data?.message || 'An unknown error occurred.';
      alert(`❌ Authentication failed: ${message}`);
      console.error("Auth Error:", error);
    }
  };

  return (
    <div className='auth-page'>
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
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} className='toggle-link'>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;