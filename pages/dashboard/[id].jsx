import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import faker from 'faker'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useContext, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

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
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import GlobalContext from '~/contexts/global'
import DatabaseIcons from '~/helpers/database-icons'
import Layout from '~/layouts/default'
import { scrollToSection } from '~/utils/global'
import { formatServer } from '~/utils/server'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    tooltip: { enabled: false },
    legend: { display: false },
  },
}

const cpuOptions = {
  ...options,
  scales: {
    // x: {
    //   grid: { display: false },
    // },
    y: {
      // grid: { display: false },
      ticks: {
        callback: function (value) {
          return value + '%'
        },
      },
    },
  },
}

const memoryOptions = {
  ...options,
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return value + ' GB'
        },
      },
    },
  },
}

const diskOptions = {
  ...options,
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return value + ' MB/s'
        },
      },
    },
  },
}

const waitsOptions = {
  ...options,
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return value + ' MB/s'
        },
      },
    },
  },
}

const labels = ['08:00', '08:10', '08:20', '08:30', '08:40', '08:50', '09:00']

const cpuData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() =>
        faker.datatype.number({ min: 0, max: 100, precision: 10 })
      ),
      borderColor: 'rgb(80, 70, 229)',
      backgroundColor: 'rgba(80, 70, 229, 0.5)',
    },
  ],
}

const memoryData = {
  labels,
  datasets: [
    {
      fill: true,
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const diskData = {
  labels,
  datasets: [
    {
      fill: true,
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: 'rgb(140, 216, 141)',
      backgroundColor: 'rgba(140, 216, 141, 0.5)',
    },
  ],
}

const waitsData = {
  labels,
  datasets: [
    {
      fill: true,
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: 'rgb(221, 123, 53)',
      backgroundColor: 'rgba(221, 123, 53, 0.5)',
    },
  ],
}

const dashboardSections = [
  { name: 'Server/host metrics', slug: 'allinstancemetrics' },
  { name: 'tempdb', slug: 'tempdb' },
  { name: 'Blocking processes', slug: 'blocking-processes' },
  { name: 'SQL user processes', slug: 'sqlprocesses' },
  { name: 'Processes', slug: 'processes' },
  { name: 'Error log', slug: 'error-log' },
  { name: 'Databases', slug: 'databases' },
]

const DashboardSingle = () => {
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

  return (
    <>
      <NextSeo title="Dashboard - MonitDB" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <PageSidebarLinksList>
              {dashboardSections.map((section) => (
                <li key={section.slug}>
                  <button onClick={() => scrollToSection(`#${section.slug}`)}>
                    {section.name}
                  </button>
                </li>
              ))}
            </PageSidebarLinksList>
            <LatestAlertsSidebar />
          </PageSidebar>
          <PageContent hideBreadcrumbs={true}>
            {!currentServer && <Loading />}
            {currentServer && (
              <div className="w-full flex flex-col gap-y-8">
                <header className="w-full flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-light">
                    <DatabaseIcons
                      name={currentServer.type.typeservername}
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
                      Raised at Wed, Oct 6 10:47 (Active for more than 427 days)
                    </p>
                  </div>
                </div>

                <form
                  className="w-full flex items-center gap-x-8 py-4 border-t border-t-gray-light
                    border-b border-b-gray-light text-sm"
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
                      onChange={(value) => formik.setFieldValue('cpu', value)}
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
                      onChange={(value) => formik.setFieldValue('disk', value)}
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
                      {sqlCode && <Code code={sqlCode} language="javascript" />}
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
                      <Line options={cpuOptions} data={cpuData} />
                    </div>
                    <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                      <h6 className="mb-4 heading-xs">Memória</h6>
                      <Line options={memoryOptions} data={memoryData} />
                    </div>
                    <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                      <h6 className="mb-4 heading-xs">Disk I/O</h6>
                      <Line options={diskOptions} data={diskData} />
                    </div>
                    <div className="col-span-2 border bg-white border-gray-light p-4 lg:col-span-6">
                      <h6 className="mb-4 heading-xs">Waits</h6>
                      <Line options={waitsOptions} data={waitsData} />
                    </div>
                  </Grid>
                </div>
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default DashboardSingle
