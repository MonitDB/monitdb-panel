import React, { useState } from 'react'
import styled from 'styled-components'

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContent = styled.div`
  position: relative;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  width: ${(properties) => properties.width || 'auto'};
  height: ${(properties) => properties.height || 'auto'};
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: 1px solid #000;
  padding: 5px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #000;
    color: #fff;
  }
`

const Modal = ({ onClose, visible, width, height, children }) => {
  const [isModalActive, setIsModalActive] = useState(false)

  const closeModal = () => {
    setIsModalActive(false)
    if (onClose) {
      onClose()
    }
  }

  if (!visible && !isModalActive) {
    return <></>
  }

  return (
    <ModalContainer onClick={closeModal}>
      <ModalContent
        width={width}
        height={height}
        onClick={(event) => event.stopPropagation()}
      >
        <CloseButton onClick={closeModal}>x</CloseButton>
        {children}
      </ModalContent>
    </ModalContainer>
  )
}

export default Modal
