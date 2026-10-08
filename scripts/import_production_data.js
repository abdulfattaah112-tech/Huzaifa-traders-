import fs from 'fs';
import path from 'path';
import pool from '../server/db/pool.js';

const dataDir = path.join(process.cwd(), 'data_export');

async function importData() {
    console.log('--- NEON PRODUCTION DATA IMPORTER (DYNAMIC) ---');

    if (!fs.existsSync(dataDir)) {
        console.error(`Data directory not found: ${dataDir}`);
        process.exit(1);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log('Transaction started.');

        const tables = ['categories', 'products', 'orders', 'history', 'business_details'];
        
        for (const table of tables) {
            const file = path.join(dataDir, `${table}.json`);
            if (fs.existsSync(file)) {
                const records = JSON.parse(fs.readFileSync(file, 'utf8'));
                console.log(`Importing ${records.length} records into ${table}...`);
                
                for (const record of records) {
                    const keys = Object.keys(record);
                    const cols = keys.map(k => `"${k}"`).join(', ');
                    
                    // Values array logic
                    const values = keys.map(k => {
                        const v = record[k];
                        if (typeof v === 'object' && v !== null) return JSON.stringify(v);
                        return v;
                    });
                    
                    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                    
                    let conflictTarget = 'id';
                    // some tables might not have id, but all our 5 app tables do.
                    // However, we just do DO NOTHING for safety against duplicates
                    if (table === 'categories') conflictTarget = 'id';
                    else if (table === 'business_details') conflictTarget = 'id'; // Or whatever is PK
                    
                    try {
                        await client.query(
                            `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) ON CONFLICT (${conflictTarget}) DO NOTHING`,
                            values
                        );
                    } catch (e) {
                        // fallback if no unique constraint on id
                        if (e.code === '42P10') {
                            await client.query(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`, values);
                        } else {
                            throw e;
                        }
                    }
                }
            }
        }

        await client.query('COMMIT');
        console.log('Transaction committed successfully. Import complete.');

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Import failed! Transaction rolled back.', err);
    } finally {
        client.release();
        await pool.end();
    }
}

importData();
