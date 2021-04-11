import { cloneDeep } from 'lodash';
import { CHAT_TYPES, STDOUT_TYPES } from '../../actionTypes';

const ChatReducer = (state: any, action: any) => {
  const { type, payload } = action;
  const newState = cloneDeep(state);
  if (type === CHAT_TYPES.A_SENT_MESSAGE) {
    newState.push({ type: CHAT_TYPES.A_SENT_MESSAGE, payload });
    return newState;
  }
  return state;
};

export default ChatReducer;
