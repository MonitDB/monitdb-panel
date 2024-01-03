import React from 'react'
import { CopyBlock, vs2015 } from 'react-code-blocks'

const Highlighter = ({ code, language, showLineNumbers, maxHeight }) => {
  // Parse o código JSON para formatá-lo com espaçamento
  const formattedCode = JSON.stringify(JSON.parse(code), undefined, 2)

  // Estilo para limitar a altura máxima
  const containerStyle = {
    maxHeight: maxHeight || 'none', // Use 'none' se maxHeight não estiver definido
    overflowY: 'auto', // Adiciona uma barra de rolagem vertical se o conteúdo ultrapassar a altura máxima
  }

  return (
    <div style={containerStyle}>
      <CopyBlock
        text={formattedCode}
        language={language}
        showLineNumbers={showLineNumbers}
        theme={vs2015}
        codeBlock
        copied
      />
    </div>
  )
}

export default Highlighter
