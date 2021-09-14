import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/modules/rootReducer';
import { dateRecordListExtendType } from '../../types';

import { logout as logoutSaga } from '../../redux/modules/auth';
import DateRecordDetail from '../../Components/DateRecord/DateRecordDetail';
import DateRecordService from '../../Services/DateRecordService';
import useToken from '../../Hooks/useToken';

const DateRecordDetailContainer = () => {
  const { id } = useParams();
  const token = useToken();
  const dateId = Number(id) || -1;
  const dateRecordList = useSelector<
    RootState,
    dateRecordListExtendType[] | null
  >((state) => state.dateRecord.dateRecordList);

  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );

  const dispatch = useDispatch();

  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);

  const [resultGetDateDetail, setResultGetDateDetail] =
    useState<dateRecordListExtendType>();
  const getDateDetail = useCallback(async () => {
    if (dateId && token) {
      setGetDataLoading(true);
      const resultGetDateDetail = await DateRecordService.getDateDetail(
        dateId,
        token,
      );
      setGetDataLoading(false);
      setResultGetDateDetail(resultGetDateDetail);
    }
  }, [dateId, token]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  return (
    <DateRecordDetail
      dateRecord={dateRecordList?.find((date) => date.dateRecord_id === dateId)}
      resultGetDateDetail={resultGetDateDetail}
      getDateDetail={getDateDetail}
      getDataLoading={getDataLoading}
      error={error}
      logout={logout}
    />
  );
};

export default DateRecordDetailContainer;
