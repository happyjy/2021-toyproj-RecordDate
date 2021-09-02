import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './Modules/rootReducer';
import rootSaga from './Modules/rootSaga';
import TokenService from '../Services/TokenService';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware(); // 2. saga 미들웨어 생성

const Create = () => {
  const token = TokenService.get();

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

export default Create;
