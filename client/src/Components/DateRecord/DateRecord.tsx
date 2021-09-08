import React from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

import styles from './DateRecord.module.css';
import { placeListType } from '../../types';

interface DateProps {
  dateCnt: number;
  dateRecord_id: number;
  title: string;
  description: string;
  dateTime: string;
  placeList: placeListType[];
  deleteRecordDate: (recordDateId: number) => void;
  goEdit: (recordDateId: number) => void;
  resetMapByDateRecord: (e: React.MouseEvent, dateRecord_id: number) => void;
}

const DateRecord: React.FC<DateProps> = React.memo(
  ({
    dateCnt,
    dateRecord_id,
    title,
    description,
    placeList,
    dateTime,
    deleteRecordDate,
    goEdit,
    resetMapByDateRecord,
  }) => {
    return (
      <div className={styles.tdItemContainer}>
        <div className={styles.firstCell}>
          <div className={styles.dateCnt}>
            <span
              className={styles.spanDateCnt}
              onClick={(e) => resetMapByDateRecord(e, dateRecord_id)}
            >
              [{dateCnt}번째]
            </span>
          </div>
          <div className={styles.title}>
            <Link
              key={dateRecord_id}
              to={`/dateRecord/${dateRecord_id}`}
              className={styles.link_detail_title}
            >
              {/* <BookOutlined />  */}
              {title}
            </Link>
          </div>
        </div>

        <div className={styles.author}>
          <Link
            to={`/dateRecord/${dateRecord_id}`}
            className={styles.link_detail_author}
          >
            {placeList?.map((v, i) => {
              if (i === 0) return <span key={v.id}>{v.placeName}</span>;
              if (i !== 0) return <span key={v.id}>, {v.placeName}</span>;
            })}
          </Link>
        </div>
        <div className={styles.lastCell}>
          {' '}
          <div className={styles.dateTime}>
            <span>{moment(dateTime).format('YYYY-MM-DD')}</span>
            {/* {moment(created_at).format('YYYY-MM-DD hh:mm a')} */}
          </div>
          <div className={styles.tooltips}>
            <Tooltip title="Edit">
              <Button
                size="small"
                shape="circle"
                onClick={clickEdit}
                icon={<EditOutlined />}
                className={styles.button_edit}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                size="small"
                type="primary"
                shape="circle"
                danger
                onClick={clickDelete}
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );

    function clickDelete() {
      deleteRecordDate(dateRecord_id);
    }
    function clickEdit() {
      goEdit(dateRecord_id);
    }
  },
);

export default DateRecord;
