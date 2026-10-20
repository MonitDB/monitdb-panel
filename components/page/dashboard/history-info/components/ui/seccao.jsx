import React from 'react'

import estilo from './painel.module.css'

// Secção numerada do desenho: número, nome, chips de resumo que informam mesmo
// com a secção fechada, e o instante da última leitura à direita.
// Sem numeração durante a transição (decisão da Sara, Q1, 12/10): numerar é
// informação de SEQUÊNCIA, e enquanto metade do separador é antiga a sequência
// não existe — numerar prometia uma arrumação que a página ainda não tem.
function Seccao({ id, titulo, resumo, quando, children }) {
  return (
    <section className={estilo.seccao} id={id}>
      <div className={estilo.cabecalho}>
        <h2>{titulo}</h2>
        <div className={estilo.resumo}>{resumo}</div>
        <span className={estilo.espaco} />
        {quando && <span className={estilo.quando}>{quando}</span>}
      </div>
      <div className={estilo.grelha}>{children}</div>
    </section>
  )
}

export default Seccao
