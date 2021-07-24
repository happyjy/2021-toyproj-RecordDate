import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';
import DateRecordEditContainer from '../containers/dateRecord/DateRecordEditContainer';

const Edit = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateRecordEditContainer />;
};

export default Edit;
