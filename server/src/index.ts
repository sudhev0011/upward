import 'dotenv/config';
import { AppServer } from './presentation/server/app-server';

async function start() {
  try {
    const server = new AppServer();
    console.log('Server initialization started');
    await server.start();
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

start();