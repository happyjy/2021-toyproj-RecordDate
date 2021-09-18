import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Signin from './Pages/Signin';
import NotFound from './Pages/NotFound';
import Error from './Pages/Error';
import ErrorBoundary from 'react-error-boundary';
import { ConnectedRouter } from 'connected-react-router';

import DateRecordDetail from './Pages/DateRecordDetail';
import DateRecordEdit from './Pages/DateRecordEdit';
import DateRecordAdd from './Pages/DateRecordAdd';
import Couple from './Pages/Couple';
import { history } from './redux/create';
import { HEADERMENU } from './Constants';
declare global {
  interface Window {
    kakao: any;
    Kakao: any;
  }
}

const App = () => (
  <ErrorBoundary FallbackComponent={Error}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/couple" component={Couple} />
        <Route
          exact
          path={'/' + HEADERMENU.ADDDATERECORD}
          component={DateRecordAdd}
        />
        <Route
          exact
          path={'/' + HEADERMENU.DATERECORD + '/:id'}
          component={DateRecordDetail}
        />
        <Route
          exact
          path={'/' + HEADERMENU.EDITDATERECORD + '/:id'}
          component={DateRecordEdit}
        />
        <Route exact path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </ConnectedRouter>
  </ErrorBoundary>
);

export default App;
