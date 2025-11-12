// src/pages/Home.jsx

import React, { useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../productsData';
import { CartContext } from "../contexts/CartContext";
import ImageSlider from '../components/ImageSlider'; 

const Home = () => {
    const { addToCart } = useContext(CartContext); 
    
    return (
        <div className='home-page'>
            <ImageSlider /> 

            <h2>Welcome to Sahara</h2>
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

export default Home;