import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../Hooks/useToken';
import DateRecordAddContainer from '../Containers/DateRecord/DateRecordAddContainer';

const Add = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateRecordAddContainer />;
};

export default Add;
