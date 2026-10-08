import pool from '../db/pool.js';
import eventBus from '../realtime/eventBus.js';

export const getProducts = async () => {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY name ASC');
    return rows;
};

export const getProductById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    eventBus.emit('update', { resource: 'products' }); return rows[0];
};

export const createProduct = async (product) => {
    const { name, price, discount, stock, category, image, active } = product;
    const { rows } = await pool.query(
        `INSERT INTO products (name, price, discount, stock, category, image, active) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, price, discount, stock, category, image, active]
    );
    eventBus.emit('update', { resource: 'products' }); return rows[0];
};

export const updateProduct = async (id, product) => {
    const { name, price, discount, stock, category, image, active } = product;
    const { rows } = await pool.query(
        `UPDATE products SET name = $1, price = $2, discount = $3, stock = $4, category = $5, image = $6, active = $7 
         WHERE id = $8 RETURNING *`,
        [name, price, discount, stock, category, image, active, id]
    );
    eventBus.emit('update', { resource: 'products' }); return rows[0];
};

export const deleteProduct = async (id) => {
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    eventBus.emit('update', { resource: 'products' }); return rows[0];
};
