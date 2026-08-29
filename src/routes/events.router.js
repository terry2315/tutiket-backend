import express from 'express';
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    changeEventStatus
} from '../controllers/events.controller.js';

import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = express.Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);

router.post(
    '/events',
    auth,
    authorize('organizer', 'admin'),
    createEvent
);

router.put(
    '/events/:id',
    auth,
    authorize('organizer', 'admin'),
    updateEvent
);

router.patch(
    '/events/:id/status',
    auth,
    authorize('organizer', 'admin'),
    changeEventStatus
);

export default router;