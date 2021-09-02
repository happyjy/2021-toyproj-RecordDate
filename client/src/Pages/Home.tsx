import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../Hooks/useToken';
import DateListContainer from '../Containers/DateRecord/DateRecordListContainer';

const Home: React.FC = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateListContainer />;
};

export default Home;
