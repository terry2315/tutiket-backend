import express from 'express';
import {
    register,
    login,
    current,
    logout,
} from '../controllers/sessions.controller.js';

import {
    authenticateRegister,
    authenticateLogin,
    authenticateCurrent
} from '../middlewares/passport.middlewares.js';

const router = express.Router();

router.post(
    '/register',
    authenticateRegister,
    register
);

router.post(
    '/login',
    authenticateLogin,
    login
);

router.get(
    '/current',
    authenticateCurrent,
    current
);

router.post('/logout', logout);
export default router;