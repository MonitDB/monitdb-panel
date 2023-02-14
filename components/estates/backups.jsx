import {
  faClock,
  faDatabase,
  faFileExport,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getBackups } from '~/services/estates'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const InstalledVersions = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const [isLoading, setIsLoading] = useState(true)
  const [backups, setBackups] = useState([])

  const getData = async () => {
    const { data } = await getBackups()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log(data)

    setBackups(data)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

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
        <div
          className="w-full prose max-w-full
            prose-p:m-0 prose-td:align-top prose-th:border prose-th:border-gray-light prose-td:border prose-td:border-gray-light prose-headings:m-0
             prose-ul:m-0 prose-ul:pl-0 prose-li:m-0 prose-li:pl-0"
        >
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <button type="button" className="btn btn--small md:ml-auto">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Exportar
            </button>
          </header>

          <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
            {isLoading ? (
              <Loading />
            ) : (
              <table className="m-0">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="px-4 align-middle border-r border-r-gray-light"
                    >
                      Banco de dados
                    </th>
                    <th
                      colSpan={3}
                      className="text-center border-r border-r-gray-light"
                    >
                      Full
                    </th>
                    <th
                      colSpan={3}
                      className="text-center border-r border-r-gray-light"
                    >
                      Diferencial
                    </th>
                    <th
                      colSpan={3}
                      className="text-center border-r border-r-gray-light"
                    >
                      Logs
                    </th>
                    <th rowSpan={2} className="align-middle text-center">
                      Modelo de recuperação
                    </th>
                    <th rowSpan={2} className="align-middle text-center">
                      Pior RPO nos últimos 30 dias
                    </th>
                  </tr>
                  <tr>
                    <th className="lowercase first-letter:uppercase text-left !border-r-white">
                      Data de início
                    </th>
                    <th className="lowercase first-letter:uppercase text-center !border-r-white">
                      Duração
                    </th>
                    <th className="lowercase first-letter:uppercase text-right">
                      Tamanho
                    </th>
                    <th className="lowercase first-letter:uppercase text-left !border-r-white">
                      Data de início
                    </th>
                    <th className="lowercase first-letter:uppercase text-center !border-r-white">
                      Duração
                    </th>
                    <th className="lowercase first-letter:uppercase text-right">
                      Tamanho
                    </th>
                    <th className="lowercase first-letter:uppercase text-left !border-r-white">
                      Data de início
                    </th>
                    <th className="lowercase first-letter:uppercase text-center !border-r-white">
                      Duração
                    </th>
                    <th className="lowercase first-letter:uppercase text-right pr-2">
                      Tamanho
                    </th>
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

                    // eslint-disable-next-line no-console
                    console.log('backups', backups)

                    if (filteredServers.length === 0) {
                      return ''
                    }

                    return (
                      <tbody
                        key={`server-${idTypeServerEnvironment}-${environmentIndex}`}
                      >
                        <tr>
                          <td
                            colSpan="12"
                            className="px-4 !border-l-0 !border-r-0"
                          >
                            <h3 className="heading-xs pt-5">
                              {environmentIndex + 1} -{' '}
                              {typeServerEnvironmentName}
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
                            <td colSpan={3}>
                              <ul className="w-full flex items-start justify-between list-none">
                                <li className="text-left">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>01 Out 2022</span>
                                  <br />
                                  <span>07:04</span>
                                </li>
                                <li className="text-center">3m 56s</li>
                                <li className="text-right">3.57 GB</li>
                              </ul>
                            </td>
                            <td colSpan={3}>
                              <ul className="w-full flex items-start justify-between list-none">
                                <li className="text-left">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>01 Out 2022</span>
                                  <br />
                                  <span>07:04</span>
                                </li>
                                <li className="text-center">3m 56s</li>
                                <li className="text-right">3.57 GB</li>
                              </ul>
                            </td>
                            <td colSpan={3}>
                              <ul className="w-full flex items-start justify-between list-none">
                                <li className="text-left">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>01 Out 2022</span>
                                  <br />
                                  <span>07:04</span>
                                </li>
                                <li className="text-center">3m 56s</li>
                                <li className="text-right">3.57 GB</li>
                              </ul>
                            </td>
                            <td className="text-center">
                              <span>Cheio</span>
                              <FontAwesomeIcon
                                icon={faWarning}
                                className="ml-2 text-orange"
                              />
                            </td>
                            <td className="text-center">1 hora 04 minutos</td>
                          </tr>
                        ))}
                      </tbody>
                    )
                  }
                )}
              </table>
            )}
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default InstalledVersions
