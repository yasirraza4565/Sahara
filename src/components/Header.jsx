// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import ConfirmModal from "./ConfirmModal"; 

const Header = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

   const authToken = localStorage.getItem("authToken");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [isModalVisible, setIsModalVisible] = useState(false);  

   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

   const handleLogoutClick = () => {
    setIsModalVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsModalVisible(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAdmin");

    // Redirect and show a notification on home
    navigate("/", {
      state: { message: "You have been logged out.", type: "info" },
    });
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
  };

  
  return (
    <>
  
      <ConfirmModal
        visible={isModalVisible}
        message="Would you like to log out and terminate your current session?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />

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
              <Link
                to="https://sadaf-elegance-raza.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sadaf Elegance
              </Link>
            </li>

            <li>
              <Link to="/cart">Cart ({totalItems})</Link>
            </li>

  
            {isAdmin && (
              <li>
                <Link to="/admin" style={{ color: "#e74c3c" }}>
                  Admin Panel
                </Link>
              </li>
            )}

  
            {authToken ? (
              <li>
                <a
                  href="#"
                  onClick={handleLogoutClick}
                  style={{ cursor: "pointer" }}
                >
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
    </>
  );
};

export default Header;
