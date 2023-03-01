/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import Servers from '~/components/estates/sql-agent-jobs/jobs/servers'
import Loading from '~/components/loading'
import useGlobal from '~/hooks/use-global'
import { getSqlAgentPRjobs } from '~/services/estates'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

function Jobs() {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlAgentPRjobs, setSqlAgentPRjobs] = useState([])
  const [environmentExpandedIndices, setEnvironmentExpandedIndices] = useState(
    new Set()
  )
  //   const [modalRundeckJobs, setModalRundeckJobs] = useState({})

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const handleEnvironmentExpandedIndices = (index) => {
    const indices = new Set(environmentExpandedIndices)

    if (indices.has(index)) {
      indices.delete(index)
    } else {
      indices.add(index)
    }

    setEnvironmentExpandedIndices(indices)
  }

  const getData = async () => {
    const { data } = await getSqlAgentPRjobs()

    setSqlAgentPRjobs(data)
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <section className="space-y-4">
      <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
        <div className="w-full md:w-3/4">
          <h2 className="heading-md">Jobs</h2>
        </div>
      </header>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {servers?.length
            ? serverEnvironments.map(
                ({ id, typeServerEnvironmentName }, environmentIndex) => {
                  const filteredServers = filterServersByEnvironmentId(
                    id,
                    servers
                  ).map((server) => formatServer(server, { serverTypes }))

                  const filteredJobs = []

                  for (let job of sqlAgentPRjobs) {
                    const server = filteredServers.find(
                      ({ id }) => id === job.ServerId
                    )

                    if (!server) continue

                    filteredJobs.push(job)
                  }

                  if (filteredJobs.length === 0) {
                    return ''
                  }

                  return (
                    <div
                      key={`environment-${id}-${environmentIndex}-`}
                      className="w-full prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed"
                    >
                      <button
                        type="button"
                        className={classNames(
                          `w-full py-2 px-4 bg-white border space-x-4
                  rounded-sm font-bold text-left text-sm lg:hover:border-gray`,
                          {
                            'border-gray':
                              environmentExpandedIndices.has(environmentIndex),
                            'border-gray-light':
                              !environmentExpandedIndices.has(environmentIndex),
                          }
                        )}
                        onClick={() =>
                          handleEnvironmentExpandedIndices(environmentIndex)
                        }
                      >
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={classNames('transform', {
                            'rotate-180':
                              environmentExpandedIndices.has(environmentIndex),
                          })}
                        />
                        <span>{typeServerEnvironmentName}</span>
                      </button>
                      <div
                        className={classNames('overflow-hidden max-h-0', {
                          'max-h-[9999px]':
                            environmentExpandedIndices.has(environmentIndex),
                        })}
                      >
                        <Servers
                          environmentServers={filteredServers}
                          serversJobs={filteredJobs}
                        />
                      </div>
                    </div>
                  )
                }
              )
            : undefined}
        </>
      )}
    </section>
  )
}

export default Jobs
