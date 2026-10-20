import React from 'react'

import estilo from './painel.module.css'

// Cabeçalho de BLOCO, que não é o mesmo que cabeçalho de secção. Separa a era
// nova da antiga e deixa a costura à vista de propósito (desenho da Sara,
// 12/10): assim a diferença de aspecto lê-se como transição e não como defeito.
function Bloco({ ordem, titulo, nota, quando }) {
  return (
    <div className={estilo.bloco}>
      <span className={estilo.blocoEtiqueta}>Bloco {ordem}</span>
      <h2>{titulo}</h2>
      <span className={estilo.blocoNota}>{nota}</span>
      <span className={estilo.espaco} />
      {quando && <span className={estilo.quando}>{quando}</span>}
    </div>
  )
}

export default Bloco
