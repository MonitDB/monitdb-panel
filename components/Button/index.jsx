import React from 'react'
import styled, { css } from 'styled-components'

const buttonStyles = css`
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;

  font-size: 12px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;

  color: #fff;
  border-radius: 4px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

const CustomButton = styled.button`
  ${buttonStyles}
  ${({ type }) =>
    type === 'primary' &&
    css`
      background-color: #5046e5;
      color: white;
      border: 1px solid #5046e5;

      &:hover {
        background-color: 1px solid #362f92;
      }

      &:active {
        background-color: #2c2799;
      }
    `}

  ${({ type }) =>
    type === 'secondary' &&
    css`
      color: #363636;
      border: 1px solid #5046e5;

      &:hover {
        color: #2b2b2b;
        border: 1px solid #362f92;
      }

      &:active {
        color: #000000;
        border-color: #2c2799;
      }
    `}

  ${({ type }) =>
    type === 'ghost' &&
    css`
      background-color: transparent;
      color: #6867ef;
      border: 1px solid #6867ef;

      &:hover {
        background-color: #6867ef;
        color: white;
      }

      &:active {
        background-color: darken(#6867ef, 10%);
      }
    `}
`

const Button = ({ type, loading, onClick, children, ...properties }) => {
  return (
    <CustomButton
      type={type}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      {...properties}
    >
      {loading ? <span>Loading...</span> : children}
    </CustomButton>
  )
}

export default Button
