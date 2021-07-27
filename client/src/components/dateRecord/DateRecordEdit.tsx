import React, { useRef, useEffect, useState } from 'react';
import { message as messageDialog, PageHeader, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { dateType, EditDateRecordReqType, placeListType } from '../../types';
import styles from './DateRecordEdit.module.css';
import mapStyles from './map.module.css';
import styled, { css } from 'styled-components';
import Chips from './chipsComponent';
import map from '../map';

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
  editDateRecord: (dateRecord: EditDateRecordReqType) => void;
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
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [placeList, setPlaceList] = useState<placeListType[]>(
    dateRecord?.placeList ? dateRecord.placeList : [],
  );
  const [originPlaceList] = useState<placeListType[]>(
    dateRecord?.placeList ? dateRecord.placeList : [],
  );

  const inputEl = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('오목교역');
  const [SearchPlacesCb, setSearchPlacesCb] = useState(() => () => {});
  const [placeMarkerList, setPlaceMarkerList] = useState<any[]>([]);

  const keypress = (e: any) => {
    if (e.key === 'Enter') {
      searchPlace();
    }
  };
  const inputEvent = (e: any) => {
    setKeyword(e.target.value);
  };

  const searchPlace = () => {
    SearchPlacesCb();
  };

  // 카카오맵
  useEffect(() => {
    const [placeMarkerObjList] = map(
      mapRef,
      inputEl,
      setSearchPlacesCb,
      placeList,
      setPlaceList,
    );
    setPlaceMarkerList(placeMarkerObjList);
  }, [placeList]);

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

      <div className={mapStyles.map_wrap}>
        <div
          ref={mapRef}
          id="map"
          style={{
            width: '800px',
            height: '500px',
            position: 'relative',
            overflow: 'hidden',
          }}
        ></div>
        <div id={mapStyles.menu_wrap} className={mapStyles.bg_white}>
          <div className={mapStyles.option}>
            <div>
              키워드 :
              <input
                type="text"
                ref={inputEl}
                id="keyword"
                value={keyword}
                onChange={(e) => inputEvent(e)}
                onKeyPress={(e) => keypress(e)}
              />
              <button onClick={() => searchPlace()}>검색하기</button>
            </div>
          </div>
          <hr />
          <ul id={mapStyles.placesList}></ul>
          <div id={mapStyles.pagination}></div>
        </div>
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
        <Chips
          placeList={placeList}
          setPlaceList={setPlaceList}
          placeMarkerList={placeMarkerList}
        ></Chips>

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

    // 변경된 placeList와 origin placeList 비교

    /* 
      # array로 key/value data structure를 만들기 위한 Type 설정
      https://stackoverflow.com/q/40358434/3937115
        * 아래 로직에서는 Map 객체를 사용해서 로직을 작성해 봤다.
      1. { [key: string]: any }
      2. use Map(dont use array)

    */
    interface NewArr {
      [key: string]: any;
    }
    // var newArr: { [key: string]: any } = [];
    // let newArr: NewArr = []
    let compMap: Map<string, placeListType> = new Map<string, placeListType>();

    for (var i = 0; i < originPlaceList.length; i++) {
      // newArr[originPlaceList[i].latLong] = originPlaceList[i];
      compMap.set(originPlaceList[i].latLong, originPlaceList[i]);
    }

    let delPlaceList: placeListType[] = [];
    let addPlaceList: placeListType[] = [];
    placeList.forEach((place) => {
      if (!!compMap.get(place.latLong)) {
        compMap.delete(place.latLong);
      } else {
        addPlaceList.push(place);
      }
    });

    delPlaceList = [...compMap.values()];

    editDateRecord({
      title,
      delPlaceList,
      addPlaceList,
      description,
    });
  }
};
export default DateRecordEdit;
