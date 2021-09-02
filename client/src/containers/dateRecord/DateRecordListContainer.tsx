import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import DateRecordList from '../../components/DateRecord/DateRecordList';
import { RootState } from '../../redux/modules/rootReducer';
import {
  dateRecordListExtendType,
  getUserResType,
  searchOptionType,
} from '../../types';
import {
  logout as logoutSaga,
  getuser as getUserSaga,
} from '../../redux/modules/auth';

import {
  getDatelist as getDateListSaga,
  deleteDaterecord as deleteDateRecordSaga,
} from '../../redux/modules/dateRecord';

const DateRecordListContainer: React.FC = (props) => {
  const dateRecordList = useSelector<
    RootState,
    dateRecordListExtendType[] | null
  >((state) => state.dateRecord.dateRecordList);

  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );
  // const user = useSelector<RootState, getUserResType | null>(
  //   (state) => state.auth.user,
  // );

  const dispatch = useDispatch();

  // const getUser = useCallback(
  //   (token: String) => {
  //     dispatch(getUserSaga(token));
  //   },
  //   [dispatch],
  // );

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
