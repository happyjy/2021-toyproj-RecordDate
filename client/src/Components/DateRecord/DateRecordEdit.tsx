import React, { useRef, useEffect, useState } from 'react';
import { message as messageDialog } from 'antd';
import Layout from '../Layout';
import {
  dateImageListType,
  dateRecordListExtendType,
  EditDateRecordReqType,
  placeListType,
} from '../../types';
import styles from './DateRecordEdit.module.css';
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
  /* border: 5px red solid; */
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
    width: auto;
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

const InputSubmitContainer = styled.div`
  text-align: right;
  margin-top: 20px;
`;
// const InputSubmit = styled.input.attrs({ type: 'submit' })`
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
interface DateRecordEditProps {
  dateRecord: dateRecordListExtendType | null | undefined;
  getDateList: () => void;
  editDateRecord: (dateRecord: EditDateRecordReqType) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}
const DateRecordEdit: React.FC<DateRecordEditProps> = ({
  dateRecord,
  getDateList,
  editDateRecord,
  loading,
  error,
  back,
  logout,
}) => {
  /* 데이트기록 form feild */
  const [dateTime, setDateTime] = useState<string>('');
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [placeList, setPlaceList] = useState<placeListType[]>(
    dateRecord?.placeList ? dateRecord.placeList : [],
  );
  const [originPlaceList] = useState<placeListType[]>(
    dateRecord?.placeList ? dateRecord.placeList : [],
  );

  /* 카카오지도 */
  const inputEl = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('오목교역');
  const [SearchPlacesCb, setSearchPlacesCb] = useState(() => () => {});
  const [placeMarkerList, setPlaceMarkerList] = useState<any[]>([]);

  /* 파일 얼로드 */
  const {
    imageFile,
    setImagefile,
    fileText,
    setFileText,
    // loadImageFiles,
    // setLoadImageFiles,
    onChangeFileupload,
  } = useFileUpload();

  // const [imageList, setImageList] = useState<dateImageListType[]>(
  //   dateRecord?.dateImageList ? dateRecord.dateImageList : [],
  // );

  useEffect(() => {
    // getDateList();
    /*
      [!] issue search option 없이 조회 해서 error생김, list화면에서 정보 filter함으로 문제 없음
      단, 데이트 번호로 직접 입력해서 들어오는 경우 문제
      데이트 번호 url 주소 공유하기 안됨
      이문제 해결하려면 map 안나오는것 부터 해결해야함
    */
  }, [getDateList]);

  const result: dateImageListType[] = dateRecord
    ? dateRecord?.dateImageList.map((v, i) => {
        v.idx = i;
        v.result = v.dateImageName;
        return v;
      })
    : [];

  const [originImageList] = useState<dateImageListType[]>(result);
  useEffect(() => {
    setImagefile(dateRecord?.dateImageList ? dateRecord.dateImageList : []);
    setFileText(result);
  }, []);

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

  /* cycalendar, setting textArea rows  */
  useEffect(() => {
    if (!dateRecord) return;

    const textAreaRow = dateRecord?.description.split('\n').length + 1;
    if (descriptionRef && descriptionRef.current) {
      descriptionRef.current.rows = textAreaRow;
    }

    const dateTimeDateObj =
      dateRecord?.dateTime && new Date(dateRecord?.dateTime);
    const month = dateTimeDateObj && dateTimeDateObj?.getMonth();
    const year = dateTimeDateObj && dateTimeDateObj?.getFullYear();
    const date = dateTimeDateObj && dateTimeDateObj?.getDate();
    const setDatedateFn = function (date) {
      setDateTime(moment(new Date(date)).format('YYYY-MM-DD'));
    };

    dycalendar.draw({
      target: '#dycalendar',
      type: 'month',
      dayformat: 'full',
      monthformat: 'ddd',
      // monthformat: 'full',
      month,
      year,
      date,
      highlighttargetdate: true,
      prevnextbutton: 'show',
      setDatedate: setDatedateFn,
    });

    return () => {
      dycalendar.remove();
    };
  }, [dateRecord]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  const [loader, setLoader] = useState(<div></div>);
  const [LoaderTemplate] = useState(<Loader></Loader>);
  useEffect(() => {
    loading ? setLoader(LoaderTemplate) : setLoader(<></>);
  }, [loading, setLoader, LoaderTemplate]);

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
                  <button onClick={searchPlace}>검색하기</button>
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
                  defaultValue={dateRecord.title}
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title..."
                  ref={titleRef}
                />
                <Chips
                  placeList={placeList}
                  setPlaceList={setPlaceList}
                  placeMarkerList={placeMarkerList}
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
              // rows={4}
              defaultValue={dateRecord.description}
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
        </ListContainer>
      </Container>
    </Layout>
  );

  function click() {
    const title = titleRef.current!.value;
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
    // 저장할 장소 설정
    interface NewArr {
      [key: string]: any;
    }
    let compMapPlace: Map<string, placeListType> = new Map<
      string,
      placeListType
    >();
    for (let i = 0; i < originPlaceList.length; i++) {
      compMapPlace.set(originPlaceList[i].latLong, originPlaceList[i]);
    }
    let delPlaceList: placeListType[] = [];
    let addPlaceList: placeListType[] = [];
    placeList.forEach((place) => {
      if (!!compMapPlace.get(place.latLong)) {
        compMapPlace.delete(place.latLong);
      } else {
        addPlaceList.push(place);
      }
    });
    delPlaceList = [...compMapPlace.values()];

    // 저장할 이미지 설정
    let newImageFileList: File[] = [];
    newImageFileList = imageFile.filter((v) => {
      return v.__proto__ === File.prototype;
    });

    let delImageFileIdList: number[] = [];
    let leftImage = imageFile.map((v) => v.id);
    delImageFileIdList = originImageList
      .filter((v) => {
        return !leftImage.includes(v.id);
      })
      .map((v) => v.id);

    // let compMapImage: { [key: string]: any } = [];
    // for (let i = 0; i < originImageList.length; i++) {
    //   let originImage = originImageList[i];
    //   if (originImage.dateImageName) {
    //     compMapImage[originImage.dateImageName] = originImage;
    //   }
    // }
    // let delImageFileIdList: number[] = [];
    // imageFile.forEach((c) => {
    //   if (
    //     c.__proto__ !== File.prototype &&
    //     c.dateImageName &&
    //     !compMapImage[c.dateImageName]
    //   ) {
    //     delImageFileIdList.push(c.id);
    //   }
    // });
    // console.log({ imageFile, fileText });

    editDateRecord({
      dateTime,
      title,
      description,
      delPlaceList,
      addPlaceList,
      newImageFileList,
      delImageFileIdList,
    });
  }
};
export default DateRecordEdit;
