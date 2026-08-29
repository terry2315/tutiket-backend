import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import adminRouter from './routes/admin.router.js';

import { initializePassport } from './config/passport.config.js';

import healthRouter from './routes/health.router.js';
import eventsRouter from './routes/events.router.js';
import sessionRoutes from './routes/sessions.router.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api', healthRouter);
app.use('/api', eventsRouter);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRouter);

export default app;