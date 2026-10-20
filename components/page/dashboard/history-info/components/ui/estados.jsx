import React from 'react'

import estilo from './painel.module.css'

// Os três estados do desenho: BOM com a prova, SEM DADOS com a causa, A
// CARREGAR. Nunca vazio — um quadro vazio lê-se como saúde.

export function Bom({ titulo, razao }) {
  return (
    <div className={estilo.bom}>
      <span>✓ {titulo}</span>
      {razao && <span className={estilo.razao}>{razao}</span>}
    </div>
  )
}

export function SemDados({ causa }) {
  return (
    <div className={estilo.semDados}>
      <b>Sem dados</b>
      <span>{causa}</span>
    </div>
  )
}

export function ACarregar({ linhas = 3 }) {
  return (
    <div>
      {Array.from({ length: linhas }, (_, posicao) => (
        <div key={posicao} className={estilo.aCarregar} />
      ))}
    </div>
  )
}
