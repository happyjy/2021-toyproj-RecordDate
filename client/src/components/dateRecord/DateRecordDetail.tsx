import React, { useEffect } from 'react';
import { PageHeader, Button } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { dateType } from '../../types';
import styles from './DateRecord.module.css';
import styled, { css } from 'styled-components';
import Chips from './chipsComponent';

interface DetailProps {
  dateRecord: dateType | null | undefined;
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
  logout,
}) => {
  if (!!dateRecord) {
    debugger;
  }
  useEffect(() => {
    getDateList();
  }, [getDateList]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

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

      <div id="map" style={{ width: '800px', height: '600px' }}></div>

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

        <img src={'http://localhost:5000' + dateRecord.image} alt="profile" />
        <label>place1</label>
        <Chips placeList={dateRecord.placeList}></Chips>

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
