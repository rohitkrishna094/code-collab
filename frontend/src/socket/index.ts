import io from 'socket.io-client';
import { baseUrl } from './../api/apiInfo';

export const socket = io.connect(baseUrl);
