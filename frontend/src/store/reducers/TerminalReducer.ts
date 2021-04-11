import { cloneDeep } from 'lodash';
import { STDOUT_TYPES } from '../../actionTypes';

export const initialTerminalState = [
  {
    type: STDOUT_TYPES.A_MESSAGE,
    payload: {
      data: 'Environment is ready, just click run button and enjoy!',
    },
  },
];

const TerminalReducer = (state: any, action: any) => {
  const { type, payload } = action;
  const newState = cloneDeep(state);
  if (type === STDOUT_TYPES.A_MESSAGE) {
    const { data } = payload;
    newState.push({ type: STDOUT_TYPES.A_MESSAGE, payload: { data } });
    return newState;
  } else if (type === STDOUT_TYPES.A_CODE_RUN) {
    const { userName: userWhoRan, langId } = payload;
    newState.push({
      type: STDOUT_TYPES.A_CODE_RUN,
      payload: { userName: userWhoRan, langId },
    });
    return newState;
  } else if (type === STDOUT_TYPES.A_CODE_RUN_RESULT) {
    const { result } = payload;
    newState.push({
      type: STDOUT_TYPES.A_CODE_RUN_RESULT,
      payload: { result },
    });
    return newState;
  } else if (type === STDOUT_TYPES.A_LANGUAGE_CHANGE) {
    const { userName: userWhoChanged, language } = payload;
    newState.push({
      type: STDOUT_TYPES.A_LANGUAGE_CHANGE,
      payload: { userName: userWhoChanged, language },
    });
    return newState;
  }
  return state;
};

export default TerminalReducer;
