import 'reflect-metadata';
import 'dotenv-safe/config';
import express, { Request, Response } from 'express';

// Generic Controller Exception Middleware
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { serverError } from './middleware/errors';
// Routes
import judge from './controller/judge/judge';

const volleyball = require('volleyball');

// socket io event types, S stands for socket io
interface SLanguageChangeEvent {
  id: number;
  mode: string;
  codeValue: string;
  userName: string;
}

interface SCodeRunEvent {
  type: string;
  payload: { userName: string; langId: number };
}

interface SCodeRunResultEvent {
  type: string;
  payload: { result: string };
}

const main = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' },
    pingTimeout: 60000,
    pingInterval: 120000
  });

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

  io.on('connection', (socket) => {
    let roomId = 0;
    let userName = '';

    // joining in a room
    socket.on('joinroom', (data: any) => {
      console.log('joinroom', data);
      roomId = data.room;
      userName = data.name;
      socket.join(roomId);
      socket.to(roomId).emit('userjoined', userName);
    });

    socket.on('codechange', (message: any) => {
      console.log('codechange');
      socket.to(roomId).emit('codechange', message);
    });

    socket.on('language_change', (data: SLanguageChangeEvent) => {
      console.log('language_change', data.id, data.mode, data.userName);
      socket.to(roomId).emit('language_change', data);
    });

    socket.on('code_run', (data: SCodeRunEvent) => {
      console.log('code_run', data.payload);
      socket.to(roomId).emit('code_run', data);
    });

    socket.on('code_run_result', (data: SCodeRunResultEvent) => {
      console.log('code_run_result', data.payload);
      socket.to(roomId).emit('code_run_result', data);
    });

    socket.on('draw_change', (data: any) => {
      console.log('draw_change');
      socket.to(roomId).emit('draw_change', data);
    });

    // socket.on('codeselectionchange', (range: any) => {
    //   console.log('range', range);
    //   socket.to(roomId).emit('codeselectionchange', range);
    // });

    socket.on('chatmessage', (data: any) => {
      socket.to(roomId).emit('chatmessage', data);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('userleft', userName);
    });
  });
};

main();
