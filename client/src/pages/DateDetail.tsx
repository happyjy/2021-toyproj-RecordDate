import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';
import DateDetailContainer from '../containers/DateDetailContainer';

const Detail = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateDetailContainer />;
};

export default Detail;
