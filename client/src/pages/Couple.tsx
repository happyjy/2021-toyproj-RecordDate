import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';
import DateRecordCoupleContainer from '../Containers/DateRecord/DateRecordCoupleContainer';

const Couple = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DateRecordCoupleContainer />;
};

export default Couple;
