import express from 'express';
import cors from 'cors';

import routes from './routes';

import * as admin from 'firebase-admin';

import serviceAccount from '../serviceAccountKey.json';

class App {
  constructor() {
    this.server = express();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export const app = new App().server;
