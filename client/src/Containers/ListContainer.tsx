import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import List from '../Components/List';
import { RootState } from '../Redux/Modules/rootReducer';
import { BookResType } from '../types';
import { logout as logoutSaga } from '../Redux/Modules/auth';
import {
  getBooks as getBooksSaga,
  deleteBook as deleteBookSaga,
} from '../Redux/Modules/books';

const ListContainer: React.FC = (props) => {
  const books = useSelector<RootState, BookResType[] | null>(
    (state) => state.books.books,
  );

  console.log('### books: ', books);
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );

  const dispatch = useDispatch();

  const getBooks = useCallback(() => {
    console.log('### getBooks', getBooksSaga);
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
    <List
      {...props}
      books={books}
      loading={loading}
      error={error}
      getBooks={getBooks}
      deleteBook={deleteBook}
      goAdd={goAdd}
      goEdit={goEdit}
      logout={logout}
    />
  );
};

export default ListContainer;
