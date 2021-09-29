import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';

import { RootState } from '../../redux/modules/rootReducer';
import { logout as logoutSaga } from '../../redux/modules/auth';

import { addDaterecord as addDateRecordSaga } from '../../redux/modules/dateRecord';
import { DateRecordReqType } from '../../types';
import DateRecordAdd from '../../Components/DateRecord/DateRecordAdd';
import { loading as dateRecordLoading } from '../../redux/modules/dateRecord';
import ToDateList from '../../Components/ToDateList/ToDateList';

const ToDateListContainer = () => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.dateRecord.loading,
  );

  const error = useSelector<RootState, Error | null>(
    (state) => state.dateRecord.error,
  );

  const dispatch = useDispatch();

  const setDateRecordLoading = useCallback(
    (isLoading) => {
      dispatch(dateRecordLoading(isLoading));
    },
    [dispatch],
  );

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
    <ToDateList
      addDateRecord={addDateRecord}
      setDateRecordLoading={setDateRecordLoading}
      loading={loading}
      error={error}
      back={back}
      logout={logout}
    />
  );
};

export default ToDateListContainer;
