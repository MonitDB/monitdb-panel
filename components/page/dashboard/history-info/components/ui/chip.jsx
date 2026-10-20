import React from 'react'

import estilo from './painel.module.css'

const TOM = {
  ok: estilo.ok,
  info: estilo.info,
  warn: estilo.warn,
  crit: estilo.crit,
  nenhum: estilo.nenhum,
}

// Chip de resumo da secção. No desenho da Sara estes chips existem para a
// secção informar mesmo quando está fechada — por isso levam sempre número ou
// palavra, nunca só cor.
function Chip({ tom = 'nenhum', ponto = false, children }) {
  return (
    <span className={`${estilo.chip} ${TOM[tom] ?? estilo.nenhum}`}>
      {ponto && <i />}
      {children}
    </span>
  )
}

export default Chip
