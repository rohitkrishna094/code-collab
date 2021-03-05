import 'reflect-metadata';
import 'dotenv-safe/config';
import express, { Request, Response } from 'express';

// Generic Controller Exception Middleware
import cors from 'cors';
import http from 'http';
import { serverError } from './middleware/errors';
import SocketIOWrapper from './socket';
// Routes
import judge from './controller/judge/judge';

const volleyball = require('volleyball');

const main = async () => {
  const app = express();
  const server = http.createServer(app);
  SocketIOWrapper(server);

  app.use(cors());
  app.use(volleyball);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/judge', judge);

  app.get('/test', (req: Request, res: Response) => {
    console.log('ping endpoint test');
    res.status(200).json({ msg: 'ping success' });
  });

  // For 404 pages
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ status: '404' });
  });

  // The last custom middleware that wraps the exception as status 500 and returns
  // "Internal Server Error" if no exception message exists
  app.use(serverError);

  server.listen(+process.env.PORT, () => {
    console.log(`Server started on localhost:${process.env.PORT}`);
  });
};

main();
