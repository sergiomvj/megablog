import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// Parse the URL to get connection details if it's a string
// mysql2 supports connection strings for some methods, but manually parsing is safer for cross-compat
export const pool = mysql.createPool(dbUrl);

// Test connection
try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully.');
} catch (err) {
    console.error('Database connection failed:', err.message);
}
