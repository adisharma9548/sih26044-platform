import express from 'express';
import cors from 'cors';
import { config, validateEnv } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';
import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import assessmentRoutes from './routes/assessment.routes';
import dashboardRoutes from './routes/dashboard.routes';
import opportunityRoutes from './routes/opportunity.routes';
import applicationRoutes from './routes/application.routes';

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
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
});
