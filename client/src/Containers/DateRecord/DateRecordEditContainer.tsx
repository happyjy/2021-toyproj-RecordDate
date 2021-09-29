import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { goBack } from 'connected-react-router';

import { RootState } from '../../redux/modules/rootReducer';
import { dateRecordListExtendType, EditDateRecordReqType } from '../../types';
import { logout as logoutSaga } from '../../redux/modules/auth';
import {
  getDatelist as getDateListSaga,
  editDaterecord as editDateRecordsaga,
} from '../../redux/modules/dateRecord';
import DateRecordEdit from '../../Components/DateRecord/DateRecordEdit';

const DateRecordEditContainer = () => {
  const { id } = useParams();
  const dateId = Number(id) || -1;
  const dateRecordList = useSelector<
    RootState,
    dateRecordListExtendType[] | null
  >((state) => state.dateRecord.dateRecordList);

  const loading = useSelector<RootState, boolean>(
    (state) => state.dateRecord.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.dateRecord.error,
  );

  const dispatch = useDispatch();

  const getDateList = useCallback(() => {
    dispatch(getDateListSaga());
  }, [dispatch]);

  const editDateRecord = useCallback(
    (dateRecord: EditDateRecordReqType) => {
      dispatch(editDateRecordsaga(dateId, dateRecord));
    },
    [dispatch, dateId],
  );

  const back = useCallback(() => {
    dispatch(goBack());
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  return (
    <DateRecordEdit
      dateRecord={dateRecordList?.find((date) => date.dateRecord_id === dateId)}
      getDateList={getDateList}
      editDateRecord={editDateRecord}
      loading={loading}
      error={error}
      back={back}
      logout={logout}
    />
  );
};

export default DateRecordEditContainer;
