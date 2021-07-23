import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';

import { RootState } from '../redux/modules/rootReducer';
import { logout as logoutSaga } from '../redux/modules/auth';

import { addDaterecord as addDateRecordSaga } from '../redux/modules/dateRecord';
import { DateRecordReqType } from '../types';
import AddDateRecord from '../components/AddDateRecord';

const AddDateRecordContainer = () => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );
  const dispatch = useDispatch();

  const addDateRecord = useCallback(
    (addDateRecord: DateRecordReqType) => {
      dispatch(addDateRecordSaga(addDateRecord));
    },
    [dispatch],
  );

  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  return (
    <AddDateRecord
      addDateRecord={addDateRecord}
      loading={loading}
      error={error}
      back={back}
      logout={logout}
    />
  );
};

export default AddDateRecordContainer;
