import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';
import ListContainer from '../containers/ListContainer';
import DateListContainer from '../containers/DateListContainer';

const Home: React.FC = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateListContainer />;
};

export default Home;
