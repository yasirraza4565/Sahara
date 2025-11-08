// File: server.js - FINAL E-commerce Backend

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret';
const BCRYPT_SALT_ROUNDS = 12;

const app = express();
app.use(cors());
app.use(express.json());

// ---- MySQL POOL (promise) ----
const pool = mysql
    .createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sahara',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })
    .promise();

// ---- Startup DB check ----
(async () => {
    try {
        await pool.query('SELECT 1');
        console.log('✅ MySQL pool connected (startup check)');
    } catch (err) {
        console.error('❌ MySQL connection failed at startup:', err.message);
        process.exit(1);
    }
})();

/* --------------------------- JWT / Auth Middleware --------------------------- */

function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Token required' });
    try {
        req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

function verifyAdmin(req, res, next) {
    if (!req.user || !req.user.is_admin)
        return res.status(403).json({ message: 'Admin privileges required' });
    next();
}

/* -------------------------- Multer Configuration (File Upload) -------------------------- */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the target folder relative to the server.js file
        // NOTE: Ensure your backend project folder has a 'public/images' subdirectory
       cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {
        // Use a timestamp + original name
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

/* ----------------------------------- API Routes ---------------------------------- */

// Health check
app.get('/', (_req, res) =>
    res.json({ message: 'Sahara API running ✅', version: '1.0' })
);

// 1) Register
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Missing fields' });

        const [exists] = await pool.execute(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );
        if (exists.length)
            return res.status(409).json({ message: 'Email already registered' });

        const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        await pool.execute(
            'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hash]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2) Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password)
            return res.status(400).json({ message: 'Missing credentials' });

        const [rows] = await pool.execute(
            'SELECT user_id, email, password_hash, is_admin FROM users WHERE email = ?',
            [email]
        );
        if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken({
            user_id: user.user_id,
            email: user.email,
            is_admin: !!user.is_admin,
        });

        res.json({
            message: 'Login successful',
            token,
            isAdmin: !!user.is_admin,
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3) Admin: Upload Image (PROTECTED)
app.post('/api/admin/upload-image', verifyToken, verifyAdmin, upload.single('productImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        
        // Construct the PUBLIC URL path
        const publicUrl = '/images/' + req.file.filename;

        res.json({ 
            message: 'File uploaded successfully.',
            imageUrl: publicUrl 
        });

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ message: 'Server error during file upload.' });
    }
});

// 4) Admin: Add product (PROTECTED)
app.post('/api/admin/product', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const { title, price, image, stock } = req.body || {};
        if (!title || price == null)
            return res.status(400).json({ message: 'Missing product details' });

        await pool.execute(
            'INSERT INTO products (title, price, image_url, stock_quantity, sales_count) VALUES (?, ?, ?, ?, 0)',
            [title, price, image || null, stock || 0]
        );

        res.status(201).json({ message: 'Product added successfully' });
    } catch (err) {
        console.error('Add product error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 5) Admin: Update Profile (PROTECTED)
app.put('/api/admin/profile', verifyToken, verifyAdmin, async (req, res) => {
    try {
        // Data received from the frontend
        const { fullName, mobNo, location } = req.body; 
        
        // IMPORTANT: Get user_id from the verified JWT payload for security
        const userId = req.user.user_id; 

        // SQL Update: Updates full_name, mobNo, and location based on the logged-in user's ID
        const [result] = await pool.execute(
            'UPDATE users SET full_name = ?, mobNo = ?, location = ? WHERE user_id = ?',
            [fullName, mobNo, location, userId]
        );

        if (result.affectedRows === 0) {
            // This is a 404 because the user ID from the token didn't match any row
            return res.status(404).json({ message: 'User not found or nothing changed.' });
        }
        
        res.json({ message: 'Profile updated successfully!' });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ message: 'Server error updating profile. Check database schema.' });
    }
});


// 6) Place Order (Transactional)
app.post('/api/orders', async (req, res) => {
    let conn;
    try {
        const { customer, shippingAddress, paymentMethod, items } = req.body || {};

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must have items' });
        }

        const fullAddress = [
            shippingAddress?.street,
            shippingAddress?.roadName,
            shippingAddress?.landmark,
            shippingAddress?.pincode ? `Pincode: ${shippingAddress.pincode}` : null,
        ]
            .filter(Boolean)
            .join(', ');

        conn = await pool.getConnection();
        await conn.beginTransaction();

        // Lock product rows to prevent race conditions
        const ids = items.map((i) => i.id);
        const placeholders = ids.map(() => '?').join(',');
        const [products] = await conn.query(
            `SELECT id, price, stock_quantity FROM products WHERE id IN (${placeholders}) FOR UPDATE`,
            ids
        );

        const byId = {};
        products.forEach((p) => (byId[p.id] = p));

        const errors = [];
        let computedTotal = 0;

        for (const it of items) {
            const p = byId[it.id];
            if (!p) {
                errors.push({ id: it.id, message: 'Product not found' });
                continue;
            }
            if (p.stock_quantity < it.quantity) {
                errors.push({ id: it.id, message: 'Insufficient stock' });
            }
            computedTotal += Number(p.price) * it.quantity;
        }

        if (errors.length) {
            await conn.rollback();
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        // Insert order
        const orderData = {
            customer_name: customer?.fullName || 'Guest',
            customer_email: customer?.email || null,
            shipping_address: fullAddress,
            payment_method: paymentMethod || null,
            total_amount: computedTotal,
            order_details: JSON.stringify(items),
            order_date: new Date(),
        };

        const [insert] = await conn.query('INSERT INTO orders SET ?', orderData);
        const orderId = insert.insertId;

        // Update stock & sales
        for (const it of items) {
            await conn.query(
                'UPDATE products SET stock_quantity = stock_quantity - ?, sales_count = sales_count + ? WHERE id = ?',
                [it.quantity, it.quantity, it.id]
            );
        }

        await conn.commit();
        res
            .status(201)
            .json({ message: 'Order placed', orderId, totalAmount: computedTotal });
    } catch (err) {
        if (conn) {
            try {
                await conn.rollback();
            } catch (_) {}
            conn.release();
        }
        console.error('Order error:', err);
        res.status(500).json({ message: 'Server error placing order' });
        return;
    }
    if (conn) conn.release();
});

// 7) Admin Dashboard (PROTECTED)
app.get('/api/admin/dashboard', verifyToken, verifyAdmin, async (_req, res) => {
    try {
        const [stock] = await pool.query(
            'SELECT SUM(stock_quantity) AS productsInStock, COUNT(CASE WHEN stock_quantity < 10 THEN 1 END) AS lowStockAlerts, SUM(sales_count) AS totalProductsSold FROM products'
        );
        const [revenue] = await pool.query(
            'SELECT SUM(total_amount) AS totalRevenue FROM orders'
        );
        const [top] = await pool.query(
            'SELECT title, sales_count, stock_quantity FROM products ORDER BY sales_count DESC LIMIT 5'
        );

        res.json({
            totalRevenue: parseFloat(revenue[0]?.totalRevenue) || 0,
            productsSold: stock[0]?.totalProductsSold || 0,
            productsInStock: stock[0]?.productsInStock || 0,
            lowStockAlerts: stock[0]?.lowStockAlerts || 0,
            profit: (parseFloat(revenue[0]?.totalRevenue) || 0) * 0.4, // demo margin
            salesPerformance: top,
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// 8) Admin: Fetch all products for stock management (PROTECTED)
app.get('/api/admin/products/all', verifyToken, verifyAdmin, async (_req, res) => {
    try {
        const sql =
            'SELECT id, title, price, image_url, stock_quantity, sales_count FROM products ORDER BY title ASC';
        const [products] = await pool.query(sql);

        const productsWithMetrics = products.map((p) => ({
            ...p,
            totalValue: Number(p.price) * Number(p.stock_quantity),
        }));

        res.json(productsWithMetrics);
    } catch (err) {
        console.error('Fetch all products error:', err);
        res.status(500).json({ message: 'Server error fetching stock data.' });
    }
});


/* -------------------------------- Start Server -------------------------------- */
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);