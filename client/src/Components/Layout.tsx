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
  align-items: stretch;

  margin-left: auto;
  margin-right: auto;
  /* max-width: 1400px; */
  width: 100%;
  height: auto;
  /*
    [중요] hegith: auto
      - 지도 화면에 유지 하는데 중요한 property
      - map position은 sticky로 설정
        : 영역은 차지 하면서 브라우저 고정된 위치에 위치 되어야 하기 때문
  */
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 24px;

  background: #fff;
  /* position: fixed; */
  position: sticky;
  top: 0px;
  z-index: 1000;
`;

interface LayoutProps {
  children: any | any[];
  menuType?: String;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      <HeaderContainer className="Header">
        <Header></Header>
      </HeaderContainer>
      {/* <SectionContainer className="SectionContainer"></SectionContainer> */}
      <SectionContainer>{children}</SectionContainer>
    </Container>
  );
};

export default Layout;
