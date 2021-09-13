import React from 'react';
import styled from 'styled-components';
import Header from './Layout/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
`;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  @media (max-width: 768px) {
    height: calc(100vh - 58px);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px;
  background: #fff;
  position: sticky;
  top: 0px;
  z-index: 1000;
  @media (max-width: 768px) {
    padding: 13px 8px;
  }
`;

interface LayoutProps {
  children: any | any[];
  menuType?: String;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <HeaderContainer className="HeaderContainer">
        <Header></Header>
      </HeaderContainer>
      {/* <SectionContainer className="SectionContainer"></SectionContainer> */}
      <SectionContainer>{children}</SectionContainer>
    </Container>
  );
};

export default Layout;
