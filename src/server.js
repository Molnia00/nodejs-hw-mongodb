import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getEnvVar } from './utils/getEnvVar.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { Contact } from './models/contact.js';
import { getAllContacts, getAllContactsByID } from './services/conFunc.js';

const PORT = Number(getEnvVar('PORT', '8080'));

export async function setupServer() {
  const app = express();

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

  // //////ROUTES////////////////////

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

    


    
  app.get('/contacts', async (req, res, next) => {
    try {
        const contact = await getAllContacts();
      res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contact,
      });
    } catch (err) {
      next(err);
    }
  });
    
  app.get('/contacts/:id', async (req, res, next) => {
    try {
      const contactId = req.params.id;
      const contact = await getAllContactsByID(contactId);

      console.log(`Запит на /contacts/${contactId} отримано. Знайдено контакт:`, !!contact);

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }

        res.status(200).json({
          status: 200,
        message: "Successfully found contact!",
        data: contact
      });

    } catch (err) {
      console.error('Помилка в маршруті /contacts/:id:', err);
      next(err);
    }
  });
  // ////////////////////////////////
  // /////END OF ROUTES//////////////

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}