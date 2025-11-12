// src/pages/OrderConfirmation.jsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmation = () => {
    // We get the orderId from the navigation state passed by Checkout.jsx
    const location = useLocation();
    const orderId = location.state?.orderId || 'N/A';

    return (
        <div className="confirmation-page">
            <div className="confirmation-card">
                <i className="fas fa-check-circle success-icon"></i>
                <h2 className="confirmation-title">Order Placed Successfully!</h2>
                
                <p className="confirmation-text">
                    Thank you for your purchase. Your order has been confirmed.
                </p>
                
                <p className="order-details">
                    **Order ID:** <span className="order-id">#{orderId}</span>
                </p>
                
                <div className="confirmation-actions">
                    <Link to="/" className="btn back-to-shop-btn">
                        Continue Shopping
                    </Link>
                    <Link to="/products" className="btn view-products-btn">
                        View More Products
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;