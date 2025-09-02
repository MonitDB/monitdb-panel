/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Badge, Card, Space, Tooltip as AntdTooltip } from 'antd'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import styled from 'styled-components'

import Link from '~/components/link'
import DatabaseIcons from '~/helpers/database-icons'
import { useGlobal } from '~/hooks/index'
import useWindowSize from '~/hooks/use-window-size'
import useServerContext from '~/services/state-manager/servers'
import { megaBytesToGigaBytes } from '~/utils/formats'
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
  const server = servers.find((server) => server.id === id)

  const { getServerMetrics } = useServerContext()
  if (interval) {
    useEffect(() => {
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
  }

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
            memory: {
              ...memory,
              inUsePercent:
                ((memory.total - memory.available) / memory.total) * 100,
            },
            disks,
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

  const cpu = 100 - metrics.cpu?.SystemIdle

  return (
    <Style>
      <Card
        ref={elementReference}
        // style={{ height: '300px' }}
        className={classNames(
          `group border bg-white border-4 transition-all duration-300
          ease-in-out relative border-opacity-75 lg:hover:border-opacity-100`,
          className,
          showStatus &&
            server.online && {
              'lg:min-h-72': metrics?.length,
              'lg:min-h-32': !metrics?.length,
              'border-orange':
                serverEnable && server?.status === SERVER_STATUS.CRITICAL,
              'border-yellow':
                serverEnable && server?.status === SERVER_STATUS.WARNING,
              'border-success':
                serverEnable && server?.status === SERVER_STATUS.HEALTLY,
              'border-blue':
                serverEnable && server?.status === SERVER_STATUS.INFO,
              'border-danger':
                serverEnable && server?.status === SERVER_STATUS.DOWN,
              'border-gray': !serverEnable,
            }
        )}
      >
        <Link
          href={
            serverEnable && server.online ? `/dashboard/${id}` : '/dashboard'
          }
          className={classNames(
            // `card-link block p-2 h-full relative before:content-[""] before:absolute before:w-1
            // before:top-0 before:left-0 before:h-full lg:p-4 lg:hover:before:w-2
            // before:transition-all before:duration-300 before:ease-in-out before:border-radius`,
            showStatus && {
              'before:bg-orange':
                serverEnable && server?.status === SERVER_STATUS.CRITICAL,
              'before:bg-yellow':
                serverEnable && server?.status === SERVER_STATUS.WARNING,
              'before:bg-success':
                serverEnable && server?.status === SERVER_STATUS.HEALTLY,
              'before:bg-blue':
                serverEnable && server?.status === SERVER_STATUS.INFO,
              'before:bg-danger':
                serverEnable && server?.status === SERVER_STATUS.DOWN,
              'opacity-25': !serverEnable,
              'before:bg-gray': !serverEnable,
            }
          )}
        >
          <h4 className="flex items-center text-sm space-x-2 mb-2 lg:mb-4">
            <FontAwesomeIcon icon={faDatabase} className="text-base" />
            <span>{serverName}</span>
          </h4>
          {type?.typeServerName && (
            <div className="absolute top-0 right-0 rounded-full border-gray-light p-4">
              <DatabaseIcons
                name={type?.typeServerName}
                className="w-10 h-10"
              />
            </div>
          )}
          <div style={{ minHeight: '100px' }}>
            <dl className="text-xs w-full text-gray">
              {metrics.memory && showMemory && (
                <>
                  {
                    <>
                      <dt className="block text-gray-dark mt-2">Memory</dt>
                      <dd>
                        <span
                          className={classNames({
                            'text-blue': metrics.memory.inUsePercent <= 85,
                            'text-orange':
                              metrics.memory.inUsePercent > 85 &&
                              metrics.memory.inUsePercent < 95,
                            'text-danger': metrics.memory.inUsePercent >= 95,
                          })}
                        >
                          {metrics.memory.total - metrics.memory.available}{' '}
                          {metrics.memory.unitType} - In Use
                        </span>{' '}
                        /{' '}
                        <span>
                          {metrics.memory.total} {metrics.memory.unitType} Total
                        </span>
                      </dd>
                    </>
                  }
                  <dd className="mt-1 w-full h-1 block relative bg-gray-light">
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
                  </dd>
                </>
              )}

              {metrics.cpu && showCPU && (
                <>
                  <dt className="block text-gray-dark mt-2">CPU</dt>
                  <dd>
                    <span
                      className={classNames({
                        'text-blue': cpu <= 85,
                        'text-orange': cpu > 85 && cpu < 95,
                        'text-danger': cpu >= 95,
                      })}
                    >
                      {cpu}%
                    </span>
                    <span> - In use</span>
                  </dd>
                  <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                    <span
                      className="absolute top-0 h-full bg-orange"
                      style={{
                        width: `${cpu}%`,
                      }}
                    />
                  </dd>
                </>
              )}

              <></>
            </dl>
          </div>
          <dt className="block text-gray mt-2">Last Updated</dt>
          <dd className="mt-1  text-gray">{lastUpdated.toLocaleString()}</dd>
          {!metrics.agents === 0 && (
            <Badge style={{ margin: 0, height: '5px' }} status="default" />
          )}
          <Space style={{ margin: 0, transform: 'translateY(12px)' }}>
            {metrics.agents?.map((agent, index) => {
              return (
                <AntdTooltip
                  key={index}
                  title={`${agent?.servicename} - ${agent.status_desc}`}
                >
                  <Badge
                    style={{ margin: 0, height: '5px' }}
                    status="processing"
                    color={agent.status_desc === 'Running' ? 'green' : 'red'}
                  />
                </AntdTooltip>
              )
            })}
          </Space>
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
