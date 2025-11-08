// src/pages/AdminDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // registers chart types

const BACKEND_URL = 'http://localhost:5000/api';

/* ---------------------------- Dashboard Home (Steps 4 & 8) ---------------------------- */
const DashboardHome = ({ metrics = {} }) => {
    // Variables MUST be defined inside the component scope
    const revenue = parseFloat(metrics.totalRevenue) || 0;
    const profit = parseFloat(metrics.profit) || 0;
    const goal = 10000;

    const salesData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ label: 'Weekly Sales', data: metrics.weeklySales ?? [3500, 4800, 6200, 7500], backgroundColor: 'rgba(54,162,235,0.5)' }],
    };

    const speedData = {
        labels: ['Reached', 'Remaining'],
        datasets: [{ data: [Math.min(revenue, goal), Math.max(goal - revenue, 0)], backgroundColor: ['#36A2EB', '#E9ECEF'] }],
    };

    return (
        <>
            <h2 className="admin-section-title">Overview Dashboard</h2>

            <div className="metrics-grid">
                <div className="metric-card revenue"><h3>TOTAL REVENUE</h3><p>${revenue.toFixed(2)}</p></div>
                <div className="metric-card sold"><h3>PRODUCTS SOLD</h3><p>{metrics.productsSold ?? 0}</p></div>
                <div className="metric-card stock"><h3>PRODUCTS IN STOCK</h3><p>{metrics.productsInStock ?? 0}</p></div>
                <div className="metric-card alert"><h3>LOW STOCK ALERT</h3><p className={metrics.lowStockAlerts > 0 ? 'text-danger' : 'text-success'}>{metrics.lowStockAlerts ?? 0}</p></div>
                <div className="metric-card profit"><h3>ESTIMATED PROFIT</h3><p className={profit > 0 ? 'text-success' : ''}>${profit.toFixed(2)}</p></div>
            </div>

            <div className="dashboard-charts-grid">
                <div className="chart-box"><h3>Monthly Sales Volume</h3><Bar data={salesData} /></div>
                <div className="chart-box"><h3>Revenue Progress (Goal: ${goal})</h3><Doughnut data={speedData} options={{ circumference: Math.PI, rotation: -Math.PI, plugins: { legend: { display: false } } }} /></div>
            </div>

            <h2 className="admin-section-title mt-5">Top Sales Performance</h2>
            <div className="sales-performance-list">
                {metrics.salesPerformance && metrics.salesPerformance.length ? (
                    metrics.salesPerformance.map((item, idx) => (
                        <div key={idx} className="performance-item">
                            <span>{item.title}</span>
                            <span>Sold: {item.sales_count} | Stock Left: {item.stock_quantity}</span>
                        </div>
                    ))
                ) : (
                    <div>No sales performance data available.</div>
                )}
            </div>
        </>
    );
};

/* ---------------------------- My Stock (Step 6) ---------------------------- */
const MyStock = ({ products = [], onAddProduct, fetchProducts, setNotification }) => {
    const [newProduct, setNewProduct] = useState({ title: '', price: '', image: '', description: '', stock: 30 });
    const [imageFile, setImageFile] = useState(null); 
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); 

    const handleChange = (e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

    // --- Image Upload Logic ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            setImagePreviewUrl('');
        }
    };

    const uploadImageAndGetUrl = async (file) => {
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('productImage', file); 

        try {
            const response = await axios.post(`${BACKEND_URL}/admin/upload-image`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            return response.data.imageUrl; // Returns public URL
        } catch (error) {
            setNotification?.({ message: 'Image upload failed.', type: 'error' });
            throw new Error('Image upload failed');
        }
    };

    // --- Modified handleAdd ---
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newProduct.title || !newProduct.price || Number(newProduct.stock) <= 0) {
            setNotification?.({ message: 'Title, Price and Stock (>0) are required', type: 'error' });
            return;
        }

        let imageUrl = newProduct.image || ''; // Default to URL input if file not selected
        
        if (imageFile) {
            imageUrl = await uploadImageAndGetUrl(imageFile);
            if (!imageUrl) return; 
        }

        try {
            await onAddProduct({
                title: newProduct.title, price: Number(newProduct.price), image: imageUrl, stock: Number(newProduct.stock), description: newProduct.description,
            });
            setNotification?.({ message: 'Product added successfully!', type: 'success' });
            
            // Reset state
            setNewProduct({ title: '', price: '', image: '', description: '', stock: 30 });
            setImageFile(null);
            setImagePreviewUrl('');
            
            if (typeof fetchProducts === 'function') fetchProducts();
        } catch (err) {
            // Error notification is handled within onAddProduct's try/catch chain
        }
    };
    
    return (
        <>
            <h2 className="admin-section-title">Inventory: My Stock ({products.length} Products)</h2>
            <table className="stock-table">
                <thead><tr><th>ID</th><th>Product</th><th>Price</th><th>Stock</th><th>Sold</th><th>Total Value</th></tr></thead>
                <tbody>
                    {products.length ? (
                        products.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td className="product-cell">
                                    {p.image_url && <img src={p.image_url} alt={p.title} className="stock-img" />}
                                    <span>{p.title}</span>
                                </td>
                                <td>${Number(p.price).toFixed(2)}</td>
                                <td className={p.stock_quantity < 10 ? 'text-danger' : ''}>{p.stock_quantity}</td>
                                <td>{p.sales_count}</td>
                                <td>${(Number(p.totalValue) || Number(p.price) * Number(p.stock_quantity) || 0).toFixed(2)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="6">No products found. Add new products below.</td></tr>
                    )}
                </tbody>
            </table>

            <h2 className="admin-section-title mt-5">Add New Product</h2>
            <form onSubmit={handleAdd} className="product-form-grid">
                {/* Image Upload Input */}
                <div className="product-image-upload">
                    <label htmlFor="file-upload">Product Image (Upload)</label>
                    <input 
                        type="file" 
                        id="file-upload" 
                        name="imageFile" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                    />
                    {imagePreviewUrl && (
                        <img src={imagePreviewUrl} alt="Preview" className="image-preview" />
                    )}
                </div>

                <input name="title" placeholder="Title" value={newProduct.title} onChange={handleChange} required />
                <input name="price" type="number" placeholder="Dollar Price" value={newProduct.price} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={newProduct.description} onChange={handleChange} />
                {/* Hidden input to pass manual URL if file upload isn't used or fails */}
                <input type="hidden" name="image" value={newProduct.image || ''} /> 
                <input name="stock" type="number" placeholder="Stock Qty (e.g. 30)" value={newProduct.stock} onChange={handleChange} required />
                
                <button type="submit" className="btn admin-submit-btn">Add Product</button>
            </form>
        </>
    );
};

/* ---------------------------- Sales Report (Step 5) ---------------------------- */
const SalesReport = ({ metrics = {} }) => {
    return (
        <>
            <h2 className="admin-section-title">Detailed Sales Report</h2>
            <div className="metrics-grid mb-4">
                <div className="metric-card revenue"><h3>Total Processed Value</h3><p>${(parseFloat(metrics.totalRevenue) || 0).toFixed(2)}</p></div>
                <div className="metric-card sold"><h3>Products Sold</h3><p>{metrics.productsSold ?? 0}</p></div>
                <div className="metric-card profit"><h3>Estimated Profit</h3><p className="text-success">${(parseFloat(metrics.profit) || 0).toFixed(2)}</p></div>
            </div>

            <table className="stock-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Date</th></tr></thead>
                <tbody><tr><td colSpan="4">Sales report data will be loaded from the database here.</td></tr></tbody>
            </table>
        </>
    );
};

/* ---------------------------- My Profile (Step 7) ---------------------------- */
const MyProfile = ({ profile = {}, setNotification, fetchData }) => {
    const [isEditing, setIsEditing] = useState(false);
    // Initialize form data using profile props
    const [formData, setFormData] = useState({
        name: profile.name || '', mobNo: profile.mobNo || '', email: profile.email || '', location: profile.location || '', user_id: profile.user_id || null,
    });

    // Sync form data when profile prop changes
    useEffect(() => {
        setFormData((f) => ({ ...f, name: profile.name || '', mobNo: profile.mobNo || '', email: profile.email || '', location: profile.location || '', user_id: profile.user_id || f.user_id }));
    }, [profile]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) { setNotification?.({ message: 'Not authenticated', type: 'error' }); return; }

        const payload = { fullName: formData.name, mobNo: formData.mobNo, location: formData.location };

        try {
            await axios.put(`${BACKEND_URL}/admin/profile`, payload, { headers: { Authorization: `Bearer ${token}` } });
            setNotification?.({ message: 'Profile updated successfully!', type: 'success' });
            setIsEditing(false);
            if (typeof fetchData === 'function') fetchData(token);
        } catch (err) {
            console.error('Profile update error:', err);
            setNotification?.({ message: err.response?.data?.message || 'Failed to save profile', type: 'error' });
        }
    };

    return (
        <>
            <h2 className="admin-section-title">Admin Profile</h2>
            <div className="profile-card">
                <img src={'/images/admin_placeholder.png'} alt="Admin" className="profile-img" />
                <div className="profile-details">
                    <p><strong>Name:</strong> {isEditing ? <input name="name" value={formData.name} onChange={handleChange} /> : <span>{formData.name}</span>}</p>
                    <p><strong>Mobile:</strong> {isEditing ? <input name="mobNo" value={formData.mobNo} onChange={handleChange} /> : <span>{formData.mobNo}</span>}</p>
                    <p><strong>Email:</strong> <span>{formData.email}</span></p>
                    <p><strong>Location:</strong> {isEditing ? <input name="location" value={formData.location} onChange={handleChange} /> : <span>{formData.location}</span>}</p>
                </div>
                <div className="social-links">
                    <a href="#"><i className="fab fa-instagram instagram-icon" /></a>
                    <a href="#"><i className="fab fa-facebook-f facebook-icon" /></a>
                </div>
            </div>

            {isEditing ? (
                <div>
                    <button className="btn admin-submit-btn mt-4 me-2" onClick={handleSave}>Save Changes</button>
                    <button className="btn admin-cancel-btn mt-4" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <button className="btn admin-submit-btn mt-4" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
        </>
    );
};

/* ---------------------------- Main Component ---------------------------- */
const AdminDashboard = ({ setNotification, activeTab }) => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({});
    const [products, setProducts] = useState([]);
    const [profile, setProfile] = useState({});

    // fetchData loads metrics + products + profile
    const fetchData = useCallback(async (token) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) { setNotification?.({ message: 'Authentication token missing', type: 'error' }); return; }
        
        try {
            const [metricsRes, productsRes] = await Promise.all([
                axios.get(`${BACKEND_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${authToken}` } }),
                axios.get(`${BACKEND_URL}/admin/products/all`, { headers: { Authorization: `Bearer ${authToken}` } }),
            ]);

            setMetrics(metricsRes.data || {});
            setProducts(productsRes.data || []);
            
            // Static profile data fallback/initial load
            setProfile({ 
                name: 'Sahara Admin', mobNo: '9876543210', email: 'admin@sahara.com', 
                location: 'Chennai, India', image: '/images/admin_placeholder.png' 
            });
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
            setNotification?.({ message: 'Failed to load dashboard data', type: 'error' });
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('isAdmin');
                navigate('/auth');
            }
        }
    }, [navigate, setNotification]);

    // handleAddProduct: posts a new product and refreshes products
    const handleAddProduct = async (productData) => {
        const token = localStorage.getItem('authToken');
        if (!token) { setNotification?.({ message: 'Not authenticated', type: 'error' }); throw new Error('Not authenticated'); }

        try {
            await axios.post(`${BACKEND_URL}/admin/product`, productData, { headers: { Authorization: `Bearer ${token}` } });
            setNotification?.({ message: 'Product added successfully!', type: 'success' });
            await fetchData(token); // re-fetch to get fresh list
        } catch (err) {
            console.error('Add product error:', err);
            setNotification?.({ message: err.response?.data?.message || 'Failed to add product', type: 'error' });
            throw err;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const isAdminFlag = localStorage.getItem('isAdmin');
        if (token && isAdminFlag === 'true') {
            fetchData(token);
        }
        // NOTE: Auth check/redirect for non-admin is primarily handled by AdminLayout
    }, [fetchData]);

    const renderContent = () => {
        switch (activeTab) {
            case 'Sales Report': return <SalesReport metrics={metrics} />;
            case 'My Stock': return <MyStock products={products} onAddProduct={handleAddProduct} fetchProducts={() => fetchData(localStorage.getItem('authToken'))} setNotification={setNotification} />;
            case 'Profile': return <MyProfile profile={profile} setNotification={setNotification} fetchData={fetchData} />;
            case 'Dashboard':
            default: return <DashboardHome metrics={metrics} />;
        }
    };

    return (
        <div className="admin-page-container">
            <section className="admin-content">
                {renderContent()}
            </section>
        </div>
    );
};

export default AdminDashboard;