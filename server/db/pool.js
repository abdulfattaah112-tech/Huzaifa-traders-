import pg from 'pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

pg.types.setTypeParser(1700, function(val) {
  return parseFloat(val);
});

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

export default pool;
