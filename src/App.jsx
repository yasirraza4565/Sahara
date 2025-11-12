import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Footer from './components/Footer';
import LoginPopup from './components/LoginPopup';
import Header from './components/Header';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import OrderConfirmation from './pages/OrderConfirmation';

const App = () => {
    const handleLogin = () => console.log("user logged in or continue.");
    const handleClose = () => console.log("user closed popup");
    return (
        <CartProvider>
            <Router>
                <Routes>
                    <Route path='/admin' element={<AdminLayout />} />
                    <Route
                        path='/*'
                        element={
                            <>
                                <Header />
                                    {/* <Route path='/order-confirmation' element={<OrderConfirmation />} /> */}
                                    <main>
                                        <Routes>
                                            <Route path='/' element={<Home />} />
                                            <Route path='/products' element={<Products />} />
                                            <Route path='/product/:id' element={<ProductDetail />} />
                                            <Route path='/cart' element={<Cart />} />
                                            <Route path='/checkout' element={<Checkout />} />
                                            <Route path='/about' element={<About />} />
                                            <Route path='/auth' element={<AuthPage />} />
                                            <Route path='/admin' element={<AdminDashboard />} />
                                            <Route path='/order-confirmation' element={<OrderConfirmation />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </>
                        }
                    />
                            </Routes>
                    </Router>
                </CartProvider>
                );
};

                export default App;