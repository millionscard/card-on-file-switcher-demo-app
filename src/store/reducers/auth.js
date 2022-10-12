import {LOGIN_SUCCESS, LOGIN_ERROR} from '../constants';

const initialState = {
  sessionId: null,
};

const auth = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        sessionId: payload.session,
      };
    case LOGIN_ERROR:
      return {...state, ...payload};
    default:
      return state;
  }
};

export default auth;
