/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */

import { Button, Select, Table, Tag } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Selector from '~/components/form/selector'
import { PageContent, PageWrapper } from '~/components/page'
import { ServerInfo } from '~/components/page/server-info'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import { AlertHtmlSubTable } from '~/components/table/subTable'
import { useUser } from '~/hooks/index'
// import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import useAlertContext from '~/services/state-manager/alerts'
import {
  FeatureFunction,
  hasPermission,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'
import { formatServer } from '~/utils/server'

const AlertsDetailsPage = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const { userState: user } = useUser()

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
      // console.log({ tableReference })
      tableReference.current.refresh()
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

  const tableReference = useRef()
  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper>
          {hasSomePermissions(
            user,
            [
              FeatureFunction.MONITORED_SERVERS,
              FeatureFunction.ACTIONS_SHORTCUT,
            ],
            TypeGrant.READ
          ) && <MonitoredServersSidebar />}

          <PageContent className="border-b border-gray-light">
            {currentServer ? (
              <div className="w-full flex items-center gap-4 mb-10">
                <ServerInfo currentServer={currentServer} />
              </div>
            ) : (
              <></>
            )}

            <form
              className="w-full flex flex-col space-y-4 max-w-[760px]
                  xl:space-x-4 xl:space-y-0 xl:flex-row"
            >
              {hasPermission(
                user,
                FeatureFunction.ALERTS_FILTER_BY_TYPE,
                TypeGrant.EXECUTE
              ) && (
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
              )}

              <Select
                name="time"
                style={{ width: '150px' }}
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={timeOptions}
                value={
                  isNaN(Number.parseInt(router?.query?.time))
                    ? -1
                    : Number.parseInt(router?.query?.time)
                }
                onChange={(value) => {
                  handleChange('time', value)
                  setCurrentPage(1)
                }}
              />
              <Select
                name="server"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={
                  // eslint-disable-next-line unicorn/prefer-number-properties
                  isNaN(Number.parseInt(router?.query?.server))
                    ? -1
                    : Number.parseInt(router?.query?.server)
                }
                style={{ width: '150px' }}
                onChange={(value) => {
                  handleChange('server', value)
                  setCurrentPage(1)
                }}
              />

              {/* <div className="flex items-center">
                <Input
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
              </div> */}
            </form>
          </PageContent>

          <PageContent>
            <Table
              ref={tableReference}
              dataSource={alertsResult.result.map((r) => ({
                ...r,
                key: `${r.serverId}-${r.id}`,
              }))}
              columns={[
                { dataIndex: 'alertName', title: 'Alert Name' },
                {
                  dataIndex: 'serverName',
                  title: 'Server Name',
                  render: (value) => {
                    return value
                  },
                },
                { dataIndex: 'dsMessage', title: 'Message' },
                {
                  dataIndex: 'isActive',
                  title: 'Status',

                  render: (value) =>
                    value === 1 && <Tag color="orange">Active</Tag>,
                },
                {
                  dataIndex: 'dtAlert',
                  title: 'Last Updated',

                  render: (value) => moment(value).format('DD/MM/yyyy HH:mm'),
                },
                {
                  title:
                    hasPermission(
                      user,
                      FeatureFunction.ALERT_ON_CLICK,
                      TypeGrant.EXECUTE
                    ) && 'Action',

                  render: (value, alert) => {
                    return hasPermission(
                      user,
                      FeatureFunction.ALERTS_LISTING,
                      TypeGrant.EXECUTE
                    ) ? (
                      <Button
                        type="dashed"
                        loading={cleaningAlert === alert.id * alert.serverId}
                        onClick={(event) => {
                          event.stopPropagation()
                          event.preventDefault()
                          handleClearAlert(alert?.id, alert?.serverId)
                        }}
                      >
                        Clear
                      </Button>
                    ) : (
                      <></>
                    )
                  },
                },
              ]}
              loading={loading}
              expandable={
                hasPermission(
                  user,
                  FeatureFunction.ALERT_ON_CLICK,
                  TypeGrant.EXECUTE
                ) && {
                  expandedRowRender: (alert) => {
                    return (
                      <AlertHtmlSubTable
                        serverId={alert.serverId}
                        idSeq={alert.idSeq}
                        id={alert.id}
                      />
                    )
                  },
                }
              }
              onRow={() => ({ style: { cursor: 'pointer' } })}
            />
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsDetailsPage
