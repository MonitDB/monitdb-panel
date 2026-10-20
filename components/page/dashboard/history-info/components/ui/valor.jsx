import React from 'react'

import estilo from './painel.module.css'

const TINTA = { warn: estilo.tintaWarn, crit: estilo.tintaCrit }

// Valor com ESTADO, para dentro do cartão e da tabela.
//
// 13/10/2026 — nasceu de uma correcção da Sara que confirmei no código: o chip
// da secção "Esperas e CPU" anunciava âmbar (runnable acima de zero, pior
// ficheiro acima de 20 ms) e o cartão por baixo mostrava o mesmo número a
// tinta normal. Quem lê o chip e desce para procurar a causa não encontra nada
// marcado.
//
// Duas regras, as mesmas das faixas: a cor é RACIONADA (só aviso e crítico
// pintam; o bom fica a tinta) e NUNCA vai sozinha — quem pinta leva a palavra
// ao lado, que é o que se lê quando a cor não chega.
function Valor({ texto, tom, palavra, classe = '' }) {
  const tinta = TINTA[tom]
  if (!tinta) return <span className={classe}>{texto}</span>

  return (
    <span className={estilo.valorCaixa}>
      <span className={`${classe} ${tinta}`}>{texto}</span>
      {palavra && (
        <span className={`${estilo.palavra} ${tinta}`}>{palavra}</span>
      )}
    </span>
  )
}

export default Valor
