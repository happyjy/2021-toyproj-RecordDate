import React, { useEffect, useRef } from 'react';
import { message as messageDialog, PageHeader, Input, Button } from 'antd';
// import TextArea from 'antd/lib/input/TextArea';
import { FormOutlined } from '@ant-design/icons';

import Layout from './Layout';
import { BookReqType, BookResType, DateRecordReqType } from '../types';
import styles from './Add.module.css';
// import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea';
import styled, { css } from 'styled-components';

interface AddProps {
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
  addDateRecord: (dateRecord: DateRecordReqType) => void;
  add: (book: BookReqType) => void;
  back: () => void;
  getBooks: () => void;
  logout: () => void;
}

// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

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

// const Button = styled.input`
//   ${styles.button_area}
// `;

const AddDateRecord: React.FC<AddProps> = ({
  books,
  loading,
  error,
  add,
  addDateRecord,
  getBooks,
  back,
  logout,
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // const titleRef = useRef<Input>(null);
  // // const messageRef = useRef<TextAreaRef>(null);
  // const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const authorRef = useRef<Input>(null);
  // const urlRef = useRef<Input>(null);

  const [text, setText] = React.useState<string>();

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  if (books === null) {
    return null;
  }

  // const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const value = e.target.value;

  //   setText(value);
  //   // onChange(value.split('\n'));
  // };

  return (
    <Layout>
      <PageHeader
        onBack={back}
        title={
          <div>
            <FormOutlined /> Add Book
          </div>
        }
        subTitle="Add Your Book"
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
      <Wrapper>
        <Title>Hello World!!</Title>
      </Wrapper>

      <FormContainer>
        {/* <form action="/action_page.php"> */}
        <label>Title</label>
        <InputEl
          type="text"
          id="title"
          name="title"
          placeholder="title..."
          ref={titleRef}
        />

        <label>place</label>
        <InputEl
          type="text"
          id="lname"
          name="lastname"
          placeholder="place.."
          ref={placeRef}
        />

        <label>description</label>
        <TextAreaEl
          onChange={(e) => setText(e.target.value)}
          value={text}
          rows={4}
          placeholder="Comment"
          // ref={messageRef}
          ref={descriptionRef}
          className={styles.input}
        />

        {/* <label>Country</label>
          <SelectEl id="country" name="country">
            <option value="australia">Australia</option>
            <option value="canada">Canada</option>
            <option value="usa">USA</option>
          </SelectEl> */}

        <InputSubmitContainer>
          <InputSubmit type="submit" value="Add" onClick={click}>
            Add
          </InputSubmit>
        </InputSubmitContainer>
        {/* </form> */}
      </FormContainer>
      {/* <div className={styles.add}>
        <div className={styles.input_title}>
          Title
          <span className={styles.required}> *</span>
        </div>
        <div className={styles.input_area}>
          <Input placeholder="Title" ref={titleRef} className={styles.input} />
        </div>
        <div className={styles.input_comment}>
          Comment
          <span className={styles.required}> *</span>
        </div>
        <div className={styles.input_area}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            value={text}
            rows={4}
            placeholder="Comment"
            // ref={messageRef}
            ref={textareaRef}
            className={styles.input}
          />
        </div>
        <div className={styles.input_author}>
          Author
          <span className={styles.required}> *</span>
        </div>
        <div className={styles.input_area}>
          <Input
            placeholder="Author"
            ref={authorRef}
            className={styles.input}
          />
        </div>
        <div className={styles.input_url}>
          URL
          <span className={styles.required}> *</span>
        </div>
        <div className={styles.input_area}>
          <Input placeholder="URL" ref={urlRef} className={styles.input} />
        </div>
        <div className={styles.button_area}>
          <Button
            size="large"
            loading={loading}
            onClick={click}
            className={styles.button}
          >
            Add
          </Button>
        </div>
      </div>*/}
    </Layout>
  );

  function click() {
    debugger;
    const title = titleRef.current!.value;
    const place = placeRef.current!.value;
    const description = descriptionRef.current!.value;
    if (
      title === undefined ||
      place === undefined ||
      description === undefined
    ) {
      messageDialog.error('Please fill out all inputs');
      return;
    }
    addDateRecord({
      title,
      place,
      description,
    });

    // const title = titleRef.current!.state.value;
    // const message = textareaRef.current!.value;
    // // const message = messageRef.current!.state.value;
    // const author = authorRef.current!.state.value;
    // const url = urlRef.current!.state.value;
    // if (
    //   title === undefined ||
    //   message === undefined ||
    //   author === undefined ||
    //   url === undefined
    // ) {
    //   messageDialog.error('Please fill out all inputs');
    //   return;
    // }
    // add({
    //   title,
    //   message,
    //   author,
    //   url,
    // });
  }
};
export default AddDateRecord;
