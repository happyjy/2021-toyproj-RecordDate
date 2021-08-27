import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';
import TokenService from '../services/TokenService';
import UserService from '../services/UserService';
import { getUserResType } from '../types';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware(); // 2. saga 미들웨어 생성

const create = () => {
  const token = TokenService.get();

  // let user: getUserResType;
  // if (token) {
  //   // user = UserService.getUserByToken(token);
  //   UserService.getUserByToken(token);
  // }
  // debugger;

  const store = createStore(
    rootReducer(history),
    {
      auth: {
        token,
        user: null,
        loading: false,
        error: null,
      },
    },
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), sagaMiddleware),
    ),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export default create;
