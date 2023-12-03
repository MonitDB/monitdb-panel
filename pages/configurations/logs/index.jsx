import { faChevronRight, faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Select from '~/components/form/select'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Pagination from '~/components/pagination'
import Reveal from '~/helpers/reveal'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getLogs } from '~/services/logs'

const MAX_POSTS_PER_PAGE = 10

const LogsPage = ({ data, pagination }) => {
  const {
    globalState: { servers },
  } = useGlobal()

  const router = useRouter()

  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)

  const serversOptions = useMemo(
    () => [
      { value: '', label: 'All servers' },
      ...servers.map(({ serverName }) => ({
        value: serverName,
        label: serverName,
      })),
    ],
    [servers]
  )
  const formik = useFormik({
    initialValues: {
      PageNumber: 1,
      ServerName: router.query.ServerName || '',
    },
  })

  const currentPage = Number.parseInt(router.query.PageNumber, 10) || 1

  const toggleActiveTableRowIndex = useCallback((index) => {
    setActiveTableRowIndex((oldIndex) => (oldIndex === index ? -1 : index))
  }, [])

  const handleChangeField = useCallback(
    (values) => {
      const parameters_ = {
        ...formik.values,
      }

      for (const { name, value } of values) {
        parameters_[name] = value
        formik.setFieldValue(name, value)
      }

      const query = Object.keys(parameters_)
        .filter((key) => parameters_[key])
        .map((key) => `${key}=${parameters_[key]}`)
        .join('&')

      router.push(`/configurations/logs/?${query}`)
    },
    [formik.values] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const updateFormFields = useCallback(() => {
    // get all fields from router.query and update field
    const fields = Object.keys(router.query)

    for (const field of fields) {
      formik.setFieldValue(field, router.query[field])
    }
  }, [router.query]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateFormFields()
  }, [updateFormFields])

  return (
    <>
      <NextSeo title="Logs - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent
            className="border-b border-gray-light"
            removeSidebarMargin={true}
          >
            <PageHeader
              title="Logs"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations/',
                },
                {
                  title: 'Logs',
                  href: '/alerts/logs/',
                },
              ]}
            />

            <form
              className="w-full flex flex-col space-y-4 max-w-[760px]
                  xl:space-x-4 xl:space-y-0 xl:flex-row"
            >
              <Select
                name="ServerName"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={formik.values.ServerName}
                onChange={(value) => {
                  handleChangeField([
                    { name: 'ServerName', value },
                    { name: 'PageNumber', value: 1 },
                  ])
                }}
              />
            </form>
          </PageContent>

          <PageContent removeSidebarMargin={true}>
            <div className="relative">
              <div className="-mx-4 mb-4 py-4 px-8 bg-white md:-mx-6">
                <table className="prose max-w-full w-full mb-4">
                  <thead>
                    <tr className="text-sm font-bold text-gray-dark text-left">
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        &nbsp;
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Server name
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Component name
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Component code
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Message
                      </th>
                      <th className="border-b-2 border-gray-light whitespace-nowrap">
                        Created at
                      </th>
                    </tr>
                  </thead>
                  {data.length === 0 && (
                    <tbody>
                      <tr>
                        <td colSpan={8} className="py-10 text-center">
                          No logs found
                        </td>
                      </tr>
                    </tbody>
                  )}

                  {data.length > 0 &&
                    data.map((log, logIndex) => (
                      <tbody
                        key={`item-${logIndex}`}
                        className={classNames(
                          'transition-all duration-150 ease-in-out',
                          {
                            'bg-white': activeTableRowIndex === logIndex,
                          }
                        )}
                      >
                        <tr
                          key={`log-${logIndex}`}
                          className="text-sm border-b border-gray-light transition-colors duration-200
                              ease-in-out cursor-pointer lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                          onClick={() => toggleActiveTableRowIndex(logIndex)}
                        >
                          <td>
                            <button type="button">
                              <FontAwesomeIcon
                                icon={faChevronRight}
                                className={classNames(
                                  'mr-1 transition-all duration-150 ease-in-out',
                                  {
                                    'rotate-90':
                                      activeTableRowIndex === logIndex,
                                  }
                                )}
                              />
                            </button>
                          </td>
                          <td>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faServer} />
                              <strong>{log.serverName}</strong>
                            </div>
                          </td>
                          <td>{log.componentName}</td>
                          <td>{log.componentCode}</td>
                          <td className="w-1/2">
                            <span className="block line-clamp-1 w-full font-courier text-sm">
                              {log.logResult}
                            </span>
                          </td>
                          <td className="whitespace-nowrap">
                            {format(
                              parseISO(log.componentLogDataCreate),
                              "dd MMM yyyy kk':'mm"
                            )}
                          </td>
                        </tr>
                        <tr
                          className={classNames({
                            'border-b border-b-gray border-opacity-50':
                              logIndex < MAX_POSTS_PER_PAGE - 1,
                          })}
                        >
                          <td colSpan={9} className="!p-0">
                            <Reveal active={activeTableRowIndex === logIndex}>
                              <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                                <div className="w-full mb-4">
                                  <h4 className="!mb-2 font-bold text-base">
                                    Log results
                                  </h4>
                                  <pre className=" whitespace-pre-wrap ">
                                    {log.componentLogResult}
                                  </pre>
                                </div>
                              </div>
                            </Reveal>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                </table>
              </div>
              {pagination?.totalResults > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalResults={pagination.totalResults}
                  onChangePage={(page) =>
                    handleChangeField([{ name: 'PageNumber', value: page }])
                  }
                />
              )}
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export async function getServerSideProps({ query, req }) {
  const response = await getLogs(
    {
      page: Number.parseInt(query.PageNumber, 10) || 1,
      pageSize: MAX_POSTS_PER_PAGE,
      serverName: query.ServerName,
    },
    req?.cookies?.user_token
  )

  return {
    props: {
      data: response?.data?.logs || [],
      pagination: {
        totalResults: response?.data?.totalResults || 0,
      },
    },
  }
}

export default LogsPage
