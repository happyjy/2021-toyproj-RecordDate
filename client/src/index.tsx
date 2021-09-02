import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import './dyCalendar.css';
import './dyCalendarCustomStyling.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Create from './Redux/Create';
import { Provider } from 'react-redux';
import dotenv from 'dotenv';

dotenv.config();

/* init kakao map, login  */
// kaako map
// const kakaoMapScript = document.createElement('script');
// kakaoMapScript.type = 'text/javascript';
// kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&libraries=services,clusterer,drawing`;
// document.head.appendChild(kakaoMapScript);

// kaako login
window.Kakao.init(process.env.REACT_APP_KAKAO_MAP_KEY);

const store = Create();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
