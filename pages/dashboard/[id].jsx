import { faChevronRight, faWarning } from '@fortawesome/free-solid-svg-icons'
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
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'

import Code from '~/components/code'
import { Textarea } from '~/components/form'
import Checkbox from '~/components/form/checkbox'
import Select from '~/components/form/select'
import Grid from '~/components/grid'
import Loading from '~/components/loading'
import { PageContent, PageWrapper } from '~/components/page'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import GlobalContext from '~/contexts/global'
import DatabaseIcons from '~/helpers/database-icons'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
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
          return value + ' s/s'
        },
      },
    },
  },
}

const labels = Array.from({ length: 60 }, (_, index) => `8:${index}`)

const tableDataItems = labels.map(() => ({
  title: `SELECT user_id FROM ${faker.random.word()} WHERE meta_key = '${faker.random.word()}'`,
}))

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
      borderColor: 'rgb(252, 144, 3)',
      backgroundColor: 'rgba(252, 144, 3, 0.5)',
    },
  ],
}

const DashboardSingle = () => {
  const {
    globalState: { servers, serverTypes },
  } = useContext(GlobalContext)
  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)

  const router = useRouter()

  const [sqlCode, setSqlCode] = useState(
    `CREATE USER 'user'@'server-ip' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON scheme.* TO 'user'@'server-ip' WITH GRANT OPTION;`
  )

  // const serverId = useMemo(() => router.query.id, [router?.query?.id])

  const toggleActiveTableRowIndex = useCallback((index) => {
    setActiveTableRowIndex((oldIndex) => (oldIndex === index ? -1 : index))
  }, [])

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
          <LatestAlertsSidebar />
          <PageContent hideBreadcrumbs={true}>
            {!currentServer && <Loading />}
            {currentServer && (
              <div className="w-full flex flex-col gap-y-8">
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
                      <h4 className="heading-md">{currentServer.serverName}</h4>
                      <p className="text-sm">
                        4 GB Memory / 2 Intel vCPUs / 50 GB Disk + 25 GB / NYC1
                        - Plesk 18.0 on Ubuntu 20.04{' '}
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
                      Raised at Wed, Oct 6 10:47 (Active for more than 427 days)
                    </p>
                  </div>
                </div>

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

                <div className="prose max-w-full prose-p:m-0 prose-td:align-top prose-td:py-4 prose-th:border-b-4 prose-headings:m-0">
                  <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                    <table className="m-0 w-full">
                      <thead>
                        <tr>
                          <th>Query text</th>
                          <th>Execuções</th>
                          <th>Duração (ms)</th>
                          <th>CPU (ms)</th>
                          <th>Physical reads</th>
                          <th>Logical reads</th>
                          <th>Logical writes</th>
                          <th>Memory grant (KB)</th>
                          <th>Database</th>
                        </tr>
                      </thead>
                      {tableDataItems.map((item, itemIndex) => (
                        <tbody
                          key={`item-${itemIndex}`}
                          className={[
                            'transition-all duration-150 ease-in-out',
                            activeTableRowIndex === itemIndex && 'bg-white',
                          ].join(' ')}
                        >
                          <tr className="border-b-0">
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  toggleActiveTableRowIndex(itemIndex)
                                }
                                className="whitespace-nowrap truncate"
                              >
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  className={[
                                    'mr-1 transition-all duration-150 ease-in-out',
                                    activeTableRowIndex === itemIndex &&
                                      'rotate-90',
                                  ].join(' ')}
                                />
                                <span className="truncate">{item.title}</span>
                              </button>
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                            <td>
                              {faker.datatype.number({ min: 0, max: 100 })}
                            </td>
                          </tr>
                          <tr
                            className={
                              itemIndex < labels.length - 1 &&
                              'border-b border-b-gray border-opacity-50'
                            }
                          >
                            <td colSpan={9} className="!p-0">
                              <Reveal
                                active={activeTableRowIndex === itemIndex}
                              >
                                <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                                  <div className="w-full mb-4">
                                    <h4 className="!mb-2 font-bold text-base">
                                      Query details
                                    </h4>
                                    <p className="text-xs">
                                      <strong>Database:</strong>{' '}
                                      {faker.random.word()}
                                      <br />
                                      <strong>Program duration:</strong> 18,582
                                      ms
                                      <br />
                                      <strong>Plan handle:</strong>
                                      {faker.datatype.uuid()}
                                      <br />
                                      SQL Monitor has identified 1 issues with
                                      this query. Addressing them could improve
                                      performance. Top query is a fragment of a
                                      larger query. Show full query.
                                    </p>
                                  </div>
                                  <div className="w-full">
                                    <h2 className="!mb-4 text-base font-bold text-gray-dark font-oxygen">
                                      Histórico de execução
                                    </h2>
                                    <Line
                                      options={options}
                                      data={diskData}
                                      height={50}
                                    />
                                  </div>
                                </div>
                              </Reveal>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
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
