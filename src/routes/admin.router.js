import express from 'express';

import { getUsers } from '../controllers/admin.controller.js';

import { auth } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';

const router = express.Router();

router.get(
    '/users',
    auth,
    authorize('admin'),
    getUsers
);

export default router;