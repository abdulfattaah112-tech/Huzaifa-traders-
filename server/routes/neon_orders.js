import express from 'express';
import { getOrders, updateOrderStatus, updateOrderNotes, deleteOrder, deleteCompletedOrders, createOrderWithStockValidation } from '../repositories/ordersRepo.js';
import { requireAdmin } from '../../middleware/auth.js';
import { orderLimiter } from '../../middleware/rateLimiter.js';

const router = express.Router();

router.get('/admin', requireAdmin, async (req, res) => {
    try {
        const orders = await getOrders();
        res.json({ data: orders });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.patch('/admin/:id/status', requireAdmin, async (req, res) => {
    try {
        const order = await updateOrderStatus(req.params.id, req.body.status);
        res.json({ data: [order] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update order status' });
    }
});

router.patch('/admin/:id/notes', requireAdmin, async (req, res) => {
    try {
        const order = await updateOrderNotes(req.params.id, req.body.internal_notes);
        res.json({ data: [order] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update order notes' });
    }
});

router.delete('/admin/:id', requireAdmin, async (req, res) => {
    try {
        const order = await deleteOrder(req.params.id);
        res.json({ data: [order] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete order' });
    }
});

router.delete('/admin/status/completed', requireAdmin, async (req, res) => {
    try {
        await deleteCompletedOrders();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete completed orders' });
    }
});

router.post('/', orderLimiter, async (req, res) => {
    try {
        const { customer_name, mobile, address, items, payment_method, customer_notes } = req.body;
        if (!customer_name || !mobile || !address || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields or empty cart.' });
        }
        
        for (const item of items) {
            if (!item.id || !item.quantity || item.quantity <= 0 || item.quantity > 1000) {
                return res.status(400).json({ error: 'Invalid item format, quantity must be between 1 and 1000.' });
            }
        }
        
        const order = await createOrderWithStockValidation(req.body);
        res.status(201).json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message || 'Failed to process checkout' });
    }
});

export default router;
