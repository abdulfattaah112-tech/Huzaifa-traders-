import pool from '../server/db/pool.js';
async function fixSchema() {
    const client = await pool.connect();
    try {
        await client.query('ALTER TABLE products ALTER COLUMN id TYPE text USING id::text');
        console.log('Altered products.id to text');
        
        await client.query('ALTER TABLE categories ALTER COLUMN id TYPE text USING id::text');
        console.log('Altered categories.id to text');
        
        await client.query('ALTER TABLE orders ALTER COLUMN id TYPE text USING id::text');
        console.log('Altered orders.id to text');
        
        await client.query('ALTER TABLE history ALTER COLUMN id TYPE text USING id::text');
        console.log('Altered history.id to text');
        
        await client.query('ALTER TABLE business_details ALTER COLUMN id TYPE text USING id::text');
        console.log('Altered business_details.id to text');
    } catch(e) {
        console.error(e.message);
    } finally {
        client.release();
        await pool.end();
    }
}
fixSchema();
