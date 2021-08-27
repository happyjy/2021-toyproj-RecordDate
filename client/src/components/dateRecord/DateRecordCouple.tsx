import React, { useEffect, useRef, useState } from 'react';
import { message as messageDialog, PageHeader, Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import Layout from '../Layout';
import { DateRecordReqType, getUserResType, placeListType } from '../../types';
import styles from './DateRecordAdd.module.css';
import mapStyles from './map.module.css';
import styled, { css } from 'styled-components';
import Chips from '../ChipsComponent/chipsComponent';
import map from '../map';
import useFileUpload from '../../hooks/useFileUplaod';
import FileUpload from '../FileUpload/FileUpload';
import dycalendar from '../Calendar/dyCalendar';
import moment from 'moment';

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
  margin: 0 auto;
  /* display: flex;
  justify-content: center;
  width: 100%;
  max-width: 80%; */

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
const SearchCoupleInput = styled.input`
  /* padding: 40px 100px; */
  width: 100%;
  height: 100%;
  font-size: 3rem;
  background: rgba(0, 0, 0, 0);
  padding: 25px 15px;
  border: none;

  &:focus {
    outline: none;
  }
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

interface AddProps {
  user: getUserResType | null;
  addDateRecord: (dateRecord: DateRecordReqType) => void;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}

const DateRecordCouple: React.FC<AddProps> = ({
  user,
  addDateRecord,
  loading,
  error,
  back,
  logout,
}) => {
  return (
    <Layout menuType="profile">
      <Container className="SectionContainer">
        {/* <img
          src="http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_640x640.jpg"
          alt=""
        /> */}
        <MenuBackgroundContainer>
          <MenuBackgroundBlurFilterContainer>
            <ContentContainer className="ContentContainer">
              <SearchContainer className="SearchContainer">
                <SearchCoupleInput placeholder="이메일을 입력하세요"></SearchCoupleInput>
              </SearchContainer>

              <CoupleContainer className="CoupleContainer">
                <CoupleCard1Container className="Couple1Container">
                  <CoupleCard1Img src={user?.profileImageUrl}></CoupleCard1Img>
                </CoupleCard1Container>
                <CoupleCard2Container className="Couple2Container">
                  <CoupleCard1Img src="http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_640x640.jpg"></CoupleCard1Img>
                </CoupleCard2Container>
              </CoupleContainer>
            </ContentContainer>
          </MenuBackgroundBlurFilterContainer>
        </MenuBackgroundContainer>
      </Container>
    </Layout>
  );
};
export default DateRecordCouple;
