import React, { useRef, useEffect, useState } from 'react';
import { message as messageDialog, PageHeader, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import {
  dateImageListType,
  dateType,
  EditDateRecordReqType,
  placeListType,
} from '../../types';
import styles from './DateRecordEdit.module.css';
import mapStyles from './map.module.css';
import styled, { css } from 'styled-components';
import Chips from '../ChipsComponent/chipsComponent';
import map from '../map';
import useFileUpload from '../../hooks/useFileUplaod';
import FileUpload from '../FileUpload/FileUpload';

const ListContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: auto;
  padding: 0px 24px 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const MapContainer = styled.div`
  width: 70%;
  height: auto;
  padding: 0px 10px 0px 0px;
  @media (max-width: 768px) {
    position: initial;
    width: auto;
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
  border-radius: 5px;
  padding: 0px 0px 0px 10px;
  width: 30%;
  @media (max-width: 768px) {
    width: 100%;
  }
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

// const ContainerImageLayout = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   justify-content: space-around;
//   grid-gap: 10px;
//   position: relative;
//   margin-top: 20px;
//   padding: 5px;
// `;
// const ContainerThumbnail = styled.div`
//   position: relative;
//   &:before {
//     content: ' ';
//     display: block;
//     width: 100%;
//     padding-top: 100%; /* Percentage value in padding derived from the width  */
//   }
// `;
// const ThumbnailImg = styled.img`
//   width: 100%;
//   height: 100%;
//   box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
//   position: absolute;
//   top: 0px;
//   left: 0px;
//   bottom: 0px;
//   right: 0px;
//   object-fit: cover;
// `;

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
  getDateList,
  editDateRecord,
  loading,
  error,
  back,
  logout,
}) => {
  useEffect(() => {
    getDateList();
  }, [getDateList]);

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

  const [dateImageList, setDateImageList] = useState<any[]>(
    dateRecord?.dateImageList ? dateRecord.dateImageList : [],
  );

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

      <ListContainer>
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
            showDelIcon={true}
          ></Chips>

          <label>Image uplaod</label>
          <FileUpload
            imageFile={imageFile}
            setImagefile={setImagefile}
            fileText={fileText}
            setFileText={setFileText}
            // loadImageFiles={loadImageFiles}
            // setLoadImageFiles={setLoadImageFiles}
            onChangeFileupload={onChangeFileupload}
          ></FileUpload>

          <label>description</label>
          <TextAreaEl
            defaultValue={dateRecord.description}
            rows={4}
            placeholder="Comment"
            ref={descriptionRef}
            className={styles.input}
          />
          {/* {dateRecord.dateImageList.length > 0 && (
            <ContainerImageLayout>
              {dateRecord.dateImageList.map((image, i) => (
                <ContainerThumbnail key={image.id}>
                  <ThumbnailImg
                    src={'http://localhost:5000' + image.dateImageName}
                  ></ThumbnailImg>
                </ContainerThumbnail>
              ))}
            </ContainerImageLayout>
          )} */}

          <InputSubmitContainer>
            <InputSubmit type="submit" value="Add" onClick={click}>
              Update
            </InputSubmit>
          </InputSubmitContainer>
        </FormContainer>
      </ListContainer>
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
