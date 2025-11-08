// db-check.js (debug version)
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  console.log('ENV DB_USER:', process.env.DB_USER);
  console.log('ENV DB_PASSWORD (len):', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : '<<undefined>>');
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'Sahara'
    });
    console.log('✅ Database connection successful!');
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('Test query result:', rows);
    await conn.end();
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error(err.message);
  }
})();
