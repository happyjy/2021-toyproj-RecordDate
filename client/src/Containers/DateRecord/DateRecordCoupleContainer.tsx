import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';
import { RootState } from '../../redux/Modules/rootReducer';
import {
  acceptcouple as acceptCoupleSaga,
  requestcouple as requestCoupleSaga,
  logout as logoutSaga,
} from '../../redux/Modules/auth';

import {
  getUserResType,
  reqAcceptCoupleType,
  requsetCoupleReqType,
} from '../../types';
import DateRecordCouple from '../../Components/DateRecord/DateRecordCouple';
import { debounce } from '../../redux/utils';
import UserService from '../../Services/UserService';

const DateRecordCoupleContainer = () => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.books.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );
  const ownInfo = useSelector<RootState, getUserResType | null>(
    (state) => state.auth && state.auth.user && state.auth.user[0],
  );
  const partnerInfo = useSelector<RootState, getUserResType | null>(
    (state) => state.auth && state.auth.user && state.auth.user[1],
  );

  // email 검색 요청
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [userList, setUserList] = useState<getUserResType[]>([]);
  const onSearchUser = debounce(async (e) => {
    if (!e.target.value.trim()) {
      setUserList([]);
      return;
    }

    setSearchLoading(true);
    const userList = await UserService.getUserByEmail({
      email: e.target.value,
      token: ownInfo?.token,
    });
    setSearchLoading(false);

    setUserList((list) => [...userList]);
  }, 500);

  const dispatch = useDispatch();

  // 커플 요청 action
  const onRequestCouple = useCallback(
    (reqCoupleUsers: requsetCoupleReqType) => {
      dispatch(requestCoupleSaga(reqCoupleUsers));
    },
    [dispatch],
  );

  // 커플 수락 action
  const onAcceptCouple = useCallback(
    (reqAcceptCouple: reqAcceptCoupleType) => {
      dispatch(acceptCoupleSaga(reqAcceptCouple));
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
      onAcceptCouple={onAcceptCouple}
      onRequestCouple={onRequestCouple}
      searchLoading={searchLoading}
      userList={userList} //email유저검색 유저list
      onSearchUser={onSearchUser}
      ownInfo={ownInfo}
      partnerInfo={partnerInfo}
      loading={loading}
      error={error}
      back={back}
      logout={logout}
    />
  );
};

export default DateRecordCoupleContainer;
