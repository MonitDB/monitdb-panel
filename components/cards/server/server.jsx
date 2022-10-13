import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'

import Link from '~/components/link'
import { getServerMetrics } from '~/services/servers'
import { megaBytesToGigaBytes } from '~/utils/formats'

ChartJS.register(ArcElement, Tooltip, Legend)

const getPieChartData = ({ inUsePercent }) => {
  const percentages = [inUsePercent, 100 - inUsePercent]
  let inUseColor = '#5046e5'

  if (inUsePercent > 85 && inUsePercent < 95) {
    inUseColor = '#fc9003'
  } else if (inUsePercent >= 95) {
    inUseColor = '#ff4e4e'
  }

  return {
    labels: ['Em uso', 'Livre'],
    datasets: [
      {
        data: [inUsePercent, percentages[1]],
        backgroundColor: [inUseColor, '#d3d3d3'],
      },
    ],
  }
}

const getDiskTotal = ({ unitType, total }) =>
  unitType === 'MB' ? `${megaBytesToGigaBytes(total)} GB` : `${total} GB`

const ServerCard = ({ idServer, healthStatus, serverEnable, serverName }) => {
  const [metrics, setMetrics] = useState({
    cpu: undefined,
    memory: undefined,
    disks: [],
  })

  const getMetrics = async () => {
    try {
      const response = await getServerMetrics({ id: idServer })

      if (response?.data?.result) {
        const { cpu, memory, disks } = response.data.result

        setMetrics({ cpu, memory, disks })
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getMetrics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article
      className={classNames(
        `col-span-1 border border-gray-light bg-white md:col-span-6 lg:col-span-3
        transition-all duration-300 ease-in-out lg:hover:border-gray`,
        {
          ' lg:min-h-72': metrics?.length,
          ' lg:min-h-32': !metrics?.length,
        }
      )}
    >
      <Link
        href="/dashboard/"
        className={classNames(
          `block p-2 h-full relative before:content-[""] before:absolute before:w-1
            before:top-0 before:left-0 before:h-full lg:p-4 lg:hover:before:w-2
            before:transition-all before:duration-300 before:ease-in-out`,
          {
            'before:bg-danger': healthStatus === 'Critical',
            'before:bg-orange': healthStatus === 'Warning',
            'before:bg-success': healthStatus === 'Healtly',
            'before:bg-blue': !healthStatus,
            'opacity-25': !serverEnable,
          }
        )}
      >
        <h4 className="flex items-center text-sm space-x-2 mb-2 lg:mb-4">
          <FontAwesomeIcon icon={faDatabase} className="text-base" />
          <span>{serverName}</span>
        </h4>
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

        {metrics.disks?.length > 0 ? (
          <div className="mt-3">
            <p className="mb-2 text-xs">Discos</p>
            <div className="w-full grid grid-cols-2 gap-2 lg:grid-cols-4">
              {metrics.disks.map((disk, index) => (
                <div
                  key={`server-${idServer}-disk-${index}`}
                  className="col-span-1"
                >
                  <p className="text-center text-xs">
                    <strong>{disk.driveName}</strong>
                  </p>
                  <Pie
                    data={getPieChartData(disk)}
                    options={{
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                  <p className="text-center text-[10px] whitespace-nowrap">
                    {Number.parseInt(disk.inUsePercent)}% em uso
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
      </Link>
    </article>
  )
}

export default ServerCard
