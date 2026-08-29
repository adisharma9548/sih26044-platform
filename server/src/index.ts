import express from 'express';
import cors from 'cors';
import { config, validateEnv } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/response';

// Validate environment variables
validateEnv();

const app = express();
const PORT = config.port;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json(sendSuccess({ status: 'ok', timestamp: new Date().toISOString() }, 'API is running'));
});

// Example protected route (placeholder)
app.get('/api/health', (req, res) => {
  res.json(sendSuccess({ uptime: process.uptime() }, 'Health check OK'));
});


// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
});