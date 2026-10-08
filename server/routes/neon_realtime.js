import express from 'express';
import eventBus from '../realtime/eventBus.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Flush headers to establish connection immediately
    res.flushHeaders();

    // Send initial heartbeat
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // Listener function
    const onUpdate = (eventPayload) => {
        // Send safe, non-sensitive notification payloads
        res.write(`data: ${JSON.stringify(eventPayload)}\n\n`);
    };

    eventBus.on('update', onUpdate);

    // Heartbeat to keep connection alive
    const heartbeatInterval = setInterval(() => {
        res.write(`data: ${JSON.stringify({ type: 'heartbeat' })}\n\n`);
    }, 30000);

    // Cleanup on disconnect
    req.on('close', () => {
        eventBus.off('update', onUpdate);
        clearInterval(heartbeatInterval);
    });
});

export default router;
