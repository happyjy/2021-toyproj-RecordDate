import React, { useEffect } from 'react';
import { PageHeader, Button, Input } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Layout from './Layout';
import { DateResType, BookResType, dateType } from '../types';
import styles from './Detail.module.css';
import styled, { css } from 'styled-components';
// import styled from 'styled-components';

interface DetailProps {
  dateRecord: dateType | null | undefined;
  error: Error | null;
  back: () => void;
  edit: () => void;
  getDateList: () => void;
  getBooks: () => void;
  logout: () => void;
}

const DateRecordDetail: React.FC<DetailProps> = ({
  dateRecord,
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

  if (dateRecord === null) {
    return null;
  }
  if (dateRecord === undefined) {
    return (
      <div>
        <h1>NotFound dateRecord</h1>
      </div>
    );
  }

  const FormContainer = styled.div`
    border-radius: 5px;
    /* background-color: #f2f2f2; */
    padding: 20px;
  `;

  const commonFormProperty = css`
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  `;
  // https://stackoverflow.com/questions/56378356/how-do-i-convert-css-to-styled-components-with-inputtype-submit-attribute
  const InputEl = styled.input.attrs({ type: 'text' })`
    ${commonFormProperty};
  `;

  const TextAreaEl = styled.textarea`
    ${commonFormProperty};
  `;

  return (
    <Layout>
      <PageHeader
        onBack={back}
        title={
          <div>
            <BookOutlined /> {dateRecord.title}
          </div>
        }
        // subTitle={dateRecord.author}
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

      <FormContainer>
        <label>Title</label>
        <InputEl
          value={dateRecord.title}
          type="text"
          id="title"
          name="title"
          placeholder="title..."
          readOnly
        />

        <label>place</label>
        {dateRecord.selectPlaceList.map((place) => (
          <InputEl
            value={place.placeName}
            type="text"
            id="lname"
            name="lastname"
            placeholder="place.."
            readOnly
          />
        ))}

        <label>description</label>
        <TextAreaEl
          value={dateRecord.description}
          rows={4}
          placeholder="Comment"
          className={styles.input}
          readOnly
        />
      </FormContainer>
    </Layout>
  );

  function click() {
    edit();
  }
};
export default DateRecordDetail;
