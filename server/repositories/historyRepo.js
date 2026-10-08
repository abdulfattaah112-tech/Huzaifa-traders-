import pool from '../db/pool.js';
import eventBus from '../realtime/eventBus.js';
export const getHistory = async () => { const { rows } = await pool.query('SELECT * FROM history ORDER BY "createdAt" DESC'); return rows; };

export const createHistory = async (historyData) => {
    // If it's a string, it's just the action (like order actions).
    // If it's an object, it's the daily snapshot.
    let action = '';
    let date = null;
    let day = null;
    let totalStock = null;
    let totalItemsSold = null;
    let salesAmount = null;
    let earnings = null;
    let outOfStockItems = null;
    let soldItems = null;

    if (typeof historyData === 'string') {
        action = historyData;
    } else {
        action = historyData.action || '';
        date = historyData.date;
        day = historyData.day;
        totalStock = historyData.totalStock;
        totalItemsSold = historyData.totalItemsSold;
        salesAmount = historyData.salesAmount;
        earnings = historyData.earnings;
        outOfStockItems = historyData.outOfStockItems;
        soldItems = historyData.soldItems ? JSON.stringify(historyData.soldItems) : null;
    }

    const { rows } = await pool.query(
        `INSERT INTO history (action, date, day, "totalStock", "totalItemsSold", "salesAmount", earnings, "outOfStockItems", "soldItems")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [action, date, day, totalStock, totalItemsSold, salesAmount, earnings, outOfStockItems, soldItems]
    );
    eventBus.emit('update', { resource: 'history' }); return rows[0];
};

export const updateHistory = async (id, historyData) => {
    const { totalStock, totalItemsSold, salesAmount, earnings, outOfStockItems, soldItems, action } = historyData;
    let sql = 'UPDATE history SET ';
    const params = [];
    let idx = 1;

    if (totalStock !== undefined) { sql += `"totalStock" = $${idx++}, `; params.push(totalStock); }
    if (totalItemsSold !== undefined) { sql += `"totalItemsSold" = $${idx++}, `; params.push(totalItemsSold); }
    if (salesAmount !== undefined) { sql += `"salesAmount" = $${idx++}, `; params.push(salesAmount); }
    if (earnings !== undefined) { sql += `earnings = $${idx++}, `; params.push(earnings); }
    if (outOfStockItems !== undefined) { sql += `"outOfStockItems" = $${idx++}, `; params.push(outOfStockItems); }
    if (soldItems !== undefined) { sql += `"soldItems" = $${idx++}, `; params.push(JSON.stringify(soldItems)); }
    if (action !== undefined) { sql += `action = $${idx++}, `; params.push(action); }

    // Remove trailing comma and space
    sql = sql.slice(0, -2);
    sql += ` WHERE id = $${idx} RETURNING *`;
    params.push(id);

    const { rows } = await pool.query(sql, params);
    eventBus.emit('update', { resource: 'history' }); return rows[0];
};

export const deleteHistory = async (id) => { const { rows } = await pool.query('DELETE FROM history WHERE id = $1 RETURNING *', [id]); eventBus.emit('update', { resource: 'history' }); return rows[0]; };
export const deleteAllHistory = async () => { const { rows } = await pool.query('DELETE FROM history RETURNING *'); return rows; };
