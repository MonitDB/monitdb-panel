import React from 'react'

import {
  FeatureFunction,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import Barra from '../../ui/barra'
import Cartao from '../../ui/cartao'
import Chip from '../../ui/chip'
import Etiqueta from '../../ui/etiqueta'
import Medidor from '../../ui/medidor'
import Numero from '../../ui/numero'
import Seccao from '../../ui/seccao'
import Tabela from '../../ui/tabela'
import {
  comCasas,
  comSeparador,
  maximoDaColuna,
  somaDaColuna,
} from '../formatos'
import { horaDeLeitura, podeLer, valorDoContador } from '../use-component'

const ACUMULADO = 'desde o arranque da instancia'
const BOM_CACHE = 95

function colunasDoPlanCache(tecto) {
  return [
    { chave: 'ObjectType', cabecalho: 'Tipo' },
    { chave: 'Plans', cabecalho: 'Planos', direita: true, formatar: comSeparador },
    {
      chave: 'CacheMB',
      cabecalho: 'Cache',
      formatar: (valor) => (
        <Barra valor={valor} maximo={tecto} texto={`${comCasas(valor)} MB`} />
      ),
    },
    { chave: 'TotalUses', cabecalho: 'Usos', direita: true, formatar: comSeparador },
    {
      chave: 'SingleUsePlans',
      cabecalho: 'Uso unico',
      direita: true,
      formatar: comSeparador,
    },
  ]
}

function QueryPerformance({ user, perf, planCache }) {
  const visivel = hasSomePermissions(
    user,
    [
      FeatureFunction.RECOMPILATIONS_SEC,
      FeatureFunction.BUFFER_CACHE_HIT_RATIO,
      FeatureFunction.PLAN_CACHE,
    ],
    TypeGrant.READ
  )
  if (!visivel) return <></>

  const cacheHit = valorDoContador(perf.data, 'Buffer cache hit ratio %')
  const cacheBom = cacheHit >= BOM_CACHE
  const usoUnico = somaDaColuna(planCache.data, 'SingleUsePlans')

  return (
    <Seccao
      id="sec-queries"
      titulo="Desempenho de queries"
      quando={horaDeLeitura(perf.lido)}
      resumo={
        <>
          <Chip tom={cacheBom ? 'ok' : 'warn'} ponto>
            cache hit {comCasas(cacheHit, 2)}%
          </Chip>
          <Chip tom="info">{comSeparador(usoUnico)} planos de uso unico</Chip>
        </>
      }
    >
      {podeLer(user, FeatureFunction.RECOMPILATIONS_SEC) && (
        <Cartao
          titulo="SQL re-compilations"
          loading={perf.loading}
          erro={perf.erro}
          etiquetas={<Etiqueta tom="aviso">acumulado</Etiqueta>}
          nota={ACUMULADO}
        >
          <Numero
            valor={comSeparador(
              valorDoContador(perf.data, 'SQL Re-Compilations/sec')
            )}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.BUFFER_CACHE_HIT_RATIO) && (
        <Cartao
          titulo="Buffer cache hit ratio"
          loading={perf.loading}
          erro={perf.erro}
          linhasEsqueleto={4}
        >
          {/* 13/10 — o arco pintava e nao dizia de que. Correccao da Sara: a
              cor nunca vai sozinha, e a legenda diz o ESTADO em vez de
              descrever o eixo. */}
          <Medidor
            percentagem={cacheHit}
            legenda={
              cacheBom
                ? `acima de ${BOM_CACHE}% — a leitura esta a ser servida de memoria`
                : `abaixo de ${BOM_CACHE}% — a leitura esta a ir ao disco`
            }
            cor={cacheBom ? 'var(--ok)' : 'var(--warn)'}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.PLAN_CACHE) && (
        <Cartao
          titulo="Plan cache"
          largura={3}
          loading={planCache.loading}
          erro={planCache.erro}
          linhasEsqueleto={5}
        >
          <Tabela
            colunas={colunasDoPlanCache(maximoDaColuna(planCache.data, 'CacheMB'))}
            linhas={planCache.data}
          />
        </Cartao>
      )}
    </Seccao>
  )
}

export default QueryPerformance
