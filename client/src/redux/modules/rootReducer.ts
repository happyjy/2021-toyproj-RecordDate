import { combineReducers, AnyAction, Reducer } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';

import dateList, { DateListState } from './dateList';
import books, { BooksState } from './books';
import auth, { AuthState } from './auth';

export interface RootState {
  dateList: DateListState;
  books: BooksState;
  auth: AuthState;
  router: Reducer<RouterState<unknown>, AnyAction>;
}

const rootReducer = (history: History<unknown>) =>
  combineReducers({
    dateList,
    books,
    auth,
    router: connectRouter(history),
  });

export default rootReducer;
