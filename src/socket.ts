import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from './utils/auth';
import { redis } from './utils/redis';
import { logger } from './utils/logger';
import { prisma } from './utils/prisma';

export function initializeSocketIO(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new Error('Authentication error');
      }

      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', async (socket) => {
    const userId = socket.data.user.id;
    logger.info(`User connected: ${userId}`);

    try {
      // Update agent status if applicable
      const agent = await prisma.agent.findUnique({
        where: { userId }
      });

      if (agent) {
        await prisma.agent.update({
          where: { id: agent.id },
          data: { status: 'ONLINE' }
        });

        // Subscribe to agent-specific channels
        socket.join(`agent:${agent.id}`);
      }

      // Handle incoming calls
      socket.on('call:start', async (data) => {
        try {
          const call = await prisma.call.create({
            data: {
              customerId: data.customerId,
              agentId: agent!.id,
              userId,
              type: data.type
            }
          });

          // Notify relevant parties
          io.to(`agent:${agent!.id}`).emit('call:started', call);
        } catch (error) {
          logger.error('Error starting call:', error);
          socket.emit('error', { message: 'Failed to start call' });
        }
      });

      // Handle call updates
      socket.on('call:update', async (data) => {
        try {
          const call = await prisma.call.update({
            where: { id: data.callId },
            data: {
              status: data.status,
              sentiment: data.sentiment,
              duration: data.duration
            }
          });

          io.to(`agent:${agent!.id}`).emit('call:updated', call);
        } catch (error) {
          logger.error('Error updating call:', error);
          socket.emit('error', { message: 'Failed to update call' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        if (agent) {
          await prisma.agent.update({
            where: { id: agent.id },
            data: { status: 'OFFLINE' }
          });
        }
        logger.info(`User disconnected: ${userId}`);
      });
    } catch (error) {
      logger.error('Socket error:', error);
      socket.disconnect();
    }
  });

  return io;
}