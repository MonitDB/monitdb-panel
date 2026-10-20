import React from 'react'

import estilo from './painel.module.css'

const TOM = {
  neutro: '',
  info: estilo.etiquetaInfo,
  aviso: estilo.etiquetaAviso,
}

// Etiqueta de cabeçalho de cartão (ACUMULADO, POR BASE, SEM SÉRIE...). Serve
// para dizer o que o número é, antes de alguém o interpretar mal.
function Etiqueta({ tom = 'neutro', children }) {
  return <span className={`${estilo.etiqueta} ${TOM[tom]}`}>{children}</span>
}

export default Etiqueta
