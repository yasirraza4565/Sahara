import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-section about">
          <h4>MyShop</h4>
          <p>
            The best luxury for quality products at sahara prices.
            Shop with Sahara!
          </p>
        </div>
        
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Shop All</Link></li>
            <li><Link to="/cart">View Cart</Link></li>
            <li><Link to="https://sadaf-elegance-raza.lovable.app/" target="_blank" rel="noopener noreferrer">Sadaf Elegance</Link></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: Sahara2025@gmail.com</p>
          <p>Phone: 962 944 6786</p>
          <p>Address: Al Dhabi06 Karachi-Pakistan</p>
        </div>
        
      </div>
      
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} MyShop | Mohammed Yasir
      </div>
    </footer>
  );
};

export default Footer;