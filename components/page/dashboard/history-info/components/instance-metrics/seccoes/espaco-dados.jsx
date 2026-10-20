import React from 'react'

import {
  FeatureFunction,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import Barra from '../../ui/barra'
import Cartao from '../../ui/cartao'
import Chip from '../../ui/chip'
import Faixas from '../../ui/faixas'
import Seccao from '../../ui/seccao'
import Tabela from '../../ui/tabela'
import {
  comCasas,
  comSeparador,
  cortado,
  maximoDaColuna,
  somaDaColuna,
} from '../formatos'
import { horaDeLeitura, podeLer } from '../use-component'

function colunasDasTabelas(tecto) {
  return [
    { chave: 'Database', cabecalho: 'Base', formatar: cortado },
    { chave: 'Schema', cabecalho: 'Schema' },
    { chave: 'Table', cabecalho: 'Tabela', formatar: cortado },
    { chave: 'Rows', cabecalho: 'Linhas', direita: true, formatar: comSeparador },
    {
      chave: 'ReservedMB',
      cabecalho: 'Espaco',
      formatar: (valor) => (
        <Barra valor={valor} maximo={tecto} texto={`${comCasas(valor)} MB`} />
      ),
    },
  ]
}

function colunasDosIndices(tecto) {
  return [
    { chave: 'Database', cabecalho: 'Base', formatar: cortado },
    { chave: 'Table', cabecalho: 'Tabela', formatar: cortado },
    { chave: 'Index', cabecalho: 'Indice', formatar: cortado },
    {
      chave: 'Seeks',
      cabecalho: 'Seeks',
      formatar: (valor) => (
        <Barra valor={valor} maximo={tecto} texto={comSeparador(valor)} />
      ),
    },
    { chave: 'Scans', cabecalho: 'Scans', direita: true, formatar: comSeparador },
    { chave: 'Updates', cabecalho: 'Updates', direita: true, formatar: comSeparador },
  ]
}

function EspacoDados({ user, topTables, dataOvw, indexUse }) {
  const visivel = hasSomePermissions(
    user,
    [
      FeatureFunction.TOP_TABLES,
      FeatureFunction.DATA_OVERVIEW,
      FeatureFunction.INDEX_USAGE,
    ],
    TypeGrant.READ
  )
  if (!visivel) return <></>

  const bases = (dataOvw.data ?? []).length
  const tabelas = somaDaColuna(dataOvw.data, 'Tables')
  const linhas = somaDaColuna(dataOvw.data, 'TotalRows')
  const emFalta = somaDaColuna(dataOvw.data, 'MissingIndexes')

  return (
    <Seccao
      id="sec-espaco"
      titulo="Espaco"
      quando={horaDeLeitura(dataOvw.lido)}
      resumo={
        <>
          <Chip tom="info" ponto>
            {comSeparador(bases)} bases
          </Chip>
          <Chip tom={emFalta > 0 ? 'warn' : 'ok'}>
            {comSeparador(emFalta)} indices em falta
          </Chip>
        </>
      }
    >
      {podeLer(user, FeatureFunction.DATA_OVERVIEW) && (
        <Cartao
          titulo="Data overview"
          loading={dataOvw.loading}
          erro={dataOvw.erro}
          nota="somado sobre as bases online, sem a model e a tempdb"
        >
          <Faixas
            itens={[
              { nome: 'Tabelas', valor: comSeparador(tabelas), tom: 'nenhum' },
              { nome: 'Linhas', valor: comSeparador(linhas), tom: 'nenhum' },
              {
                nome: 'Indices em falta',
                valor: comSeparador(emFalta),
                tom: emFalta > 0 ? 'warn' : 'ok',
                palavra:
                  emFalta > 0 ? 'AVISO · lista noutra consulta' : 'OK',
              },
            ]}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.TOP_TABLES) && (
        <Cartao
          titulo="Top tables"
          largura={2}
          loading={topTables.loading}
          erro={topTables.erro}
          linhasEsqueleto={6}
        >
          <Tabela
            colunas={colunasDasTabelas(maximoDaColuna(topTables.data, 'ReservedMB'))}
            linhas={topTables.data}
            limite={8}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.INDEX_USAGE) && (
        <Cartao
          titulo="Index usage"
          largura={3}
          loading={indexUse.loading}
          erro={indexUse.erro}
          linhasEsqueleto={6}
          nota="contadores acumulados desde o arranque; indice so com updates e indice que custa e nao serve"
        >
          <Tabela
            colunas={colunasDosIndices(maximoDaColuna(indexUse.data, 'Seeks'))}
            linhas={indexUse.data}
            limite={10}
          />
        </Cartao>
      )}
    </Seccao>
  )
}

export default EspacoDados
