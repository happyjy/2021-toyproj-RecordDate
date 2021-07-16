import { push } from 'connected-react-router';
import { AnyAction } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import DateRecordService from '../../services/DateRecordService';
import {
  DateRecordReqType,
  DateResType,
  DateResType2,
  dateType,
} from '../../types';
import { getBooksFromState, getTokenFromState } from '../utils';

export interface DateRecordState {
  dateRecordList: dateType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: DateRecordState = {
  dateRecordList: null,
  loading: true,
  error: null,
};

const options = {
  prefix: 'record-date/dateRecordList',
};

// action creator
export const { success, pending, fail } = createActions(
  {
    SUCCESS: (dateRecordList) => ({ dateRecordList }),
  },
  'PENDING',
  'FAIL',
  options,
);

const reducer = handleActions<DateRecordState, any>(
  {
    PENDING: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
    SUCCESS: (state, action) => {
      // debugger;
      console.log('SUCCESS: ', { state, action });
      return {
        dateRecordList: action.payload.dateRecordList,
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

export const { addDaterecord, getDatelist } = createActions(
  {
    ADD_DATERECORD: (dateRecord: DateRecordReqType) => ({
      dateRecord,
    }),
  },
  'GET_DATELIST',
  options,
);

console.log({ addDaterecord, getDatelist });

export function* sagas() {
  yield takeEvery(`${options.prefix}/GET_DATELIST`, getDateListSaga);
  yield takeEvery(`${options.prefix}/ADD_DATERECORD`, addDateSaga);
}

function* getDateListSaga() {
  try {
    yield put(pending());
    const token: string = yield select((state) => state.auth.token);
    const dateRecordList: DateResType[] = yield call(
      DateRecordService.getDateRecordList,
      token,
    );
    yield put(success(dateRecordList));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

//[?]
interface AddDateRecordSagaAction extends AnyAction {
  payload: {
    dateRecord: DateRecordReqType;
  };
}

function* addDateSaga(action: AddDateRecordSagaAction) {
  try {
    yield put(pending());
    //[?] getTokenFromState 인자값은 어떻게...?
    const token: string = yield select(getTokenFromState);
    const dateRecord: DateRecordReqType = yield call(
      DateRecordService.addDateRecord,
      token,
      action.payload.dateRecord,
    );
    //[?] getBooksFromState 인자값은 어떻게...?
    const dateRecordList: dateType[] = yield select(getBooksFromState);
    console.log({ dateRecordList });
    yield put(success([...dateRecordList, dateRecord]));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
