import express from 'express';

import {
    getEvents,
    createEvent,
    updateEvent
} from '../controllers/events.controller.js';

import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { authorizeEventOwner } from '../middlewares/event-owner.middleware.js';

const router = express.Router();

router.get('/events', getEvents);

router.post(
    '/events',
    auth,
    authorize('organizer', 'admin'),
    createEvent
);

router.patch(
    '/events/:eid',
    auth,
    authorize('organizer', 'admin'),
    authorizeEventOwner,
    updateEvent
);

export default router;