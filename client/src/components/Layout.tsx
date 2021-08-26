import { push } from 'connected-react-router';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import useProfileUrl from '../hooks/useProfileUrl';
import { logout as logoutSaga } from '../redux/modules/auth';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* height: 100vh; */
  height: auto;
`;
const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  width: 100%;
  height: auto;
  /* margin-bottom: 50px; */
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px;

  background: #fff;
  position: fixed;
  top: 0px;
  z-index: 1000;
`;

const TitleContainer = styled.div``;
const Title = styled.label`
  color: var(--blueberry);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
`;

const MenuContainer = styled.div`
  display: flex;
  height: 32px;
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
  /* width: 30px; */
  /* height: 30px; */
  border-radius: 50%;
`;

const ProfileImg = styled.img`
  height: 100%;
`;

const Layout: React.FC = ({ children }) => {
  const [profileUrl, thumbnail] = useProfileUrl();
  console.log('### url', profileUrl, thumbnail);

  const dispatch = useDispatch();

  const goAdd = useCallback(() => {
    dispatch(push('/addDateRecord'));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutSaga());
    window.Kakao.Auth.logout();
  }, [dispatch]);

  return (
    <Container>
      <Header className="Header">
        <TitleContainer className="TitleContainer">
          <Title className="Title">Date List</Title>
        </TitleContainer>

        <MenuContainer className="MenuContainer">
          <Button onClick={goAdd}>Add Date</Button>
          <Button onClick={logout}>Logout</Button>
          <ProfileContainer className="ProfileContainer">
            {/* profile */}
            <ProfileImg src="http://k.kakaocdn.net/dn/hH40V/btrb6sspo1a/gh67rnbk6NKvHsAASYtFm1/img_110x110.jpg"></ProfileImg>
          </ProfileContainer>
        </MenuContainer>
      </Header>
      <SectionContainer>{children}</SectionContainer>
    </Container>
  );
};

export default Layout;
