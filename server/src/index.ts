import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config, validateEnv } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import internshipRoutes from './routes/internship.routes';
import applicationRoutes from './routes/application.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';

validateEnv();
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use('/api', limiter);

app.get('/', (req, res) => {
  res.json(sendSuccess({ status: 'ok', uptime: process.uptime() }, 'Server running'));
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
});