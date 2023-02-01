import { faDatabase, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Checkbox from '~/components/form/checkbox'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageWrapper } from '~/components/page'
import Pagination from '~/components/pagination'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import DatabaseIcons from '~/helpers/database-icons'
import useAlerts from '~/hooks/use-alerts'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getAlertsById } from '~/services/alerts'
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

  const router = useRouter()

  const [alerts, setAlerts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [pagination, setPagination] = useState({})

  const typesOptions = useMemo(
    () => [
      { value: '', label: 'Todos os tipos' },
      ...parameters.map(({ id, nmAlert }) => ({
        value: id,
        label: nmAlert,
      })),
    ],
    [parameters]
  )

  const scheduleOptions = useMemo(
    () => [
      { value: '', label: 'Todos os horários' },
      { value: 1, label: '1 minuto' },
      { value: 5, label: '5 minutos' },
      { value: 20, label: '20 minutos' },
      { value: 60, label: '1 hora' },
      { value: 3600, label: '1 dia' },
      { value: 25_200, label: '1 semana' },
      { value: 32_000, label: '1 mês' },
    ],
    []
  )

  const currentServer = useMemo(() => {
    const server = servers.find((server) => server.id === +router?.query?.id)

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.id])

  const formik = useFormik({
    initialValues: {
      types: [],
      schedule: [],
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  const getAlertsData = useCallback(async () => {
    const responseAlerts = await getAlertsById(router?.query?.id, {
      PageLength: 10,
      PageNumber: currentPage,
    })

    if (currentPage === 1) {
      setPagination({
        totalResults: Number.parseInt(
          responseAlerts?.headers?.['x-paging-totalrecordcount'],
          10
        ),
      })
    }

    setIsLoadingData(false)

    setAlerts(
      [...(responseAlerts?.data ?? [])].map((alert) =>
        formatAlert(alert, {
          servers,
          serverTypes,
          serverEnvironments,
        })
      )
    )
  }, [router?.query?.id, servers, serverTypes, serverEnvironments, currentPage])

  useEffect(() => {
    setIsLoadingData(true)
    scrollToTop()
  }, [currentPage])

  useEffect(() => {
    if (router?.query?.id) {
      // setPagination({})
      // setCurrentPage(1)
      setIsLoadingData(true)
      setAlerts([])
      getAlertsData()
    }
  }, [router?.query?.id, getAlertsData])

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        {currentServer && (
          <PageWrapper>
            <MonitoredServersSidebar />

            <PageContent className="border-b border-gray-light">
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

              <form
                className="w-full flex flex-col space-y-4 max-w-[760px] xl:space-x-4 xl:space-y-0 xl:flex-row"
                onSubmit={formik.handleSubmit}
              >
                <Selector
                  name="types"
                  options={typesOptions}
                  value={formik.values.types}
                  onChange={(value) => {
                    formik.setFieldValue('types', value)
                  }}
                />
                <Selector
                  name="schedule"
                  options={scheduleOptions}
                  value={formik.values.schedule}
                  onChange={(value) => {
                    formik.setFieldValue('schedule', value)
                  }}
                />
                <button
                  type="reset"
                  className="btn"
                  onClick={() => formik.resetForm()}
                >
                  Limpar
                </button>
              </form>
            </PageContent>

            <PageContent>
              {alerts.length > 0 ? (
                <>
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
        )}
      </Layout>
    </>
  )
}

export default AlertsDetailsPage
