import { faDatabase, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Checkbox from '~/components/form/checkbox'
import Select from '~/components/form/select'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageWrapper } from '~/components/page'
import Pagination from '~/components/pagination'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import DatabaseIcons from '~/helpers/database-icons'
import useAlerts from '~/hooks/use-alerts'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import useAlertContext from '~/services/state-manager/alerts'
import { formatAlert } from '~/utils/alert'
import { scrollToTop } from '~/utils/browser'
import { getFormattedDate } from '~/utils/formats'
import { formatServer } from '~/utils/server'

const AlertsDetailsPage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const { parameters, getAlertsParameter, alertsResult, getAlertsResult } =
    useAlertContext()

  const router = useRouter()

  const [loading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [pagination, setPagination] = useState({})

  const typesOptions = useMemo(
    () => [
      { value: '', label: 'All metrics' },
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
      { value: -1, label: 'All time' },
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

  const currentServer = useMemo(() => {
    const server = servers.find(
      (server) => server.id === +router?.query?.server
    )

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.server])

  const formik = useFormik({
    initialValues: {
      types: [],
      time: '',
      server: '',
    },
  })

  const getAlertsData = useCallback(async () => {
    const serverId = router?.query?.server
    const requestQuery = {
      pageSize: 10,
      page: currentPage,
      lastMinutes: router?.query?.time,
      alertTypesId: router?.query?.types,
    }

    try {
      if (parameters.length === 0) await getAlertsParameter()
      const data = await getAlertsResult({ ...requestQuery, serverId })
      setPagination({ totalResults: data?.result?.length })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [
    currentPage,
    getAlertsParameter,
    getAlertsResult,
    parameters,
    router?.query?.server,
    router?.query?.time,
    router?.query?.types,
  ])

  useEffect(getAlertsData, [getAlertsData])

  // useEffect(() => {
  //   if (!isDataLoaded) return

  //   getAlertsData()
  //   scrollToTop()
  // }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

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
                value={formik.values.types}
                onChange={() => {}}
                // onChange={(value) => handleChangeField('types', value)}
                className="w-full md:w-1/3 md:min-w-1/3"
              />
              <Select
                name="time"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={timeOptions}
                value={formik.values.time}
                onChange={() => {}}
                // onChange={(value) => handleChangeField('time', value)}
              />
              <Select
                name="schedule"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={formik.values.server}
                onChange={() => {}}
                // onChange={(value) => handleChangeField('server', value)}
              />
            </form>
          </PageContent>

          <PageContent>
            {!loading && alertsResult?.result.length > 0 ? (
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
                        <th className="border-b-2 border-gray-light w-60">
                          Source object
                        </th>
                        <th className="border-b-2 border-gray-light w-20">
                          Status
                        </th>
                        <th className="border-b-2 border-gray-light w-40">
                          Last updated
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertsResult?.result?.map((alert, index) => (
                        <tr
                          key={`alert-${index}`}
                          className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out lg:hover:bg-gray-light lg:hover:bg-opacity-50"
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
                          <td>{alert?.alertName}</td>
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
                          <td>{getFormattedDate(alert?.dtAlert)}</td>
                        </tr>
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
              <h1>No data to Display</h1>
            )}

            {loading && !alertsResult.initialFetch ? (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            ) : (
              <></>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsDetailsPage
