import React from 'react';
import styled from 'styled-components';

const CustomButton = styled.div`
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

interface IButton {
  children: React.ReactNode;
  onClick: () => void;
}
const Button: React.FC<IButton> = ({ children, onClick }) => {
  console.log({ children });
  return (
    <>
      <CustomButton onClick={onClick}>{children}</CustomButton>
    </>
  );
};

export default Button;
