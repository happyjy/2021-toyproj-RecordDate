import React, { useRef, useEffect, useState } from 'react';
import { message as messageDialog, PageHeader, Input, Button } from 'antd';
// import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea';
import { FormOutlined } from '@ant-design/icons';

import Layout from './Layout';
import {
  BookReqType,
  BookResType,
  DateRecordReqType,
  dateType,
  placeListType,
} from '../types';
import styles from './Edit.module.css';
import styled, { css } from 'styled-components';

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

const SelectEl = styled.select`
  ${commonFormProperty};
`;

const InputSubmitContainer = styled.div`
  text-align: right;
  margin-top: 20px;
`;
// const InputSubmit = styled.input.attrs({ type: 'submit' })`
const InputSubmit = styled.button`
  width: 100%;
  border-color: #28546a;
  background-color: #28546a;
  text-transform: uppercase;
  border-radius: 1px;
  border-width: 2px;
  color: white;
  width: 120px;
  padding: 14px 20px;
  cursor: pointer;
  &:hover {
    background-color: #1f4152;
  }
`;

interface DateRecordEditProps {
  dateRecord: dateType | null | undefined;
  getDateList: () => void;
  editDateRecord: (dateRecord: DateRecordReqType) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}

const DateRecordEdit: React.FC<DateRecordEditProps> = ({
  dateRecord,
  loading,
  error,
  editDateRecord,
  back,
  logout,
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [placeList, setPlaceList] = useState<placeListType[]>([]);

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

  return (
    <Layout>
      <PageHeader
        onBack={back}
        title={
          <div>
            <FormOutlined /> Edit dateRecord
          </div>
        }
        subTitle="Edit Your Book"
        extra={[
          <Button
            key="1"
            type="primary"
            onClick={logout}
            className={styles.button_logout}
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

      <FormContainer>
        <label>Title</label>
        <InputEl
          defaultValue={dateRecord.title}
          type="text"
          id="title"
          name="title"
          placeholder="title..."
          ref={titleRef}
        />

        <label>place</label>
        {dateRecord.placeList.map((place, idx) => (
          <InputEl
            key={idx}
            defaultValue={place.placeName}
            type="text"
            id="lname"
            name="lastname"
            placeholder="place.."
            ref={placeRef}
          />
        ))}

        <label>description</label>
        <TextAreaEl
          defaultValue={dateRecord.description}
          rows={4}
          placeholder="Comment"
          ref={descriptionRef}
          className={styles.input}
        />

        <InputSubmitContainer>
          <InputSubmit type="submit" value="Add" onClick={click}>
            Update
          </InputSubmit>
        </InputSubmitContainer>
      </FormContainer>
    </Layout>
  );

  function click() {
    const title = titleRef.current!.value;
    // const place = placeRef.current!.value;
    const description = descriptionRef.current!.value;

    if (
      title === undefined ||
      placeList === undefined ||
      description === undefined
    ) {
      messageDialog.error('Please fill out all inputs');
      return;
    }
    editDateRecord({
      title,
      placeList,
      description,
    });
  }
};
export default DateRecordEdit;
