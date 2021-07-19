import React, { useEffect } from 'react';
import { Table, PageHeader, Button } from 'antd';

import styles from './List.module.css';
import Layout from './Layout';
import { BookResType, DateResType, dateType } from '../types';
import Book from './Book';
import Date from './DateRecord';

interface BooksProps {
  dateRecordList: dateType[] | null;
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
  getDateList: () => void;
  getBooks: () => void;
  deleteBook: (bookId: number) => void;
  goAdd: () => void;
  goEdit: (bookId: number) => void;
  logout: () => void;
}

const DateList: React.FC<BooksProps> = ({
  dateRecordList,
  books,
  getDateList,
  getBooks,
  error,
  loading,
  deleteBook,
  goAdd,
  logout,
  goEdit,
}) => {
  // useEffect(() => {
  //   getBooks();
  // }, [getBooks]);
  useEffect(() => {
    getDateList();
  }, [getDateList]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  return (
    <Layout>
      <PageHeader
        title={<div>Date List</div>}
        extra={[
          <Button
            key="2"
            type="primary"
            onClick={goAdd}
            className={styles.button}
          >
            Add Date
          </Button>,
          <Button
            key="1"
            type="primary"
            onClick={logout}
            className={styles.button}
          >
            Logout
          </Button>,
        ]}
      />
      <div
        className="imgContainer"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src="/love.png" style={{ height: '400px' }} alt="love" />
        <span
          style={{
            position: 'absolute',
            fontSize: '3rem',
            color: 'wheat',
            opacity: 0.5,
          }}
        >
          {' '}
          지도 영역{' '}
        </span>
      </div>
      <Table
        dataSource={dateRecordList || []}
        columns={[
          {
            title: 'Book',
            dataIndex: 'book',
            key: 'book',
            render: (text, record) => {
              console.log('# record: ', record);
              return (
                <Date
                  {...record}
                  deleteBook={deleteBook}
                  goEdit={goEdit}
                  key={record.dateRecord_id}
                />
              );
            },
          },
        ]}
        loading={dateRecordList === null || loading}
        showHeader={false}
        className={styles.table}
        rowKey="bookId"
        pagination={false}
      />
    </Layout>
  );
};

export default DateList;
