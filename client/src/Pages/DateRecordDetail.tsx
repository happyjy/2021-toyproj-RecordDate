import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../Hooks/useToken';
import DateRecordDetailContainer from '../Containers/DateRecord/DateRecordDetailContainer';

const Detail = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateRecordDetailContainer />;
};

export default Detail;
