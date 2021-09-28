import React, { useEffect, useRef, useState } from 'react';
import { message as messageDialog } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { DateRecordReqType, placeListType } from '../../types';
import styles from './DateRecordAdd.module.css';
import mapStyles from './map.module.css';
import styled, { css } from 'styled-components';
import Chips from '../ChipsComponent/ChipsComponent';
import map from '../Map/map';
import useFileUpload from '../../Hooks/useFileUplaod';
import FileUpload from '../FileUpload/FileUpload';
import dycalendar from '../Calendar/dyCalendar';
import moment from 'moment';
import Loader from '../Loader/Loader';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
  padding: 0px 24px 0px;
  @media (max-width: 768px) {
    flex-direction: column;
    height: 100vh;
    overflow: scroll;
    padding: 0px 5px 5px;
    @media (max-width: 768px) {
      & > * {
        &:not(:last-child) {
          margin-bottom: 20px;
        }
      }
    }
  }
`;
const MapContainer = styled.div`
  flex-basis: 70%;
  height: auto;
  padding: 0px 10px 0px 0px;
  @media (max-width: 768px) {
    position: initial;
    width: 100%;
    padding: 0;
  }
`;
const ListContainer = styled.div`
  flex-basis: 30%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const MapSpace = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
    height: 50vh;
    position: initial;
  }
`;
const FormContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  border-radius: 5px;
  padding: 0px 0px 0px 10px;
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
  }
`;
const commonFormProperty = css`
  width: 100%;
  padding: 7px 12px;
  margin: 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0px;

  &:not(read-only) {
    padding: 5px;
  }
  &:read-only {
    padding: 0px;
    border: none;
  }
`;
// https://stackoverflow.com/questions/56378356/how-do-i-convert-css-to-styled-components-with-inputtype-submit-attribute
const InputEl = styled.input.attrs({ type: 'text' })`
  ${commonFormProperty};
  @media (max-width: 768px) {
    height: 30px;
    width: initial;
  }
`;
const TextAreaEl = styled.textarea`
  ${commonFormProperty};
`;
// const SelectEl = styled.select`
//   ${commonFormProperty};
// `;
const InputSubmitContainer = styled.div`
  text-align: right;
  margin-top: 20px;
`;
const InputSubmit = styled.button`
  width: 100%;
  border-color: #3a86ac;
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CalendarContainer = styled.div`
  z-index: 500;
  position: relative;
  background: #161623;
  overflow: hidden;
  border-radius: 5px;
  &:before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: linear-gradient(#ffc107, #e91e63);
    border-radius: 50%;
    transform: translate(-250px, -120px);
  }
  &:after {
    content: '';
    position: absolute;
    width: 350px;
    height: 350px;
    background: linear-gradient(#2196f3, #31ff38);
    border-radius: 50%;
    transform: translate(180px, -110px);
  }
  @media (max-width: 768px) {
    width: 50%;
    height: fit-content;
  }
`;

const Calendar = styled.div`
  position: relative;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
`;

// declare global {
//   interface Window {
//     kakao: any;
//   }
// }
const TitleChipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  @media (max-width: 768px) {
    width: 50%;
    margin-left: 5px;
  }
  /* justify-content: space-between; */
`;

const CalendartitleChipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

interface AddProps {
  addDateRecord: (dateRecord: DateRecordReqType) => void;
  setDateRecordLoading: (isLoading: Boolean) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}

const DateRecordAdd: React.FC<AddProps> = ({
  addDateRecord,
  setDateRecordLoading,
  loading,
  error,
  back,
  logout,
}) => {
  /* 데이트기록 form feild */
  const [dateTime, setDateTime] = useState<string>('');
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = React.useState<string>();

  /* 카카오지도 */
  const inputEl = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('문래역');
  const [searchPlaces, setSearchPlaces] = useState(() => () => {}); // 지도 검색

  /* 파일 얼로드 */
  const { imageFile, setImagefile, fileText, setFileText, onChangeFileupload } =
    useFileUpload();

  /*
    # issue: useState with ts
      * https://stackoverflow.com/a/53650561/3937115
      * https://www.codegrepper.com/code-examples/typescript/typescript+usestate+array+type
  */
  const [placeList, setPlaceList] = useState<placeListType[]>([]);

  /* 카카오맵 */
  /*
    # 카카오맵 api 붙이는 작업
      * event trigger시 useEffect 안에 있는 함수 호출해야함
      * 돔 생성 이후에 생성된 돔에 붙이는 과정과 이벤트 동작이 묶여 있는 상황
      * 돔 이벤트 발생시 useEffect안에 있는 함수 호출 해야 하는 상황
      * 힘요한 함수만 useEffect 밖으로 빼내기 위해서 useState 사용
      * useState에 함수 설정방법
        * https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
  */
  useEffect(() => {
    map(mapRef, inputEl, setSearchPlaces, placeList, setPlaceList);
  }, [placeList]);

  /* 카카오맵 검색 이벤트 */
  const keypress = (e: any) => {
    if (e.key === 'Enter') {
      searchPlace();
    }
  };
  const inputEvent = (e: any) => {
    setKeyword(e.target.value);
  };
  const searchPlace = () => {
    searchPlaces();
  };

  /* cycalendar, & loading false */
  useEffect(() => {
    setDateRecordLoading(false);

    const setDatedateFn = function (date) {
      setDateTime(moment(new Date(date)).format('YYYY-MM-DD'));
    };

    dycalendar.draw({
      target: '#dycalendar',
      type: 'month',
      dayformat: 'full',
      monthformat: 'ddd',
      // monthformat: 'full',
      highlighttargetdate: true,
      prevnextbutton: 'show',
      setDatedate: setDatedateFn,
    });

    return () => {
      dycalendar.remove();
    };
  }, []);

  /* add button event */
  function onAddDateRecord() {
    const title = titleRef.current!.value;
    const description = descriptionRef.current!.value;
    if (!title || !placeList.length || !description) {
      messageDialog.error('Please fill out all inputs');
      return;
    }

    addDateRecord({
      dateTime,
      title,
      placeList,
      description,
      imageFile,
    });
  }

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  const [loader, setLoader] = useState(<div></div>);
  const LoaderTemplate = <Loader></Loader>;
  useEffect(() => {
    loading ? setLoader(LoaderTemplate) : setLoader(<></>);
  }, [loading]);
  return (
    <Layout>
      {loader}
      <Container className="Container">
        <MapContainer className="MapContainer">
          <div
            className={mapStyles.map_wrap}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <MapSpace ref={mapRef} id="map"></MapSpace>
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
        </MapContainer>
        <ListContainer className="ListContainer">
          <FormContainer className="FormContainer">
            <CalendartitleChipsContainer className="CalendartitleChipsContainer">
              <CalendarContainer className="CalendarContainer">
                <Calendar className="Caldendar" id="dycalendar"></Calendar>
              </CalendarContainer>
              <TitleChipsContainer className="TitleChipsContainer">
                <InputEl
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title..."
                  ref={titleRef}
                />
                <Chips
                  placeList={placeList}
                  setPlaceList={setPlaceList}
                  showDelIcon={true}
                ></Chips>
              </TitleChipsContainer>
            </CalendartitleChipsContainer>
            <FileUpload
              imageFile={imageFile}
              setImagefile={setImagefile}
              fileText={fileText}
              setFileText={setFileText}
              onChangeFileupload={onChangeFileupload}
            ></FileUpload>
            <TextAreaEl
              onChange={(e) => setText(e.target.value)}
              value={text}
              rows={4}
              placeholder="Comment"
              ref={descriptionRef}
              className={styles.input}
            />

            <InputSubmitContainer>
              <InputSubmit type="submit" value="Add" onClick={onAddDateRecord}>
                Add
              </InputSubmit>
            </InputSubmitContainer>
          </FormContainer>
        </ListContainer>
      </Container>
    </Layout>
  );
};
export default DateRecordAdd;
