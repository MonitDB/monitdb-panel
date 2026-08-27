/* eslint-disable no-console */
import React from 'react'
import { atomOneLight, CopyBlock } from 'react-code-blocks'

const Highlighter = ({
  code,
  language,
  showLineNumbers,
  maxHeight,
  maxWidth,
}) => {
  let formattedCode

  try {
    formattedCode = JSON.stringify(JSON.parse(code), undefined, 2)
  } catch (error) {
    console.error('Could not format the JSON:', error.message)
    formattedCode = code
  }

  const containerStyle = {
    maxHeight: maxHeight || 'none',
    overflowY: 'auto',
    maxWidth: maxWidth || 'none',
    overflowX: 'auto',
  }

  return (
    <div style={containerStyle}>
      <CopyBlock
        text={formattedCode}
        language={language}
        showLineNumbers={showLineNumbers}
        theme={atomOneLight}
        codeBlock
        copied
        wrapLines={true}
        wrapLongLines
      />
    </div>
  )
}

export default Highlighter
