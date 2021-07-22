import React from 'react';
import { Button, Tooltip } from 'antd';
import { BookOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

import styles from './Book.module.css';
import { selectPlaceList } from '../types';

interface DateProps {
  dateRecord_id: number;
  title: string;
  description: string;
  created_at: string;
  selectPlaceList: selectPlaceList[];
  deleteRecordDate: (recordDateId: number) => void;
  goEdit: (recordDateId: number) => void;
}

const DateRecord: React.FC<DateProps> = React.memo(
  ({
    dateRecord_id,
    title,
    description,
    selectPlaceList,
    created_at,
    deleteRecordDate: deleteBook,
    goEdit,
  }) => {
    return (
      <div className={styles.book}>
        <div className={styles.title}>
          <Link
            to={`/dateRecord/${dateRecord_id}`}
            className={styles.link_detail_title}
          >
            <BookOutlined /> {title}
          </Link>
        </div>
        <div className={styles.author}>
          <Link
            to={`/dateRecord/${dateRecord_id}`}
            className={styles.link_detail_author}
          >
            {selectPlaceList?.map((v, i) => {
              if (i == 0) return <span>{v.placeName}</span>;
              if (i != 0) return <span>, {v.placeName}</span>;
            })}
          </Link>
        </div>
        <div className={styles.created}>
          {moment(created_at).format('MM-DD-YYYY hh:mm a')}
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
              onClick={click}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </div>
      </div>
    );

    function click() {
      deleteBook(dateRecord_id);
    }
    function clickEdit() {
      goEdit(dateRecord_id);
    }
  },
);

export default DateRecord;
