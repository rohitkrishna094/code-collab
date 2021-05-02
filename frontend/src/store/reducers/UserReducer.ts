import { USER_TYPES } from '../../actionTypes';

const initialState = {};

const UserReducer = (state: any = initialState, action: any) => {
  const { type, payload } = action;
  if (type === USER_TYPES.A_USERNAME_CHANGE) {
    return { ...state, userName: payload.name };
  }
  return state;
};

export default UserReducer;
