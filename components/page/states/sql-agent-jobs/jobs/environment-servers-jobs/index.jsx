/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/exhaustive-deps */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'

import Loading from '~/components/loading'
import Pagination from '~/components/pagination/pagination'
import Reveal from '~/helpers/reveal'
import {
  getSqlAgentPRjobsExe,
  getSqlAgentPRjobsExecutions,
} from '~/services/states'

const DATE_FORMAT = "dd MMM yyyy kk':'mm"

function Servers({ environmentServers, serversJobs, expand }) {
  const [serverExpandedIndices, setServerExpandedIndices] = useState(new Set())
  const [jobModal, setJobModal] = useState({
    isOpen: false,
    jobData: {},
  })
  const [jobsExe, setJobsExe] = useState()
  const [activeTableRowIndex, toggleActiveTableRowIndex] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [jobsExecutions, setJobsExecutions] = useState()
  const [isLoadingExecutions, setIsLoadingExecutions] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const handleServerExpandedIndices = useCallback(
    (index) => {
      const indices = new Set(serverExpandedIndices)

      if (indices.has(index)) {
        indices.delete(index)
      } else {
        indices.add(index)
      }

      setServerExpandedIndices(indices)
    },
    [serverExpandedIndices]
  )

  const getData = useCallback(async () => {
    try {
      const serverId = jobModal.jobData?.ServerId
      const jobName = jobModal.jobData?.jobName

      if (serverId) {
        setIsLoading(true)
        toggleActiveTableRowIndex(-1)
        const { data } = await getSqlAgentPRjobsExe(serverId, {
          jobName,
          page: currentPage,
        })
        if (!data) return
        setJobsExe(data)
      }

      setIsLoading(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }, [jobModal.jobData?.jobName])

  const getExecutions = useCallback(
    async (runDateTime, rowIndex) => {
      try {
        const serverId = jobModal.jobData?.ServerId
        const jobName = jobModal.jobData?.jobName
        toggleActiveTableRowIndex(-1)
        if (serverId) {
          setJobsExecutions([])
          setIsLoadingExecutions(true)
          toggleActiveTableRowIndex(rowIndex)
          const { data } = await getSqlAgentPRjobsExecutions(serverId, {
            jobName,
            runDateTime,
          })
          if (!data) return

          setJobsExecutions(data)
        }

        setIsLoadingExecutions(false)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
    [jobModal.jobData?.jobName]
  )

  useEffect(() => {
    getData()
  }, [jobModal.jobData?.jobName, currentPage])

  useEffect(() => {
    if (expand) {
      const allEnvironmentIndices = environmentServers.map((_, index) => index)
      setServerExpandedIndices(new Set(allEnvironmentIndices))
    }
  }, [expand])

  return (
    <>
      <div className="p-3 pb-0">
        {environmentServers.map(({ id, serverName }, index) => {
          const serverJobs = serversJobs.filter(
            ({ ServerId }) => ServerId === id
          )
          return (
            <>
              <button
                key={`environment-server-${index}`}
                type="button"
                className={classNames(
                  `w-full py-2 px-4 bg-white border space-x-4
                        rounded-sm font-bold text-left text-sm lg:hover:border-gray`,
                  {
                    'border-gray': serverExpandedIndices.has(index),
                    'border-gray-light': !serverExpandedIndices.has(index),
                    'mt-3': index !== 0,
                  }
                )}
                onClick={() => handleServerExpandedIndices(index)}
                disabled={serverJobs.length === 0}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={classNames(
                    'transition-all duration-300 ease-in-out transform',
                    {
                      'rotate-180': serverExpandedIndices.has(index),
                    }
                  )}
                />
                <span>{serverName}</span>
              </button>
              <Reveal active={serverExpandedIndices.has(index)}>
                <div
                  className={classNames(
                    'prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed py-4 px-8 bg-white mt-3'
                  )}
                >
                  <table className="m-0">
                    <thead>
                      <tr>
                        <th className="w-[6%]">Id</th>
                        <th>Job Name</th>
                        <th>Enabled</th>
                        <th>Job Created Date</th>
                        <th>Frequency</th>
                      </tr>
                    </thead>

                    {serverJobs.length > 0 ? (
                      <tbody>
                        {serverJobs.map((jobData, index) => (
                          <tr
                            className="cursor-pointer"
                            key={`job-item-${jobData.ServerId}-${index}`}
                            onClick={() => {
                              setJobModal({
                                ...jobModal,
                                isOpen: true,
                                jobData,
                              })
                            }}
                          >
                            <td>{jobData['ServerId']}</td>
                            <td>{jobData['jobName']}</td>
                            <td>{jobData['enabled']}</td>
                            <td>
                              {jobData['createdAt']
                                ? format(
                                    parseISO(jobData['createdAt']),
                                    DATE_FORMAT
                                  )
                                : undefined}
                            </td>
                            <td>{jobData['frequency']}</td>
                          </tr>
                        ))}
                      </tbody>
                    ) : undefined}
                  </table>
                </div>
              </Reveal>
            </>
          )
        })}
      </div>

      {jobModal.isOpen ? (
        <div className="fixed flex items-center top-0 left-0 w-full min-h-full z-[100]">
          <button
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
            onClick={() => {
              setJobModal({ ...jobModal, isOpen: false })
            }}
          />
          <div className="relative h-full w-full mt-[20px] m-5 p-5 bg-white overflow-hidden prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed py-9 px-8">
            <div className="absolute top-0 left-0 bg-gray bg-opacity-20 w-full h-full" />
            <button
              className="w-4 h-4 absolute top-5 right-5 z-[1]"
              onClick={() => {
                setJobModal({ ...jobModal, isOpen: false })
              }}
            >
              <i className="absolute block w-full h-[2px] rotate-45 bg-black bg-opacity-75" />
              <i className="absolute block  w-full h-[2px] -rotate-45 bg-black bg-opacity-75" />
            </button>

            <div className="relative">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Job</h2>
                </div>
              </header>
              <div
                className={classNames(
                  'py-4 px-8 bg-white max-h-[40vh] overflow-auto'
                )}
              >
                <table className="m-0 whitespace-nowrap !table-auto">
                  <thead>
                    <tr>
                      <th>Job Name</th>
                      <th>Enabled</th>
                      <th>Job Created Date</th>
                      <th>Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={`job-item-${jobModal.jobData?.ServerId}`}>
                      <td>{jobModal.jobData['jobName']}</td>
                      <td>{jobModal.jobData['enabled']}</td>
                      <td>
                        {moment(jobModal.jobData['createdAt']).format(
                          'DD/MM/YYYY HH:ss'
                        )}
                      </td>
                      <td>{jobModal.jobData['frequency']}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <header className="flex flex-col my-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs Exe</h2>
                </div>
              </header>
              {isLoading ? (
                <Loading />
              ) : (
                <div
                  className={classNames(
                    'py-4 pt-0 px-8 bg-white max-h-[40vh] overflow-auto'
                  )}
                >
                  <table className="m-0">
                    <thead className="sticky top-0 bg-white border-0 z-[2]">
                      <tr>
                        <th className="w-[3%] !border-0"></th>
                        <th className="pt-0 pb-3.5 !border-0">Run Date Time</th>
                        <th className="pt-6 pb-3.5 !border-0">
                          Job
                          <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                        </th>
                        <th className="pt-6 pb-3.5 !border-0">
                          Enabled
                          <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                        </th>
                        <th className="pt-6 pb-3.5 !border-0">
                          Status
                          <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                        </th>
                        <th className="pt-6 pb-3.5 !border-0">
                          Run Duration
                          <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                        </th>
                      </tr>
                    </thead>

                    {jobsExe?.data?.length > 0 ? (
                      <tbody>
                        {jobsExe?.data?.map(
                          (
                            {
                              ServerId,
                              Job,
                              Enabled,
                              Status,
                              RunDuration,
                              RunDateTime,
                            },
                            exeIndex
                          ) => {
                            return (
                              <>
                                <tr
                                  className={classNames('cursor-pointer', {
                                    // 'bg-gray-light bg-opacity-30':
                                    //   activeTableRowIndex === exeIndex,
                                  })}
                                  key={`exec-item-${ServerId}-${exeIndex}`}
                                  onClick={() => {
                                    toggleActiveTableRowIndex(
                                      activeTableRowIndex === exeIndex
                                        ? undefined
                                        : exeIndex
                                    )
                                    const job =
                                      activeTableRowIndex === exeIndex
                                        ? undefined
                                        : jobsExe?.data[exeIndex]

                                    if (job)
                                      getExecutions(
                                        job['RunDateTime'],
                                        exeIndex
                                      )
                                  }}
                                >
                                  <td>
                                    <button
                                      className="relative z-[1]"
                                      type="button"
                                    >
                                      <FontAwesomeIcon
                                        icon={faChevronRight}
                                        className={classNames(
                                          'mr-1 transition-all duration-150 ease-in-out',
                                          {
                                            'rotate-90':
                                              activeTableRowIndex === exeIndex,
                                          }
                                        )}
                                      />
                                    </button>
                                  </td>
                                  <td>
                                    {format(parseISO(RunDateTime), DATE_FORMAT)}
                                  </td>
                                  <td>{Job}</td>
                                  <td>{Enabled}</td>
                                  <td>{Status}</td>
                                  <td>{RunDuration}</td>
                                </tr>
                                <tr>
                                  <td className="p-0" colSpan={6}>
                                    <Reveal
                                      active={activeTableRowIndex === exeIndex}
                                    >
                                      <div className="py-3 px-5 bg-gray-light bg-opacity-25">
                                        {isLoadingExecutions ? (
                                          <Loading />
                                        ) : (
                                          <table className="m-0">
                                            <thead className="border-0 z-[2]">
                                              <tr>
                                                <th className="relative pb-3.5 !border-0 w-[15%]">
                                                  Step Id
                                                  <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                                                </th>
                                                <th className="relative pb-3.5 !border-0 w-[15%]">
                                                  Status
                                                  <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                                                </th>
                                                <th className="relative pb-3.5 !border-0">
                                                  Message
                                                  <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                                                </th>
                                              </tr>
                                            </thead>
                                            {jobsExecutions?.length > 0 ? (
                                              <tbody>
                                                {jobsExecutions?.map(
                                                  (
                                                    {
                                                      ServerId,
                                                      Status,
                                                      Step_Id,
                                                      Message,
                                                    },
                                                    exeIndex
                                                  ) => {
                                                    return (
                                                      <tr
                                                        className="cursor-pointer"
                                                        key={`exec-item-${ServerId}-${exeIndex}`}
                                                      >
                                                        <td>{Step_Id}</td>
                                                        <td>{Status}</td>
                                                        <td className="leading-[23px] line-clamp-3 !whitespace-normal">
                                                          {Message}
                                                        </td>
                                                      </tr>
                                                    )
                                                  }
                                                )}
                                              </tbody>
                                            ) : undefined}
                                          </table>
                                        )}
                                      </div>
                                    </Reveal>
                                  </td>
                                </tr>
                              </>
                            )
                          }
                        )}
                      </tbody>
                    ) : undefined}
                  </table>
                  <Pagination
                    currentPage={currentPage}
                    totalResults={jobsExe?.count}
                    onChangePage={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : undefined}
    </>
  )
}

export default Servers
