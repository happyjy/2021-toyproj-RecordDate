import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Modal: React.FC = ({ children }) => {
  const el = document.createElement('div');
  const loaderRoot = document.getElementById('loader-root');

  console.log({ loaderRoot, children, el });

  useEffect(() => {
    loaderRoot?.appendChild(el);
    return () => {
      loaderRoot?.removeChild(el);
    };
  });

  const LoaderContainer = styled.div`
    position: relative;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  `;
  const LoaderItem = styled.label`
    position: relative;
    animation-name: heart;
    animation-duration: 1s;
    animation-iteration-count: infinite;

    @keyframes heart {
      0% {
        font-size: 3rem;
        left: 0px;
      }
      50% {
        font-size: 3.5rem;
        left: 5px;
      }
      100% {
        font-size: 3rem;
        left: 0px;
      }
    }
  `;

  const Loader = (
    <LoaderContainer className="LoaderContainer">
      <LoaderItem>❤️</LoaderItem>
    </LoaderContainer>
  );
  return ReactDOM.createPortal(Loader, el);
};

export default Modal;
