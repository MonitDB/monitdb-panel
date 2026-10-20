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
import { comCasas, comSeparador, cortado, maximoDaColuna } from '../formatos'
import { horaDeLeitura, podeLer, valorDoContador } from '../use-component'

function colunasDosClerks(tecto) {
  return [
    { chave: 'Clerk', cabecalho: 'Clerk', formatar: cortado },
    {
      chave: 'MemoryMB',
      cabecalho: 'Memoria',
      formatar: (valor) => (
        <Barra valor={valor} maximo={tecto} texto={`${comCasas(valor)} MB`} />
      ),
    },
    { chave: 'Entries', cabecalho: 'Entradas', direita: true, formatar: comSeparador },
  ]
}

function Memoria({ user, perf, memClerks }) {
  const visivel = hasSomePermissions(
    user,
    [
      FeatureFunction.MEMORY_GRANTS,
      FeatureFunction.BUFFER_POOL,
      FeatureFunction.TOP_MEMORY_CLERKS,
    ],
    TypeGrant.READ
  )
  if (!visivel) return <></>

  const pendentes = valorDoContador(perf.data, 'Memory Grants Pending')
  const emCurso = valorDoContador(perf.data, 'Memory Grants Outstanding')
  const paginas = valorDoContador(perf.data, 'Buffer pool - Database pages MB')
  const alvo = valorDoContador(perf.data, 'Buffer pool - Target pages MB')

  return (
    <Seccao
      id="sec-memoria"
      titulo="Memoria e buffer"
      quando={horaDeLeitura(perf.lido)}
      resumo={
        <>
          <Chip tom={pendentes > 0 ? 'crit' : 'ok'} ponto>
            {comSeparador(pendentes)} grants a espera
          </Chip>
          <Chip tom="info">buffer pool {comSeparador(paginas)} MB</Chip>
        </>
      }
    >
      {podeLer(user, FeatureFunction.MEMORY_GRANTS) && (
        <Cartao
          titulo="Memory grants"
          loading={perf.loading}
          erro={perf.erro}
          nota="pendentes acima de zero quer dizer consultas a espera de memoria"
        >
          <Faixas
            itens={[
              {
                nome: 'Pendentes',
                valor: comSeparador(pendentes),
                tom: pendentes > 0 ? 'crit' : 'ok',
                palavra: pendentes > 0 ? 'CRITICO · consultas a espera' : 'OK',
              },
              {
                nome: 'Em curso',
                valor: comSeparador(emCurso),
                tom: 'nenhum',
              },
            ]}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.BUFFER_POOL) && (
        <Cartao
          titulo="Buffer pool"
          loading={perf.loading}
          erro={perf.erro}
          nota="paginas de dados contra o alvo que a instancia pediu"
        >
          <Faixas
            itens={[
              {
                nome: 'Paginas de dados',
                valor: `${comSeparador(paginas)} MB`,
                tom: 'nenhum',
              },
              { nome: 'Alvo', valor: `${comSeparador(alvo)} MB`, tom: 'nenhum' },
            ]}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.TOP_MEMORY_CLERKS) && (
        <Cartao
          titulo="Top memory clerks"
          loading={memClerks.loading}
          erro={memClerks.erro}
          linhasEsqueleto={6}
        >
          <Tabela
            colunas={colunasDosClerks(maximoDaColuna(memClerks.data, 'MemoryMB'))}
            linhas={memClerks.data}
            limite={8}
          />
        </Cartao>
      )}
    </Seccao>
  )
}

export default Memoria
