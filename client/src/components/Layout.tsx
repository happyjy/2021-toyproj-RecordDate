import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin-left: auto;
  margin-right: auto;
  /* max-width: 1400px; */
  width: 100%;
  margin-bottom: 50px;
`;

const Layout: React.FC = ({ children }) => (
  <Container>
    <SectionContainer>{children}</SectionContainer>
  </Container>
  // <div className={styles.layout}></div>
);

export default Layout;
