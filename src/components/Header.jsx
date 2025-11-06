import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

const Header = () => {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    
    // --- 1. LOGIC ---
    const authToken = localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('isAdmin') === 'true'; 

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('isAdmin');  

        alert("You have been logged out.");
        navigate("/");
    };
    // ------------------------------------------

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
                    {/* External Link */}
                    <li>
                        <Link to="https://sadaf-elegance-raza.lovable.app/" target="_blank" rel="noopener noreferrer">Sadaf Elegance</Link>
                    </li>
                    <li>
                        <Link to="/cart">Cart ({totalItems})</Link>
                    </li>

                    {/* --- 2. CONDITIONAL LINKS --- */}
                    
                    {/* Admin Panel (Visible only if isAdmin is true) */}
                    {isAdmin && (
                        <li>
                            {/* FIX: Changed path from /AdminDashboard to /admin */}
                            <Link to="/admin" style={{ color: '#e74c3c' }}>Admin Panel</Link>
                        </li>
                    )}
                    
                    {/* Login/Logout Link (Show one or the other) */}
                    {authToken ? (
                        <li>
                            <a href="#" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                                Logout
                            </a>
                        </li>
                    ) : (
                        <li>
                            <Link to="/auth">Login / Sign Up</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;