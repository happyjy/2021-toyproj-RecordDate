import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../Hooks/useToken';
import ToDateListContainer from '../Containers/ToDateList/ToDateListContainer';

const Add = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <ToDateListContainer />;
};

export default Add;
