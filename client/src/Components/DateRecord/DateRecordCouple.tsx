import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Layout from '../Layout';
import {
  getUserResType,
  reqAcceptCoupleType,
  requsetCoupleReqType,
} from '../../types';
import styled, { keyframes } from 'styled-components';
import confirm from 'antd/lib/modal/confirm';
import { COUPLE_STATUS } from '../../Constants';

const Container = styled.div`
  height: 100vh;
  height: calc(100vh - 64px);
  @media (max-width: 768px) {
    height: calc(100vh - 58px);
  }
`;
const MenuBackgroundContainer = styled.div`
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
  }
`;
const MenuBackgroundBlurFilterContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
`;
type ContentContainerType = {
  coupleReqStatus: number | undefined;
};
const ContentContainer = styled.div<ContentContainerType>`
  display: grid;
  row-gap: 100px;
  margin-bottom: ${({ coupleReqStatus }) =>
    coupleReqStatus === undefined ? '30%' : 'none'};
`;
const SearchContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 60%;

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
const SearchCoupleInput = styled.input`
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
  overflow-y: auto;
`;
const SearchItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0);
  padding: 15px 25px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
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
`;
const CoupleCard1Container = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;

  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
const CoupleCard1Img = styled.img`
  width: 100%;
  height: 100%;
`;
type CoupleCard2ContainerType = {
  border?: string;
};

const CoupleCardHeartContainer = styled.div`
  grid-column-start: 3;
  grid-column-end: 4;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoupleCard2Container = styled.div<CoupleCard2ContainerType>`
  grid-column-start: 4;
  grid-column-end: 5;

  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);

  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;
type CoupleCard2ImgType = {
  filter: boolean;
};
const CoupleCard2Img = styled.img<CoupleCard2ImgType>`
  position: absolute;
  filter: ${({ filter }) => (filter ? 'blur(2px)' : 'none')};
  width: 100%;
  height: 100%;
`;

const RequestSpan = styled.span`
  position: relative;
`;
const RequestButton = styled.span`
  position: relative;
  padding: 10px 15px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
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

interface CoupleMngtProps {
  onAcceptCouple: (reqAcceptCouple: reqAcceptCoupleType) => void;
  onRequestCouple: (reqCoupleUsers: requsetCoupleReqType) => void;
  searchLoading: boolean;
  userList: getUserResType[];
  onSearchUser: (event: ChangeEvent<HTMLInputElement>) => void;
  ownInfo: getUserResType | null;
  partnerInfo: getUserResType | null;
  loading: boolean;
  error: Error | null;
  back: () => void;
  logout: () => void;
}
const DateRecordCouple: React.FC<CoupleMngtProps> = ({
  onAcceptCouple,
  onRequestCouple,
  searchLoading,
  userList,
  onSearchUser,
  ownInfo,
  partnerInfo,
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

  // # user email 검색 layer height 제어
  useEffect(() => {
    if (userListContainerDom.current) {
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
    }
  }, [userList]);

  // # EVENT
  // ## EVENT - 커플 요청
  const onClickSearchItem = (e) => {
    console.log('### onClickSearchItem: ', e, userList);
    const clickedUserArr = userList.filter((user) => {
      return user.user_id === e.user_id;
    });

    let clickedUser;
    if (clickedUserArr.length === 1) {
      clickedUser = clickedUserArr[0];
    }

    const onOk = () => {
      console.log('clickedUser', clickedUser);
      if (!!ownInfo && !!ownInfo.token) {
        onRequestCouple({
          reqestUserId: ownInfo.user_id,
          receiveUserId: clickedUser.user_id,
          token: ownInfo.token,
        });
      }
    };

    confirm({
      title: `${clickedUser.email}님에게 커플 요청하시겠습니까?`,
      onOk,
      onCancel: function () {},
    });
  };

  // ## EVENT - 커플 수락
  const onClickAcceptButton = (e) => {
    if (ownInfo && ownInfo.token) {
      onAcceptCouple({
        coupleId: ownInfo?.couple_id,
        status: COUPLE_STATUS.ACCPET,
        token: ownInfo.token,
      });
    }
  };

  return (
    <Layout menuType="profile">
      <Container className="Container">
        <MenuBackgroundContainer>
          <MenuBackgroundBlurFilterContainer>
            <ContentContainer
              coupleReqStatus={ownInfo?.couple_status}
              className="ContentContainer"
            >
              <CoupleContainer className="CoupleContainer">
                <CoupleCard1Container className="CoupleCard1Container">
                  <CoupleCard1Img
                    src={ownInfo?.profileImageUrl}
                  ></CoupleCard1Img>
                </CoupleCard1Container>
                {ownInfo?.couple_status === 1 && (
                  /* 커플 수락 */
                  <CoupleCardHeartContainer className="CoupleCardHeartContainer">
                    ❤️
                  </CoupleCardHeartContainer>
                )}

                {ownInfo?.couple_status === undefined && (
                  <CoupleCard2Container
                    border="none"
                    className="CoupleCard2Container"
                  >
                    '요청하세요.'
                  </CoupleCard2Container>
                )}
                {ownInfo?.couple_status === 0 &&
                  ownInfo?.user_id === ownInfo?.couple1_id && (
                    /* 요청한 사람 */
                    <CoupleCard2Container
                      border="none"
                      className="CoupleCard2Container"
                    >
                      <CoupleCard2Img
                        filter={true}
                        src={partnerInfo?.profileImageUrl}
                      />
                      <RequestSpan>요청중입니다.</RequestSpan>
                    </CoupleCard2Container>
                  )}
                {ownInfo?.couple_status === 0 &&
                  ownInfo?.user_id === ownInfo?.couple2_id && (
                    /* 요청 받은 사람: 요청하기 */
                    <CoupleCard2Container
                      border="none"
                      className="CoupleCard2Container"
                    >
                      <CoupleCard2Img
                        filter={false}
                        src={partnerInfo?.profileImageUrl}
                      />
                      <RequestButton onClick={onClickAcceptButton}>
                        수락하시겠습니까?
                      </RequestButton>
                    </CoupleCard2Container>
                  )}
                {ownInfo?.couple_status === 1 && (
                  /* 커플 수락 */
                  <CoupleCard2Container className="CoupleCard2Container">
                    <CoupleCard2Img
                      filter={false}
                      src={partnerInfo?.profileImageUrl}
                    />
                  </CoupleCard2Container>
                )}
              </CoupleContainer>

              {ownInfo?.couple_id == null && ownInfo?.couple_status !== 1 && (
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
                        <SearchItemContainer
                          key={v.user_id}
                          onClick={(e) => {
                            onClickSearchItem({ ...e, ...v });
                          }}
                        >
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
              )}
            </ContentContainer>
          </MenuBackgroundBlurFilterContainer>
        </MenuBackgroundContainer>
      </Container>
    </Layout>
  );
};
export default DateRecordCouple;
