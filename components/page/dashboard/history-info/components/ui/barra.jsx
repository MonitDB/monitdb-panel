import React from 'react'

import estilo from './painel.module.css'

// Barra dentro da linha da tabela, como no Grafana deles: a proporção lê-se de
// relance e o número continua lá. A escala é o MAIOR valor da coluna nesta
// leitura — barra cheia quer dizer "o maior destes", não "100% de nada".
function Barra({ valor, maximo, texto }) {
  const numero = Number(valor)
  const tecto = Number(maximo)
  const fatia =
    Number.isFinite(numero) && Number.isFinite(tecto) && tecto > 0
      ? Math.max(1, Math.round((numero / tecto) * 100))
      : 0

  return (
    <div className={estilo.barra}>
      <span className={estilo.barraCalha}>
        <i className={estilo.barraCheia} style={{ width: `${fatia}%` }} />
      </span>
      <span className={estilo.direita}>{texto}</span>
    </div>
  )
}

export default Barra
