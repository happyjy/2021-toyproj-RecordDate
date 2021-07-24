import React, { useEffect } from 'react';
import { Table, PageHeader, Button } from 'antd';

import styles from './DateRecordList.module.css';
import Layout from '../Layout';
import { dateType } from '../../types';
import DateRecord from './DateRecord';

declare global {
  interface Window {
    kakao: any;
  }
}
interface DateRecordsProps {
  dateRecordList: dateType[] | null;
  loading: boolean;
  error: Error | null;
  getDateList: () => void;
  deleteRecordDate: (bookId: number) => void;
  goAdd: () => void;
  goEdit: (bookId: number) => void;
  logout: () => void;
}

const DateRecordList: React.FC<DateRecordsProps> = ({
  dateRecordList,
  getDateList,
  error,
  loading,
  deleteRecordDate,
  goAdd,
  logout,
  goEdit,
}) => {
  useEffect(() => {
    getDateList();
  }, [getDateList]);

  useEffect(() => {
    if (error) {
      logout();
    }
  }, [error, logout]);

  useEffect(() => {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
        center: new window.kakao.maps.LatLng(
          37.52279639598579,
          126.88244947391755,
        ), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
      };

    var map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    let placeList: { title: string; latlng: any }[] = [];
    dateRecordList?.forEach((dateRecord) => {
      dateRecord.placeList.forEach((place) => {
        if (!!place.latLong) {
          const latLongSplit = place.latLong.split(',');
          let lat = latLongSplit[0];
          let long = latLongSplit[1];
          placeList.push({
            title: place.placeName,
            latlng: new window.kakao.maps.LatLng(lat, long),
          });
        }
      });
    });

    // 마커 이미지의 이미지 주소입니다
    var imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

    for (var i = 0; i < placeList.length; i++) {
      // 마커 이미지의 이미지 크기 입니다
      var imageSize = new window.kakao.maps.Size(24, 35);

      // 마커 이미지를 생성합니다
      var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 생성합니다
      var marker = new window.kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: placeList[i].latlng, // 마커를 표시할 위치
        title: placeList[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });
    }
  });

  return (
    <Layout>
      <PageHeader
        title={<div>Date List</div>}
        extra={[
          <Button
            key="2"
            type="primary"
            onClick={goAdd}
            className={styles.button}
          >
            Add Date
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
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div id="map" style={{ width: '800px', height: '600px' }}></div>
        {/* <img src="/love.png" style={{ height: '400px' }} alt="love" />
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
        </span> */}
      </div>
      <Table
        dataSource={dateRecordList || []}
        columns={[
          {
            title: 'Book',
            dataIndex: 'book',
            key: 'book',
            render: (text, record) => {
              return (
                <DateRecord
                  {...record}
                  deleteRecordDate={deleteRecordDate}
                  goEdit={goEdit}
                  key={record.dateRecord_id}
                />
              );
            },
          },
        ]}
        loading={dateRecordList === null || loading}
        showHeader={false}
        className={styles.table}
        rowKey="bookId"
        pagination={false}
      />
    </Layout>
  );
};

export default DateRecordList;
