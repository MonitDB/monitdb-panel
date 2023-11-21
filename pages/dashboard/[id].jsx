/* eslint-disable no-console */
// import { faWarning } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import faker from 'faker'
import { useFormik } from 'formik'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from 'react'

import Select from '~/components/form/select'
import Grid from '~/components/grid'
import Loading from '~/components/loading'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageWrapper,
} from '~/components/page'
import {
  BlockingProcesses,
  CpuUsage,
  Databases,
  ErrorLog,
  Permissions,
  // Server,
  ServerMetrics,
  SqlUserProcesses,
  TempDB,
} from '~/components/page/dashboard'
import CurrentActivity from '~/components/page/dashboard/current-activity'
import MemoryUsage from '~/components/page/dashboard/memory-usage'
import { SPBlitz } from '~/components/page/dashboard/sp-blitz'
import RdpButton from '~/components/rdpButton'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import { SingleDashboardContextProvider } from '~/contexts/single-dashboard'
import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import useServerContext from '~/services/state-manager/servers'
/*import useComponentLogContext from '~/services/state-manager/logs'*/
/*import { dateStringToTime } from '~/utils/formats'*/
import { scrollToSection } from '~/utils/global'
import { formatServer } from '~/utils/server'

export const labels = Array.from({ length: 60 }, (_, index) => `8:${index}`)

export const tableDataItems = labels.map(() => ({
  title: `SELECT user_id FROM ${faker.random.word()} WHERE meta_key = '${faker.random.word()}'`,
}))

const HOUR = 60
const DAY = 24 * HOUR

const dashboardSections = [
  { name: 'Server/host metrics', slug: 'allinstancemetrics' },
  { name: 'TEMPDB', slug: 'tempdb' },
  { name: 'Blocking processes', slug: 'blocking-processes' },
  { name: 'SQL user processes', slug: 'sqlprocesses' },
  { name: 'Processes', slug: 'processes' },
  { name: 'Error log', slug: 'error-log' },
  { name: 'Databases', slug: 'databases' },
]

const tabItems = [
  {
    title: 'History',
    id: 'history',
  },
  {
    title: 'Current activity',
    id: 'current-activity',
  },
  {
    title: 'Sp Blitz',
    id: 'sp-blitz',
  },
]

const SingleDashboard = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const [activeTabId, setActiveTabId] = useState(tabItems[0]['id'])
  const [serverMetrics, setServerMetrics] = useState()
  const [lastFetch, setLastFetch] = useState(Date.now())

  const { getServerMetrics } = useServerContext()

  const router = useRouter()

  const currentServer = useMemo(() => {
    const server = servers.find((server) => server.id === +router?.query?.id)

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.id])

  useEffect(() => {
    if (router?.query?.id) {
      const fetch = async () => {
        const { data } = await getServerMetrics({ id: router?.query?.id })
        setServerMetrics(data)
      }
      fetch()
    }
  }, [getServerMetrics, router?.query?.id])

  const lastMinutesOptions = [
    { value: HOUR, label: '1 hour' },
    { value: 6 * HOUR, label: '6 hours' },
    { value: 12 * HOUR, label: '12 hours' },
    { value: 1 * DAY, label: '24 hours' },
    { value: 2 * DAY, label: '2 days' },
  ]

  const formik = useFormik({
    initialValues: {
      cpu: true,
      memory: true,
      disk: true,
      lastMinutes: router.query.lastMinutes,
    },
    onSubmit: () => {},
  })

  return (
    <SingleDashboardContextProvider>
      <NextSeo title="Dashboard - MonitDB" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <LatestAlertsSidebar />
            {activeTabId === 'history' && (
              <PageSidebarLinksList className="mt-5">
                {dashboardSections.map((section, sectionIndex) => (
                  <li key={section.slug}>
                    <button
                      onClick={() => scrollToSection(`#${section.slug}`)}
                      className={classNames({
                        active: sectionIndex === 0,
                      })}
                    >
                      {section.name}
                    </button>
                  </li>
                ))}
              </PageSidebarLinksList>
            )}
          </PageSidebar>
          <PageContent hideBreadcrumbs={true} key={lastFetch}>
            {!currentServer && <Loading />}
            {currentServer && (
              <>
                <div className="w-full flex flex-col gap-y-6">
                  <header className="w-full">
                    <h2 className="heading-lg mb-6">Dashboard - Overview</h2>
                    <div className="w-full flex items-center gap-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-light">
                        <DatabaseIcons
                          name={currentServer.type.typeServerName}
                          className="w-9 h-9"
                        />
                      </div>
                      <div>
                        <h4 className="heading-md">
                          {currentServer.serverName}
                        </h4>
                        <p className="text-sm">
                          {serverMetrics
                            ? `${Math.round(
                                serverMetrics?.osProperties['Memory MB'] / 1024
                              )}GB Memory / ${
                                serverMetrics?.osProperties['Logic Processors']
                              } Intel vCPUs /
                        ${serverMetrics?.osProperties['OS_Plataform']}`
                            : 'Loading...'}
                        </p>
                      </div>
                    </div>
                  </header>

                  {/* <div className="w-full flex items-center gap-4 py-2 px-4 border border-orange border-opacity-25 bg-orange bg-opacity-10 text-sm">
                    <div className="flex items-center justify-center w-16 h-16">
                      <FontAwesomeIcon
                        icon={faWarning}
                        className="text-4xl text-orange"
                      />
                    </div>
                    <div>
                      <h6 className="heading-xs">
                        SQL Server Reporting Service status (2017+): ssc-db-n1
                      </h6>
                      <p>
                        Raised at Wed, Oct 6 10:47 (Active for more than 427
                        days)
                      </p>
                    </div>
                  </div> */}
                </div>

                <div className="flex items-center border-b-gray-light border-b-4">
                  {tabItems.map((tab) => (
                    <button
                      className={classNames('px-2 h-11 relative', {
                        'after:content-[""] after:block after:bg-blue after:h-1 after:w-full after:absolute after:-bottom-1 after:left-0':
                          tab.id === activeTabId,
                      })}
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {activeTabId === 'history' && (
                  <div className="w-full flex flex-col gap-y-6 mt-6">
                    <div className="w-full flex gap-x-8 p-4 border border-gray-light bg-white text-sm">
                      <div className="flex gap-2 mr-auto">
                        {serverMetrics?.osProperties['host_platform'] ===
                          'Windows' && (
                          <RdpButton
                            serverName={currentServer.serverName}
                            address={currentServer.serverHost}
                          />
                        )}
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <Select
                          className="w-40"
                          name="lastMinutes"
                          value={formik.values.lastMinutes}
                          options={lastMinutesOptions}
                          defaultValue={router.query.lastMinutes}
                          onChange={(value) => {
                            const queryParameters = new URLSearchParams(
                              router.query
                            )
                            queryParameters.set('lastMinutes', value)
                            const newUrl = `${
                              router.pathname
                            }?${queryParameters.toString()}`
                            router.push(newUrl)
                            formik.setFieldValue('lastMinutes', value)
                          }}
                        />
                        <button
                          className="bg-blue text-white px-3 h-11 rounded-[5px] font-medium flex items-center gap-1"
                          onClick={() => setLastFetch(Date.now())}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    <div id="allinstancemetrics">
                      <Grid>
                        <MemoryUsage currentServer={currentServer} />
                        <CpuUsage currentServer={currentServer} />
                      </Grid>

                      {/* <Server /> */}
                      <ServerMetrics key={lastFetch} />
                      <Permissions currentServer={currentServer} />
                      <div>
                        <br />
                        <h4 className="mb-4 text-sm">OS Properties</h4>
                        <div className="w-full mb-4 prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-gray-light prose-headings:m-0">
                          <table className="m-0 py-4 prose-tr:last:!border-b">
                            <tbody>
                              <tr>
                                <td>Edition</td>
                                <td>
                                  {serverMetrics?.osProperties['OS_Version']}
                                </td>
                              </tr>
                              <tr>
                                <td>Version</td>
                                <td>
                                  {' '}
                                  {serverMetrics?.osProperties['OS_Release']}
                                </td>
                              </tr>
                              {/* <tr>
                                <td>Build number</td>
                                <td>14393</td>
                              </tr> */}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {/* <VmwareMetrics /> */}
                      <TempDB />
                      <BlockingProcesses currentServer={currentServer} />
                      <SqlUserProcesses currentServer={currentServer} />
                      <ErrorLog currentServer={currentServer} />
                      <Databases currentServer={currentServer} />
                    </div>
                  </div>
                )}

                {activeTabId === 'current-activity' && (
                  <CurrentActivity currentServer={currentServer} />
                )}
                {activeTabId === 'sp-blitz' && (
                  <SPBlitz currentServer={currentServer} />
                )}
              </>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </SingleDashboardContextProvider>
  )
}

export default SingleDashboard
