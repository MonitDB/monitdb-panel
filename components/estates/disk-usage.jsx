import { faDatabase, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getDiskUsage } from '~/services/estates'
import { getPercentage } from '~/utils/global'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DiskUsage = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [diskUsage, setDiskUsage] = useState([])

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const getData = async () => {
    const { data } = await getDiskUsage()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('disk usage', data)

    setDiskUsage(data)
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
        <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
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
                    <th>Nome do servidor</th>
                    <th>Disco</th>
                    <th>Espaço usado</th>
                    <th>Capacidade</th>
                    <th>Porcentagem usada</th>
                    <th>Espaço livre</th>
                    <th>Espaço livre porcentagem</th>
                  </tr>
                </thead>

                {serverEnvironments.map(
                  ({ id, typeServerEnvironmentName }, environmentIndex) => {
                    const filteredServers = filterServersByEnvironmentId(
                      id,
                      servers
                    ).map((server) => formatServer(server, { serverTypes }))

                    const filteredDiskUsage = []

                    for (let disk of diskUsage) {
                      const server = filteredServers.find(
                        ({ id }) => id === disk.ServerId
                      )

                      if (!server) continue

                      filteredDiskUsage.push({
                        ...disk,
                        ServerName: server.serverName,
                      })
                    }

                    if (filteredDiskUsage.length === 0) {
                      return ''
                    }

                    return (
                      <tbody key={`server-${id}-${environmentIndex}`}>
                        <tr>
                          <td colSpan="8">
                            <h3 className="heading-xs pt-5">
                              {typeServerEnvironmentName}
                            </h3>
                          </td>
                        </tr>
                        {filteredDiskUsage.map((disk, index) => (
                          <tr key={`server-production-${index}`}>
                            <td className="border-l-4 border-gray">
                              <FontAwesomeIcon
                                icon={faDatabase}
                                className="mr-2"
                              />
                              {disk.ServerName}
                            </td>
                            <td>
                              <p>
                                <Link
                                  href="/estates/?tab=disk-usage"
                                  className="text-blue no-underline"
                                >
                                  {disk.Drive ? `${disk.Drive}:` : disk.Volume}
                                </Link>
                              </p>
                            </td>
                            <td>{disk['Usage(MB)']} MB</td>
                            <td>{disk['Total(MB)']} MB</td>
                            <td>
                              {getPercentage(
                                disk['Usage(MB)'],
                                disk['Total(MB)']
                              ).toFixed(2)}
                              %
                            </td>
                            <td>{disk['Livre(MB)']} MB</td>
                            <td>{disk['Livre(%)']}%</td>
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

export default DiskUsage
