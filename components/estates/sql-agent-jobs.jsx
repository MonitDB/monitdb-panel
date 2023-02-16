import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faker from 'faker'
import React, { useEffect, useMemo, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getSqlAgentJobs } from '~/services/estates'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const SqlAgentJobs = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlAgentJobs, setSqlAgentJobs] = useState({})
  const execution = useMemo(
    () => sqlAgentJobs.executions?.execution,
    [sqlAgentJobs]
  )

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const getData = async () => {
    const { data } = await getSqlAgentJobs()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('jobs', data)

    setSqlAgentJobs(data)
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

      <PageContent removeSidebarMargin={true} className="space-y-10">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs com falha</h2>
                  <p className="text-sm">
                    Tarefas em que a execução mais recente falhou.
                  </p>
                </div>
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
                      <th>Categoria | Nome</th>
                      <th>Execuções</th>
                      <th>Sucessos</th>
                      <th>Falhas</th>
                      <th>Última execução</th>
                      <th>Próxima</th>
                      <th>Etapa falhou</th>
                    </tr>
                  </thead>

                  {serverEnvironments.map(
                    ({ id, typeServerEnvironmentName }, environmentIndex) => {
                      const filteredServers = filterServersByEnvironmentId(
                        id,
                        servers
                      ).map((server) => formatServer(server, { serverTypes }))

                      const failedExecutions = execution.filter(
                        (item) =>
                          item['@status'] === 'failed' &&
                          filteredServers.findIndex(
                            ({ id }) => id === item['@id']
                          ) !== -1
                      )

                      if (failedExecutions.length === 0) {
                        return ''
                      }

                      return (
                        <tbody key={`jobs-failed-${id}-${environmentIndex}`}>
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
                          {failedExecutions.map((server, index) => (
                            <tr key={`job-item-${id}-failed-${index}`}>
                              <td>{server.serverName}</td>
                              <td>{faker.random.word()}</td>
                              <td>{faker.random.number()}</td>
                              <td>0</td>
                              <td>{faker.random.number()}</td>
                              <td>04 Oct 2022 10:06</td>
                              <td>04 Oct 2022 11:06</td>
                              <td>{faker.random.number()}</td>
                            </tr>
                          ))}
                        </tbody>
                      )
                    }
                  )}
                </table>
              </div>
            </div>

            <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs com sucesso</h2>
                  <p className="text-sm">
                    Tarefas em que a execução mais recente foi bem-sucedida.
                  </p>
                </div>
                <button type="button" className="btn btn--small md:ml-auto">
                  <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                  Exportar
                </button>
              </header>

              <div className="-mx-6 py-4 px-8 bg-white">
                <table className="m-0">
                  <thead>
                    <tr>
                      <th>Nome do servidor</th>
                      <th>Categoria | Nome</th>
                      <th>Execuções</th>
                      <th>Sucessos</th>
                      <th>Falhas</th>
                      <th>Última execução</th>
                      <th>Próxima</th>
                      <th>Última duração</th>
                    </tr>
                  </thead>

                  {serverEnvironments.map(
                    ({ id, typeServerEnvironmentName }, environmentIndex) => {
                      const filteredServers = filterServersByEnvironmentId(
                        id,
                        servers
                      ).map((server) => formatServer(server, { serverTypes }))

                      const successfulExecutions = execution.filter(
                        (item) =>
                          item['@status'] === 'succeeded' &&
                          filteredServers.findIndex(
                            ({ id }) => id === item['@id']
                          ) !== -1
                      )

                      if (successfulExecutions.length === 0) {
                        return ''
                      }

                      return (
                        <tbody key={`jobs-succeeded-${id}-${environmentIndex}`}>
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
                          {successfulExecutions.map((server, index) => (
                            <tr key={`job-item-${id}-succeeded-${index}`}>
                              <td>{server.serverName}</td>
                              <td>{faker.random.word()}</td>
                              <td>{faker.random.number()}</td>
                              <td>0</td>
                              <td>{faker.random.number()}</td>
                              <td>04 Oct 2022 10:06</td>
                              <td>04 Oct 2022 11:06</td>
                              <td>{faker.random.number()}</td>
                            </tr>
                          ))}
                        </tbody>
                      )
                    }
                  )}
                </table>
              </div>
            </div>
          </>
        )}
      </PageContent>
    </>
  )
}

export default SqlAgentJobs
