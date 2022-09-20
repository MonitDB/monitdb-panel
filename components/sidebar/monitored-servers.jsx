import {
  faChevronRight,
  faDatabase,
  faFolder,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useContext, useState } from 'react'

import Link from '~/components/link'
import {
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
} from '~/components/page'
import GlobalContext from '~/contexts/global'
import Reveal from '~/helpers/reveal'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const MonitoredServers = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useContext(GlobalContext)
  const [sidebarEnvironmentActiveIndex, setSidebarEnvironmentActiveIndex] =
    useState(-1)
  const [sidebarShowAllServers, setSidebarShowAllServers] = useState(true)

  return (
    <PageSidebar>
      {serverEnvironments?.length > 0 ? (
        <>
          <header className="mb-4">
            <PageSidebarTitle>
              <span>Servidores monitorados</span>
            </PageSidebarTitle>
          </header>

          <div className="mb-10 text-sm">
            <button
              type="button"
              className="flex items-center space-x-2 mb-4"
              onClick={() => setSidebarShowAllServers(!sidebarShowAllServers)}
            >
              <FontAwesomeIcon icon={faFolder} />{' '}
              <strong>Todos os servidores</strong>
            </button>

            <div className="w-full space-y-4">
              {serverEnvironments.map((environment, environmentIndex) => {
                const filteredServers = filterServersByEnvironmentId(
                  environment.idTypeServerEnvironment,
                  servers
                ).map((server) => formatServer(server, { serverTypes }))

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
                      <div className="pt-4 pl-5">
                        {filteredServers.length > 0 ? (
                          filteredServers.map((server, serverIndex) => (
                            <button
                              key={`env-${environmentIndex}-server-${serverIndex}`}
                              type="button"
                              className="flex items-center space-x-2"
                            >
                              <FontAwesomeIcon icon={faDatabase} />{' '}
                              <span>
                                {server.serverName} -{' '}
                                <span className="text-xs opacity-50">
                                  {server.type.typeservername}
                                </span>
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="opacity-50">
                            Nenhum servidor encontrado.
                          </p>
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
        ''
      )}

      <div>
        <h3 className="mb-5 heading-xs">Ações</h3>
        <PageSidebarLinksList>
          <li>
            <Link href="/alerts/">Crie métricas e alertas personalizados</Link>
          </li>
          <li>
            <Link href="/alerts/">Gerenciar servidores monitorados</Link>
          </li>
          <li>
            <Link href="/alerts/">Gerenciar grupos de servidores</Link>
          </li>
          <li>
            <Link href="/alerts/">Configurar alertas</Link>
          </li>
          <li>
            <Link href="/alerts/">Gerenciar supressões de alerta</Link>
          </li>
          <li>
            <Link href="/alerts/">Assine o feed de alerta RSS</Link>
          </li>
        </PageSidebarLinksList>
      </div>
    </PageSidebar>
  )
}

export default MonitoredServers
