import {spawn} from 'redux-saga/effects';
import authFlow from './auth';

function* rootSaga() {
  yield spawn(authFlow);
}

export default rootSaga;
