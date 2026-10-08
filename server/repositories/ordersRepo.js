import pool from '../db/pool.js';
import eventBus from '../realtime/eventBus.js';

export const getOrders = async () => {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    return rows;
};

export const updateOrderStatus = async (id, status) => {
    const { rows } = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    eventBus.emit('update', { resource: 'orders' }); return rows[0];
};

export const updateOrderNotes = async (id, notes) => {
    const { rows } = await pool.query(
        'UPDATE orders SET internal_notes = $1 WHERE id = $2 RETURNING *',
        [notes, id]
    );
    eventBus.emit('update', { resource: 'orders' }); return rows[0];
};

export const deleteOrder = async (id) => {
    const { rows } = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    eventBus.emit('update', { resource: 'orders' }); return rows[0];
};

export const deleteCompletedOrders = async () => {
    const { rows } = await pool.query('DELETE FROM orders WHERE status = $1 RETURNING *', ['Completed']);
    eventBus.emit('update', { resource: 'orders' }); return rows;
};

export const createOrderWithStockValidation = async (orderData) => {
    const { customer_name, mobile, address, items, payment_method, customer_notes } = orderData;
    
    // Acquire a client from the pool for a transaction
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        let calculatedTotal = 0;
        const itemsToUpdate = [];
        
        // Lock rows and validate stock
        for (const item of items) {
            // FOR UPDATE locks the row against concurrent modifications
            const { rows } = await client.query(
                'SELECT price, discount, stock, name FROM products WHERE id = $1 FOR UPDATE',
                [item.id]
            );
            
            if (rows.length === 0) {
                throw new Error(`Product ${item.id} not found.`);
            }
            
            const prodData = rows[0];
            
            if (prodData.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${prodData.name}.`);
            }
            
            let itemPrice = parseFloat(prodData.price) || 0;
            let itemDiscount = parseFloat(prodData.discount) || 0;
            let priceAfterDiscount = itemPrice - (itemPrice * (itemDiscount / 100));
            calculatedTotal += priceAfterDiscount * item.quantity;
            
            itemsToUpdate.push({
                id: item.id,
                name: prodData.name,
                price: priceAfterDiscount,
                quantity: item.quantity
            });
            
            // Atomically decrement stock inside the transaction
            await client.query(
                'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
                [item.quantity, item.id]
            );
        }
        
        // Insert order
        const { rows: orderRows } = await client.query(
            `INSERT INTO orders (customer_name, mobile, address, items, total, payment_method, customer_notes, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [customer_name, mobile, address, JSON.stringify(itemsToUpdate), calculatedTotal, payment_method || 'Cash on Delivery', customer_notes || '', 'Pending']
        );
        
        await client.query('COMMIT');
        eventBus.emit('update', { resource: 'orders' });
        return orderRows[0];
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};
