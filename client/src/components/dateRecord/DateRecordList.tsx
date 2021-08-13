import React, { useEffect, useState } from 'react';
import { Table, PageHeader, Button } from 'antd';
import styles from './DateRecordList.module.css';
import Layout from '../Layout';
import { dateType } from '../../types';
import DateRecord from './DateRecord';
import styled from 'styled-components';

const ListContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  /* margin-top: 62px; */
  height: 100%;
  padding: 0px 24px 16px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const ImgContainer = styled.div`
  position: sticky;
  width: 100%;
  z-index: 100;
  @media (max-width: 768px) {
    position: initial;
    /* width: 100%; */
  }
`;
const ImgItem = styled.div`
  width: 100%;
  height: 100%;
  @media (max-width: 768px) {
    height: 50vh;
    position: initial;
  }
}
`;
const TableContainer = styled.div`
  width: 100%;
  margin-top: 0px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

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
  const [mapState, setMapState] = useState<any>(); // map 객체
  const [setBoundsState, setSetBoundsState] = useState(); // 위치 객체

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
          const lat = latLongSplit[0];
          const long = latLongSplit[1];
          placeList.push({
            title: place.placeName,
            latlng: new window.kakao.maps.LatLng(lat, long),
          });
        }
      });
    });

    // 마커 이미지의 이미지 주소입니다
    // var imageSrc =
    //   'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

    // for (var i = 0; i < placeList.length; i++) {
    //   // 마커 이미지의 이미지 크기 입니다
    //   var imageSize = new window.kakao.maps.Size(24, 35);

    //   // 마커 이미지를 생성합니다
    //   var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    //   // 마커를 생성합니다
    //   new window.kakao.maps.Marker({
    //     map: map, // 마커를 표시할 지도
    //     position: placeList[i].latlng, // 마커를 표시할 위치
    //     title: placeList[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
    //     image: markerImage, // 마커 이미지
    //   });
    // }
    const bounds = new window.kakao.maps.LatLngBounds();
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);

    for (let i = 0; i < placeList.length; i++) {
      // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      let marker = new window.kakao.maps.Marker({
        position: placeList[i].latlng,
        title: placeList[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });

      marker.setMap(map);
      bounds.extend(placeList[i].latlng);
    }

    // setSetBounds(map.setBounds);
    setMapState(map);
    setSetBoundsState(bounds);
    map.setBounds(bounds);
    // setBoundsFnState(() => map.setBounds(bounds));
  }, [dateRecordList]);

  function debounce(fn, ms) {
    let timer: any;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(function () {
        timer = null;
        // fn.apply(this, arguments);
        fn.apply(fn, arguments);
      }, ms);
    };
  }

  // 지도 범위 재설정 적용
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      mapState?.setBounds(setBoundsState);
    }, 1000);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  return (
    <Layout>
      <PageHeader
        className={styles.pageHeader1}
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
      <ListContainer>
        <ImgContainer className="imgContainer">
          <ImgItem id="map"></ImgItem>
          {/* <button
            onClick={() => {
              // console.log(boundsFnState);
              console.log({ mapState, setBoundsState });
              mapState?.setBounds(setBoundsState);
            }}
          >
            클릭
          </button> */}
        </ImgContainer>

        {/* <ReplaceImgContainer></ReplaceImgContainer> */}

        <TableContainer>
          <Table
            style={{ marginTop: 0 }}
            dataSource={dateRecordList || []}
            columns={[
              {
                title: 'DateRecord',
                dataIndex: 'dateRecord',
                key: 'dateRecord',
                render: (text, record) => {
                  return (
                    <DateRecord
                      key={record.dateRecord_id}
                      {...record}
                      deleteRecordDate={deleteRecordDate}
                      goEdit={goEdit}
                    />
                  );
                },
              },
            ]}
            showHeader={false}
            pagination={false}
            loading={dateRecordList === null || loading}
            className={styles.table}
            rowKey="dateRecord_id"
          />
        </TableContainer>
      </ListContainer>
    </Layout>
  );
};

export default DateRecordList;
