import {LOGIN} from '../constants';

export const login = data => {
  return {
    type: LOGIN,
    payload: {...data},
  };
};
