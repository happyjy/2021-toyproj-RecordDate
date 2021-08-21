import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  Table,
  PageHeader,
  Button,
  DatePicker,
  Input,
  Dropdown,
  Menu,
} from 'antd';
import styles from './DateRecordList.module.css';
import Layout from '../Layout';
import {
  dateRecordListExtendType,
  searchOptionType,
  keywordSearchType,
  placeListType,
} from '../../types';
import DateRecord from './DateRecord';
import styled from 'styled-components';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { debounce, getDateFormatSearchType } from '../../redux/utils';

const Container = styled.div`
  /* border: 5px red solid; */
  position: relative;
  top: 64px;
  display: flex;
  flex-direction: row;
  height: 100%;
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
  /* border: 5px blue solid; */
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  flex-basis: 60%;
  /* z-index: 100; */
  @media (max-width: 768px) {
    position: initial;
    /* width: 100%; */
  }
`;
const MapSpace = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  @media (max-width: 768px) {
    height: 50vh;
    position: initial;
  }
`;
const ListContainer = styled.div`
  /* border: 5px black solid; */
  flex-basis: 40%;
`;
const ConditionContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  position: sticky;
  top: 64px;
  z-index: 1000;
  background: #fff;

  & > * {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  /* justify-content: space-between; */
`;
// const PickerContainer = styled.div``;
const SearchContainer = styled.div`
  /* display: flex;
  flex-direction: row;
  justify-content: space-between; */
  position: relative;
`;
const FilterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;
const FilterOutlinedContainer = styled.div`
  /* position: absolute;
  margin: 0;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%); */
`;
const TableContainer = styled.div`
  width: 100%;
  margin-top: 0px;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const InputContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;
const SearchOutlinedContainer = styled.div`
  position: absolute;
  margin: 0;
  right: 12px;
  top: 50%;
  transform: translate(0, -50%);
  cursor: point;
`;

interface DateRecordsProps {
  dateRecordList: dateRecordListExtendType[] | null;
  loading: boolean;
  error: Error | null;
  getDateList: (searchOption: searchOptionType) => void;
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
  const [kakaoMapObjState, setKakaoMapObjState] = useState<any>(); // map 객체
  const [initBoundsState, setInitBoundsState] = useState(); // 위치 객체
  const [initMarkerArrState, setInitMarkerArrState] = useState<any[]>(); // 위치 객체

  const [dateRecordListState, setDateRecordListState] = useState<
    dateRecordListExtendType[] | null
  >(dateRecordList); // list state

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() - 6);

  // 검색조건(키워드)
  const [keywordSeach, setKeywordSearch] = useState<String>('');

  // 검색조건(기간, 정렬)
  const [searchOption, setSearchOption] = useState<searchOptionType>({
    rangeDate: [
      getDateFormatSearchType(targetDate),
      getDateFormatSearchType(new Date()),
    ],
    sort: 'desc',
  });

  useEffect(() => {
    getDateList(searchOption);
  }, [getDateList]);

  useEffect(() => {
    setDateRecordListState(dateRecordList);
  }, [dateRecordList]);

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

    const kakaoMapObj = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    let willMarkedPlaceList: { title: string; latlng: any }[] = [];
    dateRecordList?.forEach((dateRecord) => {
      dateRecord.placeList.forEach((place) => {
        if (!!place.latLong) {
          const latLongSplit = place.latLong.split(',');
          const lat = latLongSplit[0];
          const long = latLongSplit[1];
          willMarkedPlaceList.push({
            title: place.placeName,
            latlng: new window.kakao.maps.LatLng(lat, long),
          });
        }
      });
    });

    // 마커 이미지의 이미지 주소입니다
    // var imageSrc =
    //   'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';

    // for (var i = 0; i < willMarkedPlaceList.length; i++) {
    //   // 마커 이미지의 이미지 크기 입니다
    //   var imageSize = new window.kakao.maps.Size(24, 35);

    //   // 마커 이미지를 생성합니다
    //   var markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

    //   // 마커를 생성합니다
    //   new window.kakao.maps.Marker({
    //     map: map, // 마커를 표시할 지도
    //     position: willMarkedPlaceList[i].latlng, // 마커를 표시할 위치
    //     title: willMarkedPlaceList[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
    //     image: markerImage, // 마커 이미지
    //   });
    // }
    const bounds = new window.kakao.maps.LatLngBounds();
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSize = new window.kakao.maps.Size(24, 35);

    let initMarkerArr: any = [];
    for (let i = 0; i < willMarkedPlaceList.length; i++) {
      // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
      );

      let marker = new window.kakao.maps.Marker({
        position: willMarkedPlaceList[i].latlng,
        title: willMarkedPlaceList[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });

      initMarkerArr.push(marker);
      marker.setMap(kakaoMapObj);
      bounds.extend(willMarkedPlaceList[i].latlng);
    }

    setKakaoMapObjState(kakaoMapObj);
    setInitBoundsState(bounds);
    setInitMarkerArrState(initMarkerArr);
    kakaoMapObj.setBounds(bounds);
  }, [dateRecordList]);

  // 지도 범위 재설정 적용
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      kakaoMapObjState?.setBounds(initBoundsState);
    }, 1000);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  // 조회 이벤트
  const onChangeDatePicker = function (_, rangeDate: string[]) {
    setSearchOption((option) => {
      return { ...option, rangeDate };
    });
  };
  const onClickSearchButton = function () {
    getDateList(searchOption);
  };
  const onClickSortButton = function (type) {
    setSearchOption((option) => {
      return { ...option, sort: type };
    });
  };
  const { RangePicker } = DatePicker;
  const dropdownMenu = (
    <Menu>
      <Menu.Item>
        <div onClick={() => onClickSortButton('desc')}>내림차순 정렬</div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => onClickSortButton('asc')}>오름차순 정렬</div>
      </Menu.Item>
    </Menu>
  );
  const onChangeKeywordSearch = function ({ target: { value } }) {
    setKeywordSearch(value);
  };
  const onKeydownKeywordSearch: (keywordSearchType) => void = function ({
    key,
    target: { value },
  }) {
    if (key === 'Enter') {
      if (!value) {
        setDateRecordListState(dateRecordList);
      } else {
        keywordSearch(value);
      }
    }
  };
  const onClickKeywordSearch = function () {
    keywordSearch(keywordSeach);
  };

  const keywordSearch = function (value) {
    let restultFromTitle: dateRecordListExtendType[] = [];
    restultFromTitle =
      dateRecordList?.filter((v) => {
        return v.title.includes(value);
      }) || [];

    let resultFromPlaceList: dateRecordListExtendType[] = [];
    dateRecordList?.forEach((v) => {
      let result = v.placeList?.filter((v) =>
        v.placeName.includes(value),
      ).length;

      if (result > 0) {
        resultFromPlaceList.push(v);
      }
    });

    let resultMerge = [...restultFromTitle, ...resultFromPlaceList];
    setDateRecordListState(resultMerge);
  };

  // reset marker, bound
  const resetMapByDateRecord = function (e, clickedDateRecordId) {
    console.log('### resetMapByDateRecord');
    // 기존 marker 제거
    // initMarkerArrState?.forEach((marker) => {
    //   marker.setMap(null);
    // });

    // reset marker, bound
    const filterDateRecordList: dateRecordListExtendType | undefined =
      dateRecordListState?.filter(
        (v) => v.dateRecord_id === clickedDateRecordId,
      )[0];

    const placeList: placeListType[] | undefined =
      filterDateRecordList?.placeList;

    const bounds = new window.kakao.maps.LatLngBounds();
    const imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
    const imageSrc1 =
      'https://image.flaticon.com/icons/png/512/2107/2107845.png'; // red heart
    const imageSrc2 =
      'https://image.flaticon.com/icons/png/512/1405/1405351.png'; // heart*3
    const imageSize = new window.kakao.maps.Size(24, 24);

    if (filterDateRecordList && placeList && placeList?.length > 0) {
      for (let i = 0; i < placeList.length; i++) {
        // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
        const markerImage = new window.kakao.maps.MarkerImage(
          imageSrc1,
          imageSize,
        );

        const latLongSplit = placeList[i].latLong.split(',');
        const lat = latLongSplit[0];
        const long = latLongSplit[1];
        const mapLatLng = new window.kakao.maps.LatLng(lat, long);

        let marker = new window.kakao.maps.Marker({
          position: mapLatLng,
          title: filterDateRecordList?.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });

        marker.setMap(kakaoMapObjState);
        bounds.extend(mapLatLng);
      }

      kakaoMapObjState?.setBounds(bounds);
    }
  };
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
      <Container className="Container">
        <MapContainer className="MapContainer">
          <MapSpace id="map"></MapSpace>
          {/* <button
            onClick={() => {
              // console.log(boundsFnState);
              console.log({ mapState, setBoundsState });
              mapState?.setBounds(setBoundsState);
            }}
          >
            클릭
          </button> */}
        </MapContainer>
        <ListContainer className="ListContainer">
          <ConditionContainer className="ConditionContainer">
            <FilterContainer>
              <RangePicker
                picker="month"
                onChange={onChangeDatePicker}
                defaultValue={[
                  moment(searchOption.rangeDate[0]),
                  moment(searchOption.rangeDate[1]),
                ]}
              ></RangePicker>
              <FilterOutlinedContainer className="FilterOutlinedContainer">
                <Dropdown overlay={dropdownMenu} placement="bottomCenter">
                  <Button>
                    <FilterOutlined />
                  </Button>
                </Dropdown>
                <SearchOutlined onClick={onClickSearchButton} />
              </FilterOutlinedContainer>
            </FilterContainer>
            <SearchContainer>
              <InputContainer>
                <Input
                  placeholder="keyword"
                  onChange={onChangeKeywordSearch}
                  onKeyDown={onKeydownKeywordSearch}
                ></Input>
                <SearchOutlinedContainer>
                  <SearchOutlined onClick={onClickKeywordSearch} />
                </SearchOutlinedContainer>
              </InputContainer>
            </SearchContainer>
          </ConditionContainer>
          <TableContainer className="TableContainer">
            <Table
              style={{ marginTop: 0 }}
              dataSource={dateRecordListState || []}
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
                        resetMapByDateRecord={resetMapByDateRecord}
                      />
                    );
                  },
                },
              ]}
              showHeader={false}
              pagination={false}
              loading={dateRecordListState === null || loading}
              className={styles.table}
              rowKey="dateRecord_id"
            />
          </TableContainer>
        </ListContainer>
      </Container>
    </Layout>
  );
};

export default DateRecordList;
