/* eslint-disable no-console */
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import faker from 'faker'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'

import Chart from '~/components/chart'
import Code from '~/components/code'
import { Textarea } from '~/components/form'
import Checkbox from '~/components/form/checkbox'
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
  Server,
  ServerMetrics,
  SqlUserProcesses,
  TempDB,
} from '~/components/page/dashboard'
import CurrentActivity from '~/components/page/dashboard/current-activity'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import { SingleDashboardContextProvider } from '~/contexts/single-dashboard'
import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
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
]

const SingleDashboard = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const [activeTabId, setActiveTabId] = useState(tabItems[0]['id'])
  const [lastFetch, setLastFetch] = useState(Date.now())

  const router = useRouter()

  const [sqlCode, setSqlCode] = useState(
    `CREATE USER 'user'@'server-ip' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON scheme.* TO 'user'@'server-ip' WITH GRANT OPTION;`
  )

  // const serverId = useMemo(() => router.query.id, [router?.query?.id])

  const currentServer = useMemo(() => {
    const server = servers.find((server) => server.id === +router?.query?.id)

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.id])

  const lastMinutesOptions = [
    { value: HOUR, label: '1 hora' },
    { value: 6 * HOUR, label: '6 horas' },
    { value: DAY, label: '24 horas' },
    { value: 7 * DAY, label: '7 dias' },
    { value: 14 * DAY, label: '14 dias' },
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
                          4 GB Memory / 2 Intel vCPUs / 50 GB Disk + 25 GB /
                          NYC1 - Plesk 18.0 on Ubuntu 20.04{' '}
                        </p>
                      </div>
                    </div>
                  </header>

                  <div className="w-full flex items-center gap-4 py-2 px-4 border border-orange border-opacity-25 bg-orange bg-opacity-10 text-sm">
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
                  </div>
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
                    <form
                      className="w-full flex items-center gap-x-8 p-4 border border-gray-light
                        bg-white text-sm"
                      onSubmit={formik.handleSubmit}
                    >
                      <label
                        htmlFor="cpu"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span>CPU</span>
                        <Checkbox
                          id="cpu"
                          name="cpu"
                          defaultValue={formik.values.cpu}
                          value={formik.values.cpu}
                          onChange={(value) =>
                            formik.setFieldValue('cpu', value)
                          }
                        />
                      </label>
                      <label
                        htmlFor="memory"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span>Memória</span>
                        <Checkbox
                          id="memory"
                          name="memory"
                          defaultValue={formik.values.memory}
                          value={formik.values.memory}
                          onChange={(value) =>
                            formik.setFieldValue('memory', value)
                          }
                        />
                      </label>
                      <label
                        htmlFor="disk"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <span>Disk I/O</span>
                        <Checkbox
                          id="disk"
                          name="disk"
                          defaultValue={formik.values.disk}
                          value={formik.values.disk}
                          onChange={(value) =>
                            formik.setFieldValue('disk', value)
                          }
                        />
                      </label>
                      <div className="flex items-center gap-2">
                        <span>Frequência</span>
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
                      </div>
                      <button onClick={() => setLastFetch(Date.now())}>
                        Refresh
                      </button>
                      <div>{lastFetch}</div>
                    </form>

                    <div id="allinstancemetrics">
                      <Grid>
                        <div className="col-span-2 bg-white border border-gray-light p-4 lg:col-span-12">
                          <Textarea
                            name="description"
                            className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                            onChange={(event) => {
                              const target = event.target

                              setSqlCode(target.value)
                            }}
                            value={sqlCode}
                          />
                          {sqlCode && (
                            <Code code={sqlCode} language="javascript" />
                          )}
                          <div className="w-full flex">
                            <button
                              type="button"
                              className="btn mt-4 ml-auto"
                              onClick={() => {
                                setSqlCode('')
                              }}
                            >
                              Run
                            </button>
                          </div>
                        </div>
                        <div className="col-span-2 bg-white lg:col-span-6">
                          <Chart
                            colors={['#ff5500']}
                            title={{
                              text: 'DTU',
                              offsetY: 10,
                              offsetX: 5,
                            }}
                            seriesName="% Utilization"
                          />
                        </div>
                        <CpuUsage currentServer={currentServer} />
                        <div className="col-span-2 bg-white lg:col-span-6">
                          <Chart
                            colors={['#4abc4b']}
                            title={{
                              text: 'Data I/O',
                              offsetY: 10,
                              offsetX: 5,
                            }}
                            seriesName="% Utilization"
                          />
                        </div>
                        <div className="col-span-2 bg-white lg:col-span-6">
                          <Chart
                            colors={['#0e5b10']}
                            title={{
                              text: 'Log I/O',
                              offsetY: 10,
                              offsetX: 5,
                            }}
                            seriesName="% Utilization"
                          />
                        </div>
                      </Grid>

                      <Server />
                      <ServerMetrics key={lastFetch} />
                      <Permissions currentServer={currentServer} />
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
              </>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </SingleDashboardContextProvider>
  )
}

export default SingleDashboard
