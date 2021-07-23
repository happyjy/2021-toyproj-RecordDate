import React from 'react';
import styled from 'styled-components';
import { placeListType } from '../types';
import { default as closeIcon } from '../assets/img/close.svg';
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
  onClickDelete: (e: any) => void;
}
const ChipsComponent: React.FC<chipsComponent> = ({
  placeList,
  onClickDelete,
}) => {
  return (
    <Container>
      <Chips>
        {placeList &&
          placeList.map((place) => (
            <ChipItem key={place.id}>
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
