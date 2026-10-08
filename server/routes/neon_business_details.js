import express from 'express';
import { getBusinessDetails, updateBusinessDetails } from '../repositories/businessDetailsRepo.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try { const details = await getBusinessDetails(); res.json({ data: [details] }); } 
    catch (err) { res.status(500).json({ error: 'Failed to fetch business details' }); }
});

router.patch('/:id', requireAdmin, async (req, res) => {
    try { const details = await updateBusinessDetails(req.params.id, req.body); res.json({ data: [details] }); } 
    catch (err) { res.status(400).json({ error: 'Failed to update business details' }); }
});

export default router;
