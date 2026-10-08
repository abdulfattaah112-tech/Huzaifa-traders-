import express from 'express';
import { getHistory, createHistory, updateHistory, deleteHistory, deleteAllHistory } from '../repositories/historyRepo.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res) => {
    try { const history = await getHistory(); res.json({ data: history }); } 
    catch (err) { res.status(500).json({ error: 'Failed to fetch history' }); }
});

router.post('/', async (req, res) => {
    try { 
        const hist = await createHistory(req.body); 
        res.status(201).json({ data: [hist] }); 
    } catch (err) { res.status(400).json({ error: 'Failed to create history' }); }
});

router.put('/:id', async (req, res) => {
    try { 
        const hist = await updateHistory(req.params.id, req.body); 
        res.json({ data: [hist] }); 
    } catch (err) { res.status(400).json({ error: 'Failed to update history' }); }
});

router.delete('/:id', async (req, res) => {
    try { const hist = await deleteHistory(req.params.id); res.json({ data: [hist] }); } 
    catch (err) { res.status(400).json({ error: 'Failed to delete history' }); }
});

export default router;
