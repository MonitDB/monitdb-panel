import React from 'react'

import estilo from './painel.module.css'

// Barra de secções horizontal e pegajosa, no lugar do índice lateral: a 934 e a
// 1168 px de secção o índice lateral custava uma coluna inteira. Esta custa
// 34 px de altura e nenhum de largura, e o separador tem mais de 6000 px.
function BarraSeccoes({ atalhos, quando }) {
  return (
    <nav className={estilo.barra2}>
      {atalhos.map((atalho) => (
        <a
          key={atalho.id}
          href={`#${atalho.id}`}
          className={`${estilo.atalho} ${atalho.bloco ? estilo.atalhoBloco : ''}`}
        >
          {atalho.nome}
        </a>
      ))}
      <span className={estilo.espaco} />
      {quando && <span className={estilo.quando}>{quando}</span>}
    </nav>
  )
}

export default BarraSeccoes
