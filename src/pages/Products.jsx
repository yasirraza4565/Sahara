// src/pages/Products.jsx
import React, { useContext } from 'react'; 
import ProductCard from '../components/ProductCard';
import { products } from '../productsData'; 
import { CartContext } from "../contexts/CartContext"; 
import Checkout from './Checkout';

const Products = () => {
    const { addToCart } = useContext(CartContext); 

    return (
        <div className='products-page'>
            <h2>All Products</h2>
            <div className='product-grid'>
                {products.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAdd={addToCart} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Products;