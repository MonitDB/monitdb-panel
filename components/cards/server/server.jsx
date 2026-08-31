/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faDatabase,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Card, message as antdMessage } from 'antd'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import styled from 'styled-components'

import Link from '~/components/link'
import DatabaseIcons, { Icons } from '~/helpers/database-icons'
import { useGlobal } from '~/hooks/index'
import useWindowSize from '~/hooks/use-window-size'
import { useHealthThresholdStore } from '~/services/state-manager/health-threshold-store'
import useServerContext from '~/services/state-manager/servers'
import { megaBytesToGigaBytes } from '~/utils/formats'
import { slugify } from '~/utils/global'
import { SERVER_STATUS } from '~/utils/server'

ChartJS.register(ArcElement, Tooltip, Legend)

const Style = styled.div`
  :where(.css-dev-only-do-not-override-rmiond).ant-card .ant-card-body {
    padding: 0px;
  }

  .before\:w-1::before {
    width: 50px;
  }

  .card-link::before {
    border-radius: 8px 0 0 8px;
  }
`

export const getPieChartData = (data) => {
  const availablePercent = data['Free(%)']
  const inUserPercentage = 100 - availablePercent
  let inUseColor = '#5046e5'

  if (inUserPercentage > 80 && inUserPercentage < 95) {
    inUseColor = '#fc9003'
  } else if (inUserPercentage >= 95) {
    inUseColor = '#ff4e4e'
  }

  return {
    labels: ['In use', 'Free'],
    datasets: [
      {
        data: [inUserPercentage, availablePercent],
        backgroundColor: [inUseColor, '#d8d8d8'],
      },
    ],
  }
}

const getDiskTotal = ({ unitType, total }) =>
  unitType === 'MB' ? `${megaBytesToGigaBytes(total)} GB` : `${total} GB`

// Onda visual: a cor deixa de ser o unico sinal. Os cinco estados ja existiam e ja
// vinham na API (server.status); o que faltava era estarem ESCRITOS. A regra de
// negocio esta na pagina de health thresholds e e esta:
//   Healthy  — abaixo de todos os limiares
//   Info     — ha um alerta activo
//   Warning  — CPU% ou disco% acima do valor de aviso
//   Critical — CPU% ou disco% acima do critico, ou memoria livre abaixo do minimo
//   Down     — sem ligacao
// Nota: o WARNING pintava 'border-yellow', e nao existe amarelo nenhum na paleta do
// tailwind deste projecto — ou seja, ate hoje um servidor em aviso nao tinha cor
// nenhuma. Passa a laranja, que e a cor de aviso que a paleta tem. E o CRITICAL, que
// pintava laranja, passa a vermelho, que e o que a regra de negocio diz.
const STATUS_VIEW = {
  [SERVER_STATUS.HEALTLY]: { label: 'Healthy', line: '#409d66', text: '#2f7a4e' },
  [SERVER_STATUS.INFO]: { label: 'Info', line: '#5046e5', text: '#3f38b8' },
  [SERVER_STATUS.WARNING]: { label: 'Warning', line: '#fc9003', text: '#b25f00' },
  [SERVER_STATUS.CRITICAL]: { label: 'Critical', line: '#cc0000', text: '#cc0000' },
  [SERVER_STATUS.DOWN]: { label: 'Down', line: '#cc0000', text: '#cc0000' },
}

const STATUS_ICON = {
  [SERVER_STATUS.HEALTLY]: faCircleCheck,
  [SERVER_STATUS.INFO]: faCircleInfo,
  [SERVER_STATUS.WARNING]: faTriangleExclamation,
  [SERVER_STATUS.CRITICAL]: faTriangleExclamation,
  [SERVER_STATUS.DOWN]: faCircleXmark,
}

/**
 * "13.0 / 29.6 GB" em vez de "13296 MB - In Use / 30269 MB Total": cinco digitos em MB
 * nao se leem de relance, e o par usado/total e o que interessa.
 */
/**
 * O desenho tinha chips curtos ("Agent", "Browser"); os dados do cliente trazem
 * "SQL Server Agent (MSSQLSERVER)". Num cartao de ~180px — que e a largura real com 31
 * instancias, sete por linha — esse nome parte em duas linhas e engorda o cartao todo.
 * A parte entre parenteses e a instancia e nao distingue nada aqui; fica no title.
 */
const shortAgentName = (name = '') => {
  const withoutInstance = String(name).replace(/\s*\([^)]*\)\s*$/, '').trim()
  const cleaned = withoutInstance || String(name)
  return cleaned.length > 18 ? `${cleaned.slice(0, 17)}…` : cleaned
}

const asPercent = (value) =>
  Number.isFinite(Number(value)) ? Math.round(Number(value)) : value

const formatMemory = (memory, which) => {
  const value =
    which === 'used' ? memory.total - memory.available : memory.total
  if (memory.unitType !== 'MB') return `${value} ${memory.unitType}`
  // Uma casa decimal chega: "13.4 GB" le-se de relance, "13.35" nao acrescenta nada a
  // quem esta a varrer trinta cartoes.
  return `${(Number(value) / 1024).toFixed(1)} GB`
}

/** "ha 12 s" / "ha 3 min". Recalculado a cada sondagem, que e quando o cartao redesenha. */
const relativeSince = (date) => {
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return `há ${seconds} s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `há ${minutes} min`
  return `há ${Math.round(minutes / 60)} h`
}

/**
 * O limiar que o cartao mostra tem de ser o limiar REAL, o que o motor usa para
 * decidir a cor — nao um numero bonito. Vem de /server/health-thresholds: a linha do
 * proprio servidor ganha a global (serverId 0), como diz a pagina de configuracao.
 */
/**
 * O DatabaseIcons devolve string vazia quando o tipo nao tem svg mapeado. Como o
 * icone passou a ser o unico do titulo, e preciso saber ANTES se existe — senao um
 * motor nao mapeado ficava com o titulo sem icone nenhum.
 */
const hasEngineIcon = (typeServerName) =>
  Boolean(typeServerName && Icons[slugify(typeServerName)])

const resolveThreshold = (thresholds, serverId) =>
  thresholds.find((t) => t.serverId === serverId) ||
  thresholds.find((t) => t.serverId === 0) ||
  undefined

const ServerCard = ({
  id,
  serverEnable,
  serverName,
  type,
  className = '',
  interval,
  showCPU = true,
  showMemory = true,
  showDisks = true,
  showStatus = true,
}) => {
  const windowSize = useWindowSize()
  const elementReference = useRef(null)
  const [tooltipPosition, setTooltipPosition] = useState('left')
  const [metrics, setMetrics] = useState({
    serverStatus: undefined,
    cpu: undefined,
    memory: undefined,
    disks: [],
    agents: [],
  })

  const {
    globalState: { servers },
  } = useGlobal()

  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [startingCollector, setStartingCollector] = useState(false)
  const server = servers.find((server) => server.id === id)

  // Quick win — "Iniciar coleta": dispara o job do agente na instância.
  const collectorStopped = metrics.agents?.some(
    (agent) => agent.status_desc !== 'Running'
  )
  const handleStartCollector = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    setStartingCollector(true)
    try {
      const result = await useServerContext.getState().startCollector(id)
      if (result?.ok) antdMessage.success(result.message)
      else antdMessage.warning(result?.message || 'Could not start the collector.')
    } catch {
      antdMessage.error('Could not start the collector.')
    } finally {
      setStartingCollector(false)
    }
  }

  const { thresholds } = useHealthThresholdStore()
  const threshold = resolveThreshold(thresholds, id)

  const { getServerMetrics } = useServerContext()

  const getMetrics = useCallback(async () => {
    if (serverEnable)
      try {
        let response
        try {
          response = await getServerMetrics({ id })
        } catch {
          /* empty */
        } finally {
          setLastUpdated(new Date())
        }

        if (response?.data) {
          const { cpu, memory, disks, serverStatus, agents } = response.data
          setMetrics({
            cpu,
            // Servidor offline (status 5) vem sem métricas — não derrubar o card.
            memory: memory
              ? {
                  ...memory,
                  inUsePercent:
                    ((memory.total - memory.available) / memory.total) * 100,
                }
              : undefined,
            disks: disks || [],
            serverStatus,
            agents,
          })
          return
        }
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    setMetrics({
      serverStatus: undefined,
      cpu: undefined,
      memory: undefined,
      disks: [],
    })
  }, [getServerMetrics, id])

  useEffect(() => {
    setTooltipPosition(
      elementReference.current.offsetLeft > windowSize.width / 2
        ? 'left'
        : 'right'
    )
  }, [windowSize])

  useEffect(() => {
    getMetrics()
  }, [])

  // Hook incondicional (Rules of Hooks): a condição vive DENTRO do effect —
  // antes era `if (interval) { useEffect(...) }`, que derrubaria a página se
  // `interval` fosse falsy; declarado após getMetrics (evita ref antes da init).
  useEffect(() => {
    if (!interval) return

    const intervalId = setInterval(() => {
      try {
        getMetrics()
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
    }, interval)

    return () => {
      clearInterval(intervalId)
    }
  }, [getMetrics, interval])

  const cpu = 100 - metrics.cpu?.SystemIdle

  // A API so marca DOWN quando online e false; sao a mesma coisa vista de dois
  // lados, e o cartao trata-as como uma so.
  const isDown =
    serverEnable && (!server?.online || server?.status === SERVER_STATUS.DOWN)
  const statusView = isDown
    ? STATUS_VIEW[SERVER_STATUS.DOWN]
    : STATUS_VIEW[server?.status]
  const statusIcon = isDown
    ? STATUS_ICON[SERVER_STATUS.DOWN]
    : STATUS_ICON[server?.status]

  const cpuOverWarn =
    threshold?.cpuWarn !== undefined && cpu > threshold.cpuWarn
  const cpuOverCrit =
    threshold?.cpuCrit !== undefined && cpu > threshold.cpuCrit
  // O limiar de memoria e um MINIMO DE MB LIVRES, nao uma percentagem: o traco vai no
  // ponto de uso a partir do qual a memoria livre desce abaixo desse minimo.
  const memoryLimitPercent =
    threshold?.memMinMb !== undefined && metrics.memory?.total
      ? Math.min(
          100,
          Math.max(
            0,
            ((metrics.memory.total - threshold.memMinMb) /
              metrics.memory.total) *
              100
          )
        )
      : undefined

  return (
    <Style>
      <Card
        ref={elementReference}
        // style={{ height: '300px' }}
        className={classNames(
          `group bg-white border transition-all duration-300 ease-in-out relative`,
          className,
          showStatus && {
            'lg:min-h-32': !metrics?.length,
          }
        )}
        // A moldura de 4px de cor sai e entra um filete a esquerda: a cor deixa de
        // ser o unico sinal (a palavra do estado esta no titulo) e o cartao deixa de
        // parecer um alerta permanente. O servidor caido e a excepcao — esse leva
        // moldura vermelha inteira e fundo levemente rosado, porque as 3 da manha e
        // o unico cartao que interessa encontrar no ecra.
        style={
          showStatus && serverEnable && statusView
            ? {
                borderLeft: `4px solid ${statusView.line}`,
                ...(isDown
                  ? {
                      borderColor: statusView.line,
                      backgroundColor: '#fff7f7',
                    }
                  : {}),
              }
            : undefined
        }
      >
        <Link
          href={
            serverEnable && server.online ? `/dashboard/${id}` : '/dashboard'
          }
          // O filete de cor passou para a borda esquerda do proprio Card. As classes
          // before:bg-* que aqui estavam nunca chegaram a pintar nada: a geometria do
          // ::before (content, width, height) esta comentada desde sempre.
          className={classNames('block p-2 pb-1.5 lg:p-3 lg:pb-2', {
            'opacity-25': !serverEnable,
          })}
        >
          {/* O logotipo do motor estava absoluto no canto superior direito, a comecar
              no topo do cartao: ocupava uma faixa acima da linha do nome e obrigava a
              reservar pr-10 nesta linha. Passa a ser o icone DESTA linha — a faixa
              desaparece e o nome ganha a largura que era do espacamento. */}
          {/* Com 31 instancias a sete por linha o cartao mede ~180px: o nome e a
              palavra do estado nao cabem sempre numa linha. O nome trunca e o estado
              passa para baixo quando nao couber, em vez de esmagar ou transbordar. */}
          <h4 className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm mb-2">
            {hasEngineIcon(type?.typeServerName) ? (
              <DatabaseIcons
                name={type.typeServerName}
                className="shrink-0 w-4 h-4"
              />
            ) : (
              <FontAwesomeIcon icon={faDatabase} className="shrink-0 text-base" />
            )}
            <span
              className="min-w-0 flex-1 font-bold truncate"
              title={serverName}
            >
              {serverName}
            </span>
            {showStatus && serverEnable && statusView && (
              <span
                className="shrink-0 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide"
                style={
                  isDown
                    ? {
                        color: '#fff',
                        backgroundColor: statusView.line,
                        padding: '2px 7px',
                        borderRadius: 3,
                      }
                    : { color: statusView.text }
                }
              >
                <FontAwesomeIcon icon={statusIcon} />
                {statusView.label}
              </span>
            )}
          </h4>
          <div>
            <dl className="text-[11px] w-full text-gray">
              {metrics.memory && showMemory && !isDown && (
                <>
                  <dt className="sr-only">Memory</dt>
                  <dd className="mt-2 flex items-baseline justify-between gap-1 overflow-hidden">
                    <span className="shrink-0 text-gray-dark">Memory</span>
                    <span className="tabular-nums whitespace-nowrap">
                      <b className="text-gray-dark">
                        {asPercent(metrics.memory.inUsePercent)}%
                      </b>{' '}
                      · {formatMemory(metrics.memory, 'used')} /{' '}
                      {formatMemory(metrics.memory, 'total')}
                    </span>
                  </dd>
                  <dd className="mt-1 w-full h-1.5 block relative bg-gray-light">
                    <span
                      className={classNames('absolute top-0 left-0 h-full', {
                        'bg-blue': metrics.memory.inUsePercent <= 85,
                        'bg-orange':
                          metrics.memory.inUsePercent > 85 &&
                          metrics.memory.inUsePercent < 95,
                        'bg-danger': metrics.memory.inUsePercent >= 95,
                      })}
                      style={{
                        width: `${metrics.memory.inUsePercent}%`,
                      }}
                    />
                    {memoryLimitPercent !== undefined && (
                      // O traco marca o ponto em que a memoria livre desce abaixo do
                      // minimo configurado. O olho ve a barra passar o traco mesmo
                      // sem distinguir a cor.
                      <span
                        className="absolute bg-gray-dark opacity-50"
                        style={{
                          left: `${memoryLimitPercent}%`,
                          top: -2,
                          width: 1,
                          height: 10,
                        }}
                        title={`Mínimo de memória livre: ${threshold.memMinMb} MB`}
                      />
                    )}
                  </dd>
                </>
              )}

              {metrics.cpu && showCPU && !isDown && (
                <>
                  <dt className="sr-only">CPU</dt>
                  <dd className="mt-2 flex items-baseline justify-between gap-1 overflow-hidden">
                    <span className="shrink-0 text-gray-dark">CPU</span>
                    <span className="tabular-nums whitespace-nowrap">
                      <b
                        className={classNames({
                          'text-gray-dark': !cpuOverWarn,
                          'text-orange': cpuOverWarn && !cpuOverCrit,
                          'text-red': cpuOverCrit,
                        })}
                      >
                        {asPercent(cpu)}%
                      </b>
                      {cpuOverWarn && (
                        <span
                          className={cpuOverCrit ? 'text-red' : 'text-orange'}
                        >
                          {cpuOverCrit ? ' · Crítico' : ' · Elevado'}
                        </span>
                      )}
                      {threshold?.cpuWarn !== undefined && (
                        <span className="text-gray">
                          {' '}
                          · limiar {threshold.cpuWarn}%
                        </span>
                      )}
                    </span>
                  </dd>
                  <dd className="mt-1 w-full h-1.5 block relative bg-gray-light">
                    <span
                      className={classNames('absolute top-0 h-full', {
                        'bg-blue': !cpuOverWarn,
                        'bg-orange': cpuOverWarn && !cpuOverCrit,
                        'bg-red': cpuOverCrit,
                      })}
                      style={{
                        width: `${cpu}%`,
                      }}
                    />
                    {threshold?.cpuWarn !== undefined && (
                      <span
                        className="absolute bg-gray-dark opacity-50"
                        style={{
                          left: `${threshold.cpuWarn}%`,
                          top: -2,
                          width: 1,
                          height: 10,
                        }}
                      />
                    )}
                  </dd>
                </>
              )}

              {isDown && (
                // O que a API sabe hoje de um servidor caido e so isto: que esta em
                // baixo. "Em baixo ha X min" e "ultima resposta do servidor" exigem
                // gravar a transicao de estado — trabalho de motor, fora desta onda.
                <>
                  <dd
                    className="mt-2 font-medium"
                    style={{ color: statusView?.text }}
                  >
                    Sem ligação ao servidor
                  </dd>
                  {type?.typeServerName && (
                    <dd className="mt-1 text-gray">{type.typeServerName}</dd>
                  )}
                  <dd className="mt-1 flex items-baseline justify-between gap-2">
                    <span className="text-gray-dark">Métricas</span>
                    <b className="text-gray-dark">indisponíveis</b>
                  </dd>
                </>
              )}

              <></>
            </dl>
          </div>
          {/* Os agentes eram bolinhas de cor com o nome escondido num tooltip:
              ilegiveis num print, na parede e por teclado. Passam a chips com o nome
              escrito e, quando parados, com o sinal alem da cor. */}
          {metrics.agents?.length > 0 && !isDown && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {metrics.agents.map((agent, index) => {
                const running = agent.status_desc === 'Running'
                return (
                  <span
                    key={`server-${id}-agent-${index}`}
                    className={classNames(
                      'inline-flex items-center gap-1 border rounded px-1.5 text-[10px]',
                      running
                        ? 'border-gray-light text-gray-dark'
                        : 'border-danger text-danger'
                    )}
                    title={`${agent?.servicename} - ${agent.status_desc}`}
                  >
                    <span
                      className={classNames(
                        'inline-block w-1.5 h-1.5 rounded-full',
                        running ? 'bg-success' : 'bg-danger'
                      )}
                    />
                    {shortAgentName(agent?.servicename)}
                    {!running && ' ✕'}
                  </span>
                )
              })}
            </div>
          )}
          {/* Esta hora e a do relogio do browser no momento em que o painel TENTOU,
              nao a resposta do servidor: continua a andar mesmo quando a chamada
              falha. Por isso o rotulo diz "Verificado", e no servidor caido diz
              "Ultima tentativa" — e o que a frase pode prometer sem mentir. */}
          <dd className="mt-2 text-gray text-[11px]">
            {isDown
              ? `Última tentativa ${lastUpdated.toLocaleTimeString()} · sem resposta`
              : `Verificado ${lastUpdated.toLocaleTimeString()} · ${relativeSince(
                  lastUpdated
                )}`}
          </dd>
          {serverEnable && server?.online && collectorStopped && (
            <Button
              size="small"
              danger
              loading={startingCollector}
              onClick={handleStartCollector}
              style={{ marginTop: 8, fontSize: 12 }}
            >
              ▶ Iniciar coleta
            </Button>
          )}
        </Link>

        {metrics.disks?.length > 0 && showDisks ? (
          <div
            className={classNames(
              `absolute bottom-1/2 w-[calc(100%+1.25rem)] min-h-full h-auto py-2 px-4 z-20 transform
              translate-y-px bg-gray-dark text-white transition-all duration-75
              ease-in-out invisible opacity-0 lg:group-hover:opacity-100
              lg:group-hover:visible lg:group-hover:duration-150`,
              {
                'left-full -translate-x-1 lg:group-hover:translate-x-px':
                  tooltipPosition === 'right',
                'right-full translate-x-1 lg:group-hover:translate-x-px':
                  tooltipPosition === 'left',
              }
            )}
          >
            <span
              className={classNames(
                `absolute bottom-5 transform border-t-[16px]
                border-t-transparent border-b-[16px] border-b-transparent`,
                {
                  'border-r-[16px] border-r-gray-dark -left-4':
                    tooltipPosition === 'right',
                  'border-l-[16px] border-l-gray-dark -right-4':
                    tooltipPosition === 'left',
                }
              )}
            />
            <p className="mb-2 text-xs">Disks</p>
            <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4">
              {metrics.disks.map((disk, index) => (
                <div key={`server-${id}-disk-${index}`} className="col-span-1">
                  <p className="text-center text-xs">
                    <strong>{disk.Drive}</strong>
                  </p>
                  <Pie
                    data={getPieChartData(disk)}
                    options={{
                      plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false },
                      },
                    }}
                  />
                  <p className="text-center text-[10px] whitespace-nowrap">
                    {Number.parseInt(disk['Usage(%)'])}% in use
                    <br />
                    {getDiskTotal({
                      total: disk['Total(MB)'],
                      unitType: 'MB',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ''
        )}
      </Card>
    </Style>
  )
}

export default ServerCard
