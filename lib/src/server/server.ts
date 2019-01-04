import express, { Application } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import mongoose, { Connection } from 'mongoose';

import container from '../common/config/ioc';
import env from '../common/config/env';

import jsend from './middlewares/jsend';

export class Server {
  db: Connection;
  private server: InversifyExpressServer;
  constructor() {
    this.connectDB();

    this.server = new InversifyExpressServer(container, null, {
      rootPath: '/api/v1',
    });

    //setup server-level middlewares
    this.server.setConfig((app: Application) => {
      app.disable('x-powered-by');
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));

      //enable jsend
      app.use(jsend);
    });

    //register 404 route handler
    this.server.setErrorConfig((app: Application) => {
      app.use((req, res, next) => {
        res.status(404).send("Whoops! Route doesn't exist.");
      });
    });
  }

  getServer = () => this.server;

  connectDB() {
    mongoose.set('useCreateIndex', true);
    mongoose.connect(
      env.mongodb_uri,
      { useNewUrlParser: true }
    );
    this.db = mongoose.connection;
  }
}
