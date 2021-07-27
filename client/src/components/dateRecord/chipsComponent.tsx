import React from 'react';
import styled from 'styled-components';
import { placeListType } from '../../types';
import { default as closeIcon } from '../../assets/img/close.svg';
// import { close } from '*.svg';

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 10px 0px;
`;

const Chips = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const ChipItem = styled.div`
  display: inline-flex;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-right: 8px;
  padding-left: 12px;
  border: solid 1px #ccc;
  margin-right: 5px;
  border-radius: 10px;
`;

const ChipLabel = styled.label`
  margin-right: 5px;
`;

const ChipDeleteIcon = styled.img`
  cursor: pointer;
  background-color: #aaa;
  border-radius: 5px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin: auto 0;
  text-align: center;
  line-height: 17px;
  display: inline-block;
`;

interface chipsComponent {
  placeList: placeListType[];
  setPlaceList?: (state: any) => void;
  placeMarkerList?: any[];
}
const ChipsComponent: React.FC<chipsComponent> = ({
  placeList,
  setPlaceList,
  placeMarkerList,
}) => {
  const onClickDelete = (e: any) => {
    // reset PlaceList
    const index = e.target.dataset.index;
    const filterPlaceList = placeList.filter((place) => {
      return place.id.toString() !== index && place;
    });

    // delete Place from Map
    const deletePlace = placeList.filter((place) => {
      return place.id.toString() === index && place;
    })[0];

    const latLong = deletePlace.latLong.split(', ');
    const placePosition = new window.kakao.maps.LatLng(latLong[0], latLong[1]);
    const marker = new window.kakao.maps.Marker({
      position: placePosition, // 마커의 위치
    });

    placeMarkerList && placeMarkerList[marker.n].setMap(null);
    setPlaceList && setPlaceList(filterPlaceList);
  };

  const onDragStart = (e: any) => {
    e.dataTransfer.setData('dragStartId', e.target.dataset.index);
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.dropAllowed = 'move';
  };
  const onDrop = (e: any) => {
    const dragIndex = e.dataTransfer.getData('dragStartId');
    let el = e.target;
    while (!el.dataset.index) {
      el = e.target.parentElement;
    }
    const dropIndex = el.dataset.index;
    const result = placeList.map((place) => {
      if (place.id + '' === dropIndex) {
        place.id = parseInt(dragIndex);
        return place;
      }
      if (place.id + '' === dragIndex) {
        place.id = parseInt(dropIndex);
        return place;
      }
      return place;
    });

    const resultSort = result.sort((a, b) => a.id - b.id);
    setPlaceList && setPlaceList(() => [...resultSort]);
  };
  const onDragOver = (e: any) => {
    console.log('# onDragOver');
    e.preventDefault();
  };

  return (
    <Container>
      <Chips onDragOver={onDragOver} onDrop={onDrop} onDragStart={onDragStart}>
        {placeList &&
          placeList.map((place) => (
            <ChipItem key={place.id} draggable="true" data-index={place.id}>
              <ChipLabel>{place.placeName}</ChipLabel>
              <ChipDeleteIcon
                data-index={place.id}
                onClick={(e) => onClickDelete(e)}
                src={closeIcon}
              />
            </ChipItem>
          ))}
        {placeList.length === 0 && (
          <ChipItem>
            <ChipLabel>지도에서 검색후 번호를 클릭하세요</ChipLabel>
          </ChipItem>
        )}
      </Chips>
    </Container>
  );
};

export default ChipsComponent;
