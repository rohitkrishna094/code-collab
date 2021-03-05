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
