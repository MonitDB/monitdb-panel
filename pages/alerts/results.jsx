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

  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const { getAlerts, getAlertsById } = useAlertContext()

  const router = useRouter()

  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [pagination, setPagination] = useState({})

  const isAllServersInfoLoaded = useMemo(
    () =>
      servers.length > 0 &&
      serverTypes.length > 0 &&
      serverEnvironments.length > 0,
    [servers, serverTypes, serverEnvironments]
  )

  const typesOptions = useMemo(
    () => [
      { value: '', label: 'All metrics' },
      ...parameters.map(({ id, nmAlert }) => ({
        value: id,
        label: nmAlert,
      })),
    ],
    [parameters]
  )

  const serversOptions = useMemo(
    () => [
      { value: '', label: 'All servers' },
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

  const handleChangeField = useCallback(
    (name, value) => {
      const parameters_ = {
        ...formik.values,
        [name]: value,
      }

      const query = Object.keys(parameters_)
        .filter((key) => parameters_[key])
        .map((key) => `${key}=${parameters_[key]}`)
        .join('&')

      formik.setFieldValue(name, value)

      router.push(`/alerts/results/?${query}`)
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

  const getAlertsData = useCallback(async () => {
    const serverId = router?.query?.server
    const requestQuery = {
      pageLength: 10,
      pageNumber: currentPage,
      time: router?.query?.time,
      metrics: router?.query?.types,
    }

    setIsLoadingData(true)

    try {
      const responseAlerts = serverId
        ? await getAlertsById(serverId, requestQuery)
        : await getAlerts(requestQuery)

      setIsDataLoaded(true)

      if (currentPage === 1) {
        setPagination({
          totalResults: Number.parseInt(
            responseAlerts?.headers?.['x-paging-totalrecordcount'],
            10
          ),
        })
      }

      setAlerts(
        [...(responseAlerts?.data ?? [])].map((alert) =>
          formatAlert(alert, {
            servers,
            serverTypes,
            serverEnvironments,
          })
        )
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoadingData(false)
    }
  }, [router?.query, servers, serverTypes, serverEnvironments, currentPage])

  useEffect(() => {
    if (!isDataLoaded) return

    getAlertsData()
    scrollToTop()
  }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isAllServersInfoLoaded) return

    updateFormFields()
    setCurrentPage(1)
    setIsLoadingData(true)
    setAlerts([])
    getAlertsData()
  }, [router?.query, isAllServersInfoLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper>
          <MonitoredServersSidebar />

          <PageContent className="border-b border-gray-light">
            {currentServer && (
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
            )}

            <form
              className="w-full flex flex-col space-y-4 max-w-[760px]
                  xl:space-x-4 xl:space-y-0 xl:flex-row"
            >
              <Selector
                name="types"
                options={typesOptions}
                value={formik.values.types}
                onChange={(value) => handleChangeField('types', value)}
                className="w-full md:w-1/3 md:min-w-1/3"
              />
              <Select
                name="time"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={timeOptions}
                value={formik.values.time}
                onChange={(value) => handleChangeField('time', value)}
              />
              <Select
                name="schedule"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={formik.values.server}
                onChange={(value) => handleChangeField('server', value)}
              />
            </form>
          </PageContent>

          <PageContent>
            {alerts.length > 0 ? (
              <>
                <div className="-mx-4 mb-4 py-4 px-8 bg-white md:-mx-6">
                  <table
                    className={classNames('prose max-w-full w-full mb-4', {
                      'opacity-25': isLoadingData,
                    })}
                  >
                    <thead>
                      <tr className="text-sm font-bold text-gray-dark text-left">
                        <th className="w-5 border-b-2 border-gray-light">
                          <Checkbox
                            name="all"
                            value="1"
                            onChange={(value) => {
                              // eslint-disable-next-line no-console
                              console.log(`select all checkboxes ${value}`)
                            }}
                          />
                        </th>
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
                      {alerts.map((alert, index) => (
                        <tr
                          key={`alert-${index}`}
                          className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                        >
                          <td>
                            <Checkbox
                              className="transform translate-y-1"
                              name="alerts"
                              value={alert.idAlert}
                              onChange={(value) => {
                                // eslint-disable-next-line no-console
                                console.log(`select checkbox ${value}`)
                              }}
                            />
                          </td>
                          <td>{alert.dsMessage}</td>
                          <td>
                            <div className="flex items-center space-x-4 w-full">
                              <div className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faDatabase} />
                                <strong>{alert.server?.serverName}</strong>
                              </div>
                              {alert.serverEnvironment && (
                                <span className="flex items-center space-x-1">
                                  <FontAwesomeIcon icon={faTag} />{' '}
                                  <span className="rounded py-px px-1 text-xs bg-blue text-white">
                                    {
                                      alert.serverEnvironment
                                        .typeServerEnvironmentName
                                    }
                                  </span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td>Enabled</td>
                          <td>{getFormattedDate(alert.dtAlert)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination?.totalResults > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalResults={pagination.totalResults}
                    onChangePage={(page) => setCurrentPage(page)}
                  />
                )}
              </>
            ) : (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsDetailsPage
