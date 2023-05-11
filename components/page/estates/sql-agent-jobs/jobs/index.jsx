/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'

import Servers from '~/components/page/estates/sql-agent-jobs/jobs/environment-servers-jobs'
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

  const handleEnvironmentExpandedIndices = useCallback(
    (index) => {
      const indices = new Set(environmentExpandedIndices)

      if (indices.has(index)) {
        indices.delete(index)
      } else {
        indices.add(index)
      }

      setEnvironmentExpandedIndices(indices)
    },
    [environmentExpandedIndices]
  )

  const getData = useCallback(async () => {
    const { data } = await getSqlAgentPRjobs()

    console.log('AgentPRjobs', data)

    setSqlAgentPRjobs(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="space-y-3">
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
                      className="w-full"
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
                        className={classNames({
                          block:
                            environmentExpandedIndices.has(environmentIndex),
                          hidden:
                            !environmentExpandedIndices.has(environmentIndex),
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
        </div>
      )}
    </section>
  )
}

export default Jobs
