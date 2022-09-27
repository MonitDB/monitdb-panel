import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import Link from '~/components/link'
import { getServerMetrics } from '~/services/servers'

const ServerCard = ({ idServer, healthStatus, serverEnable, serverName }) => {
  const [metrics, setMetrics] = useState({
    cpu: undefined,
    memory: undefined,
    disk: undefined,
  })

  const getMetrics = async () => {
    try {
      const response = await getServerMetrics({ id: idServer })

      if (response?.data?.result) {
        const { cpu, memory, disk } = response.data.result

        setMetrics({ cpu, memory, disk })
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getMetrics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <article className="col-span-1 border border-gray-light md:col-span-4 lg:col-span-3 lg:min-h-40">
      <Link
        href="/dashboard/"
        className={classNames(
          `block bg-white p-2 relative border-l-4 lg:p-4 lg:hover:border-l-8`,
          {
            'border-l-danger': healthStatus === 'Critical',
            'border-l-orange': healthStatus === 'Warning',
            'border-l-success': healthStatus === 'Healtly',
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
                <span className="text-success">
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
                    'bg-success': metrics.memory.inUsePercent <= 85,
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

          {metrics.disk && (
            <>
              <dt className="block text-gray-dark mt-2">Disco</dt>
              <dd>
                <span className="text-success">
                  {metrics.disk.available} {metrics.disk.unitType} - Livre
                </span>{' '}
                /{' '}
                <span>
                  {metrics.memory.total} {metrics.memory.unitType} Total
                </span>
              </dd>
              <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                <span
                  className={classNames('absolute top-0 left-0 h-full', {
                    'bg-success': metrics.disk.inUsePercent <= 85,
                    'bg-orange':
                      metrics.disk.inUsePercent > 85 &&
                      metrics.disk.inUsePercent < 95,
                    'bg-danger': metrics.disk.inUsePercent >= 95,
                  })}
                  style={{
                    width: `${metrics.disk.inUsePercent}%`,
                  }}
                />
              </dd>
            </>
          )}
        </dl>
      </Link>
    </article>
  )
}

export default ServerCard
