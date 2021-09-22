import { AnyAction } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import {
  getUserReqType,
  getUserResType,
  LoginReqType,
  reqAcceptCoupleType,
  requsetCoupleReqType,
  SnsLoginReqType,
} from '../../types';
import { getTokenFromState } from '../utils';
import { success as booksSuccess } from './books';
import UserService from '../../Services/UserService';
import TokenService from '../../Services/TokenService';
import produce from 'immer';

export interface AuthState {
  token: string | null;
  user: getUserResType[] | null; //# index1: own, # index2: partner
  loading: boolean;
  error: Error | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const options = {
  prefix: 'dateRecord/auth',
};

export const {
  success,
  successrequestcouple,
  successacceptcouple,
  pending,
  fail,
} = createActions(
  {
    SUCCESS: (token: string, user: getUserResType) => ({
      token,
      user,
    }),
    SUCCESSREQUESTCOUPLE: (token: string, user: getUserResType) => ({
      token,
      user,
    }),
    SUCCESSACCEPTCOUPLE: (coupleStatus: number) => ({
      coupleStatus,
    }),
  },
  'PENDING',
  'FAIL',
  options,
);

const reducer = handleActions<AuthState, any>(
  {
    SUCCESS: (state, action) => {
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    },
    SUCCESSREQUESTCOUPLE: (state, action) => {
      // immer(불변성관리) library 적용
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
      };

      // return produce(state, (draft) => {
      //   if (draft && draft.user) {
      //     draft.user[0].couple_id = action.payload.user[0].couple_id;
      //     draft.user[0].couple_status = action.payload.user[0].couple_status;
      //   }
      // });
    },
    SUCCESSACCEPTCOUPLE: (state, action) => {
      // immer(불변성관리) library 적용
      return produce(state, (draft) => {
        if (draft && draft.user) {
          draft.user[0].couple_status = action.payload.coupleStatus;
          draft.user[1].couple_status = action.payload.coupleStatus;
        }
      });
    },
    PENDING: (state) => ({
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

export const { acceptcouple, requestcouple, getuser, snslogin, login, logout } =
  createActions(
    {
      ACCEPTCOUPLE: (reqAcceptCouple: reqAcceptCoupleType) => reqAcceptCouple,
      REQUESTCOUPLE: (reqCoupleUsers: requsetCoupleReqType) => reqCoupleUsers,
      GETUSER: (token: String) => ({
        token,
      }),
      SNSLOGIN: ({
        email,
        nickname,
        birthday,
        gender,
        profileImageUrl,
        thumbnailImageUrl,
      }: SnsLoginReqType) => ({
        email,
        nickname,
        birthday,
        gender,
        profileImageUrl,
        thumbnailImageUrl,
      }),
      LOGIN: ({ email, password }: LoginReqType) => ({
        email,
        password,
      }),
    },
    'LOGOUT',
    options,
  );

export function* sagas() {
  yield takeEvery(`${options.prefix}/ACCEPTCOUPLE`, acceptCoupleSaga);
  yield takeEvery(`${options.prefix}/REQUESTCOUPLE`, requestCoupleSaga);
  yield takeEvery(`${options.prefix}/GETUSER`, getUserSaga);
  yield takeEvery(`${options.prefix}/SNSLOGIN`, snsLoginSaga);
  yield takeEvery(`${options.prefix}/LOGOUT`, logoutSaga);
}

interface acceptCoupleSagaAction extends AnyAction {
  payload: reqAcceptCoupleType;
}

function* acceptCoupleSaga(action: acceptCoupleSagaAction) {
  try {
    yield put(pending());
    const result: reqAcceptCoupleType = yield call(
      UserService.acceptCouple,
      action.payload,
    );
    console.log('### acceptCoupleSaga', { result });
    console.log('### acceptCoupleSaga', {
      'action.payload.status': action.payload.status,
    });
    yield put(successacceptcouple(action.payload.status));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface requestCoupleSagaAction extends AnyAction {
  payload: requsetCoupleReqType;
}

function* requestCoupleSaga(action: requestCoupleSagaAction) {
  try {
    yield put(pending());
    const requestCoupleResResult: getUserResType[] = yield call(
      UserService.requestCouple,
      action.payload,
    );
    yield put(
      successrequestcouple(action.payload.token, requestCoupleResResult),
    );
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

interface getUserSagaAction extends AnyAction {
  payload: getUserReqType;
}

function* getUserSaga(action: getUserSagaAction) {
  try {
    yield put(pending());
    const coupleUsers: getUserResType[] = yield call(
      UserService.getUserByToken,
      action.payload.token,
    );
    yield put(success(action.payload.token, coupleUsers));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}
interface SnsLoginSagaAction extends AnyAction {
  payload: SnsLoginReqType;
}

function* snsLoginSaga(action: SnsLoginSagaAction) {
  try {
    yield put(pending());
    const token: string = yield call(UserService.snsLogin, action.payload);
    TokenService.set(token);
    yield put(success(token));
    yield put(push('/'));
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || 'UNKNOWN_ERROR')));
  }
}

function* logoutSaga() {
  try {
    yield put(booksSuccess(null));
    yield put(pending());
    const token: string = yield select(getTokenFromState);
    yield call(UserService.logout, token);
  } catch (error) {
    console.log(error);
  } finally {
    TokenService.remove();
    yield put(success(null));
  }
}
