import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../Hooks/useToken';
import DateRecordEditContainer from '../Containers/DateRecord/DateRecordEditContainer';

const Edit = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateRecordEditContainer />;
};

export default Edit;
