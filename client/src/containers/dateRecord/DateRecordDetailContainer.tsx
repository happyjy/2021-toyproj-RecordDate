import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack, push } from 'connected-react-router';
import { useParams } from 'react-router-dom';
import { RootState } from '../../redux/modules/rootReducer';
import { dateRecordListExtendType } from '../../types';

import { logout as logoutSaga } from '../../redux/modules/auth';
import { getDatelist as getDateListSaga } from '../../redux/modules/dateRecord';
import DateRecordDetail from '../../components/DateRecord/DateRecordDetail';

const DateRecordDetailContainer = () => {
  const { id } = useParams();
  const dateId = Number(id) || -1;
  const dateRecordList = useSelector<
    RootState,
    dateRecordListExtendType[] | null
  >((state) => state.dateRecord.dateRecordList);

  const error = useSelector<RootState, Error | null>(
    (state) => state.books.error,
  );

  const dispatch = useDispatch();

  const getDateList = useCallback(() => {
    dispatch(getDateListSaga());
  }, [dispatch]);

  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);

  const edit = useCallback(() => {
    dispatch(push(`/editDateRecord/${id}`));
  }, [dispatch, id]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // console.log('# recordDetail > dateRecordList: ', dateRecordList);
  return (
    <DateRecordDetail
      dateRecord={dateRecordList?.find((date) => date.dateRecord_id === dateId)}
      error={error}
      getDateList={getDateList}
      back={back}
      edit={edit}
      logout={logout}
    />
  );
};

export default DateRecordDetailContainer;
