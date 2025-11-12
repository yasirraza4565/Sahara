// src/contexts/CartContext.jsx (Final Corrected Version)

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    // State initialization, pulling cart data from storage
    // This is the correct location for the state hook
    const [cart, setCart] = useState(() => {
        try { 
            // Attempt to parse existing cart from local storage
            return JSON.parse(localStorage.getItem('cart')) || []; 
        } catch { 
            // If parsing fails (corrupted data), return an empty array
            return []; 
        }
    });

    // Effect to save cart to localStorage whenever 'cart' state changes
    useEffect(() => { 
        localStorage.setItem('cart', JSON.stringify(cart)); 
    }, [cart]);

    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const found = prev.find(i => i.id === product.id);

            if (found) {
                // If product is found, update quantity
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
            }

            // If product is new, add it with full details
            return [
                ...prev,
                {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    // Use a safe fallback for the image URL property
                    image: product.image || product.images?.[0], 
                    quantity: qty
                }
            ];
        });
    };

    // Update quantity function
    const updateQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    
    // Remove item function
    const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
    
    // --- PERMANENT FIX for Manual Deletion ---
    const clearCart = () => {
        setCart([]); // Clears the React state
        // This line guarantees the browser's storage is cleared instantly.
        localStorage.removeItem('cart'); 
    };
    // -----------------------------------------

    // Calculate subtotal
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart, subtotal }}>
            {children}
        </CartContext.Provider>
    );
}