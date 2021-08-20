import React, { useState } from 'react';
import styled from 'styled-components';

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

const Layout: React.FC = ({ children }) => {
  return (
    <Container>
      <SectionContainer>{children}</SectionContainer>
    </Container>
  );
};

export default Layout;
