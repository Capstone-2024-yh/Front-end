import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background-color: #4CAF50; /* 기본 배경색 */
  border: none;
  color: white; /* 텍스트 색 */
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px; /* 둥근 모서리 */
  transition-duration: 0.4s; /* 호버 애니메이션 속도 */
  width: 118px; /* 고정된 너비 */

  &:hover {
    background-color: white; /* 호버 시 배경색 변경 */
    color: black; /* 호버 시 텍스트 색 변경 */
    border: 2px solid #4CAF50; /* 호버 시 테두리 */
  }
`;

const StyledButton = ({ onClick, children }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default StyledButton;
