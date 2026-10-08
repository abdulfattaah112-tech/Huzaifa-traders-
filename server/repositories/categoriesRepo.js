import pool from '../db/pool.js';
import eventBus from '../realtime/eventBus.js';
export const getCategories = async () => { const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC'); return rows; };
export const createCategory = async (category) => { const { rows } = await pool.query('INSERT INTO categories (name, active) VALUES ($1, $2) RETURNING *', [category.name, category.active]); eventBus.emit('update', { resource: 'categories' }); return rows[0]; };
export const deleteCategory = async (name) => { const { rows } = await pool.query('DELETE FROM categories WHERE name = $1 RETURNING *', [name]); eventBus.emit('update', { resource: 'categories' }); return rows[0]; };
