import io from 'socket.io-client';
import { baseUrl } from './../api/apiInfo';

export const socket = io.connect(baseUrl);

// socket io event constants
export const USER_JOIN = 'userjoin';
export const CODE_CHANGE = 'codechange';
export const LANGUAGE_CHANGE = 'language_change';
export const CODE_RUN = 'code_run';
export const CODE_RUN_RESULT = 'code_run_result';
export const USER_LEFT = 'userleft';
export const CHAT_MESSAGE_SENT = 'chat_message_sent';

// socket io event types, S stands for socket io
export interface SLanguageChangeEvent {
  id: number;
  mode: string;
  codeValue: string;
  userName: string;
}
export interface SCodeRunEvent {
  type: string;
  payload: { userName: string; langId: number };
}

export interface SCodeRunResultEvent {
  type: string;
  payload: { result: string };
}

export interface SChatMessageSentEventInput {
  type: string;
  payload: { userName: string; msg: string };
}
