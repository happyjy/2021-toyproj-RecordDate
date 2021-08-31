import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';

import { RootState } from '../../redux/modules/rootReducer';
import { logout as logoutSaga } from '../../redux/modules/auth';

import { addDaterecord as addDateRecordSaga } from '../../redux/modules/dateRecord';
import { DateRecordReqType, getUserResType } from '../../types';
import DateRecordCouple from '../../components/DateRecord/DateRecordCouple';
import { debounce } from '../../redux/utils';
import UserService from '../../services/UserService';

const DateRecordCoupleContainer = () => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );
  const user = useSelector<RootState, getUserResType | null>(
    (state) => state.auth.user,
  );

  // email 검색 요청
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<getUserResType[]>([]);
  const onSearchUser = debounce(async (e) => {
    // 유저 검색 saga호출(container, action, saga, service)
    if (!e.target.value.trim()) return;

    setSearchLoading(true);
    const userList = await UserService.getUserByEmail({
      email: e.target.value,
      token: user?.token,
    });
    setSearchLoading(false);
    setUserList((list) => [...userList]);
  }, 500);

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
    <DateRecordCouple
      searchLoading={searchLoading}
      userList={userList}
      onSearchUser={onSearchUser}
      user={user}
      addDateRecord={addDateRecord}
      loading={loading}
      error={error}
      back={back}
      logout={logout}
    />
  );
};

export default DateRecordCoupleContainer;
