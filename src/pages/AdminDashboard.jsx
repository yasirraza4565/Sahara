import React, { useState, useeffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [metrics, setMetrics] = useState({ totalRevenue: 0, productsSold: 0, productsInStock:0 });
    const [newProduct, setNewProduct] = useState({ title: '', price: '', image: '', stock: ''});

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const isAdminFlag = localStorage.getItem('isAdmin');

        if (!token || isAdminFlag !== 'true'){
            alert('access Denied: you must be and administrator.');
            navigate('/');
            return;
        }
        setIsAdmin(true);
        fetchDashboardData(token);
    }, [navigate]);

    const fetchDashboardData = async (token) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/admin/dashboard`,{
                headers: { Authorization: `Bearer ${token}`}
            });
            setMetrics(response.data);
        } catch (error) {
            console.error("failed to fetch admin data",error);
            alert("session expired or unauthorized access to metrics.");
            navigate('/auth');
        }
    };


    const handleProductChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value});
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');

        try {
            await axios.post(`${BACKEND_URL}/admin/products`, newProduct, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Product added successfully!');
            setNewProduct({ title: '', price: '', image: '', stock: ''});
            fetchDashboardData(token);
        } catch (error) {
            alert('Failed to add product.');
            console.error(error);
        }
    };

    if (!isAdmin) {
        return <div className='admin-page'> Loading or Redirecting... </div>
    }

    return (
        <div className='admin-page'>
            <header className='admin-header'>
                <h1>Admin Control Panel</h1>
                <p>Manage products, inventory, and sales performance.</p>
            </header>

            <section className='admin-metrics'>
                <h2>Sales Dashboard</h2>
                <div className='metrics-grid'>
                    <div className='metrics-card revenue'>
                        <h3>Total Revenue</h3>
                        <p>${metrics.totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className='metric-card sold'>
                        <h3>Products Sold</h3>
                        <p>{metrics.productsSold}</p>
                    </div>
                    <div className='metric-card stock'>
                        <h3>Products in Stock</h3>
                        <p>{metrics.productsInstock}</p>
                    </div>

                    <div className='metric-card profit'>
                        <h3>Profit / Loss</h3>
                        <p className={metrics.profit > 0 ? 'positive' : 'negative'}>
                            ${metrics.profit ? metrics.profit.toFixed(2) : 'N/A'}
                        </p>
                    </div>
                </div>
            </section>

            <section className='admin-product-management'>
                <h2>Add New Product</h2>
                <form onSubmit={handleAddProduct} className='product-form-grid'>
                    <input 
                    type='text'
                    name='title'
                    placeholder='Product Title'
                    value={newProduct.title}
                    onChange={handleProductChange}
                    required
                    />
                    <input
                    type='number'
                    name='price'
                    placeholder='Price'
                    value={newProduct.price}
                    onChange={handleProductChange}
                    required
                    />
                    <input
                    type='text'
                    name='image'
                    placeholder='Image URL (/images/product.jpg)'
                    value={newProduct.image}
                    onChange={handleProductChange}
                    required
                    />
                    <input
                    type='number'
                    name='stock'
                    placeholder='Stock Quantity'
                    value={newProduct.stock}
                    onChange={handleAddProduct}
                    required
                    />

                    <button type='submit' className='btn admin-submit-btn'>Add Product to Inventory</button>
                </form>
            </section>
        </div>
    );
};

export default AdminDashboard;