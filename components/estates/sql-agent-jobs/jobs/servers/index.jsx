import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'

import Reveal from '~/helpers/reveal'
import {
  getSqlAgentPRjobsExe,
  getSqlAgentPRjobsSteps,
} from '~/services/estates'

const DATE_FORMAT = "dd MMM yyyy kk':'mm"

function Servers({ environmentServers, serversJobs }) {
  const [serverExpandedIndices, setServerExpandedIndices] = useState(new Set())
  const [modal, setModal] = useState({
    isOpen: false,
  })
  const [jobsExe, setJobsExe] = useState()
  const [jobsSteps, setJobsSteps] = useState()

  const getData = async () => {
    const [responseJobsExe, responseJobsSteps] = await Promise.all([
      getSqlAgentPRjobsExe(),
      getSqlAgentPRjobsSteps(),
    ])
    if (!responseJobsExe?.data && !responseJobsSteps?.data) return

    setJobsExe(responseJobsExe.data)
    setJobsSteps(responseJobsSteps.data)
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
                        {serverJobs.map(
                          (
                            {
                              ServerId,
                              JobName,
                              JobDescription,
                              JobCreatedOn,
                              JobLastModifiedOn,
                            },
                            index
                          ) => (
                            <tr
                              className="cursor-pointer"
                              key={`job-item-${ServerId}-${index}`}
                              onClick={() => {
                                setModal({ ...modal, isOpen: true })
                              }}
                            >
                              <td className="w-[6%]">{ServerId}</td>
                              <td>{JobName}</td>
                              <td>{JobDescription}</td>
                              <td>
                                {format(parseISO(JobCreatedOn), DATE_FORMAT)}
                              </td>
                              <td>
                                {format(
                                  parseISO(JobLastModifiedOn),
                                  DATE_FORMAT
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    ) : undefined}
                  </table>
                </div>
              </Reveal>
            </>
          )
        })}
      </div>
      {modal.isOpen ? (
        <div className="fixed top-0 left-0 w-full min-h-full z-[100]">
          <button
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
            onClick={() => {
              setModal({ ...modal, isOpen: false })
            }}
          />
          <div className="relative h-full mt-[20px] m-5 p-5 bg-white">
            <div className="absolute top-0 left-0 bg-gray bg-opacity-20 w-full h-full" />
            <button
              className="w-4 h-4 absolute top-5 right-5 z-[1]"
              onClick={() => {
                setModal({ ...modal, isOpen: false })
              }}
            >
              <i className="absolute block w-full h-[2px] rotate-45 bg-black bg-opacity-75" />
              <i className="absolute block  w-full h-[2px] -rotate-45 bg-black bg-opacity-75" />
            </button>

            <div className="relative">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs Exe</h2>
                </div>
              </header>
              <div
                className={classNames(
                  'py-4 px-8 bg-white max-h-[40vh] overflow-auto'
                )}
              >
                <table className="m-0">
                  <thead>
                    <tr>
                      <th className="w-[6%]">Id</th>
                      <th>Job</th>
                      <th>Enabled</th>
                      <th>Status</th>
                      <th>Run Duration</th>
                    </tr>
                  </thead>

                  {jobsExe.length > 0 ? (
                    <tbody>
                      {jobsExe.map(
                        (
                          { ServerId, Job, Enabled, Status, RunDuration },
                          index
                        ) => (
                          <tr key={`job-item-${ServerId}-${index}`}>
                            <td className="w-[6%]">{ServerId}</td>
                            <td>{Job}</td>
                            <td>{Enabled}</td>
                            <td>{Status}</td>
                            <td>{RunDuration}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  ) : undefined}
                </table>
              </div>

              <header className="flex flex-col mt-5 mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs Steps</h2>
                </div>
              </header>
              <div
                className={classNames(
                  'py-4 px-8 bg-white max-h-[40vh] overflow-auto'
                )}
              >
                <table className="m-0">
                  <thead>
                    <tr>
                      <th className="w-[6%]">Id</th>
                      <th>Job Name</th>
                      <th>Is Enabled</th>
                      <th>Is Scheduled</th>
                      <th>Job Category</th>
                    </tr>
                  </thead>

                  {jobsSteps.length > 0 ? (
                    <tbody>
                      {jobsSteps.map(
                        (
                          {
                            ServerId,
                            JobName,
                            IsEnabled,
                            IsScheduled,
                            JobCategory,
                          },
                          index
                        ) => (
                          <tr key={`job-item-${ServerId}-${index}`}>
                            <td className="w-[6%]">{ServerId}</td>
                            <td>{JobName}</td>
                            <td>{IsEnabled}</td>
                            <td>{IsScheduled}</td>
                            <td>{JobCategory}</td>
                          </tr>
                        )
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
