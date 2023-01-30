import { faArrowsRotate, faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import classNames from 'classnames'
import faker from 'faker'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useContext, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

import BlockMessage from '~/components/block-message'
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
  Databases,
  ErrorLog,
  Permissions,
  Server,
  ServerMetrics,
  SqlUserProcesses,
  TempDB,
  VmwareMetrics,
} from '~/components/page/dashboard'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import GlobalContext from '~/contexts/global'
import DatabaseIcons from '~/helpers/database-icons'
import Layout from '~/layouts/default'
import {
  GB_DATA,
  GB_OPTIONS,
  MB_DATA,
  MB_OPTIONS,
  PERCENTE_DATA,
  PERCENTE_OPTIONS,
  S_DATA,
  S_OPTIONS,
} from '~/utils/chart'
import { scrollToSection } from '~/utils/global'
import { formatServer } from '~/utils/server'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

export const options = {
  responsive: true,
  plugins: {
    tooltip: { enabled: true },
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
}

export const labels = Array.from({ length: 60 }, (_, index) => `8:${index}`)

export const tableDataItems = labels.map(() => ({
  title: `SELECT user_id FROM ${faker.random.word()} WHERE meta_key = '${faker.random.word()}'`,
}))

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

const DashboardSingle = () => {
  const [activeTabId, setActiveTabId] = useState(tabItems[0]['id'])
  const {
    globalState: { servers, serverTypes },
  } = useContext(GlobalContext)

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

  const frequencyOptions = useMemo(
    () => [
      { value: '1h', label: '1 hora' },
      { value: '6h', label: '6 horas' },
      { value: '24h', label: '24 horas' },
      { value: '7d', label: '7 dias' },
      { value: '14d', label: '14 dias' },
    ],
    []
  )

  const formik = useFormik({
    initialValues: {
      cpu: true,
      memory: true,
      disk: true,
      frequency: frequencyOptions[0].value,
    },
    onSubmit: () => {},
  })

  // const TESTE_OPTIONS = {
  //   ...options,
  //   scales: {
  //     x: {
  //       grid: { display: false },
  //     },
  //     y: {
  //       // grid: { display: false },
  //       ticks: {
  //         // Include a dollar sign in the ticks
  //         callback: function (value, index, ticks) {
  //           const $firstTick = ticks[0]
  //           const $lastTick = ticks[ticks.length - 1]

  //           if (value > $firstTick.value && value < $lastTick.value) {
  //             return
  //           }
  //           return value
  //         },
  //       },
  //     },
  //   },
  // }

  return (
    <>
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
          <PageContent hideBreadcrumbs={true}>
            <div className="min-h-[calc(100vh-64px]">
              {/* <Line options={TESTE_OPTIONS} data={TESTE_DATA} /> */}
              {!currentServer && <Loading />}
              {currentServer && (
                <>
                  <div className="w-full flex flex-col gap-y-6">
                    <header className="w-full">
                      <h2 className="heading-lg mb-6">Dashboard - Overview</h2>
                      <div className="w-full flex items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-light">
                          <DatabaseIcons
                            name={currentServer.type.typeservername}
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
                            name="frequency"
                            value={formik.values.frequency}
                            options={frequencyOptions}
                            onChange={(value) => {
                              formik.setFieldValue('frequency', value)
                            }}
                          />
                        </div>
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
                          <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                            <h6 className="mb-4 heading-xs">CPU</h6>
                            <Line
                              options={PERCENTE_OPTIONS}
                              data={PERCENTE_DATA}
                            />
                          </div>
                          <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                            <h6 className="mb-4 heading-xs">Memória</h6>
                            <Line options={GB_OPTIONS} data={GB_DATA} />
                          </div>
                          <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                            <h6 className="mb-4 heading-xs">Disk I/O</h6>
                            <Line options={MB_OPTIONS} data={MB_DATA} />
                          </div>
                          <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                            <h6 className="mb-4 heading-xs">Waits</h6>
                            <Line options={S_OPTIONS} data={S_DATA} />
                          </div>
                        </Grid>

                        <Server />
                        <ServerMetrics />
                        <Permissions />
                        <VmwareMetrics />
                        <TempDB />
                        <BlockingProcesses />
                        <SqlUserProcesses />
                        <ErrorLog />
                        <Databases />
                      </div>
                    </div>
                  )}

                  {activeTabId === 'current-activity' && (
                    <div className="w-full min-h-96">
                      <button className="mt-6 bg-blue text-white px-3 h-11 rounded-[5px] font-medium flex items-center gap-1">
                        <FontAwesomeIcon
                          className="font-medium"
                          icon={faArrowsRotate}
                        />
                        Refresh
                      </button>
                      <BlockMessage
                        className="mt-6"
                        type="error"
                        message={
                          <p className="text-xs">
                            <span>The server is currently inaccessible.</span>
                          </p>
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default DashboardSingle
