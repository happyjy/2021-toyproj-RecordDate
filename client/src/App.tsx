import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import Add from './pages/Add';
import Signin from './pages/Signin';
import NotFound from './pages/NotFound';
import Error from './pages/Error';
import ErrorBoundary from 'react-error-boundary';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './redux/create';
import Detail from './pages/Detail';
import Edit from './pages/Edit';

import DateRecordDetail from './pages/DateRecordDetail';
import DateRecordEdit from './pages/DateRecordEdit';
import AddDateRecord from './pages/AddDateRecord';
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
        <Route exact path="/edit/:id" component={Edit} />
        <Route exact path="/book/:id" component={Detail} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/add" component={Add} />

        <Route exact path="/dateRecord/:id" component={DateRecordDetail} />
        <Route exact path="/addDateRecord" component={AddDateRecord} />
        <Route exact path="/editDateRecord/:id" component={DateRecordEdit} />
        <Route exact path="/" component={Home} />
        {/* <Route exact path="/" component={AddDateRecord} /> */}
        <Route component={NotFound} />
      </Switch>
    </ConnectedRouter>
  </ErrorBoundary>
);

export default App;
