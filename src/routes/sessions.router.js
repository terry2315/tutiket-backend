import express from 'express';
import { auth } from '../middlewares/auth.middlewares.js';
import {
    register,
    login,
    current,
    logout,
} from '../controllers/sessions.controller.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/current', auth, current);

router.post('/logout', logout);

export default router;