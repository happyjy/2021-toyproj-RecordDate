import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Add from './Pages/Add';
import Signin from './Pages/Signin';
import NotFound from './Pages/NotFound';
import Error from './Pages/Error';
import ErrorBoundary from 'react-error-boundary';
import { ConnectedRouter } from 'connected-react-router';
import Detail from './Pages/Detail';
import Edit from './Pages/Edit';

import DateRecordDetail from './Pages/DateRecordDetail';
import DateRecordEdit from './Pages/DateRecordEdit';
import DateRecordAdd from './Pages/DateRecordAdd';
import Couple from './Pages/Couple';
import { history } from './Redux/create';
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
        <Route exact path="/couple" component={Couple} />

        <Route exact path="/dateRecord/:id" component={DateRecordDetail} />
        <Route exact path="/addDateRecord" component={DateRecordAdd} />
        <Route exact path="/editDateRecord/:id" component={DateRecordEdit} />
        <Route exact path="/" component={Home} />
        {/* <Route exact path="/" component={DateRecordAdd} /> */}
        <Route component={NotFound} />
      </Switch>
    </ConnectedRouter>
  </ErrorBoundary>
);

export default App;
