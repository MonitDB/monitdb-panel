import { faDatabase, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import Link from '~/components/link'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const InstalledVersions = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between"
      >
        <header className="pt-8 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <button type="button" className="btn btn--small md:ml-auto">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Exportar
            </button>
          </header>

          <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
            <table className="m-0">
              <thead>
                <tr>
                  <th>Nome do servidor</th>
                  <th>Disco</th>
                  <th>Espaço usado</th>
                  <th>Capacidade</th>
                  <th>Porcentagem usada</th>
                  <th>Espaço projetado em 1 ano</th>
                  <th>Mudança projetada</th>
                  <th>Tempo até encher</th>
                </tr>
              </thead>

              {serverEnvironments.map(
                (
                  { idTypeServerEnvironment, typeServerEnvironmentName },
                  environmentIndex
                ) => {
                  const filteredServers = filterServersByEnvironmentId(
                    idTypeServerEnvironment,
                    servers
                  ).map((server) => formatServer(server, { serverTypes }))

                  if (filteredServers.length === 0) {
                    return ''
                  }

                  return (
                    <tbody
                      key={`server-${idTypeServerEnvironment}-${environmentIndex}`}
                    >
                      <tr>
                        <td colSpan="8">
                          <h3 className="heading-xs pt-5">
                            {environmentIndex + 1} - {typeServerEnvironmentName}
                          </h3>
                        </td>
                      </tr>
                      {filteredServers.map((server, index) => (
                        <tr key={`server-production-${index}`}>
                          <td className="border-l-4 border-gray">
                            <FontAwesomeIcon
                              icon={faDatabase}
                              className="mr-2"
                            />
                            {server.serverName}
                          </td>
                          <td>
                            <p>
                              <Link
                                href="/estates/?tab=disk-usage"
                                className="text-blue no-underline"
                              >
                                D:
                              </Link>
                            </p>
                          </td>
                          <td>115.70 GB</td>
                          <td>147.65 GB</td>
                          <td>78%</td>
                          <td>146.52 GB</td>
                          <td>+30.95 GB</td>
                          <td>em até um ano</td>
                        </tr>
                      ))}
                    </tbody>
                  )
                }
              )}
            </table>
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default InstalledVersions
