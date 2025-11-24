// src/pages/Products.jsx
import React, { useContext, useState } from 'react'; 
import ProductCard from '../components/ProductCard';
import { products } from '../productsData'; 
import { CartContext } from "../contexts/CartContext"; 
import Checkout from './Checkout';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';

const Products = () => {
    const { addToCart, clearCart } = useContext(CartContext); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleBuyNow = () => {
        if (!selectedProduct) return;
        clearCart();
        addToCart(selectedProduct, 1);
        setIsModalOpen(false);
        navigate('/checkout');
    };

    return (
        <div className='products-page'>
            <h2>All Products</h2>

            <Notification message={notification?.message} type={notification?.type} />

            {isModalOpen && selectedProduct && (
                <div className="custom-modal-overlay" onClick={closeModal}>
                    <div className="custom-modal-dialog product-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-body">
                            <div className="modal-image">
                                <img src={selectedProduct.image} alt={selectedProduct.title} />
                            </div>
                            <div className="modal-info">
                                <h3>{selectedProduct.title}</h3>
                                <p className="modal-message">{selectedProduct.description}</p>
                                <h3 className="modal-price">${selectedProduct.price}</h3>
                                <div className="modal-actions">
                                    <button className="btn modal-cancel-btn" onClick={closeModal}>Close</button>
                                    <button className="btn btn-primary" onClick={() => { addToCart(selectedProduct); setNotification({ message: `${selectedProduct.title} added to cart`, type: 'success' }); }}>Add to cart</button>
                                    <button className="btn modal-confirm-btn" onClick={handleBuyNow}>Buy Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className='product-grid'>
                {products.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onView={openModal}
                        onAdded={() => setNotification({ message: `${product.title} added to cart`, type: 'success' })}
                    />
                ))}
            </div>
        </div>
    );
};

export default Products;
