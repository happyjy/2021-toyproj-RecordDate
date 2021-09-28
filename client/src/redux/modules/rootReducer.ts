import { combineReducers, AnyAction, Reducer } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';

import dateRecord, { DateRecordState } from './dateRecord';
import auth, { AuthState } from './auth';

export interface RootState {
  dateRecord: DateRecordState;
  auth: AuthState;
  router: Reducer<RouterState<unknown>, AnyAction>;
}

const rootReducer = (history: History<unknown>) =>
  combineReducers({
    dateRecord,
    auth,
    router: connectRouter(history),
  });

export default rootReducer;
