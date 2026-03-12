import 'dotenv/config';
import { AppServer } from './presentation/server/app-server';
import { winstonLogger } from './infrastructure/config/logger';

async function start() {
  try {
    const server = new AppServer();
    winstonLogger.info('Server initialization started');
    await server.start();
  } catch (error) {
    winstonLogger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();