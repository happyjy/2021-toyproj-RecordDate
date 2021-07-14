import { createActions, handleActions } from 'redux-actions';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import DateService from '../../services/DateListService';
import { DateResType } from '../../types';

export interface DateListState {
  dateList: DateResType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: DateListState = {
  dateList: null,
  loading: true,
  error: null,
};

const options = {
  prefix: 'record-date/dateList',
};

// action creator
export const { success, pending, fail } = createActions(
  {
    SUCCESS: (dateList) => ({ dateList }),
  },
  'PENDING',
  'FAIL',
  options,
);

const reducer = handleActions<DateListState, any>(
  {
    PENDING: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => {
      debugger;
      console.log('SUCCESS: ', { state, action });
      return {
        dateList: action.payload.dateList,
        loading: false,
        error: null,
      };
    },
    FAIL: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
  initialState,
  options,
);

export default reducer;

export const { getDatelist } = createActions({}, 'GET_DATELIST', options);

export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_DATELIST`, getDateListSaga);
}

function* getDateListSaga() {
  try {
    yield put(pending());
    const token: string = yield select((state) => state.auth.token);
    const dateList: DateResType[] = yield call(DateService.getDateList, token);
    yield put(success(dateList));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
