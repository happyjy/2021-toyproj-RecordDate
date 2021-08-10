import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import DateRecordList from '../../components/DateRecord/DateRecordList';
import { RootState } from '../../redux/modules/rootReducer';
import { dateType } from '../../types';
import { logout as logoutSaga } from '../../redux/modules/auth';

import {
  getDatelist as getDateListSaga,
  deleteDaterecord as deleteDateRecordSaga,
} from '../../redux/modules/dateRecord';

const DateRecordListContainer: React.FC = (props) => {
  const dateRecordList = useSelector<RootState, dateType[] | null>(
    (state) => state.dateRecord.dateRecordList,
  );
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );

  const dispatch = useDispatch();

  const getDateList = useCallback(() => {
    dispatch(getDateListSaga());
  }, [dispatch]);

  const deleteRecordDate = useCallback(
    (dateRecordId: number) => {
      dispatch(deleteDateRecordSaga(dateRecordId));
    },
    [dispatch],
  );

  const goAdd = useCallback(() => {
    dispatch(push('/addDateRecord'));
  }, [dispatch]);

  const goEdit = useCallback(
    (dateRecordId: number) => {
      dispatch(push(`/editDateRecord/${dateRecordId}`));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  return (
    <DateRecordList
      {...props}
      dateRecordList={dateRecordList}
      loading={loading}
      error={error}
      getDateList={getDateList}
      deleteRecordDate={deleteRecordDate}
      goAdd={goAdd}
      goEdit={goEdit}
      logout={logout}
    />
  );
};

export default DateRecordListContainer;
