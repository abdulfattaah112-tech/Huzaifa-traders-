import pool from '../server/db/pool.js';

async function verifyData() {
    console.log('--- NEON PRODUCTION DATA VERIFICATION ---');

    try {
        const counts = {};
        const tables = ['categories', 'products', 'orders', 'history', 'business_details'];
        
        for (const table of tables) {
            const { rows } = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            counts[table] = parseInt(rows[0].count, 10);
        }
        
        console.log('\\n📊 Row Counts:');
        console.table(counts);

        // Validation: Orphans
        const { rows: orphanedProducts } = await pool.query(`
            SELECT COUNT(*) FROM products p 
            LEFT JOIN categories c ON p.category = c.name 
            WHERE p.category IS NOT NULL AND c.name IS NULL
        `);
        console.log(`\\n🔍 Orphaned Products (Missing Category): ${orphanedProducts[0].count}`);

        // Validation: JSON structure (just an example for orders)
        const { rows: invalidOrders } = await pool.query(`
            SELECT COUNT(*) FROM orders 
            WHERE items IS NULL OR jsonb_array_length(items) = 0
        `);
        console.log(`🔍 Orders with empty/null items: ${invalidOrders[0].count}`);

        console.log('\\n✅ Verification script completed.');

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await pool.end();
    }
}

verifyData();
