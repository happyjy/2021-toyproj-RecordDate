import React, { useEffect } from 'react';
import { PageHeader, Button, Input } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Layout from './Layout';
import { DateResType, BookResType, dateType } from '../types';
import styles from './Detail.module.css';
// import styled from 'styled-components';

const { TextArea } = Input;

interface DetailProps {
  date: dateType | null | undefined;
  book: BookResType | null | undefined;
  error: Error | null;
  back: () => void;
  edit: () => void;
  getDateList: () => void;
  getBooks: () => void;
  logout: () => void;
}

// const Title = styled.h1`
//   font-size: 1.5em;
//   text-align: center;
//   color: palevioletred;
// `;
const DateRecordDetail: React.FC<DetailProps> = ({
  date,
  book,
  error,
  edit,
  getDateList,
  getBooks,
  back,
  logout,
}) => {
  useEffect(() => {
    getDateList();
  }, [getDateList]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  if (date === null) {
    return null;
  }
  if (date === undefined) {
    return (
      <div>
        <h1>NotFound date recorded</h1>
      </div>
    );
  }

  return (
    <Layout>
      <PageHeader
        onBack={back}
        title={
          <div>
            <BookOutlined /> {date.title}
          </div>
        }
        // subTitle={date.author}
        extra={[
          <Button
            key="2"
            type="primary"
            onClick={click}
            className={styles.button}
          >
            Edit
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
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <img src="/love.png" style={{ height: '400px' }} alt="love" />
      </div>

      <div className={styles.detail}>
        <div className={styles.message_title}> My Comment </div>
        <div className={styles.message}>
          <TextArea
            rows={4}
            value={date.description}
            readOnly
            className={styles.message_textarea}
          />
        </div>
        <div className={styles.button_area}></div>
      </div>
    </Layout>
  );

  function click() {
    edit();
  }
};
export default DateRecordDetail;
