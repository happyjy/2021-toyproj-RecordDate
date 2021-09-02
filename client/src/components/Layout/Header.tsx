import {
  HeartOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { push } from 'connected-react-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  logout as logoutSaga,
  getuser as getUserSaga,
} from '../../Redux/modules/auth';
import { RootState } from '../../Redux/modules/rootReducer';
import TokenService from '../../Services/TokenService';
import { getUserResType } from '../../types';
import styles from './Header.module.css';

const TitleContainer = styled.div``;

const Title = styled.label`
  cursor: pointer;
  color: var(--blueberry);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
`;

const RightHeaderContainer = styled.div`
  display: flex;
  height: 32px;
  position: relative;
`;

const Button = styled.div`
  /* bluemana, neonblue */
  border: none;
  background-color: var(--bluemana);
  text-transform: uppercase;
  border-radius: 1px;
  border-width: 2px;
  color: white;

  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;

  cursor: pointer;

  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  transition: background-color 0.2s ease-in-out;

  &:not(:last-child) {
    margin-right: 10px;
  }
  &:hover {
    background-color: var(--neonblue);
  }
`;

const ProfileContainer = styled.div`
  height: 100%;
  border-radius: 50%;
`;

const ProfileImgContainer = styled.div`
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
`;

const ProfileImg = styled.img`
  height: 100%;
`;

type MenuContainerType = {
  isActive: Boolean;
};
const Triangle = styled.div<MenuContainerType>`
  position: absolute;
  top: ${(props) => (props.isActive ? '-20px' : '0px')};
  right: 20px;
  border-top: 10px transparent solid;
  border-right: 10px transparent solid;
  border-bottom: ${(props) =>
    props.isActive ? '10px var(--coral) solid' : 'rgba(0, 0, 0, 0)'};
  border-left: 10px #11ffee00 solid;

  transition: 0.5s;
`;

const MenuContainer = styled.div<MenuContainerType>`
  visibility: ${(props) => (props.isActive ? 'visible' : 'hidden')};
  background: ${(props) =>
    props.isActive ? 'var(--coral)' : 'rgba(0, 0, 0, 0)'};
  top: ${(props) => (props.isActive ? '45px' : '60px')};
  opacity: ${(props) => (props.isActive ? '1' : '0.5')};
  color: ${(props) =>
    props.isActive ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0)'};

  z-index: 9999;
  position: absolute;
  right: -15px;
  padding: 10px 20px;
  width: 150px;
  box-sizing: 0 5px 25px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  transition: 0.5s;
  z-index: 200;

  &::before {
    z-index: 300;
    background: inherit;
    content: '';
    position: absolute;
    top: ${(props) => (props.isActive ? '-8px' : '7px')};
    right: 22px;
    /* width: 20px;
    height: 20px; */

    border-right: ${(props) =>
      props.isActive ? '8px rgba(255, 255, 255, 1) solid' : 'none'};
    border-bottom: ${(props) =>
      props.isActive ? '8px var(--coral) solid' : 'none'};
    border-left: ${(props) =>
      props.isActive ? '8px rgba(255, 255, 255, 1) solid' : 'none'};
    transition: 0.5s;

    /* border-color: transparent yellow transparent; */
    /* transform: rotate(45deg); */
  }
`;

const MenuTitle = styled.div<MenuContainerType>`
  width: 100%;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  transition: 1s;

  color: ${(props) =>
    props.isActive ? 'var(--deuteranopia)' : 'rgba(0, 0, 0, 0)'};
`;

const MenuSubTitle = styled.div<MenuContainerType>`
  font-size: 0.8rem;
  transition: 1s;
  color: ${(props) =>
    props.isActive ? 'var(--darkGrayishBlue)' : 'rgba(0, 0, 0, 0)'};
  font-weight: 400;
`;

const MenuListContainer = styled.ul`
  padding: 0px;
  margin: 0px;
`;

const MenuList = styled.li<MenuContainerType>`
  list-style: none;
  display: flex;
  align-items: center;
  cursor: pointer;

  color: ${(props) =>
    props.isActive ? 'var(--darkGrayishBlue)' : 'rgba(0, 0, 0, 0)'};

  opacity: 0.8;
  transition: 0.5s;

  &:first-child {
    margin-top: 10px;
  }
  &:not(&:last-child) {
    margin-bottom: 10px;
  }

  &:hover {
    opacity: 1;
  }
`;

const MenuListLink = styled.span`
  font-weight: 1000;
`;

const ProfileMenu: React.FC = () => {
  const [toggleProfile, setToggleProfile] = useState<Boolean>(false);

  const dispatch = useDispatch();

  const goHome = useCallback(() => {
    dispatch(push('/'));
  }, [dispatch]);

  const goAdd = useCallback(() => {
    dispatch(push('/addDateRecord'));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
    window.Kakao.Auth.logout();
  }, [dispatch]);

  const couple = useCallback(() => {
    dispatch(push('/couple'));
    setToggleProfile((props) => !props);
  }, [dispatch]);

  const onClickProfile = (e) => {
    setToggleProfile((props) => !props);
  };
  const getUser = useCallback(
    (token: String) => {
      dispatch(getUserSaga(token));
    },
    [dispatch],
  );

  const ownInfo = useSelector<RootState, getUserResType | null>(
    (state) => state.auth && state.auth.user && state.auth.user[0],
  );
  const partnerInfo = useSelector<RootState, getUserResType | null>(
    (state) => state.auth && state.auth.user && state.auth.user[1],
  );

  // 유저 정보: user
  const token = TokenService.get();
  useEffect(() => {
    token && getUser(token);
  }, [getUser]);

  return (
    <>
      <TitleContainer className="TitleContainer">
        <Title onClick={goHome} className="Title">
          Date List
        </Title>
      </TitleContainer>
      <RightHeaderContainer className="RightHeaderContainer">
        <Button onClick={goAdd}>Add Date</Button>
        <Button onClick={logout}>Logout</Button>
        <ProfileContainer className="ProfileContainer">
          <ProfileImgContainer
            onClick={onClickProfile}
            className="ProfileImgContainer"
          >
            <ProfileImg src={ownInfo?.thumbnailImageUrl}></ProfileImg>
          </ProfileImgContainer>
          <MenuContainer isActive={toggleProfile} className="MenuContainer">
            {/* <Triangle isActive={toggleProfile} className="Triangle"></Triangle> */}
            <MenuTitle isActive={toggleProfile} className="MenuTitle">
              {ownInfo?.nickname}
              <br></br>
              <MenuSubTitle isActive={toggleProfile} className="MenuSubTitle">
                {partnerInfo?.nickname &&
                  partnerInfo?.couple_status === 1 &&
                  `❤️ ${partnerInfo?.nickname}`}
              </MenuSubTitle>
            </MenuTitle>
            <MenuListContainer className="MenuListContainer">
              <MenuList isActive={toggleProfile} className="MenuList">
                <MenuListLink className="MenuListLink">
                  <UserOutlined className={styles.menuIcon} />
                  프로필
                </MenuListLink>
              </MenuList>
              <MenuList isActive={toggleProfile} className="MenuList">
                <MenuListLink onClick={couple}>
                  <HeartOutlined className={styles.menuIcon} />
                  커플인증하기
                </MenuListLink>
              </MenuList>
              <MenuList isActive={toggleProfile} className="MenuList">
                <MenuListLink>
                  <SettingOutlined className={styles.menuIcon} />
                  설정
                </MenuListLink>
              </MenuList>
              <MenuList isActive={toggleProfile} className="MenuList">
                <MenuListLink>
                  <LogoutOutlined className={styles.menuIcon} />
                  로그아웃
                </MenuListLink>
              </MenuList>
            </MenuListContainer>
          </MenuContainer>
        </ProfileContainer>
      </RightHeaderContainer>
    </>
  );
};

export default ProfileMenu;
