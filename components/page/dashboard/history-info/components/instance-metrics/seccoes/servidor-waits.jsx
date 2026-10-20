import React from 'react'

import {
  FeatureFunction,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import Barra from '../../ui/barra'
import Cartao from '../../ui/cartao'
import Chip from '../../ui/chip'
import Medidor from '../../ui/medidor'
import Pares from '../../ui/pares'
import Seccao from '../../ui/seccao'
import Tabela from '../../ui/tabela'
import Valor from '../../ui/valor'
import {
  comCasas,
  comoDuracao,
  comSeparador,
  cortado,
  maximoDaColuna,
} from '../formatos'
import { horaDeLeitura, podeLer } from '../use-component'

const LIMIAR_SINAL = 25 // acima disto o CPU e o estrangulamento, nao o recurso
const LIMIAR_STALL = 20 // ms por I/O; acima disto o ficheiro esta a travar

// 13/10 — o mesmo numero que o chip da seccao usa tem de ser o numero que pinta
// o cartao por baixo. Quando o limiar estava escrito duas vezes, o chip dizia
// ambar e a tabela nao marcava nada: era a correccao da Sara.

function colunasDoStall(tecto) {
  return [
    { chave: 'Database', cabecalho: 'Base', formatar: cortado },
    { chave: 'LogicalName', cabecalho: 'Ficheiro', formatar: cortado },
    { chave: 'FileType', cabecalho: 'Tipo' },
    {
      chave: 'TotalStallMs',
      cabecalho: 'Espera total',
      formatar: (valor) => (
        <Barra valor={valor} maximo={tecto} texto={comoDuracao(valor)} />
      ),
    },
    {
      chave: 'AvgStallMsPerIO',
      cabecalho: 'Media por I/O',
      direita: true,
      formatar: (valor) => (
        <Valor
          texto={`${comSeparador(valor)} ms`}
          tom={Number(valor) > LIMIAR_STALL ? 'warn' : 'ok'}
          palavra="lento"
        />
      ),
    },
    { chave: 'SizeMB', cabecalho: 'MB', direita: true, formatar: comSeparador },
  ]
}

function ServidorWaits({ user, sched, waits, ioStall }) {
  const visivel = hasSomePermissions(
    user,
    [
      FeatureFunction.SCHEDULER_HEALTH,
      FeatureFunction.WAITS_SIGNAL_VS_RESOURCE,
      FeatureFunction.IO_STALL_PER_DB_FILE,
    ],
    TypeGrant.READ
  )
  if (!visivel) return <></>

  const linhaSched = sched.data?.[0]
  const linhaWaits = waits.data?.[0]
  const sinal = Number(linhaWaits?.SignalPct)
  const emFila = Number(linhaSched?.Runnable ?? 0)
  const piorStall = Number(
    (ioStall.data ?? [])[0]?.AvgStallMsPerIO ?? Number.NaN
  )

  return (
    <Seccao
      id="sec-esperas"
      titulo="Esperas e CPU"
      quando={horaDeLeitura(sched.lido)}
      resumo={
        <>
          <Chip tom={emFila > 0 ? 'warn' : 'ok'} ponto>
            {comSeparador(emFila)} a espera de CPU
          </Chip>
          <Chip tom={sinal > LIMIAR_SINAL ? 'warn' : 'ok'}>
            sinal {comCasas(sinal, 2)}%
          </Chip>
          {Number.isFinite(piorStall) && (
            <Chip tom={piorStall > LIMIAR_STALL ? 'warn' : 'ok'}>
              pior ficheiro {comSeparador(piorStall)} ms por I/O
            </Chip>
          )}
        </>
      }
    >
      {podeLer(user, FeatureFunction.SCHEDULER_HEALTH) && (
        <Cartao
          titulo="Scheduler health"
          largura={2}
          loading={sched.loading}
          erro={sched.erro}
          nota="runnable acima de zero quer dizer tarefas a espera de CPU"
        >
          <Pares
            itens={[
              { nome: 'Schedulers', valor: comSeparador(linhaSched?.Schedulers) },
              { nome: 'Tarefas', valor: comSeparador(linhaSched?.CurrentTasks) },
              {
                nome: 'Runnable',
                valor: comSeparador(linhaSched?.Runnable),
                tom: emFila > 0 ? 'warn' : 'ok',
                palavra: 'a espera de CPU',
              },
              { nome: 'Workers', valor: comSeparador(linhaSched?.ActiveWorkers) },
              { nome: 'Fila', valor: comSeparador(linhaSched?.Queued) },
              { nome: 'I/O pendente', valor: comSeparador(linhaSched?.PendingDiskIO) },
            ]}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.WAITS_SIGNAL_VS_RESOURCE) && (
        <Cartao
          titulo="Signal vs resource waits"
          loading={waits.loading}
          erro={waits.erro}
          linhasEsqueleto={4}
          nota="sinal alto aponta para CPU; recurso alto aponta para I/O ou bloqueio"
        >
          <Medidor
            percentagem={sinal}
            legenda={
              sinal > LIMIAR_SINAL
                ? `sinal acima de ${LIMIAR_SINAL}% do tempo de espera — o estrangulamento e o CPU`
                : `sinal abaixo de ${LIMIAR_SINAL}% do tempo de espera — a espera e de recurso, nao de CPU`
            }
            cor={sinal > LIMIAR_SINAL ? 'var(--warn)' : 'var(--ok)'}
          />
        </Cartao>
      )}

      {podeLer(user, FeatureFunction.IO_STALL_PER_DB_FILE) && (
        <Cartao
          titulo="I/O stall por ficheiro"
          largura={3}
          loading={ioStall.loading}
          erro={ioStall.erro}
          linhasEsqueleto={6}
        >
          <Tabela
            colunas={colunasDoStall(maximoDaColuna(ioStall.data, 'TotalStallMs'))}
            linhas={ioStall.data}
            limite={10}
          />
        </Cartao>
      )}
    </Seccao>
  )
}

export default ServidorWaits
