/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import {
  faArrowUpRightFromSquare,
  faChevronDown,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

import { Field, Input, Submit } from '~/components/form'
import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import Reveal from '~/helpers/reveal'
import useGlobal from '~/hooks/use-global'
import { getSqlAgentJobs, getSqlAgentPRjobs } from '~/services/estates'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DATE_FORMAT = "dd MMM yyyy kk':'mm"

const RundeckJobsFormSchema = Yup.object().shape({
  JobName: Yup.string().required('job name is required'),
  JobDescription: Yup.string().required('Job description is required'),
})

const SqlAgentJobs = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlAgentRundeckJobs, setSqlAgentRundeckJobs] = useState({})
  const [sqlAgentPRjobs, setSqlAgentPRjobs] = useState([])
  const [jobsExpandedIndices, setJobsExpandedIndices] = useState(new Set())
  const [modalRundeckJobs, setModalRundeckJobs] = useState({})
  const [error, setError] = useState('')

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const handlejobsExpandedIndices = (index) => {
    const indices = new Set(jobsExpandedIndices)

    if (indices.has(index)) {
      indices.delete(index)
    } else {
      indices.add(index)
    }

    setJobsExpandedIndices(indices)
  }

  const getData = async () => {
    const [rundeckJobs, jobs] = await Promise.all([
      getSqlAgentJobs(),
      getSqlAgentPRjobs(),
    ])

    if (!rundeckJobs?.data && !jobs?.data) return

    console.log('rundeckJobs', rundeckJobs)
    console.log('jobs', jobs)

    setSqlAgentRundeckJobs(rundeckJobs.data.executions)
    setSqlAgentPRjobs(jobs.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const formik = useFormik({
    initialValues: {
      JobName: '',
      JobDescription: '',
    },
    validationSchema: RundeckJobsFormSchema,
    onSubmit: async () => {
      try {
        console.log('update data')
      } catch {
        setError('Algum erro aconteceu, tente novamente mais tarde.')

        setTimeout(() => {
          setError('')
        }, 4000)
      }
    },
  })

  return (
    <>
      <PageContent removeSidebarMargin className="pt-16 space-y-10">
        {isLoading ? (
          <div className="min-h-screen flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <>
            <section className="space-y-5">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs</h2>
                </div>
              </header>
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
                                  jobsExpandedIndices.has(environmentIndex),
                                'border-gray-light':
                                  !jobsExpandedIndices.has(environmentIndex),
                              }
                            )}
                            onClick={() =>
                              handlejobsExpandedIndices(environmentIndex)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={classNames(
                                'transition-all duration-300 ease-in-out transform',
                                {
                                  'rotate-180':
                                    jobsExpandedIndices.has(environmentIndex),
                                }
                              )}
                            />
                            <span>
                              {typeServerEnvironmentName}{' '}
                              {`(${filteredJobs.length})`}
                            </span>
                          </button>
                          <Reveal
                            active={jobsExpandedIndices.has(environmentIndex)}
                          >
                            <div
                              className={classNames('mt-4 py-4 px-8 bg-white')}
                            >
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

                                {filteredJobs.length > 0 ? (
                                  <tbody>
                                    {filteredJobs.map(
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
                                          onClick={() =>
                                            setModalRundeckJobs({
                                              index,
                                              data: filteredJobs[index],
                                              isOpen: !modalRundeckJobs.isOpen,
                                            })
                                          }
                                        >
                                          <td className="w-[6%]">{ServerId}</td>
                                          <td>{JobName}</td>
                                          <td>{JobDescription}</td>
                                          <td>
                                            {format(
                                              parseISO(JobCreatedOn),
                                              DATE_FORMAT
                                            )}
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
                        </div>
                      )
                    }
                  )
                : undefined}
            </section>

            <section className="w-full prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <div className="w-full md:w-3/4">
                  <h2 className="heading-md">Jobs Rundeck</h2>
                </div>
                <button type="button" className="btn btn--small md:ml-auto">
                  <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                  Exportar
                </button>
              </header>

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

                  {sqlAgentRundeckJobs.execution.length > 0 ? (
                    <tbody>
                      {sqlAgentRundeckJobs.execution.map((execution, index) => (
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
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                              />
                            </Link>
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
            </section>

            {modalRundeckJobs.isOpen ? (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
                <button
                  className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
                  onClick={() =>
                    setModalRundeckJobs({ ...modalRundeckJobs, isOpen: false })
                  }
                />
                <div className="relative pt-12 p-5 bg-white text-blue font-bold min-w-full md:min-w-[500px]">
                  <button
                    className="w-4 h-4 absolute top-3 right-3"
                    onClick={() =>
                      setModalRundeckJobs({
                        ...modalRundeckJobs,
                        isOpen: false,
                      })
                    }
                  >
                    <i className="absolute block w-full h-[2px] rotate-45 bg-black bg-opacity-75" />
                    <i className="absolute block  w-full h-[2px] -rotate-45 bg-black bg-opacity-75" />
                  </button>
                  <form
                    className="grid grid-cols-2 w-full gap-5 md:grid-cols-12"
                    onSubmit={formik.handleSubmit}
                  >
                    <Field
                      htmlFor="ServerId"
                      className="col-span-2 md:col-span-12"
                      disabled
                    >
                      <label
                        className="text-sm mb-1 block text-black text-opacity-75"
                        htmlFor="ServerId"
                      >
                        ID
                      </label>
                      <Input
                        id="ServerId"
                        name="ServerId"
                        type="text"
                        disabled
                        defaultValue={modalRundeckJobs.data?.['ServerId']}
                      />
                    </Field>
                    <Field
                      htmlFor="JobName"
                      className="col-span-2 md:col-span-12"
                      hasError={
                        !!(formik.errors.JobName && formik.touched.JobName)
                      }
                      error={formik.errors.JobName}
                    >
                      <label
                        className="text-sm mb-1 block text-black text-opacity-75"
                        htmlFor="JobName"
                      >
                        Name
                      </label>
                      <Input
                        id="JobName"
                        name="JobName"
                        type="text"
                        placeholder="Job Name"
                        onChange={formik.handleChange}
                        value={formik.values.JobName}
                        defaultValue={modalRundeckJobs.data?.['JobName']}
                        hasError={
                          !!(formik.errors.JobName && formik.touched.JobName)
                        }
                      />
                    </Field>
                    <Field
                      htmlFor="JobDescription"
                      className="col-span-2 md:col-span-12"
                      hasError={
                        !!(
                          formik.errors.JobDescription &&
                          formik.touched.JobDescription
                        )
                      }
                      error={formik.errors.JobDescription}
                    >
                      <label
                        className="text-sm mb-1 block text-black text-opacity-75"
                        htmlFor="JobDescription"
                      >
                        Description
                      </label>
                      <Input
                        id="JobDescription"
                        name="JobDescription"
                        type="text"
                        placeholder="Job Description"
                        onChange={formik.handleChange}
                        value={formik.values.JobDescription}
                        defaultValue={modalRundeckJobs.data?.['JobDescription']}
                        hasError={
                          !!(
                            formik.errors.JobDescription &&
                            formik.touched.JobDescription
                          )
                        }
                      />
                    </Field>
                    <Field
                      htmlFor="JobCreatedOn"
                      className="col-span-2 md:col-span-12"
                      disabled
                    >
                      <label
                        className="text-sm mb-1 block text-black text-opacity-75"
                        htmlFor="JobCreatedOn"
                      >
                        Started
                      </label>
                      <Input
                        id="JobCreatedOn"
                        name="JobCreatedOn"
                        type="text"
                        disabled
                        defaultValue={modalRundeckJobs.data?.['JobCreatedOn']}
                      />
                    </Field>
                    <Field
                      htmlFor="JobLastModifiedOn"
                      className="col-span-2 md:col-span-12"
                      disabled
                    >
                      <label
                        className="text-sm mb-1 block text-black text-opacity-75"
                        htmlFor="JobLastModifiedOn"
                      >
                        End
                      </label>
                      <Input
                        id="JobLastModifiedOn"
                        name="JobLastModifiedOn"
                        type="text"
                        disabled
                        defaultValue={
                          modalRundeckJobs.data?.['JobLastModifiedOn']
                        }
                      />
                    </Field>
                    <div className="pointer-events-none opacity-75 col-span-2 md:col-span-12 md:flex md:justify-between md:items-center">
                      <Submit
                        className="!py-2"
                        disabled={formik.isSubmitting}
                        loading={formik.isSubmitting}
                        loadingText="Salvando..."
                      >
                        Salvar
                      </Submit>
                    </div>
                    {error && (
                      <div className="col-span-2 w-full text-right text-danger text-sm md:col-span-12">
                        <p>{error}</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            ) : undefined}
          </>
        )}
      </PageContent>
    </>
  )
}

export default SqlAgentJobs
