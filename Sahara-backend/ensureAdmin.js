// ensureAdmin.js - run once: node ensureAdmin.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Sahara'
  });

  const email = 'admin@sahara.com';
  const plain = 'admin_password123';
  const hash = await bcrypt.hash(plain, 12);

  // Check if user exists
  const [rows] = await conn.execute('SELECT user_id FROM users WHERE email = ?', [email]);
  if (rows.length) {
    await conn.execute('UPDATE users SET password_hash = ?, is_admin = TRUE WHERE email = ?', [hash, email]);
    console.log('✅ Existing user password reset and promoted to admin.');
  } else {
    await conn.execute('INSERT INTO users (full_name, email, password_hash, is_admin) VALUES (?, ?, ?, ?)', ['Test Admin', email, hash, true]);
    console.log('✅ New admin user created.');
  }

  await conn.end();
})();
