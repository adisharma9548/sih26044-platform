import express from 'express';
import cors from 'cors';
import { config, validateEnv } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';

validateEnv();
connectDB();

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json(sendSuccess({ status: 'ok' }, 'API is running'));
});

app.get('/api/health', (req, res) => {
  res.json(sendSuccess({ uptime: process.uptime() }, 'Health check OK'));
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);   // ✅ Mounts ALL student routes

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
});