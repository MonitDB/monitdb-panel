import React from 'react'

import estilo from './painel.module.css'

// Medidor em arco para percentagens, como o Cache Hit % do Grafana deles.
// Desenhado em SVG à mão: não acrescenta dependência nenhuma ao produto e a
// CSP do haproxy não deixa entrar nada de fora.
//
// O arco é meia circunferência de raio 46 centrada em (56,56): comprimento
// pi*46 ≈ 144,5. A fatia cheia é essa constante vezes a percentagem.
const RAIO = 46
const COMPRIMENTO = Math.PI * RAIO

function Medidor({ percentagem, legenda, cor = 'var(--indigo)' }) {
  const valor = Number(percentagem)
  const temValor = Number.isFinite(valor)
  const fatia = temValor ? (Math.min(Math.max(valor, 0), 100) / 100) * COMPRIMENTO : 0

  return (
    <div>
      <svg viewBox="0 0 112 66" width="100%" height="66" role="img">
        <path
          d={`M 10 56 A ${RAIO} ${RAIO} 0 0 1 102 56`}
          fill="none"
          stroke="var(--none-bg)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {temValor && (
          <path
            d={`M 10 56 A ${RAIO} ${RAIO} 0 0 1 102 56`}
            fill="none"
            stroke={cor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${fatia} ${COMPRIMENTO}`}
          />
        )}
      </svg>
      <div className={estilo.numero} style={{ textAlign: 'center' }}>
        {temValor ? `${valor.toFixed(2)}%` : '—'}
      </div>
      {legenda && <div className={estilo.legenda}>{legenda}</div>}
    </div>
  )
}

export default Medidor
