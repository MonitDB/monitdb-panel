import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Grid from '~/components/grid'
import Link from '~/components/link'
import Loading from '~/components/loading/loading'
import { PageContent, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import useAlertContext from '~/services/state-manager/alerts'
import { formatServer } from '~/utils/server'

import styles from './alerts.module.css'

const AlertsPage = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const { getAlertsCount } = useAlertContext()

  const [formattedServers, setFormattedServers] = useState([])
  const [search, setSearch] = useState('')
  const [loadingAlertCount, setLoadingAlertCount] = useState(false)
  const [error, setError] = useState(false)
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
          <MonitoredServersSidebar />

          <PageContent className="lg:pt-20">
            <form
              className="relative w-full mx-auto mb-10 lg:w-2/3 lg:mb-20"
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <input
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

            {activeServersCount >= 0 && !loadingAlertCount ? (
              <div className="w-full">
                <h2 className="mb-10 heading-md">Alert Servers</h2>
                <Grid className={styles.serversList}>
                  {formattedServers.map(({ id, serverName, type, active }) =>
                    active ? (
                      <div
                        key={`alerts-server-${id}`}
                        className="group relative col-span-2 transition-all duration-200 md:col-span-3 lg:col-span-4 lg:hover:!opacity-100 xl:col-span-3"
                      >
                        <Link
                          href={`/alerts/results/?server=${id}`}
                          className="relative block p-4 pr-14 border border-gray border-opacity-50 transition-all duration-200 ease-in-out bg-white lg:group-hover:bg-gray lg:group-hover:bg-opacity-25 lg:group-hover:border-opacity-25"
                        >
                          <h4 className="flex items-center text-sm space-x-2">
                            <FontAwesomeIcon
                              icon={faDatabase}
                              className="text-base"
                            />
                            <span className="truncate">{serverName}</span>
                            <span className="flex items-center justify-center rounded-full w-5 min-w-5 h-5 ml-auto text-xs bg-orange text-white">
                              {error
                                ? '?'
                                : serverAlertsCount[id]?.count || '?'}
                            </span>
                          </h4>
                          {type?.typeServerName && (
                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full border-gray-light p-4 transition-all duration-200 ease-in-out opacity-50 lg:group-hover:opacity-100">
                              <DatabaseIcons
                                name={type.typeServerName}
                                className="w-8 h-8"
                              />
                            </div>
                          )}
                        </Link>
                        <div className="absolute top-full left-0 w-full text-xs z-10 bg-white border border-gray border-opacity-50 transition-all duration-150 ease-in-out invisible opacity-0 lg:group-hover:visible lg:group-hover:opacity-100">
                          <ul>
                            <li>
                              <Link
                                href={`/alerts/metrics/?server=${id}`}
                                className="border-l-2 border-l-gray-dark block py-2 pl-2 underline lg:hover:text-blue lg:hover:border-l-4 lg:hover:border-l-blue"
                              >
                                Edit metrics and custom alerts
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      ''
                    )
                  )}
                </Grid>
              </div>
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
