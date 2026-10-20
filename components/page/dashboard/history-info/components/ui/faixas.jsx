import React from 'react'

import estilo from './painel.module.css'

const PINTA = { warn: estilo.warn, crit: estilo.crit }
const PALAVRA = { ok: estilo.palavraOk, nenhum: estilo.palavraNenhum }

// Faixas empilhadas: a forma do Key Counters do Grafana do cliente, que o
// Danilo pediu a 12/10 ("os componentes novos podem ficar mais agrupados").
//
// Duas diferenças de propósito em relação ao original, e as duas importam:
// 1. lá a cor é fixa e decorativa — o mesmo magenta quer o número seja bom ou
//    mau. Aqui o tom vem do valor.
// 2. a cor é RACIONADA (correcção da Sara): só aviso e crítico pintam; o bom
//    fica a tinta com a palavra. Um ecrã onde o OK também pinta gasta a atenção
//    em quem não precisa dela.
function Faixas({ itens }) {
  return (
    <div className={estilo.faixas}>
      {itens.map((item) => (
        <div
          key={item.nome}
          className={`${estilo.faixa} ${PINTA[item.tom] ?? estilo.faixaLimpa}`}
        >
          <span className={estilo.faixaNome}>{item.nome}</span>
          <span className={estilo.faixaDireita}>
            <span className={estilo.faixaValor}>{item.valor ?? '—'}</span>
            {item.palavra && (
              <span className={`${estilo.palavra} ${PALAVRA[item.tom] ?? ''}`}>
                {item.palavra}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Faixas
