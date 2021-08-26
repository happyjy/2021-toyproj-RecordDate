import React from 'react';
import styled from 'styled-components';
import ProfileMenu from './Layout/ProfileMenu';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Layout: React.FC = ({ children }) => {
  return (
    <Container>
      <Header className="Header">
        <ProfileMenu></ProfileMenu>
      </Header>
      <SectionContainer className="SectionContainer"></SectionContainer>
      <SectionContainer>{children}</SectionContainer>
    </Container>
  );
};

export default Layout;
