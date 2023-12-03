/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  faChevronRight,
  faDatabase,
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Select from '~/components/form/select'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageWrapper } from '~/components/page'
import Pagination from '~/components/pagination'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import { AlertHtmlSubTable } from '~/components/table/subTable'
import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import useAlertContext from '~/services/state-manager/alerts'
import { formatServer } from '~/utils/server'

const AlertsDetailsPage = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const {
    parameters,
    getAlertsParameter,
    alertsResult,
    getAlertsResult,
    clearAlert,
  } = useAlertContext()

  const router = useRouter()

  const [loading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)

  const [cleaningAlert, setCleaningAlert] = useState(-1)

  const typesOptions = useMemo(
    () => [
      { value: -1, label: 'All metrics' },
      ...parameters.map(({ id, alertName }) => ({
        value: id,
        label: alertName,
      })),
    ],
    [parameters]
  )

  const serversOptions = useMemo(
    () => [
      { value: -1, label: 'All servers' },
      ...servers.map(({ id, serverName }) => ({
        value: id,
        label: serverName,
      })),
    ],
    [servers]
  )

  const timeOptions = useMemo(
    () => [
      { value: '', label: 'All time' },
      { value: 1, label: '1 minute' },
      { value: 5, label: '5 minutes' },
      { value: 20, label: '20 minutes' },
      { value: 60, label: '1 hour' },
      { value: 3600, label: '1 day' },
      { value: 25_200, label: '1 week' },
      { value: 32_000, label: '1 month' },
    ],
    []
  )

  const handleChange = (path, value) => {
    router.query[path] = value
    router.replace({ pathname: router.pathname, query: router.query })
  }

  const currentServer = useMemo(() => {
    const server = servers.find(
      (server) => server.id === +router?.query?.server
    )

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.server])

  const handleClearAlert = async (alertId, serverId) => {
    setCleaningAlert(alertId * serverId)
    try {
      await clearAlert(alertId, serverId)
      toast.success('Alert cleared successfully')
      getAlertsData()
    } catch (error) {
      console.error(error)
      toast.error('Error to clear the alert')
    } finally {
      setCleaningAlert(-1)
    }
  }

  const getAlertsData = useCallback(async () => {
    const serverId = router?.query?.server
    const requestQuery = {
      pageSize: 10,
      page: currentPage,
      lastMinutes: router?.query?.time,
      alertTypesId: router?.query?.types,
      allAlerts: router?.query?.allAlerts,
    }

    try {
      setIsLoading(true)
      if (parameters.length === 0) await getAlertsParameter()
      if (parameters.length > 0)
        await getAlertsResult({ ...requestQuery, serverId })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [
    currentPage,
    getAlertsParameter,
    getAlertsResult,
    parameters.length,
    router?.query?.allAlerts,
    router?.query?.server,
    router?.query?.time,
    router?.query?.types,
  ])

  useEffect(getAlertsData, [getAlertsData])

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper>
          <MonitoredServersSidebar />

          <PageContent className="border-b border-gray-light">
            {currentServer ? (
              <div className="w-full flex items-center gap-4 mb-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-light">
                  <DatabaseIcons
                    name={currentServer.type.typeServerName}
                    className="w-9 h-9"
                  />
                </div>
                <div>
                  <h4 className="heading-md">{currentServer.serverName}</h4>
                  <p className="text-sm">
                    4 GB Memory / 2 Intel vCPUs / 50 GB Disk + 25 GB / NYC1 -
                    Plesk 18.0 on Ubuntu 20.04{' '}
                  </p>
                </div>
              </div>
            ) : (
              <></>
            )}

            <form
              className="w-full flex flex-col space-y-4 max-w-[760px]
                  xl:space-x-4 xl:space-y-0 xl:flex-row"
            >
              <Selector
                name="types"
                options={typesOptions}
                value={JSON.parse(router?.query?.types || '[]')}
                onChange={(value) => {
                  handleChange('types', JSON.stringify(value))
                  setCurrentPage(1)
                }}
                className="w-full md:w-1/3 md:min-w-1/3"
              />
              <Select
                name="time"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={timeOptions}
                value={router?.query?.time}
                onChange={(value) => {
                  handleChange('time', value)
                  setCurrentPage(1)
                }}
              />
              <Select
                name="server"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={router?.query?.server}
                onChange={(value) => {
                  handleChange('server', value)
                  setCurrentPage(1)
                }}
              />

              <div className="flex items-center">
                <input
                  id="allAlerts"
                  type="checkbox"
                  name="allAlerts"
                  checked={router?.query?.allAlerts === 'true'}
                  onChange={(event) => {
                    handleChange('allAlerts', event.target.checked)
                    setCurrentPage(1)
                  }}
                />

                <label htmlFor="allAlerts" className="ml-2">
                  <span>All</span>
                </label>
              </div>
            </form>
          </PageContent>

          <PageContent>
            {loading && !alertsResult.initialFetch && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}
            {alertsResult?.result.length > 0 && alertsResult.initialFetch ? (
              <>
                <div className="-mx-4 mb-4 py-4 px-8 bg-white md:-mx-6">
                  <table
                    className={classNames('prose max-w-full w-full mb-4', {
                      'opacity-25': loading,
                    })}
                  >
                    <thead>
                      <tr className="text-sm font-bold text-gray-dark text-left">
                        {/* <th className="w-5 border-b-2 border-gray-light">
                          <Checkbox
                            name="all"
                            value="1"
                            onChange={(value) => {
                              // eslint-disable-next-line no-console
                              console.log(`select all checkboxes ${value}`)
                            }}
                          />
                        </th> */}
                        <th className="border-b-2 border-gray-light">
                          Alert type
                        </th>
                        <th className="border-b-2 border-gray-light">
                          Alert message
                        </th>
                        <th className="border-b-2 border-gray-light w-60">
                          Source object
                        </th>
                        <th className="border-b-2 border-gray-light w-20">
                          Status
                        </th>
                        <th className="border-b-2 border-gray-light w-60">
                          Last updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertsResult?.result?.map((alert, index) => (
                        // <tr
                        //   key={`alert-${index}`}
                        //   className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                        // >
                        <>
                          <tr
                            key={`alert-${index}`}
                            className={classNames(
                              'hover:bg-gray-lightest',
                              activeTableRowIndex === index &&
                                'bg-gray-lightest'
                            )}
                            onClick={() => {
                              if (activeTableRowIndex === index)
                                setActiveTableRowIndex(-1)
                              else setActiveTableRowIndex(index)
                            }}
                          >
                            {/* <td>
                            <Checkbox
                              className="transform translate-y-1"
                              name="alerts"
                              value={alert.idAlert}
                              onChange={(value) => {
                                // eslint-disable-next-line no-console
                                console.log(`select checkbox ${value}`)
                              }}
                            />
                          </td> */}
                            <td>
                              <button
                                type="button"
                                className="whitespace-nowrap truncate"
                              >
                                <FontAwesomeIcon
                                  width={7}
                                  height={7}
                                  icon={faChevronRight}
                                  className={classNames(
                                    'mr-1 transition-all duration-150 ease-in-out',
                                    {
                                      'rotate-90':
                                        activeTableRowIndex === index,
                                    }
                                  )}
                                />
                              </button>
                              <span>{alert?.alertName}</span>
                            </td>
                            <td>{alert?.dsMessage}</td>
                            <td>
                              <div className="flex items-center space-x-4 w-full">
                                <div className="flex items-center space-x-1">
                                  <FontAwesomeIcon icon={faDatabase} />
                                  <strong>{alert?.serverName}</strong>
                                </div>
                                {alert?.serverEnvironment && (
                                  <span className="flex items-center space-x-1">
                                    <FontAwesomeIcon icon={faTag} />{' '}
                                    <span className="rounded py-px px-1 text-xs bg-blue text-white">
                                      {
                                        alert?.serverEnvironment
                                          ?.typeServerEnvironmentName
                                      }
                                    </span>
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              {alert?.isActive === 1 ? 'Active' : 'Unactive'}
                            </td>
                            <td>{new Date(alert?.dtAlert).toLocaleString()}</td>
                            <td width={'100px'}>
                              {cleaningAlert === alert.id * alert.serverId ? (
                                <span>Cleaning...</span>
                              ) : (
                                <a
                                  aria-disabled={cleaningAlert != -1}
                                  href=""
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    event.preventDefault()

                                    handleClearAlert(alert?.id, alert?.serverId)
                                  }}
                                >
                                  Clear
                                </a>
                              )}
                            </td>
                          </tr>

                          {activeTableRowIndex === index && (
                            <AlertHtmlSubTable
                              serverId={alert.serverId}
                              idSeq={alert.idSeq}
                            />
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalResults={alertsResult.count}
                  onChangePage={(page) => setCurrentPage(page)}
                />
              </>
            ) : (
              !loading && <h1>No data to Display</h1>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsDetailsPage
