import { createServer } from 'http';
import { app } from './app';
import { initializeSocketIO } from './socket';
import { logger } from './utils/logger';
import { redis } from './utils/redis';
import { prisma } from './utils/prisma';

const PORT = process.env.PORT || 3000;
const server = createServer(app);

// Initialize Socket.IO
initializeSocketIO(server);

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database');

    // Test Redis connection
    await redis.ping();
    logger.info('Connected to Redis');

    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();