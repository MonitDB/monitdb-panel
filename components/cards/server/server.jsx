import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import classNames from 'classnames'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'

import Link from '~/components/link'
import DatabaseIcons from '~/helpers/database-icons'
import useWindowSize from '~/hooks/use-window-size'
import { getServerMetrics } from '~/services/servers'
import { megaBytesToGigaBytes } from '~/utils/formats'
import { SERVER_STATUS } from '~/utils/server'

ChartJS.register(ArcElement, Tooltip, Legend)

const getPieChartData = ({ availablePercent }) => {
  const inUserPercentage = 100 - availablePercent
  let inUseColor = '#5046e5'

  if (inUserPercentage > 85 && inUserPercentage < 95) {
    inUseColor = '#fc9003'
  } else if (inUserPercentage >= 95) {
    inUseColor = '#ff4e4e'
  }

  return {
    labels: ['Em uso', 'Livre'],
    datasets: [
      {
        data: [inUserPercentage, availablePercent],
        backgroundColor: [inUseColor, '#d3d3d3'],
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
}) => {
  const windowSize = useWindowSize()
  const elementReference = useRef(null)
  const [tooltipPosition, setTooltipPosition] = useState('left')
  const [metrics, setMetrics] = useState({
    serverStatus: undefined,
    cpu: undefined,
    memory: undefined,
    disks: [],
  })

  if (interval) {
    useEffect(() => {
      const intervalId = setInterval(() => {
        getMetrics()
      }, interval)

      return () => clearInterval(intervalId)
    }, [getMetrics, interval])
  }

  const getMetrics = useCallback(async () => {
    try {
      const response = await getServerMetrics({ id })

      if (response?.data) {
        const { cpu, memory, disks, serverStatus } = response.data

        setMetrics({ cpu, memory, disks, serverStatus })
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }, [id])

  useEffect(() => {
    setTooltipPosition(
      elementReference.current.offsetLeft > windowSize.width / 2
        ? 'left'
        : 'right'
    )
  }, [windowSize])

  useEffect(() => {
    getMetrics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article
      ref={elementReference}
      className={classNames(
        `group border bg-white transition-all duration-300
          ease-in-out relative border-opacity-75 lg:hover:border-opacity-100`,
        className,
        {
          'lg:min-h-72': metrics?.length,
          'lg:min-h-32': !metrics?.length,
          'border-danger': metrics?.serverStatus === SERVER_STATUS.CRITICAL,
          'border-orange': metrics?.serverStatus === SERVER_STATUS.WARNING,
          'border-success': metrics?.serverStatus === SERVER_STATUS.HEALTLY,
          'border-blue': metrics?.serverStatus === SERVER_STATUS.INFO,
          'border-gray': metrics?.serverStatus === SERVER_STATUS.DOWN,
        }
      )}
    >
      <Link
        href={`/dashboard/${id}`}
        className={classNames(
          `block p-2 h-full relative before:content-[""] before:absolute before:w-1
            before:top-0 before:left-0 before:h-full lg:p-4 lg:hover:before:w-2
            before:transition-all before:duration-300 before:ease-in-out`,
          {
            'before:bg-danger':
              metrics?.serverStatus === SERVER_STATUS.CRITICAL,
            'before:bg-orange': metrics?.serverStatus === SERVER_STATUS.WARNING,
            'before:bg-success':
              metrics?.serverStatus === SERVER_STATUS.HEALTLY,
            'before:bg-blue': metrics?.serverStatus === SERVER_STATUS.INFO,
            'before:bg-gray': metrics?.serverStatus === SERVER_STATUS.DOWN,
            'opacity-25': !serverEnable,
          }
        )}
      >
        <h4 className="flex items-center text-sm space-x-2 mb-2 lg:mb-4">
          <FontAwesomeIcon icon={faDatabase} className="text-base" />
          <span>{serverName}</span>
        </h4>
        {type?.typeServerName && (
          <div className="absolute top-0 right-0 rounded-full border-gray-light p-4">
            <DatabaseIcons name={type.typeServerName} className="w-10 h-10" />
          </div>
        )}
        <dl className="text-xs w-full text-gray">
          {metrics.memory && (
            <>
              <dt className="block text-gray-dark mt-2">Memória</dt>
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
                  {metrics.memory.available} {metrics.memory.unitType} - Livre
                </span>{' '}
                /{' '}
                <span>
                  {metrics.memory.total} {metrics.memory.unitType} Total
                </span>
              </dd>
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

          {metrics.cpu && (
            <>
              <dt className="block text-gray-dark mt-2">CPU</dt>
              <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                <span
                  className="absolute top-0 h-full bg-orange"
                  style={{
                    width: `${metrics.cpu.otherProcessPercent}%`,
                    left: `${metrics.cpu.instanceProcessPercent}%`,
                  }}
                />
                <span
                  className={classNames('absolute top-0 left-0 h-full bg-blue')}
                  style={{
                    width: `${metrics.cpu.instanceProcessPercent}%`,
                  }}
                />
              </dd>
            </>
          )}
        </dl>
      </Link>

      {metrics.disks?.length > 0 ? (
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
          <p className="mb-2 text-xs">Discos</p>
          <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.disks.map((disk, index) => (
              <div key={`server-${id}-disk-${index}`} className="col-span-1">
                <p className="text-center text-xs">
                  <strong>{disk.driveName}</strong>
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
                  {Number.parseInt(100 - disk.availablePercent)}% em uso
                  <br />
                  {getDiskTotal(disk)} total
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ''
      )}
    </article>
  )
}

export default ServerCard
