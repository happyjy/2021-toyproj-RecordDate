import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

// import List from '../components/List';
import DateList from '../components/DateRecordList';
import { RootState } from '../redux/modules/rootReducer';
import { DateResType, BookResType, dateType } from '../types';
import { logout as logoutSaga } from '../redux/modules/auth';
import {
  getBooks as getBooksSaga,
  deleteBook as deleteBookSaga,
} from '../redux/modules/books';

import {
  getDatelist as getDateListSaga,
  deleteDaterecord as deleteDateRecordSaga,
} from '../redux/modules/dateRecord';

const DateRecordListContainer: React.FC = (props) => {
  const dateRecordList = useSelector<RootState, dateType[] | null>(
    (state) => state.dateRecord.dateRecordList,
  );
  const books = useSelector<RootState, BookResType[] | null>(
    (state) => state.books.books,
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

  const getBooks = useCallback(() => {
    dispatch(getBooksSaga());
  }, [dispatch]);

  const deleteBook = useCallback(
    (dateRecordId: number) => {
      // dispatch(deleteBookSaga(dateRecordId));
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
    <DateList
      {...props}
      dateRecordList={dateRecordList}
      books={books}
      loading={loading}
      error={error}
      getDateList={getDateList}
      getBooks={getBooks}
      deleteBook={deleteBook}
      goAdd={goAdd}
      goEdit={goEdit}
      logout={logout}
    />
  );
};

export default DateRecordListContainer;
