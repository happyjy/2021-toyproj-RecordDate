import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import { RootState } from '../../Redux/Modules/rootReducer';
import {
  dateRecordListExtendType,
  getUserResType,
  searchOptionType,
} from '../../types';
import {
  logout as logoutSaga,
  getuser as getUserSaga,
} from '../../Redux/Modules/auth';

import {
  getDatelist as getDateListSaga,
  deleteDaterecord as deleteDateRecordSaga,
} from '../../Redux/Modules/dateRecord';
import DateRecordList from '../../Components/DateRecord/DateRecordList';

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
