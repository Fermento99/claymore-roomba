import styled from '@emotion/styled';

export const Button = styled.button<{ active?: boolean }>`
  border-radius: 16px;
  margin: 0.25em 1em;
  padding: 0 0.75em;
  background-color: ${({ active }) => (active ? '#e8833f' : '#6d9886')};
  border-style: outset;
  border-width: 2px;
  border-color: ${({ active }) => (active ? '#f6ab7b' : '#8ec5af')};
  color: #f7f7f7;
  font-size: 14px;

  &:not(:disabled):hover::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    opacity: 0.12;
    border-radius: 16px;
    background-color: #fff;
  }
  &:active {
    border-style: inset;
  }
`;
