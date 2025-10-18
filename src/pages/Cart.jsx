import React, { useContext } from 'react';
import { CartContext } from "../contexts/CartContext";
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart } = useContext(CartContext);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div className='cart-page'>
                <h2>Your Cart is Empty</h2>
                <Link to='/'>--Go Shopping--</Link>
            </div>
        );
    }

    return (
        <div className='cart-page'>
            <h2>Your Shopping Cart</h2>

            <div className='cart-list'>
                {/* FIX: Use item.id for the key */}
                {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </div>

            <div className='cart-summary'>
                <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
                {/* FIX: Use the actual checkout route from App.jsx */}
                <Link to="/checkout" className='checkout-btn'> Proceed to Checkout</Link>
            </div>
        </div>
    );
};

export default Cart;