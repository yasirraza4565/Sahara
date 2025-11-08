import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartItem = ({ item }) => {
     const { updateQty , removeItem } = useContext(CartContext);

     const description = item.description ?? item.desc;

    return (
        <div className='cart-item'>
            <img src={item.image} alt={item.title}/>
            <div className='cart-item-details'>
                <h4>{item.title}</h4>

                 {description && <p className='cart-item-description'>{description}</p>}

                 <p>${(item.price * item.quantity).toFixed(2)}</p> 

                <div className='cart-item-actions'>
                    <label>
                        Qty:{" "}
                        <input
                            type='number'
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQty(item.id, Number(e.target.value))}
                        />
                    </label>
                
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;