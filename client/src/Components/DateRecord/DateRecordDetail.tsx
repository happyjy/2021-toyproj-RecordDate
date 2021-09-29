import React, { useEffect, useRef, useState } from 'react';
import Layout from '../Layout';
import { dateRecordListExtendType } from '../../types';
import styles from './DateRecord.module.css';
import styled, { css } from 'styled-components';
import Chips from '../ChipsComponent/ChipsComponent';
import dycalendar from '../Calendar/dyCalendar';
import Carousel from '../Carousel/Carousel';
import Modal from '../Modal/Modal';

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
const ContainerImageLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: space-around;
  grid-gap: 10px;
  position: relative;
  /* margin-top: 20px; */
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
interface DetailProps {
  dateRecord: dateRecordListExtendType | null | undefined;
  resultGetDateDetail: dateRecordListExtendType | null | undefined;
  getDateDetail: () => void;
  getDataLoading: Boolean;
  error: Error | null;
  logout: () => void;
}
const DateRecordDetail: React.FC<DetailProps> = ({
  dateRecord,
  resultGetDateDetail,
  getDateDetail,
  getDataLoading,
  error,
  logout: onClickLogout,
}) => {
  const [dateRecordDetailData, setDateRecordDetailData] =
    useState<dateRecordListExtendType>();
  useEffect(() => {
    if (dateRecord) {
      setDateRecordDetailData(dateRecord);
    } else if (resultGetDateDetail) {
      setDateRecordDetailData(resultGetDateDetail);
    } else {
      getDateDetail();
    }
  }, [dateRecord, resultGetDateDetail, getDateDetail]);

  useEffect(() => {
    if (error) {
      onClickLogout();
    }
  }, [error, onClickLogout]);

  // 다음 지도
  useEffect(() => {
    setTimeout(() => {
      const mapContainer = document.getElementById('map'), // 지도를 표시할 div
        mapOption = {
          center: new window.kakao.maps.LatLng(
            37.52279639598579,
            126.88244947391755,
          ), // 지도의 중심좌표
          level: 5, // 지도의 확대 레벨
        };
      const map = new window.kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
      const placeList =
        (dateRecordDetailData && dateRecordDetailData.placeList) || [];
      const bounds = new window.kakao.maps.LatLngBounds();

      const imageSrc =
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png';
      const imageSize = new window.kakao.maps.Size(24, 35);

      for (let i = 0; i < placeList.length; i++) {
        // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
        let latLong = placeList[i].latLong.split(', ');
        let placePosition1 = new window.kakao.maps.LatLng(
          latLong[0],
          latLong[1],
        );
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
  });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  /* cycalendar, setting textArea rows */
  useEffect(() => {
    if (!dateRecordDetailData) return;
    if (textAreaRef && textAreaRef.current) {
      const textAreaRow =
        dateRecordDetailData.description?.split('\n').length + 1;
      textAreaRef.current.rows = textAreaRow;
    }

    const dateTimeDateObj =
      dateRecordDetailData?.dateTime &&
      new Date(dateRecordDetailData?.dateTime);
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
  }, [dateRecordDetailData]);

  const ModalContainer = styled.div`
    position: relative;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;

  const CloseIcon = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    top: 8px;
    right: 8px;
    opacity: 0.7;
    cursor: pointer;

    &:after,
    &:before {
      content: '';
      position: absolute;
      width: 3px;
      height: 80%;
      top: 50%;
      left: 50%;
      background: #fff;
    }
    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  `;
  const [modal, setModal] = useState(<div></div>);

  if (dateRecordDetailData === null) {
    return null;
  }
  if (getDataLoading) {
    return (
      <div>
        <h1> 로딩중 </h1>
      </div>
    );
  }
  if (dateRecordDetailData === undefined || getDataLoading) {
    return (
      <div>
        <h1>NotFound dateRecord</h1>
      </div>
    );
  }

  const handleHide = () => {
    setModal(<></>);
  };
  const modalTemplate = (clickIdx) => (
    <Modal>
      <ModalContainer className="modal" onClick={handleHide}>
        <Carousel
          images={dateRecordDetailData.dateImageList}
          clickIdx={clickIdx}
          width={700}
        ></Carousel>
        <CloseIcon onClick={handleHide}></CloseIcon>
      </ModalContainer>
    </Modal>
  );
  const onClickContainerImageLayout = (e) => {
    const clickIdx = e.target.dataset.index || 0;
    setModal(modalTemplate(Number(clickIdx)));
  };

  return (
    <Layout>
      <Container className="Container">
        <MapContainer>
          <MapSpace id="map"></MapSpace>
        </MapContainer>
        <ListContainer className="ListContainer">
          <FormContainer className="FormContainer">
            <CalendartitleChipsContainer className="CalendartitleChipsContainer">
              <CalendarContainer className="CalendarContainer">
                <Calendar className="Caldendar" id="dycalendar"></Calendar>
              </CalendarContainer>
              <TitleChipsContainer className="TitleChipsContainer">
                {/* <InputEl
                  value={dateRecordDetailData.title}
                  type="text"
                  id="title"
                  name="title"
                  placeholder="title..."
                  readOnly
                /> */}
                <label>{dateRecordDetailData.title}</label>
                <Chips placeList={dateRecordDetailData.placeList}></Chips>
              </TitleChipsContainer>
            </CalendartitleChipsContainer>
            <TextAreaEl
              ref={textAreaRef}
              // row={textAreaRow}
              value={dateRecordDetailData.description}
              placeholder="Comment"
              className={styles.input}
              readOnly
              disabled
            />
            {dateRecordDetailData.dateImageList.length > 0 && (
              <ContainerImageLayout onClick={onClickContainerImageLayout}>
                {dateRecordDetailData.dateImageList.map((image, i) => (
                  <ContainerThumbnail
                    className="ContainerThumbnail"
                    key={image.id}
                  >
                    <ThumbnailImg
                      // src={'http://localhost:5000' + image.dateImageName}
                      data-index={i + 1}
                      src={image.dateImageName}
                    ></ThumbnailImg>
                  </ContainerThumbnail>
                ))}
              </ContainerImageLayout>
            )}
            {modal}
          </FormContainer>
        </ListContainer>
      </Container>
    </Layout>
  );
};
export default DateRecordDetail;
