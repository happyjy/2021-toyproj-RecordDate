import React, { useEffect } from 'react';
import { DateRecordReqType } from '../../types';

interface AddProps {
  addDateRecord: (dateRecord: DateRecordReqType) => void;
  setDateRecordLoading: (isLoading: Boolean) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}

const ToDateList: React.FC<AddProps> = ({
  addDateRecord,
  setDateRecordLoading,
  loading,
  error,
  back,
  logout,
}) => {
  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  return <>To Date List</>;
};
export default ToDateList;
