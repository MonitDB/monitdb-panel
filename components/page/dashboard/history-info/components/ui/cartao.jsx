import React from 'react'

import { ACarregar, SemDados } from './estados'
import estilo from './painel.module.css'

const LARGURA = {
  1: '',
  2: estilo.larg2,
  3: estilo.larg3,
  4: estilo.larg4,
  6: estilo.larg6,
}

// Cartão do desenho: cabeçalho com título e etiquetas, corpo, e rodapé com a
// nota. Trata sozinho os dois estados que não são conteúdo: a carregar e a
// leitura falhada. Lista vazia NÃO é erro e tem de ser dita por quem chama.
function Cartao({
  titulo,
  etiquetas,
  largura = 1,
  loading = false,
  erro,
  nota,
  linhasEsqueleto = 3,
  children,
}) {
  return (
    <div className={`${estilo.cartao} ${LARGURA[largura] ?? ''}`}>
      <div className={estilo.cartaoCabecalho}>
        <h3>{titulo}</h3>
        <span className={estilo.espaco} />
        {etiquetas}
      </div>

      {loading && <ACarregar linhas={linhasEsqueleto} />}
      {!loading && erro && <SemDados causa={erro} />}
      {!loading && !erro && children}

      {nota && !loading && <div className={estilo.rodape}>{nota}</div>}
    </div>
  )
}

export default Cartao
