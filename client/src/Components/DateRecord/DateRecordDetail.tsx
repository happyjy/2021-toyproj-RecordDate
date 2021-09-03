import React, { useEffect } from 'react';
import { PageHeader, Button } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { dateRecordListExtendType } from '../../types';
import styles from './DateRecord.module.css';
import styled, { css } from 'styled-components';
import Chips from '../ChipsComponent/ChipsComponent';
import dycalendar from '../Calendar/dyCalendar';

const Container = styled.div`
  /* border: 5px red solid; */
  position: relative;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
  padding: 0px 24px 16px;
  @media (max-width: 768px) {
    flex-direction: column;
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
  border-radius: 5px;
  padding: 0px 0px 0px 10px;
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

const ContainerImageLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  grid-gap: 10px;
  position: relative;
  margin-top: 20px;
  padding: 5px;
`;
const ContainerThumbnail = styled.div`
  position: relative;
  &:before {
    content: ' ';
    display: block;
    width: 100%;
    padding-top: 100%; /* Percentage value in padding derived from the width  */
  }
`;
const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  object-fit: cover;
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
`;

const Calendar = styled.div`
  position: relative;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
`;

interface DetailProps {
  dateRecord: dateRecordListExtendType | null | undefined;
  error: Error | null;
  back: () => void;
  edit: () => void;
  getDateList: () => void;
  logout: () => void;
}

const DateRecordDetail: React.FC<DetailProps> = ({
  dateRecord,
  error,
  edit,
  getDateList,
  back,
  logout: onClickLogout,
}) => {
  useEffect(() => {
    getDateList();
  }, [getDateList]);

  useEffect(() => {
    if (error) {
      onClickLogout();
    }
  }, [error, onClickLogout]);

  // 다음 지도
  useEffect(() => {
    const mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
        center: new window.kakao.maps.LatLng(
          37.52279639598579,
          126.88244947391755,
        ), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
      };
    const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    const placeList = (dateRecord && dateRecord.placeList) || [];
    const bounds = new window.kakao.maps.LatLngBounds();

    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);

    for (let i = 0; i < placeList.length; i++) {
      // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
      let latLong = placeList[i].latLong.split(', ');
      let placePosition1 = new window.kakao.maps.LatLng(latLong[0], latLong[1]);
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      let marker = new window.kakao.maps.Marker({
        position: placePosition1,
        title: placeList[i].placeName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });

      marker.setMap(map);
      bounds.extend(placePosition1);
    }
    map.setBounds(bounds);
  });

  /* cycalendar */
  useEffect(() => {
    console.log(dateRecord);
    const dateTimeDateObj =
      dateRecord?.dateTime && new Date(dateRecord?.dateTime);
    const month = dateTimeDateObj && dateTimeDateObj?.getMonth();
    const year = dateTimeDateObj && dateTimeDateObj?.getFullYear();
    const date = dateTimeDateObj && dateTimeDateObj?.getDate();

    dycalendar.draw({
      target: '#dycalendar',
      type: 'month',
      dayformat: 'full',
      monthformat: 'ddd',
      month,
      year,
      date,
      highlighttargetdate: true,
      readOnly: true,
    });

    return () => {
      dycalendar.remove();
    };
  }, [dateRecord]);

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
            <BookOutlined /> {dateRecord.title}
          </div>
        }
        // subTitle={dateRecord.author}
        extra={[
          <Button
            key="2"
            type="primary"
            onClick={onClickEdit}
            className={styles.button}
          >
            Edit
          </Button>,
          <Button
            key="1"
            type="primary"
            onClick={onClickLogout}
            className={styles.button}
          >
            Logout
          </Button>,
        ]}
      />

      <Container className="Container">
        <MapContainer>
          <MapSpace id="map"></MapSpace>
        </MapContainer>
        <ListContainer>
          <FormContainer>
            <label>날짜</label>
            <CalendarContainer>
              <Calendar id="dycalendar"></Calendar>
            </CalendarContainer>
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
            <Chips placeList={dateRecord.placeList}></Chips>
            <label>description</label>
            <TextAreaEl
              value={dateRecord.description}
              rows={4}
              placeholder="Comment"
              className={styles.input}
              readOnly
            />
            {dateRecord.dateImageList.length > 0 && (
              <ContainerImageLayout>
                {dateRecord.dateImageList.map((image, i) => (
                  <ContainerThumbnail key={image.id}>
                    <ThumbnailImg
                      src={'http://localhost:5000' + image.dateImageName}
                    ></ThumbnailImg>
                  </ContainerThumbnail>
                ))}
              </ContainerImageLayout>
            )}
          </FormContainer>
        </ListContainer>
      </Container>
    </Layout>
  );

  function onClickEdit() {
    edit();
  }
};
export default DateRecordDetail;