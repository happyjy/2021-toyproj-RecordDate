import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Signin from '../Components/Signin';
import { RootState } from '../Redux/Modules/rootReducer';
import {
  login as loginSaga,
  snslogin as snsLoginSaga,
} from '../Redux/Modules/auth';
import { LoginReqType, SnsLoginReqType } from '../types';

const SigninContainer: React.FC = () => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.auth.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.auth.error,
  );

  const dispatch = useDispatch();

  const snsLogin = useCallback(
    ({
      email,
      nickname,
      birthday,
      gender,
      profileImageUrl,
      thumbnailImageUrl,
    }: SnsLoginReqType) => {
      dispatch(
        snsLoginSaga({
          email,
          nickname,
          birthday,
          gender,
          profileImageUrl,
          thumbnailImageUrl,
        }),
      );
    },
    [dispatch],
  );

  const login = useCallback(
    ({ email, password }: LoginReqType) => {
      dispatch(loginSaga({ email, password }));
    },
    [dispatch],
  );

  return (
    <Signin loading={loading} error={error} snsLogin={snsLogin} login={login} />
  );
};

export default SigninContainer;
