import pool from '../server/db/pool.js';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data_export');

async function syncSchema() {
    const client = await pool.connect();
    try {
        const tables = ['categories', 'products', 'orders', 'history', 'business_details'];
        
        for (const table of tables) {
            const file = path.join(dataDir, `${table}.json`);
            if (!fs.existsSync(file)) continue;
            
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            if (data.length === 0) continue;
            
            const jsonKeys = Object.keys(data[0]);
            
            const res = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [table]);
            const existingCols = res.rows.map(r => r.column_name);
            
            for (const key of jsonKeys) {
                // Ignore keys that already exist (case insensitive in postgres if not quoted, but we check exact matches for now, actually postgres columns are lowercase unless quoted).
                const lowerKey = key.toLowerCase();
                const exists = existingCols.some(c => c.toLowerCase() === lowerKey || c === key);
                if (!exists) {
                    console.log(`Adding missing column "${key}" to ${table}`);
                    // Type guessing based on data
                    const val = data[0][key];
                    let type = 'TEXT';
                    if (typeof val === 'number') type = 'NUMERIC';
                    else if (typeof val === 'boolean') type = 'BOOLEAN';
                    else if (Array.isArray(val) || typeof val === 'object') type = 'JSONB';
                    else if (key.includes('at') || key.includes('date')) type = 'TIMESTAMPTZ';
                    
                    await client.query(`ALTER TABLE ${table} ADD COLUMN "${key}" ${type}`);
                }
            }
        }
        console.log('Schema sync complete.');
    } finally {
        client.release();
        await pool.end();
    }
}

syncSchema();
