import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';
import { logger } from '../utils/logger';

let memoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<typeof mongoose> {
  // If explicitly requested or running tests, use memory server
  if (env.USE_IN_MEMORY_DB || env.NODE_ENV === 'test') {
    logger.info('Starting MongoMemoryServer (In-Memory Database)...');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    logger.info(`Connected to In-Memory MongoDB at ${uri}`);
    return mongoose;
  }

  try {
    logger.info(`Attempting to connect to MongoDB at ${env.MONGODB_URI}`);
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500, // fast fallback if local mongo is down
    });
    logger.info('Connected to MongoDB successfully.');
    return mongoose;
  } catch (err: any) {
    logger.warn(`Failed to connect to ${env.MONGODB_URI}: ${err.message}`);
    logger.info('Falling back to MongoMemoryServer for development resilience...');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    logger.info(`Connected to In-Memory MongoDB at ${uri}`);
    return mongoose;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
