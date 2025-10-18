import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cart')) || []; } 
        catch { return []; }
    });

    useEffect(() => { localStorage.setItem('cart',JSON.stringify(cart)); }, [cart]);

    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const found = prev.find(i => i.id === product.id); 
            
            if (found) {
                return prev.map(i => i.id === product.id ? {...i, quantity: i.quantity + qty} : i);
            }
            
            return [
                ...prev, 
                { 
                    id: product.id, 
                    title: product.title, 
                    price : product.price, 
                    image: product.image || product.images?.[0], 
                    quantity: qty 
                }
            ];
        });
    };

    // Update quantity (uses 'id' and 'quantity' consistently)
    const updateQty = (id, qty) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: qty} : i));
    const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
    const clearCart = () => setCart([]);

    // Calculate subtotal using the correct 'quantity' property
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart , addToCart, updateQty, removeItem, clearCart, subtotal }}>
            {children}
        </CartContext.Provider>
    );
}