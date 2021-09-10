import { push } from 'connected-react-router';
import { AnyAction } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import DateRecordService from '../../Services/DateRecordService';
import {
  DateRecordReqType,
  DateResType,
  dateRecordListExtendType,
  EditDateRecordReqType,
  searchOptionType,
} from '../../types';
import { getDateRecordFromState, getTokenFromState } from '../utils';

export interface DateRecordState {
  dateRecordList: dateRecordListExtendType[] | null;
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
    SUCCESS: (state, action) => ({
      dateRecordList: action.payload.dateRecordList,
      loading: false,
      error: null,
    }),
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

export const { addDaterecord, getDatelist, deleteDaterecord, editDaterecord } =
  createActions(
    {
      ADD_DATERECORD: (dateRecord: DateRecordReqType) => ({
        dateRecord,
      }),
      EDIT_DATERECORD: (
        dateRecordId: number,
        dateRecord: DateRecordReqType,
      ) => ({
        dateRecordId,
        dateRecord,
      }),
      DELETE_DATERECORD: (dateRecordId: number) => ({ dateRecordId }),
      GET_DATELIST: (searchOption: searchOptionType) => {
        return { searchOption };
      },
    },
    options,
  );

// console.log({
//   addDaterecord: addDaterecord(),
//   getDatelist: getDatelist(),
//   editDaterecord: editDaterecord(),
//   deleteDaterecord: deleteDaterecord(),
// });

export function* sagas() {
  yield takeEvery(`${options.prefix}/ADD_DATERECORD`, addDateRecordSaga);
  yield takeEvery(`${options.prefix}/GET_DATELIST`, getDateListSaga);
  yield takeEvery(`${options.prefix}/EDIT_DATERECORD`, editDateRecord);
  yield takeEvery(`${options.prefix}/DELETE_DATERECORD`, deleteDateRecord);
}

interface AddDateRecordSagaAction extends AnyAction {
  payload: {
    dateRecord: DateRecordReqType;
  };
}

function* addDateRecordSaga(action: AddDateRecordSagaAction) {
  try {
    yield put(pending());
    //[ ] getTokenFromState 인자값은 어떻게 관리되는지 분석글 작성하기
    const token: string = yield select(getTokenFromState);
    // const dateRecord: dateRecordListExtendType = yield call(
    yield call(
      DateRecordService.addDateRecord,
      token,
      action.payload.dateRecord,
    );
    //[ ] getDateRecordFromState 인자값은 어떻게 관리되는지 분석글 작성하기
    const dateRecordList: dateRecordListExtendType[] = yield select(
      getDateRecordFromState,
    );
    console.log({ dateRecordList });
    // [todo] response data structure 맞춰 success 완성 시키기
    // yield put(success([...dateRecordList, dateRecord]));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface getDateListSagaAction extends AnyAction {
  payload: {
    searchOption: searchOptionType;
  };
}

function* getDateListSaga(action: getDateListSagaAction) {
  try {
    yield put(pending());
    const token: string = yield select((state) => state.auth.token);
    const dateRecordList: dateRecordListExtendType[] = yield call(
      DateRecordService.getDateRecordList,
      token,
      action.payload.searchOption,
    );
    yield put(success(dateRecordList));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface EditDateRecordSagaAction extends AnyAction {
  payload: {
    dateRecordId: number;
    dateRecord: EditDateRecordReqType;
  };
}
function* editDateRecord(action: EditDateRecordSagaAction) {
  try {
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    const newDateRecord: dateRecordListExtendType = yield call(
      DateRecordService.editDateRecord,
      token,
      action.payload.dateRecordId,
      action.payload.dateRecord,
    );
    const dateRecordList: DateResType[] = yield select(getDateRecordFromState);
    newDateRecord.dateCnt = dateRecordList[0].dateCnt;
    const newResult = dateRecordList.map((dateRecord) => {
      if (dateRecord.dateRecord_id === newDateRecord.dateRecord_id) {
        newDateRecord.dateCnt = dateRecord.dateCnt;
        return newDateRecord;
      } else {
        return dateRecord;
      }
    });
    yield put(success(newResult));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface DeletedDateRecordAction extends AnyAction {
  payload: {
    dateRecordId: number;
  };
}

function* deleteDateRecord(action: DeletedDateRecordAction) {
  try {
    const { dateRecordId } = action.payload;
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    yield call(DateRecordService.deleteDateRecord, token, dateRecordId);
    const dateRecordList: DateResType[] = yield select(getDateRecordFromState);
    yield put(
      success(
        dateRecordList.filter(
          (dateRecord) => dateRecord.dateRecord_id !== dateRecordId,
        ),
      ),
    );
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
