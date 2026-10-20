import React from 'react'

import estilo from './painel.module.css'
import Valor from './valor'

// Vários números pequenos no mesmo cartão, em vez de um cartão por número. Foi
// o pedido do Danilo a 12/10: "os componentes novos podem ficar mais agrupados".
//
// 13/10: cada par pode agora levar `tom` e `palavra`. Serve o Scheduler health,
// onde o chip da secção já dizia âmbar com runnable acima de zero e a linha do
// runnable no cartão não dizia nada. A ração de cor e a palavra obrigatória
// vivem no <Valor>, não aqui.
function Pares({ itens }) {
  return (
    <div className={estilo.pares}>
      {itens.map((item) => (
        <div key={item.nome} className={estilo.par}>
          <span className={estilo.parNome}>{item.nome}</span>
          <Valor
            classe={estilo.parValor}
            texto={item.valor ?? '—'}
            tom={item.tom}
            palavra={item.palavra}
          />
        </div>
      ))}
    </div>
  )
}

export default Pares
