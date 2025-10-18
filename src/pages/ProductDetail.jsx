import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from "../contexts/CartContext";
import products from '../pages/Products';
import Checkout from './Checkout';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);

    const product = products.find((p) => p.id === parseInt(id));

    if (!product) {
        return (
            <div className='product-detail'>
                <h2>Product not found</h2>
            </div>
        );
    }

    return (
        <div className='product-detail'>
            <img src={product.image} alt={product.title} />
            <div className='product.info'>
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <h3>${product.price}</h3>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductDetail;