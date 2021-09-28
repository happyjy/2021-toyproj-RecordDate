import { all } from 'redux-saga/effects';

import { sagas as authSagas } from './auth';
import { sagas as dateRecordListSagas } from './dateRecord';

export default function* rootSaga() {
  yield all([authSagas(), dateRecordListSagas()]);
}
