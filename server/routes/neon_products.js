import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../repositories/productsRepo.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.json({ data: products });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products', detail: err.message, stack: err.stack });
    }
});

router.post('/', requireAdmin, async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json({ data: [product] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create product' });
    }
});

router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const product = await updateProduct(req.params.id, req.body);
        res.json({ data: [product] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to update product' });
    }
});

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const product = await deleteProduct(req.params.id);
        res.json({ data: [product] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete product' });
    }
});

export default router;
