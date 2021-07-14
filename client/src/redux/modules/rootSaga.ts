import { all } from 'redux-saga/effects';

import { sagas as authSagas } from './auth';
import { sagas as booksSagas } from './books';
import { sagas as dateList } from './dateList';

export default function* rootSaga() {
  yield all([authSagas(), booksSagas(), dateList()]);
}
