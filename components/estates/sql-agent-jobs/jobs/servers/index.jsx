import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useMemo, useState } from 'react'

import Reveal from '~/helpers/reveal'
import { getSqlAgentPRjobsExe } from '~/services/estates'

const DATE_FORMAT = "dd MMM yyyy kk':'mm"

function Servers({ environmentServers, serversJobs }) {
  const [serverExpandedIndices, setServerExpandedIndices] = useState(new Set())
  const [jobModal, setJobModal] = useState({
    isOpen: false,
    jobData: {},
  })
  const [jobsExe, setJobsExe] = useState()

  const currentServerRuns = useMemo(
    () =>
      jobModal.isOpen && jobModal.jobData?.ServerId && jobsExe.length > 0
        ? jobsExe.filter(
            ({ ServerId }) => ServerId === jobModal.jobData.ServerId
          )
        : [],
    [jobModal, jobsExe]
  )

  const getData = async () => {
    try {
      const { data } = await getSqlAgentPRjobsExe()

      if (!data) return

      setJobsExe(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }

  const handleServerExpandedIndices = (index) => {
    const indices = new Set(serverExpandedIndices)

    if (indices.has(index)) {
      indices.delete(index)
    } else {
      indices.add(index)
    }

    setServerExpandedIndices(indices)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <div className="p-4 space-y-2">
        {environmentServers.map(({ id, serverName }) => {
          const serverJobs = serversJobs.filter(
            ({ ServerId }) => ServerId === id
          )

          if (serverJobs.length === 0) return

          return (
            <>
              <button
                key={`server-${id}`}
                type="button"
                className={classNames(
                  `w-full py-2 px-4 bg-white border space-x-4
                        rounded-sm font-bold text-left text-sm lg:hover:border-gray`,
                  {
                    'border-gray': serverExpandedIndices.has(id),
                    'border-gray-light': !serverExpandedIndices.has(id),
                  }
                )}
                onClick={() => handleServerExpandedIndices(id)}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={classNames(
                    'transition-all duration-300 ease-in-out transform',
                    {
                      'rotate-180': serverExpandedIndices.has(id),
                    }
                  )}
                />
                <span>
                  {serverName} {`(${serverJobs.length})`}
                </span>
              </button>
              <Reveal active={serverExpandedIndices.has(id)}>
                <div className={classNames('py-4 px-8 bg-white')}>
                  <table className="m-0">
                    <thead>
                      <tr>
                        <th className="w-[6%]">Id</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Started</th>
                        <th>Ended</th>
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
                            <td className="w-[6%]">{jobData.ServerId}</td>
                            <td>{jobData.JobName}</td>
                            <td>{jobData.JobDescription}</td>
                            <td>
                              {format(
                                parseISO(jobData.JobCreatedOn),
                                DATE_FORMAT
                              )}
                            </td>
                            <td>
                              {format(
                                parseISO(jobData.JobLastModifiedOn),
                                DATE_FORMAT
                              )}
                            </td>
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
          <div className="relative h-full mt-[20px] m-5 p-5 bg-white overflow-hidden">
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
              <header className="flex flex-col mt-5 mb-5 md:flex-row md:justify-between md:items-center">
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
                      <th>Id</th>
                      <th>Job Name</th>
                      <th>Enabled</th>
                      <th>Creation date</th>
                      <th>Last modified date</th>
                      <th>Step Nº</th>
                      <th>Step name</th>
                      <th>Job Owner</th>
                      <th>Job Category</th>
                      <th>Step Type</th>
                      <th>Database name</th>
                      <th>Command</th>
                      <th>Occurrence</th>
                      <th>Recurrence</th>
                      <th>Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={`job-item-${jobModal.jobData?.ServerId}`}>
                      <td>{jobModal.jobData?.ServerId}</td>
                      <td>{jobModal.jobData?.JobName}</td>
                      <td>{jobModal.jobData?.IsEnabled}</td>
                      <td>{jobModal.jobData?.JobCreatedOn}</td>
                      <td>{jobModal.jobData?.JobLastModifiedOn}</td>
                      <td>{jobModal.jobData?.StepNo}</td>
                      <td>{jobModal.jobData?.StepName}</td>
                      <td>{jobModal.jobData?.JobOwner}</td>
                      <td>{jobModal.jobData?.JobCategory}</td>
                      <td>{jobModal.jobData?.StepType}</td>
                      <td>{jobModal.jobData?.Database}</td>
                      <td>{jobModal.jobData?.ExecutableCommand}</td>
                      <td>{jobModal.jobData?.Occurrence}</td>
                      <td>{jobModal.jobData?.Recurrence}</td>
                      <td>{jobModal.jobData?.Frequency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <header className="flex flex-col my-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs Exe</h2>
                </div>
              </header>
              <div
                className={classNames(
                  'py-4 pt-0 px-8 bg-white max-h-[40vh] overflow-auto'
                )}
              >
                <table className="m-0">
                  <thead className="sticky top-0 bg-white border-0">
                    <tr>
                      <th className="w-[6%] pt-6 pb-3.5 !border-0">
                        Id
                        <span className="absolute bottom-0 left-0 block h-1 w-full bg-[#9da5b1]" />
                      </th>
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

                  {currentServerRuns.length > 0 ? (
                    <tbody>
                      {currentServerRuns.map(
                        (
                          { ServerId, Job, Enabled, Status, RunDuration },
                          index
                        ) => {
                          return (
                            <tr key={`job-item-${ServerId}-${index}`}>
                              <td className="w-[6%]">{ServerId}</td>
                              <td>{Job}</td>
                              <td>{Enabled}</td>
                              <td>{Status}</td>
                              <td>{RunDuration}</td>
                            </tr>
                          )
                        }
                      )}
                    </tbody>
                  ) : undefined}
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
    </>
  )
}

export default Servers
