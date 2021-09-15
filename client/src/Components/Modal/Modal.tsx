import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal: React.FC = ({ children }) => {
  const el = document.createElement('div');
  const modalRoot = document.getElementById('modal-root');

  console.log({ modalRoot, children, el });

  useEffect(() => {
    modalRoot?.appendChild(el);
    return () => {
      modalRoot?.removeChild(el);
    };
  });
  return ReactDOM.createPortal(children, el);
};

export default Modal;
