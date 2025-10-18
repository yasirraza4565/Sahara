import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { CartContext } from "../contexts/CartContext";

const Header = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- NEW LOGOUT FUNCTION ---
  const handleLogout = () => {
    // 1. Clear any login-related flags/tokens from local storage
    localStorage.removeItem('hasLoggedIn');

    // In a real app, you would also clear the user's auth token here.

    // 2. Alert and Redirect
    alert("You have been logged out.");
    navigate("/"); // Redirect to the home page
  };
  // ---------------------------


  return (
    <header className="header">
      <nav className="navbar">
        <h1 className="logo">
          <Link to="/">Sahara</Link>
        </h1>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="https://sadaf-elegance-raza.lovable.app/" target="_blank" rel="noopener noreferrer">Sadaf Elegance</Link>
          </li>
          <li>
            <Link to="/cart">Cart ({totalItems})</Link>
          </li>
          {/* Add the Logout Link */}
          <li>
            {/* We use an anchor tag with onClick since we handle navigation manually */}
            <a href="#" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </a>
          </li>
          <li>
            <Link to="/auth">SignIn</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;