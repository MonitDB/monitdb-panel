import {
  faChevronRight,
  faDatabase,
  faFolder,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import {
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
} from '~/components/page'
import Reveal from '~/helpers/reveal'
import useGlobal from '~/hooks/use-global'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const MonitoredServers = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()
  const router = useRouter()

  const [sidebarEnvironmentActiveIndex, setSidebarEnvironmentActiveIndex] =
    useState(-1)
  const [sidebarShowAllServers, setSidebarShowAllServers] = useState(true)

  return (
    <PageSidebar>
      {serverEnvironments?.length > 0 ? (
        <>
          <header className="mb-4">
            <PageSidebarTitle>
              <span>Monitored servers</span>
            </PageSidebarTitle>
          </header>

          <div className="mb-10 text-sm">
            <button
              type="button"
              className="flex items-center space-x-2 mb-4"
              onClick={() => setSidebarShowAllServers(!sidebarShowAllServers)}
            >
              <FontAwesomeIcon icon={faFolder} /> <strong>All servers</strong>
            </button>

            <div className="w-full space-y-4">
              {serverEnvironments.map((environment, environmentIndex) => {
                const filteredServers = filterServersByEnvironmentId(
                  environment.id,
                  servers
                ).map((server) => formatServer(server, { serverTypes }))

                if (filteredServers.length === 0) {
                  return ''
                }

                return (
                  <div
                    key={`environment-${environmentIndex}`}
                    className="w-full pl-5"
                  >
                    <button
                      type="button"
                      className="flex items-center space-x-2"
                      onClick={() =>
                        setSidebarEnvironmentActiveIndex(environmentIndex)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className={classNames(
                          'transition-all duration-300 ease-in-out transform',
                          {
                            'rotate-90':
                              sidebarEnvironmentActiveIndex ===
                              environmentIndex,
                          }
                        )}
                      />{' '}
                      <FontAwesomeIcon icon={faFolder} />{' '}
                      <strong className="lowercase first-letter:uppercase">
                        {environment.typeServerEnvironmentName} - (
                        {filteredServers.length})
                      </strong>
                    </button>

                    <Reveal
                      active={
                        sidebarEnvironmentActiveIndex === environmentIndex
                      }
                    >
                      <div className="pt-4 pl-5 space-y-4">
                        {filteredServers.length > 0 ? (
                          filteredServers.map((server, serverIndex) => (
                            <Link
                              key={`env-${environmentIndex}-server-${serverIndex}`}
                              href={`/alerts/${server.id}`}
                              className="flex items-center space-x-2 transition-transform duration-300 ease-in-out transform hover:translate-x-2"
                            >
                              <FontAwesomeIcon icon={faDatabase} />{' '}
                              <span className="text-left text-xs">
                                {server.serverName} -{' '}
                                <span className="opacity-50">
                                  {server.type.typeServerName}
                                </span>
                              </span>
                            </Link>
                          ))
                        ) : (
                          <p className="opacity-50">No servers found.</p>
                        )}
                      </div>
                    </Reveal>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full min-h-28">
          <Loading />
        </div>
      )}

      <div>
        <h3 className="mb-5 heading-xs">Actions</h3>
        <PageSidebarLinksList>
          <li>
            <Link
              href="/alerts/metrics/"
              className={classNames({
                active:
                  router.pathname.search(
                    '/alerts/metrics/'.replace(/\/$/, '')
                  ) >= 0,
              })}
            >
              Create custom metrics and alerts
            </Link>
          </li>
          <li>
            <Link href="/configurations/servers/">
              Manage monitored servers
            </Link>
          </li>
          <li>
            <Link href="/alerts/">Manage groups</Link>
          </li>
          <li>
            <Link href="/alerts/">Configure alerts</Link>
          </li>
          <li>
            <Link href="/alerts/">Manage alert suppressions</Link>
          </li>
          <li>
            <Link href="/alerts/">Subscribe to RSS alert feed</Link>
          </li>
        </PageSidebarLinksList>
      </div>
    </PageSidebar>
  )
}

export default MonitoredServers
