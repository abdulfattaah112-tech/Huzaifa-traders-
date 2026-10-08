import express from 'express';
import { getCategories, createCategory, deleteCategory } from '../repositories/categoriesRepo.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const categories = await getCategories();
        res.json({ data: categories });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.post('/', requireAdmin, async (req, res) => {
    try {
        const cat = await createCategory(req.body);
        res.status(201).json({ data: [cat] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create category' });
    }
});

router.delete('/:name', requireAdmin, async (req, res) => {
    try {
        const cat = await deleteCategory(req.params.name);
        res.json({ data: [cat] });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete category' });
    }
});

export default router;
