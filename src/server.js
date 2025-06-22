import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnvVar.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import router from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(getEnvVar('PORT', '8080'));

export async function setupServer() {
  const app = express();

  app.use(cookieParser())
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );


  try {
    await initMongoConnection();
    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Failed to start server due to database connection error:", error);
    process.exit(1);
  }


  app.use('/', router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}
