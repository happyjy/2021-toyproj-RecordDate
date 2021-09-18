import { push } from 'connected-react-router';
import { AnyAction } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { call, put, select, takeEvery, delay } from 'redux-saga/effects';
import DateRecordService from '../../Services/DateRecordService';
import {
  DateRecordReqType,
  DateResType,
  dateRecordListExtendType,
  EditDateRecordReqType,
  searchOptionType,
  paginationType,
  dateRecordListPaginatedType,
} from '../../types';
import { getDateRecordFromState, getTokenFromState } from '../utils';

/*
  # dateRecord redux
*/

export interface DateRecordState {
  dateRecordList: dateRecordListExtendType[] | null;
  dateRecordListRowCount: number;
  loading: boolean;
  error: Error | null;
}

const initialState: DateRecordState = {
  dateRecordList: null,
  dateRecordListRowCount: 0,
  loading: true,
  error: null,
};

const options = {
  prefix: 'record-date/dateRecordList',
};

export const { success, pending, fail } = createActions(
  {
    SUCCESS: (dateRecordList, dateRecordListRowCount) => ({
      dateRecordList,
      dateRecordListRowCount,
    }),
  },
  'PENDING',
  'FAIL',
  options,
);

const reducer = handleActions<DateRecordState, any>(
  {
    SUCCESS: (state, action) => {
      return {
        dateRecordList: action.payload.dateRecordList,
        dateRecordListRowCount: action.payload.dateRecordListRowCount,
        loading: false,
        error: null,
      };
    },
    PENDING: (state, action) => ({
      ...state,
      loading: true,
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

/*
# dateRecord saga
*/
export const {
  addDaterecord,
  getDatelistpaginated,
  getDatelist,
  deleteDaterecord,
  editDaterecord,
} = createActions(
  {
    ADD_DATERECORD: (dateRecord: DateRecordReqType) => ({
      dateRecord,
    }),
    GET_DATELISTPAGINATED: (
      searchOption: searchOptionType,
      pagination: paginationType,
    ) => {
      return { searchOption, pagination };
    },
    GET_DATELIST: (searchOption: searchOptionType) => {
      return { searchOption };
    },
    EDIT_DATERECORD: (dateRecordId: number, dateRecord: DateRecordReqType) => ({
      dateRecordId,
      dateRecord,
    }),
    DELETE_DATERECORD: (dateRecordId: number) => ({ dateRecordId }),
  },
  options,
);

export function* sagas() {
  yield takeEvery(`${options.prefix}/ADD_DATERECORD`, addDateRecordSaga);
  yield takeEvery(
    `${options.prefix}/GET_DATELISTPAGINATED`,
    getDateListPaginatedSaga,
  );
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
    const token: string = yield select(getTokenFromState);
    // const dateRecord: dateRecordListExtendType = yield call(
    yield call(
      DateRecordService.addDateRecord,
      token,
      action.payload.dateRecord,
    );
    const dateRecordList: dateRecordListExtendType[] = yield select(
      getDateRecordFromState,
    );
    console.log({ dateRecordList });
    // [todo] response data structure 맞춰 success 완성 시키기
    // yield put(success([...dateRecordList, dateRecord]));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error.response.data.error || 'UNKNOWN_ERROR')));
  }
}

interface getDateListPaginatedSagaAction extends AnyAction {
  payload: {
    searchOption: searchOptionType;
    pagination: paginationType;
  };
}

function* getDateListPaginatedSaga(action: getDateListPaginatedSagaAction) {
  try {
    yield put(pending());
    const token: string = yield select((state) => state.auth.token);
    const dateRecordList: dateRecordListPaginatedType = yield call(
      DateRecordService.getDateRecordListPaginated,
      token,
      action.payload.searchOption,
      action.payload.pagination,
    );
    const dateRecordListFromState: dateRecordListExtendType[] = yield select(
      getDateRecordFromState,
    );
    // yield delay(30000000);
    const gridCurrentPage = action.payload.pagination.gridCurrentPage;
    yield put(
      success(
        gridCurrentPage === 0
          ? dateRecordList.dateRecordList
          : [...dateRecordListFromState, ...dateRecordList.dateRecordList],
        dateRecordList.dateRecordListRowCount,
      ),
    );
  } catch (error) {
    yield put(fail(new Error(error.response.data.error || 'UNKNOWN_ERROR')));
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
    yield put(fail(new Error(error.response.data.error || 'UNKNOWN_ERROR')));
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
    // yield delay(3000);
    yield put(success(newResult));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error.response.data.error || 'UNKNOWN_ERROR')));
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
    yield put(fail(new Error(error.response.data.error || 'UNKNOWN_ERROR')));
  }
}
