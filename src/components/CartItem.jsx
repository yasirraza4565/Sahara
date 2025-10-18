import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartItem = ({ item }) => {
    // Note: The structure in CartProvider uses 'id' for the unique key
    const { updateQty , removeItem } = useContext(CartContext);

    return (
        <div className='cart-item'>
        <img src={item.image} alt={item.title}/>
        <div className='cart-item-details'>
            <h4>{item.title}</h4>
            {/* Display price multiplied by quantity for the item total */}
            <p>${(item.price * item.quantity).toFixed(2)}</p> 

            <div className='cart-item-actions'>
                <label>
                    Qty:{" "}
                    <input
                    type='number'
                    min="1"
                    // FIX: Use 'quantity' property
                    value={item.quantity}
                    // Pass item.id and the new quantity
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    />
                </label>
                {/* Pass item.id to the removeItem function */}
                <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
        </div>
        </div>
    );
};

export default CartItem;