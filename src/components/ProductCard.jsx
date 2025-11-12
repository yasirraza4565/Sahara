// src/components/ProductCard.jsx (Corrected)

import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { CartContext } from "../contexts/CartContext";

export default function ProductCard({ product }) {
    const { clearCart, addToCart } = useContext(CartContext); 
    const navigate = useNavigate();

    const handleBuyNow = () => {
        clearCart(); 
        addToCart(product, 1);
        navigate('/checkout'); 
    };

    return (
        <div className="card">
            {/* FIX APPLIED HERE: Changed product.images to product.image */}
            <img src={product.image} alt={product.title}/> 
            
            <h3>{product.title}</h3>
            <p>₹{product.price}</p>
            <h4>{product.description}</h4> 
            
            <div className="add-buy"> 
                <button onClick={() => addToCart(product)} id="btn" className="add-buy-btn">Add to cart</button> 
                <button onClick={handleBuyNow} id="btn" className="buy-now-btn">Buy Now</button> 
            </div>
        </div>
    );
}