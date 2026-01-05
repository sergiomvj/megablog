import { pool } from './services/db.js';

async function patch() {
    try {
        console.log('Adding base_prompt column to settings table...');
        await pool.query('ALTER TABLE settings ADD COLUMN base_prompt TEXT AFTER google_api_key');
        console.log('Patch successful.');
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column base_prompt already exists.');
            process.exit(0);
        }
        console.error('Patch failed:', err.message);
        process.exit(1);
    }
}

patch();
