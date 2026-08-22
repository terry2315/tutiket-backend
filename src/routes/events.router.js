import express from 'express';
import events from '../controllers/events.controller.js';

const router = express.Router();

router.get('/events', events);

export default router;