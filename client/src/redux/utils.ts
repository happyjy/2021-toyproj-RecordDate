import { RootState } from './modules/rootReducer';
import { BookResType, dateType } from '../types';

export function getTokenFromState(state: RootState): string | null {
  return state.auth.token;
}

export function getDateRecordFromState(state: RootState): dateType[] | null {
  return state.dateRecord.dateRecordList;
}

export function getBooksFromState(state: RootState): BookResType[] | null {
  return state.books.books;
}
