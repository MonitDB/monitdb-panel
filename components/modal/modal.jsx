import React from 'react'
import styled from 'styled-components'

const StyledModal = styled.div`
  display: ${(properties) => (properties.visible ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 100;

  .modal-content {
    position: relative;
    padding: 20px;
    width: ${(properties) => (properties.width ? properties.width : '80%')};
    height: ${(properties) => (properties.height ? properties.height : '80vh')};
    background: #fff;
    border-radius: 8px;
    transition: transform 0.3s ease-in-out;
  }

  .modal-body {
    height: 80%;
    overflow-y: auto;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .footer {
    margin-top: 20px;
    text-align: right;
  }

  .flex-container {
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
  }

  .close-button {
    font-size: 24px;
    cursor: pointer;
    background: none;
    border: none;
    color: #000000;
    transition: color 0.3s ease-in-out;
  }

  .close-button:hover {
    color: #ff4500; /* Cor de destaque ao passar o mouse */
  }

  code[class*='language-'],
  pre[class*='language-'] {
    color: 'white';
  }
`

const Modal = ({
  onClose,
  visible,
  width,
  height,
  title,
  footer,
  closable = true,
  children,
}) => {
  const closeModal = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <StyledModal visible={visible} width={width} height={height}>
      <div className="modal-content">
        {closable && (
          <div className="flex-container">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
          </div>
        )}
        {title && <div className="title">{title}</div>}
        <div className="modal-body">{children}</div>
        {footer && <div className="footer">{footer}</div>}
      </div>
    </StyledModal>
  )
}

export default Modal
