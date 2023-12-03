import React from 'react'
import styled, { css } from 'styled-components'

const buttonStyles = css`
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s, color 0.3s;

  &:hover {
    @apply bg-opacity-80;
  }

  &:active {
    @apply bg-opacity-100;
  }

  &:disabled {
    @apply cursor-not-allowed opacity-60;
  }
`

const Button = styled.button`
  @apply ${buttonStyles};

  ${({ type }) =>
    type === 'primary' &&
    css`
      @apply bg-blue-500 text-white border-blue-500;

      &:hover {
        @apply border-blue-600;
      }

      &:active {
        @apply border-blue-700;
      }
    `}

  ${({ type }) =>
    type === 'secondary' &&
    css`
      @apply bg-indigo-500 text-white border-indigo-500;

      &:hover {
        @apply border-indigo-600;
      }

      &:active {
        @apply border-indigo-700;
      }
    `}

  ${({ type }) =>
    type === 'ghost' &&
    css`
      @apply bg-transparent text-indigo-500 border-indigo-500;

      &:hover {
        @apply bg-indigo-500 text-white;
      }

      &:active {
        @apply bg-indigo-600;
      }
    `}
`

const CustomButton = ({ type, loading, onClick, children, ...properties }) => {
  return (
    <Button
      type={type}
      onClick={loading ? undefined : onClick}
      disabled={loading}
      {...properties}
    >
      {loading ? <span>Loading...</span> : children}
    </Button>
  )
}

export default CustomButton
