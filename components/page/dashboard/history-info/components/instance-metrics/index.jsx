import React from 'react'

import { useUser } from '~/hooks/index'
import {
  FeatureFunction,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import BarraSeccoes from '../ui/barra-seccoes'
import Bloco from '../ui/bloco'
import estilo from '../ui/painel.module.css'
import EspacoDados from './seccoes/espaco-dados'
import Memoria from './seccoes/memoria'
import QueryPerformance from './seccoes/query-performance'
import Rede from './seccoes/rede'
import Seguranca from './seccoes/seguranca'
import ServidorWaits from './seccoes/servidor-waits'
import { horaDeLeitura, useComponentData } from './use-component'

// 12/10/2026 — os quinze paineis novos do dashboard, no desenho da transicao
// que a Sara mandou nesse dia (transicao-como-fica.html), com a densidade do
// Grafana do cliente que o Danilo pediu ("os componentes novos podem ficar
// mais agrupados").
//
// SEM NUMERACAO de proposito: numerar e informacao de SEQUENCIA, e enquanto
// metade do separador for antiga a sequencia nao existe. Em vez disso dois
// cabecalhos de BLOCO, com a costura a vista — assim a diferenca de aspecto
// le-se como transicao e nao como defeito.

const ATALHOS = [
  { id: 'instance-metrics', nome: 'Indicadores novos', bloco: true },
  { id: 'sec-rede', nome: 'Rede e ligacoes' },
  { id: 'sec-queries', nome: 'Desempenho de queries' },
  { id: 'sec-esperas', nome: 'Esperas e CPU' },
  { id: 'sec-memoria', nome: 'Memoria e buffer' },
  { id: 'sec-espaco', nome: 'Espaco' },
  { id: 'sec-seguranca', nome: 'Seguranca' },
  { id: 'paineis-anteriores', nome: 'Paineis anteriores' },
]

const TODAS = [
  FeatureFunction.RECOMPILATIONS_SEC,
  FeatureFunction.BUFFER_CACHE_HIT_RATIO,
  FeatureFunction.MEMORY_GRANTS,
  FeatureFunction.BUFFER_POOL,
  FeatureFunction.SECURITY_LOGINS_LOGOUTS_ERRORS,
  FeatureFunction.SECURITY_DEADLOCKS,
  FeatureFunction.WAITS_SIGNAL_VS_RESOURCE,
  FeatureFunction.SCHEDULER_HEALTH,
  FeatureFunction.IO_STALL_PER_DB_FILE,
  FeatureFunction.PLAN_CACHE,
  FeatureFunction.NETWORK_IO_BY_CLIENT,
  FeatureFunction.INDEX_USAGE,
  FeatureFunction.TOP_MEMORY_CLERKS,
  FeatureFunction.TOP_TABLES,
  FeatureFunction.DATA_OVERVIEW,
]

function InstanceMetrics({ currentServer }) {
  const { userState: user } = useUser()
  const serverId = currentServer?.id

  // Um pedido por componente, nao por quadro: o LTPERFCNT sozinho abastece
  // quatro quadros em duas seccoes.
  const perf = useComponentData('LTPERFCNT', serverId)
  const seg = useComponentData('LTSECCNT', serverId)
  const waits = useComponentData('LTWAITSIG', serverId)
  const sched = useComponentData('LTSCHED', serverId)
  const ioStall = useComponentData('LTIOSTALL', serverId)
  const planCache = useComponentData('LTPLNCACHE', serverId)
  const netIo = useComponentData('LTNETIO', serverId)
  const indexUse = useComponentData('LTIDXUSE', serverId)
  const memClerks = useComponentData('LTMEMCLK', serverId)
  const topTables = useComponentData('LTTOPTAB', serverId)
  const dataOvw = useComponentData('LTDATAOVW', serverId)

  if (!hasSomePermissions(user, TODAS, TypeGrant.READ)) return <></>

  return (
    <div id="instance-metrics" className={estilo.raiz}>
      <BarraSeccoes atalhos={ATALHOS} quando={horaDeLeitura(perf.lido)} />
      <Bloco
        ordem="1"
        titulo="Indicadores novos"
        nota="leitura do momento · 15 paineis · sem numeracao ate o separador ser refeito"
        quando={horaDeLeitura(perf.lido)}
      />
      <Rede user={user} netIo={netIo} />
      <QueryPerformance user={user} perf={perf} planCache={planCache} />
      <ServidorWaits
        user={user}
        sched={sched}
        waits={waits}
        ioStall={ioStall}
      />
      <Memoria user={user} perf={perf} memClerks={memClerks} />
      <EspacoDados
        user={user}
        topTables={topTables}
        dataOvw={dataOvw}
        indexUse={indexUse}
      />
      <Seguranca user={user} seg={seg} />

      <div id="paineis-anteriores">
        <Bloco
          ordem="2"
          titulo="Paineis anteriores"
          nota="como estavam · intocados nesta volta · a refazer quando o Danilo decidir"
        />
      </div>
    </div>
  )
}

export default InstanceMetrics
