import {call, put, takeLatest} from 'redux-saga/effects';

import {LOGIN, LOGIN_SUCCESS, LOGIN_ERROR} from '../constants';
import {createNewSession, registerUser} from '../../api/axios';

function* loginFlow(action) {
  const {payload} = action;
  try {
    yield call(registerUser, payload);
    const session = yield call(createNewSession);
    yield put({
      type: LOGIN_SUCCESS,
      payload: session,
    });
  } catch (e) {
    yield put({type: LOGIN_ERROR, payload: {isLoading: false}});
  }
}

function* authFlow() {
  yield takeLatest(LOGIN, loginFlow);
}

export default authFlow;
