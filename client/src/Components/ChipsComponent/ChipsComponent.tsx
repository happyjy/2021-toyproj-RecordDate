import React from 'react';
import styled from 'styled-components';
import { placeListType } from '../../types';
import { default as closeIcon } from '../../assets/img/close.svg';

const Container = styled.div`
  width: 100%;
  margin: 0px;
  @media (max-width: 768px) {
    width: initial;
    margin-top: 20px;
  }
`;

const Chips = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  @media (max-width: 768px) {
    width: initial;
  }
`;

type ChipItemType = {
  stretchLine?: Boolean;
  marginRight?: Number;
  marginBottom?: Number;
};
const ChipItem = styled.div<ChipItemType>`
  width: ${({ stretchLine }) => (stretchLine ? '100%' : 'initial')};
  margin-right: ${({ marginRight }) =>
    marginRight ? `${marginRight}px` : 'initial'};
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? `${marginBottom}px` : 'initial'};
  display: inline-flex;
  padding: 7px 12px;
  border: solid 1px #ccc;
  border-radius: 4px;
  @media (max-width: 768px) {
    padding: 3px;
  }
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
  showDelIcon?: boolean;
}
const ChipsComponent: React.FC<chipsComponent> = ({
  placeList,
  setPlaceList,
  placeMarkerList,
  showDelIcon = false,
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
            <ChipItem
              className="ChipItem"
              data-index={place.id}
              key={place.id}
              draggable="true"
              marginRight={1}
              marginBottom={1}
            >
              <ChipLabel>{place.placeName}</ChipLabel>
              {showDelIcon && (
                <ChipDeleteIcon
                  data-index={place.id}
                  onClick={(e) => onClickDelete(e)}
                  src={closeIcon}
                />
              )}
            </ChipItem>
          ))}
        {placeList.length === 0 && (
          <ChipItem stretchLine={true}>
            <ChipLabel>지도에서 검색후 번호를 클릭하세요</ChipLabel>
          </ChipItem>
        )}
      </Chips>
    </Container>
  );
};

export default ChipsComponent;
