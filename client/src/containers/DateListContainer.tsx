import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

// import List from '../components/List';
import DateList from '../components/DateList';
import { RootState } from '../redux/modules/rootReducer';
import { DateResType, BookResType, dateType } from '../types';
import { logout as logoutSaga } from '../redux/modules/auth';
import {
  getBooks as getBooksSaga,
  deleteBook as deleteBookSaga,
} from '../redux/modules/books';

import { getDatelist as getDateListSaga } from '../redux/modules/dateList';

const DateListContainer: React.FC = (props) => {
  const dateList = useSelector<RootState, dateType[] | null>(
    (state) => state.dateList.dateList,
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
    (bookId) => {
      dispatch(deleteBookSaga(bookId));
    },
    [dispatch],
  );

  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);

  const goEdit = useCallback(
    (bookId: number) => {
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  return (
    <DateList
      {...props}
      dateList={dateList}
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

export default DateListContainer;
