import React from 'react'

import estilo from './painel.module.css'

// O número grande. Um valor em falta é travessão e não zero: zero é uma
// medida, falta de medida não é.
function Numero({ valor, unidade, legenda }) {
  return (
    <div>
      <div className={estilo.numero}>
        {valor ?? '—'}
        {unidade && valor !== undefined && <small>{unidade}</small>}
      </div>
      {legenda && <div className={estilo.legenda}>{legenda}</div>}
    </div>
  )
}

export default Numero
