import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import { RootState } from '../../redux/modules/rootReducer';
import {
  dateRecordListExtendType,
  paginationType,
  searchOptionType,
} from '../../types';
import { logout as logoutSaga } from '../../redux/modules/auth';

import {
  getDatelistpaginated as getDateListPaginatedSaga,
  getDatelist as getDateListSaga,
  deleteDaterecord as deleteDateRecordSaga,
} from '../../redux/modules/dateRecord';
import DateRecordList from '../../Components/DateRecord/DateRecordList';

const DateRecordListContainer: React.FC = (props) => {
  const dateRecordList = useSelector<
    RootState,
    dateRecordListExtendType[] | null
  >((state) => state.dateRecord.dateRecordList);

  const dateRecordListRowCount = useSelector<RootState, number>(
    (state) => state.dateRecord.dateRecordListRowCount,
  );
  const dateRecordListCurrentPage = useSelector<RootState, number>(
    (state) => state.dateRecord.dateRecordListCurrentPage,
  );
  const dateRecordListScrollTop = useSelector<RootState, number>(
    (state) => state.dateRecord.dateRecordListScrollTop,
  );
  const loading = useSelector<RootState, boolean>(
    (state) => state.dateRecord.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.dateRecord.error,
  );

  const dispatch = useDispatch();

  const getDateListPaginated = useCallback(
    (searchOption: searchOptionType, pagination: paginationType) => {
      dispatch(getDateListPaginatedSaga(searchOption, pagination));
    },
    [dispatch],
  );

  const getDateList = useCallback(
    (searchOption: searchOptionType) => {
      dispatch(getDateListSaga(searchOption));
    },
    [dispatch],
  );

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
    window.Kakao.Auth.logout();
  }, [dispatch]);

  return (
    <DateRecordList
      {...props}
      dateRecordListRowCount={dateRecordListRowCount}
      dateRecordListCurrentPage={dateRecordListCurrentPage}
      dateRecordListScrollTop={dateRecordListScrollTop}
      dateRecordList={dateRecordList}
      loading={loading}
      error={error}
      getDateListPaginated={getDateListPaginated}
      getDateList={getDateList}
      deleteRecordDate={deleteRecordDate}
      goAdd={goAdd}
      goEdit={goEdit}
      logout={logout}
    />
  );
};

export default DateRecordListContainer;
