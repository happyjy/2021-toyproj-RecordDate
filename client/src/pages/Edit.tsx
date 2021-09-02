import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../Hooks/useToken';
import EditContainer from '../Containers/EditContainer';

const Edit = () => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <EditContainer />;
};

export default Edit;
