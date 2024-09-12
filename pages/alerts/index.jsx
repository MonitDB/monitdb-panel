/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-nested-ternary */
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Collapse, Input, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

// import Link from '~/components/link'
import Loading from '~/components/loading/loading'
import { PageContent, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import DatabaseIcons from '~/helpers/database-icons'
// import DatabaseIcons from '~/helpers/database-icons'
import { useUser } from '~/hooks/index'
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

const AlertsPage = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const { userState: user } = useUser()
  const router = useRouter()

  const { getAlertsCount } = useAlertContext()

  const [formattedServers, setFormattedServers] = useState([])
  const [search, setSearch] = useState('')
  const [loadingAlertCount, setLoadingAlertCount] = useState(false)
  const [, setError] = useState(false)
  const [serverAlertsCount, setServerAlertsCount] = useState({})

  const activeServersCount = useMemo(
    () => formattedServers.filter(({ active }) => active).length,
    [formattedServers]
  )

  const handleSubmit = useCallback((event) => {
    event.preventDefault()

    return false
  }, [])

  const handleSearchChanges = useCallback((event) => {
    const target = event.target
    const { value } = target

    setSearch(value)
  }, [])

  const loadAlertsCount = useCallback(async () => {
    try {
      setError(false)
      setLoadingAlertCount(true)
      const alertCountByServer = await getAlertsCount()
      setServerAlertsCount(alertCountByServer)
    } catch {
      toast.error('An error occurred while loading the alert count.')
      setError(true)
      setServerAlertsCount({})
    } finally {
      setLoadingAlertCount(false)
    }
  }, [getAlertsCount])

  useEffect(loadAlertsCount, [loadAlertsCount])

  useEffect(() => {
    if (servers.length === 0 || serverTypes.length === 0) {
      return
    }

    setFormattedServers(
      [...servers].map((server) => ({
        ...formatServer(server, { serverTypes }),
        active: true,
      }))
    )
  }, [servers, serverTypes])

  const serversByEnvironment = formattedServers.reduce((previous, current) => {
    if (!previous[current.typeServerEnvironment.typeServerEnvironmentName]) {
      previous[current.typeServerEnvironment.typeServerEnvironmentName] = []
    }

    previous[current.typeServerEnvironment.typeServerEnvironmentName].push(
      current
    )

    return previous
  }, {})

  useEffect(() => {
    setFormattedServers((oldFormattedServers) =>
      [...oldFormattedServers].map((server) => ({
        ...server,
        active: search
          ? server.serverName.toLowerCase().includes(search.toLowerCase())
          : true,
      }))
    )
  }, [search])

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
          ) && (
            <MonitoredServersSidebar
              showMonitoredServers={hasPermission(
                user,
                FeatureFunction.MONITORED_SERVERS,
                TypeGrant.READ
              )}
              showActions={hasPermission(
                user,
                FeatureFunction.ACTIONS_SHORTCUT,
                TypeGrant.READ
              )}
            />
          )}

          <PageContent className="lg:pt-20">
            {hasPermission(
              user,
              FeatureFunction.SEARCH_SERVER,
              TypeGrant.READ
            ) && (
              <form
                className="relative w-full mx-auto mb-10 lg:w-2/3 lg:mb-20"
                onSubmit={handleSubmit}
              >
                <div className="relative">
                  <Input
                    type="text"
                    name="search"
                    className="w-full pl-8 pr-20 h-20 shadow-md bg-white leading-10 rounded outline-none text-lg"
                    placeholder="Search for a server..."
                    onChange={handleSearchChanges}
                    value={search}
                  />
                </div>
                {search && (
                  <p className="absolute -bottom-8 left-0 w-full text-center text-sm text-gray">
                    {activeServersCount === 0 && <>No server found</>}
                    {activeServersCount === 1 && <>1 server found</>}
                    {activeServersCount > 1 && (
                      <>
                        <strong>{activeServersCount}</strong> servers found
                      </>
                    )}
                  </p>
                )}
              </form>
            )}

            {activeServersCount >= 0 && !loadingAlertCount ? (
              hasPermission(
                user,
                FeatureFunction.MONITORED_SERVERS,
                TypeGrant.READ
              ) && (
                <div className="w-full">
                  <h2 className="mb-10 heading-md">Alert Servers</h2>
                  {
                    <Collapse>
                      {Object.keys(serversByEnvironment).map((environment) => (
                        <Collapse.Panel key={environment} header={environment}>
                          <Table
                            dataSource={serversByEnvironment[
                              environment
                            ].filter((value) => value.active)}
                            showHeader={false}
                            pagination={false}
                            columns={[
                              {
                                dataIndex: 'serverName',
                                width: '30%',
                                render: (value, record) => (
                                  <>
                                    <h4 className="flex items-center text-sm space-x-2">
                                      <FontAwesomeIcon
                                        icon={faDatabase}
                                        className="text-base"
                                      />
                                      <span className="truncate">
                                        {value}{' '}
                                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full border-gray-light transition-all duration-200 ease-in-out opacity-50 lg:group-hover:opacity-100">
                                          <DatabaseIcons
                                            name={record.type.typeServerName}
                                            className="w-8 h-8"
                                          />
                                        </div>
                                      </span>
                                    </h4>
                                  </>
                                ),
                              },
                              {
                                width: '5%',
                                render: (_, record) => (
                                  <span
                                    className={`flex items-center justify-center rounded-full w-5 min-w-5 h-5 ml-auto text-xs ${
                                      serverAlertsCount[0]?.count === 0
                                        ? 'bg-green'
                                        : 'bg-orange'
                                    } text-white`}
                                  >
                                    {serverAlertsCount[record.id]?.count}
                                  </span>
                                ),
                              },
                              {
                                render: (_, record) => (
                                  <Button
                                    type="link"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      router.push(
                                        `/alerts/metrics/?server=${record.id}`
                                      )
                                    }}
                                  >
                                    Edit metrics
                                  </Button>
                                ),
                              },
                            ]}
                            onRow={(record) => ({
                              onClick: () => {
                                router.push(
                                  `/alerts/results/?server=${record.id}`
                                )
                              },
                              style: { cursor: 'pointer' },
                            })}
                          />
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  }
                </div>
              )
            ) : (
              <Loading />
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsPage
