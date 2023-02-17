import { faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import { getSqlAgentJobs } from '~/services/estates'

const DATE_FORMAT = "dd MMM yyyy kk':'mm"

const SqlAgentJobs = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlAgentJobs, setSqlAgentJobs] = useState({})

  const failedExecutions = useMemo(() => {
    const executions = sqlAgentJobs?.executions?.execution || []
    return executions.filter((item) => item['@status'] === 'failed')
  }, [sqlAgentJobs])

  const succeededExecutions = useMemo(() => {
    const executions = sqlAgentJobs?.executions?.execution || []
    return executions.filter((item) => item['@status'] === 'succeeded')
  }, [sqlAgentJobs])

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
            <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed">
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
                      <th className="w-[6%]">Id</th>
                      <th>Project</th>
                      <th className="w-[10%]">User</th>
                      <th>Started</th>
                      <th>Ended</th>
                      <th className="w-[8%]">Duration</th>
                      <th>Access</th>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>

                  {failedExecutions.length > 0 ? (
                    <tbody>
                      {failedExecutions.map((execution, index) => (
                        <tr
                          key={`job-item-${execution['@id']}-failed-${index}`}
                        >
                          <td className="w-[6%]">{execution['@id']}</td>
                          <td>{execution['@project']}</td>
                          <td className="w-[10%]">{execution.user}</td>
                          <td>
                            {format(
                              parseISO(execution['date-started']['#text']),
                              DATE_FORMAT
                            )}
                          </td>
                          <td>
                            {format(
                              parseISO(execution['date-ended']['#text']),
                              DATE_FORMAT
                            )}
                          </td>
                          <td className="w-[8%]">
                            {execution.job['@averageDuration']}
                          </td>
                          <td>{execution.job['@permalink']}</td>
                          <td title={execution.job.name}>
                            {execution.job.name}
                          </td>
                          <td title={execution.description}>
                            {execution.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : undefined}
                </table>
              </div>
            </div>

            <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed">
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
                      <th className="w-[6%]">Id</th>
                      <th>Project</th>
                      <th className="w-[10%]">User</th>
                      <th>Started</th>
                      <th>Ended</th>
                      <th className="w-[8%]">Duration</th>
                      <th>Access</th>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>

                  {succeededExecutions.length > 0 ? (
                    <tbody>
                      {succeededExecutions.map((execution, index) => (
                        <tr
                          key={`job-item-${execution['@id']}-succeeded-${index}`}
                        >
                          <td className="w-[6%]">{execution['@id']}</td>
                          <td>{execution['@project']}</td>
                          <td className="w-[10%]">{execution.user}</td>
                          <td>
                            {format(
                              parseISO(execution['date-started']['#text']),
                              DATE_FORMAT
                            )}
                          </td>
                          <td>
                            {format(
                              parseISO(execution['date-ended']['#text']),
                              DATE_FORMAT
                            )}
                          </td>
                          <td className="w-[8%]">
                            {execution.job['@averageDuration']}
                          </td>
                          <td title={execution.job['@permalink']}>
                            {execution.job['@permalink']}
                          </td>
                          <td title={execution.job.name}>
                            {execution.job.name}
                          </td>
                          <td title={execution.description}>
                            {execution.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : undefined}
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
