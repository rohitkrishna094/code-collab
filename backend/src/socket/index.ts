import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

// socket io event input types, S stands for socket io
interface SJoinRoomEventInput {
  room: string;
  name: string;
}

interface SLanguageChangeEventInput {
  id: number;
  mode: string;
  codeValue: string;
  userName: string;
}

interface SCodeRunEventInput {
  type: string;
  payload: { userName: string; langId: number };
}

interface SCodeRunResultEventInput {
  type: string;
  payload: { result: string };
}

// socket io event constants
const USER_JOIN = 'userjoin';
const CODE_CHANGE = 'codechange';
const LANGUAGE_CHANGE = 'language_change';
const CODE_RUN = 'code_run';
const CODE_RUN_RESULT = 'code_run_result';
const USER_LEFT = 'userleft';

export default (server: Server) => {
  const io = new SocketServer(server, {
    cors: { origin: '*' },
    pingTimeout: 60000,
    pingInterval: 120000
  });

  io.on('connection', (socket) => {
    let roomId = '0';
    let userName = '';

    // joining in a room
    socket.on(USER_JOIN, (data: SJoinRoomEventInput) => {
      console.log(USER_JOIN, data);
      roomId = data.room;
      userName = data.name;
      socket.join(roomId);
      socket.to(roomId).emit(USER_JOIN, userName);
    });

    socket.on(CODE_CHANGE, (message: any) => {
      console.log(CODE_CHANGE);
      socket.to(roomId).emit(CODE_CHANGE, message);
    });

    socket.on(LANGUAGE_CHANGE, (data: SLanguageChangeEventInput) => {
      console.log(LANGUAGE_CHANGE, data.id, data.mode, data.userName);
      socket.to(roomId).emit(LANGUAGE_CHANGE, data);
    });

    socket.on(CODE_RUN, (data: SCodeRunEventInput) => {
      console.log(CODE_RUN, data.payload);
      socket.to(roomId).emit(CODE_RUN, data);
    });

    socket.on(CODE_RUN_RESULT, (data: SCodeRunResultEventInput) => {
      console.log(CODE_RUN_RESULT, data.payload);
      socket.to(roomId).emit(CODE_RUN_RESULT, data);
    });

    // socket.on('codeselectionchange', (range: any) => {
    //   console.log('range', range);
    //   socket.to(roomId).emit('codeselectionchange', range);
    // });

    socket.on('chatmessage', (data: any) => {
      socket.to(roomId).emit('chatmessage', data);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit(USER_LEFT, userName);
    });
  });
};
