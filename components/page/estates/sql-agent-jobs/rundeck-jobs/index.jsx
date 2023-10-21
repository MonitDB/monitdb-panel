/* eslint-disable no-console */
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import Link from '~/components/link'
import Loading from '~/components/loading'
import { getSqlAgentRundeckJobs } from '~/services/estates'

const DATE_FORMAT = "dd MMM yyyy kk':'mm"

function RundeckJobs() {
  const [rundeckJobs, setRundeckJobs] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const getData = useCallback(async () => {
    const { data } = await getSqlAgentRundeckJobs()

    if (!data) return

    setRundeckJobs(data.executions)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="w-full prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed">
      <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
        <div className="w-full md:w-3/4">
          <h2 className="heading-md">Jobs Rundeck</h2>
        </div>

        <ExportButton
          className="btn btn--small md:ml-auto"
          disabled={isLoading}
          fileName={'RUNDECK_JOBS'}
          data={rundeckJobs}
        />
      </header>

      {isLoading ? (
        <div className="mt-5">
          <Loading />
        </div>
      ) : (
        <div className="py-4 px-8 bg-white">
          <table className="m-0">
            <thead>
              <tr>
                <th className="w-[6%]">Id</th>
                <th>Project</th>
                <th className="w-[10%]">User</th>
                <th>Started</th>
                <th>Ended</th>
                <th>Status</th>
                <th className="w-[8%]">Duration</th>
                <th>Access</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>

            {rundeckJobs?.execution?.length > 0 ? (
              <tbody>
                {rundeckJobs.execution.map((execution, index) => (
                  <tr key={`job-rundeck-${execution['@id']}-${index}`}>
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
                    <td>{execution['@status']}</td>
                    <td className="w-[8%]">
                      {execution.job['@averageDuration']}
                    </td>
                    <td title={execution.job['@permalink']}>
                      <Link
                        href={execution.job['@permalink']}
                        target="_blank"
                        rel="noreferrer"
                        isExternal
                      >
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                      </Link>
                    </td>
                    <td title={execution.job.name}>{execution.job.name}</td>
                    <td title={execution.description}>
                      {execution.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : undefined}
          </table>
        </div>
      )}
    </section>
  )
}

export default RundeckJobs
