import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { message as messageDialog, PageHeader, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import {
  DateRecordReqType,
  getUserByEmailReqType,
  getUserResType,
  placeListType,
} from '../../types';
import styles from './DateRecordAdd.module.css';
import mapStyles from './map.module.css';
import styled, { css, keyframes } from 'styled-components';
import Chips from '../ChipsComponent/chipsComponent';
import map from '../map';
import useFileUpload from '../../hooks/useFileUplaod';
import FileUpload from '../FileUpload/FileUpload';
import dycalendar from '../Calendar/dyCalendar';
import moment from 'moment';
import { debounce } from '../../redux/utils';
import UserService from '../../services/UserService';

declare global {
  interface Window {
    kakao: any;
  }
}

const Container = styled.div`
  /* border: 5px solid red; */
  margin-top: 64px;
  height: calc(100vh - 64px);
`;

const MenuBackgroundContainer = styled.div`
  /* z-index: 500; */
  width: 100%;
  height: 100%;
  position: relative;
  background: #161623;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    width: 900px;
    height: 900px;
    background: linear-gradient(to right, #6d71f9, #54c1fb);
    border-radius: 50%;
    transform: translate(-200px, -120px);
  }
  &:after {
    content: '';
    position: absolute;
    right: -200px;
    bottom: -400px;
    width: 1000px;
    height: 1000px;
    background: linear-gradient(#ffc107, #e91e63);
    border-radius: 50%;
    /* z-index: 500; */
  }
`;
const MenuBackgroundBlurFilterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
`;

const ContentContainer = styled.div`
  display: grid;
  row-gap: 100px;
  margin-bottom: 30%;
  /* display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;

  width: 70%;
  height: 50%; */
  /* border: 2px solid var(--white)   */
  /* border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); */
`;

const SearchContainer = styled.div`
  /* display: flex;
  justify-content: center;
  width: 100%;
  max-width: 80%; */
  position: relative;
  margin: 0 auto;
  width: 60%;

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
const SearchCoupleInput = styled.input`
  /* padding: 40px 100px; */

  width: 100%;
  height: 100%;
  font-size: 2rem;
  background: rgba(0, 0, 0, 0);
  padding: 15px 25px;
  border: none;

  &:focus {
    outline: none;
  }
`;

const LoadingIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  /* border: 1px solid red; */
  transform: translate(-10px, -50%);

  height: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
`;
type SearchResultListContainerType = {
  setHeight: string;
};
const SearchResultListContainer = styled.div<SearchResultListContainerType>`
  position: absolute; // [!]flex item인 input dom bottom에 붙어서 늘어 트려야해서 flex영역을 벗어난 영역을 차지 하기 위한 방법
  width: calc(100% + 2px);
  left: -1px;
  height: ${({ setHeight }) => setHeight}px;
  overflow-y: scroll;
`;
const SearchItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  /* height: 100%; */
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0);
  padding: 15px 25px;
  /* border: none; */
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchItemEmailSpan = styled.span``;
const SearchItemThumbnailImg = styled.img`
  height: 1.5rem;
  filter: blur(2px);
`;

const CoupleContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  /* grid-template-rows: masonry; */
  /* display: flex;
  justify-content: space-around;
  align-items: center;

  width: 100%;
  height: 50%; */
`;
const CoupleCard1Container = styled.div`
  /* width: 33%;
  height: 100%; */
  grid-column-start: 2;
  grid-column-end: 3;
`;
const CoupleCard1 = styled.div`
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_640x640.jpg');
`;
const CoupleCard1Img = styled.img`
  width: 100%;
  height: 100%;
  /*
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_640x640.jpg'); */
`;

const CoupleCard2Container = styled.div`
  grid-column-start: 4;
  grid-column-end: 5;
`;

const LoadingRotateAnimation = keyframes`
  0%{ transform: rotate(0deg);
  100%{ transform: rotate(90deg);
}`;

const LodingSvg = styled.svg`
  width: 30px;
  height: 30px;
  overflow: visible !important;
  animation: ${LoadingRotateAnimation} 1s linear infinite;
`;

const LoadingAnimation = keyframes`
  0%, 100% { stroke-dashoffset: 20; }
  50% { stroke-dashoffset: 0; }
  50.1% { stroke-dashoffset: 40; }
`;
const LoadingCircle = styled.circle`
  fill: none;
  stroke-width: 3;
  stroke: var(--neonblue);
  stroke-linecap: round;
  transform: translate(5px, 5px);
  stroke-dasharray: 10;
  stroke-dashoffset: 20;
  animation: ${LoadingAnimation} 0.5s linear infinite;
`;

interface AddProps {
  searchLoading: boolean;
  userList: getUserResType[];
  onSearchUser: (event: ChangeEvent<HTMLInputElement>) => void;
  user: getUserResType | null;
  addDateRecord: (dateRecord: DateRecordReqType) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}

const DateRecordCouple: React.FC<AddProps> = ({
  searchLoading,
  userList,
  onSearchUser,
  user,
  addDateRecord,
  loading,
  error,
  back,
  logout,
}) => {
  const searchCoupleInputDom =
    useRef() as React.MutableRefObject<HTMLInputElement>;
  const userListContainerDom =
    useRef() as React.MutableRefObject<HTMLDivElement>;

  const [searchContainerHeight, setSearchContainerHeight] =
    useState<string>('');

  useEffect(() => {
    console.log(userList);
    console.log(searchCoupleInputDom);
    console.log(userListContainerDom);

    let a = userListContainerDom.current;
    let firstDom = userListContainerDom.current.firstElementChild;
    let firstDomRect =
      userListContainerDom.current.firstElementChild?.getBoundingClientRect();

    let userListHeight;
    if (firstDomRect) {
      userListHeight = userList.length * firstDomRect?.height;
    }

    let layer = '';
    const searchInputDomBottomYAxis =
      searchCoupleInputDom.current.getBoundingClientRect().y +
      searchCoupleInputDom.current.getBoundingClientRect().height;
    if (
      window.innerHeight < userListHeight + searchInputDomBottomYAxis + 60 &&
      userList.length > 0
    ) {
      layer = window.innerHeight - searchInputDomBottomYAxis - 60 + '';
    }

    setSearchContainerHeight(layer + '');
  }, [userList]);

  return (
    <Layout menuType="profile">
      <Container className="SectionContainer">
        <MenuBackgroundContainer>
          <MenuBackgroundBlurFilterContainer>
            <ContentContainer className="ContentContainer">
              <CoupleContainer className="CoupleContainer">
                <CoupleCard1Container className="Couple1Container">
                  <CoupleCard1Img src={user?.profileImageUrl}></CoupleCard1Img>
                </CoupleCard1Container>
                <CoupleCard2Container className="Couple2Container">
                  {/* <CoupleCard1Img src="http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_640x640.jpg"></CoupleCard1Img> */}
                  <CoupleCard1Img></CoupleCard1Img>
                </CoupleCard2Container>
              </CoupleContainer>

              <SearchContainer className="SearchContainer">
                <SearchCoupleInput
                  ref={searchCoupleInputDom}
                  onChange={(event) => {
                    event.persist();
                    onSearchUser(event);
                  }}
                  placeholder="이메일을 입력하세요"
                ></SearchCoupleInput>

                {searchLoading && (
                  <LoadingIcon>
                    <LodingSvg>
                      <LoadingCircle cx="10" cy="10" r="10"></LoadingCircle>
                    </LodingSvg>
                  </LoadingIcon>
                )}
                <SearchResultListContainer
                  ref={userListContainerDom}
                  setHeight={searchContainerHeight}
                >
                  {!searchLoading &&
                    userList &&
                    userList.map((v) => (
                      <SearchItemContainer key={v.user_id}>
                        <SearchItemEmailSpan>{v.email}</SearchItemEmailSpan>
                        <SearchItemThumbnailImg
                          src={v.thumbnailImageUrl}
                          alt=""
                        />
                      </SearchItemContainer>
                    ))}
                </SearchResultListContainer>
                {/* {!searchLoading &&
                  userList &&
                  userList.map((v) => <span>{v.email}</span>)} */}
              </SearchContainer>
            </ContentContainer>
          </MenuBackgroundBlurFilterContainer>
        </MenuBackgroundContainer>
      </Container>
    </Layout>
  );
};
export default DateRecordCouple;
