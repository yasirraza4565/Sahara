// File: server.js - Consolidated and Corrected Code

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors');
const PORT = process.env.PORT || 5000;

// --- 1. APP SETUP & MIDDLEWARE ---
const app = express();

app.use(cors()); 
app.use(express.json()); 


// --- 2. DATABASE CONNECTION SETUP ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err.stack);
        return; 
    }
    console.log('✅ Connected to MySQL Database as id ' + db.threadId);
});


// --- 3. MIDDLEWARE FUNCTIONS (Must be defined BEFORE protected routes) ---

// Placeholder for Token Verification (Real apps use JWT library)
const verifyTokenAndAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Authorization token required.' });
    }

    const token = authHeader.split(' ')[1];
    
    // Assuming a successful login sets the token format to "FAKE_JWT_TOKEN_[ID]".
    if (!token || !token.startsWith('FAKE_JWT_TOKEN_')) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
    
    // HARDCODE ADMIN CHECK (TEMPORARY): Check if the user ID is an admin ID
    const userId = token.split('_').pop(); 
    if (userId !== '1') { // Example: Only user_id 1 is the admin
        return res.status(403).json({ message: 'Access denied: Requires admin privileges.' });
    }

    req.userId = userId; 
    next(); 
};


// --- 4. API ROUTES ---

// 4.1 Health Check / Root Route (Optional)
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to the Sahara E-commerce API!', 
        status: 'Server is running',
        version: '1.0'
    });
});

// 4.2 Fetch Product List (Placeholder)
app.get('/api/products', (req, res) => {
    res.json({ message: "Products data will be served from here." });
});


// 4.3 User Registration
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body; 

    // NOTE: In production, hash the password before inserting!
    const sql = "INSERT INTO users (full_name, email, password_hash) VALUES (?,?,?)";

    db.query(sql, [name, email, password], (err, result) => { 
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: 'Email already registered.' });
            }
            return res.status(500).json({ message: "Failed to register user." });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});


// 4.4 User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const sql = "SELECT user_id, email, password_hash, is_admin FROM users WHERE email = ?";
    
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error during login.' });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password.' });
        
        const user = results[0];
        
        // DANGER: Simple password check. Change this to bcrypt.compare in production.
        if (user.password_hash !== password) { 
             return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Success: Generate Token and return admin status
        const token = "FAKE_JWT_TOKEN_FOR_" + user.user_id; 

        res.json({ 
            message: 'Login successful!', 
            token: token,
            // Return isAdmin status to the frontend
            isAdmin: user.is_admin === 1 ? 'true' : 'false' 
        });
    });
});


// 4.5 User Logout
app.post('/api/logout', (req, res) => {
    res.json({ message: "Logout confirmed." });
});


// 4.6 (PROTECTED) Get Admin Dashboard Metrics
app.get('/api/admin/dashboard', verifyTokenAndAdmin, (req, res) => {
    // NOTE: This route needs logic to query the DB for metrics (products, orders, total_amount)
    res.json({
        totalRevenue: 5400.75, // Placeholder
        productsSold: 125,     // Placeholder
        productsInStock: 890,  // Placeholder
        profit: 2200.50        // Placeholder
    });
});


// 4.7 (PROTECTED) Insert New Product Card Details
app.post('/api/admin/product', verifyTokenAndAdmin, (req, res) => {
    const { title, price, image, stock } = req.body;
    
    // NOTE: Requires a 'products' table in MySQL.
    const sql = "INSERT INTO products (title, price, image_url, stock_quantity) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [title, price, image, stock], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to insert product." });
        }
        res.status(201).json({ message: "Product added successfully!" });
    });
});


// 4.8 Checkout/Order Placement
app.post("/api/orders", (req, res) => {
    const { name, email, address, payment, cart, total } = req.body;

    const orderData = {
        customer_name: name,
        customer_email: email,
        shipping_address: address, // PII
        payment_method: payment,
        total_amount: total,
        order_details: JSON.stringify(cart),
        order_date: new Date()
    };

    const sql = "INSERT INTO orders SET ?";

    db.query(sql, orderData, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error placing order." });
        }
        console.log("Order placed successfully! ID:", result.insertId);
        res.status(201).json({
            message: 'Order placed successfully!',
            orderId: result.insertId
        });
    });
});


// --- 5. SERVER START ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});