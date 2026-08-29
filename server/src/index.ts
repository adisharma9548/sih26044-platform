import express from 'express';
import cors from 'cors';
import { config, validateEnv } from './config/env';
import { connectDB } from './config/db';           // new
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();                                       // new

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json(sendSuccess({ status: 'ok', timestamp: new Date().toISOString() }, 'API is running'));
});

app.get('/api/health', (req, res) => {
  res.json(sendSuccess({ uptime: process.uptime() }, 'Health check OK'));
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
});