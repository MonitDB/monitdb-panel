import { faChevronRight, faServer } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Pagination from '~/components/pagination'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
import { getLogs } from '~/services/logs'

const MAX_POSTS_PER_PAGE = 10

const LogsPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [data, setData] = useState([])
  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)

  const getData = useCallback(async () => {
    setIsLoading(true)
    setData([])

    try {
      const response = await getLogs({
        PageNumber: currentPage,
        PageLength: MAX_POSTS_PER_PAGE,
      })

      if (currentPage === 1) {
        setPagination({
          totalResults: Number.parseInt(
            response?.headers?.['x-paging-totalrecordcount'],
            10
          ),
        })
      }

      setData(response?.data)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
      setIsLoaded(true)
    }
  }, [currentPage])

  const toggleActiveTableRowIndex = useCallback((index) => {
    setActiveTableRowIndex((oldIndex) => (oldIndex === index ? -1 : index))
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <>
      <NextSeo title="Logs - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Logs"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/Configurations/',
                },
                {
                  title: 'Logs',
                  href: '/alerts/logs/',
                },
              ]}
            />

            {isLoading && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}

            {!isLoading && isLoaded && (
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
                                parseISO(log.dataCreate),
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
                                      {log.logResult}
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
                    onChangePage={(page) => setCurrentPage(page)}
                  />
                )}
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default LogsPage
