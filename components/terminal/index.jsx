/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/number-literal-case */
// TerminalWindow.js
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const WindowContainer = styled.div`
  background-color: #2d2d2d;
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  width: ${(properties) => properties.width || '400px'};
  height: ${(properties) => properties.height || '300px'};
  font-family: 'Courier New', Courier, monospace;
  color: white;
`

const TitleBar = styled.div`
  background-color: #1e1e1e;
  border-bottom: 1px solid #555;
  padding: 8px;
  display: flex;
  justify-content: flex-end;
`

const Button = styled.div`
  background-color: ${(properties) => properties.color || '#ff5f56'};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-left: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(properties) =>
      properties.color ? lightenDarkenColor(properties.color, -20) : '#ff5f56'};
  }

  &:active {
    background-color: ${(properties) =>
      properties.color ? lightenDarkenColor(properties.color, -40) : '#b33b3b'};
  }
`

const Content = styled.div`
  padding: 16px;
  position: relative;
  height: calc(100% - 30px);
  overflow-y: auto;
  white-space: pre-line;

  /* Personalização da barra de rolagem */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #4a4a4a;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: #2d2d2d;
    border-radius: 10px;
  }
`

const Cursor = styled.span`
  color: #00ff00;
`

// Função para clarear ou escurecer uma cor hex
const lightenDarkenColor = (color, amount) => {
  let usePound = false

  if (color[0] === '#') {
    color = color.slice(1)
    usePound = true
  }

  const number_ = Number.parseInt(color, 16)

  let r = (number_ >> 16) + amount

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let g = ((number_ >> 8) & 0x00_ff) + amount

  if (g > 255) g = 255
  else if (g < 0) g = 0

  let b = (number_ & 0x00_00_ff) + amount

  if (b > 255) b = 255
  else if (b < 0) b = 0

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16)
}

const TerminalWindow = ({
  children,
  width,
  height,
  buttons,
  showCursor = true,
}) => {
  const [cursorVisible, setCursorVisible] = useState(true)
  const contentReference = useRef(null)

  useEffect(() => {
    // Oscilação do cursor
    const intervalId = setInterval(() => {
      setCursorVisible((previous) => !previous)
    }, 500)

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Rola para o final quando o conteúdo é atualizado
    if (contentReference.current) {
      contentReference.current.scrollTop = contentReference.current.scrollHeight
    }
  }, [children])

  return (
    <WindowContainer width={width} height={height}>
      <TitleBar>
        {buttons &&
          buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              onMouseDown={(e) => e.preventDefault()}
              title={button.tooltip}
              color={button.color}
            />
          ))}
      </TitleBar>
      <Content ref={contentReference}>
        {children}
        {showCursor && (
          <Cursor style={{ visibility: cursorVisible ? 'visible' : 'hidden' }}>
            &#9646;
          </Cursor>
        )}
      </Content>
    </WindowContainer>
  )
}

export default TerminalWindow
