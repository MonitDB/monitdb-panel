/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable unicorn/no-array-reduce */
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, DatePicker, Form, notification } from 'antd'
import moment from 'moment'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'

import { ApexChart, defaultChartOptions } from '~/components/chart'
import { Select } from '~/components/form'
import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { getAnalysis } from '~/services/analysis'

import { useGlobal } from '../hooks'

const datasets = {
  Log_Full_Scans_Count: {
    code: 'Log_Full_Scans_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_Batch_Requests_Count: {
    code: 'Log_Batch_Requests_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_Tempdb_Usage: {
    code: 'Log_Tempdb_Usage',
    options: [
      { label: 'Allocated Space', value: 'allocated_space' },
      { label: 'Space Used', value: 'space_used' },
      { label: 'Available Space', value: 'available_space' },
    ],
    parent: '',
  },
  Log_Lock_Waits_Count: {
    code: 'Log_Lock_Waits_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_Tempdb_Space_Use: {
    code: 'Log_Tempdb_Space_Use',
    options: [],
    parent: '',
  },
  Log_Processes: { code: 'Log_Processes', options: [], parent: '' },
  Log_Memory_Usage: {
    code: 'Log_Memory_Usage',
    options: [
      { label: 'Available Os Memory', value: 'AVAILABLE_OS_MEMORY' },
      { label: 'Total OS Memory', value: 'TOTAL_OS_MEMORY' },
      { label: 'Percent Usaged', value: 'PERCENT_USAGED(%)' },
    ],
    parent: '',
  },
  Log_Executions_SP: { code: 'Log_Executions_SP', options: [], parent: '' },
  Log_CPU_Usage: { code: 'Log_CPU_Usage', options: [], parent: '' },
  Log_User_Connections_Count: {
    code: 'Log_User_Connections_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_SQL_Compilations_Count: {
    code: 'Log_SQL_Compilations_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_Page_Splits_Count: {
    code: 'Log_Page_Splits_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_Lock_Timeouts_Count: {
    code: 'Log_Lock_Timeouts_Count',
    options: [],
    parent: 'HISTORIC',
  },
  Log_Latch_Waits_Count: {
    code: 'Log_Latch_Waits_Count',
    options: [],
    parent: 'HISTORIC',
  },
}

const AnalysisPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()
  const [data, setData] = useState([])

  const intervalOptions = useMemo(
    () => [
      { value: 15, label: '15 minutes' },
      { value: 60, label: '1 hour' },
      { value: 60 * 6, label: '6 hours' },
      { value: 24 * 60, label: '24 hours' },
    ],
    []
  )

  const groupedDatasets = Object.values(datasets).reduce(
    (accumulator, dataset) => {
      if (!accumulator[dataset.parent]) {
        accumulator[dataset.parent] = []
      }
      accumulator[dataset.parent].push(dataset)
      return accumulator
    },
    {}
  )

  const datasetsOptions = Object.entries(groupedDatasets).map(
    ([parent, datasets]) => (
      <optgroup key={parent} label={` ▼ ${parent}`} title={parent}>
        {datasets.map((dataset, index) => (
          <option
            key={index}
            value={dataset.code}
            title={dataset.code}
            className=""
          >
            &nbsp;&nbsp;&nbsp;{dataset.code.replace(/_/g, ' ')}
          </option>
        ))}
      </optgroup>
    )
  )

  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()

  const fetchData = async (metric, serverId, filter) => {
    setLoading(true)
    try {
      const { data } = await getAnalysis({ metric, serverId, filter })
      setData(data)
    } catch (error) {
      notification.error({ message: error.message })
    }
    setLoading(false)
  }

  const handleSubmit = (values) => {
    const { startDate, endDate, metric, server, interval } = values
    fetchData(metric, server, { startDate, endDate, interval })
  }

  return (
    <>
      <NextSeo title="Analysis - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <Form form={form} onFinish={handleSubmit}>
            <PageContent
              removeSidebarMargin={true}
              className="border-b border-gray-light"
            >
              <div className="w-full flex flex-col space-y-4 mb-5 xl:space-x-4 xl:space-y-0 xl:flex-row">
                <div className="flex items-center">
                  <strong className="block mr-2 whitespace-nowrap text-sm">
                    Interval
                  </strong>
                  <Form.Item
                    name="interval"
                    rules={[{ required: true }]}
                    initialValue={15}
                  >
                    <Select options={intervalOptions} className="w-40" />
                  </Form.Item>
                </div>
                <div className="flex items-center space-x-3">
                  <Form.Item name="startDate" rules={[{ required: true }]}>
                    <DatePicker />
                  </Form.Item>

                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ transform: 'translateY(-12px)' }}
                  />
                  <Form.Item name="endDate" rules={[{ required: true }]}>
                    <DatePicker />
                  </Form.Item>
                </div>
                <Button htmlType="submit" type="dashed" loading={loading}>
                  Compare
                </Button>
              </div>
              <div className="flex items-center">
                <ul
                  className="flex items-center border-r border-r-gray pr-4 mr-4
                text-blue text-sm space-x-3"
                >
                  <li>
                    <Link
                      onClick={() => {
                        const oneHourAgo = new Date()
                        oneHourAgo.setHours(oneHourAgo.getHours() - 1)

                        form.setFieldsValue({
                          startDate: moment(oneHourAgo),
                          endDate: moment(),
                        })
                      }}
                    >
                      Last Hour
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setHours(startDate.getHours() - 6)

                        form.setFieldsValue({
                          startDate: moment(startDate),
                          endDate: moment(),
                        })
                      }}
                    >
                      Last 6hrs
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setHours(startDate.getHours() - 24)

                        form.setFieldsValue({
                          startDate: moment(startDate),
                          endDate: moment(),
                        })
                      }}
                    >
                      Last 24hrs
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setDate(startDate.getDate() - 7)

                        form.setFieldsValue({
                          startDate: moment(startDate),
                          endDate: moment(),
                        })
                      }}
                    >
                      Lasts 7 days
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setDate(startDate.getDate() - 14)

                        form.setFieldsValue({
                          startDate: moment(startDate),
                          endDate: moment(),
                        })
                      }}
                    >
                      Lasts 14 days
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setHours(0)

                        form.setFieldsValue({
                          startDate: moment(startDate),
                          endDate: moment(),
                        })
                      }}
                    >
                      Today
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const today = new Date()
                        const startDate = new Date(today)
                        startDate.setDate(today.getDate() - today.getDay())

                        form.setFieldsValue({
                          startDate: moment(startDate),
                          endDate: moment(),
                        })
                      }}
                    >
                      This week
                    </Link>
                  </li>
                </ul>
              </div>
            </PageContent>

            <PageContent
              removeSidebarMargin={true}
              className="border-b border-gray-light"
            >
              <div className="w-4/5 mb-10 bg-white">
                {loading && (
                  <div className="col-span-2 bg-white lg:col-span-6 h-200 flex items-center justify-center h-[215px]">
                    <Loading />
                  </div>
                )}
                {!loading && (
                  <ApexChart
                    height={200}
                    options={{
                      ...defaultChartOptions,
                      title: {
                        text: !data
                          ? 'Error to load the data'
                          : form.getFieldValue('metric')?.replace(/_/g, ' '),
                        offsetY: 10,
                        offsetX: 5,
                      },
                      stroke: { width: 1, curve: 'smooth' },
                      xaxis: {
                        ...defaultChartOptions.xaxis,
                        type: 'datetime',
                        labels: {
                          datetimeUTC: false,
                          datetimeFormatter: {
                            year: 'yyyy',
                            month: "MMM 'yy",
                            day: 'dd',
                            hour: 'HH:mm',
                          },
                        },
                      },
                      yaxis: {
                        ...defaultChartOptions.yaxis,
                        forceNiceScale: false,

                        tickAmount: 5,
                      },
                      legend: {
                        ...defaultChartOptions.legend,
                        itemMargin: '10px',
                        labels: {
                          useSeriesColors: true,
                          formatter: function (seriesName) {
                            return seriesName.replace(/_/g, ' ')
                          },
                        },
                      },
                    }}
                    series={[
                      {
                        name: 'Count',
                        data,
                      },
                    ]}
                  />
                )}
              </div>{' '}
              <div className="w-full flex flex-col md:flex-row">
                <div className="flex flex-col md:flex-row md:space-x-4 md:w-4/5">
                  <div className="w-60">
                    <input
                      type="text"
                      name="metrics"
                      placeholder="Search by metrics"
                      className="w-full px-4 h-10 mb-2 bg-white leading-10 rounded outline-none text-sm"
                    />
                    <Form.Item name="metric" rules={[{ required: true }]}>
                      <select
                        size="15"
                        className="w-full appearance-none border border-gray-light text-xs"
                      >
                        {datasetsOptions}
                      </select>
                    </Form.Item>
                  </div>
                  <div className="w-60">
                    <input
                      type="text"
                      name="cluster"
                      placeholder="Search by cluster"
                      className="w-full px-4 h-10 mb-2 bg-white leading-10 rounded outline-none text-sm"
                    />{' '}
                    <Form.Item name="server" rules={[{ required: true }]}>
                      <select
                        size="15"
                        className="w-full appearance-none border border-gray-light text-xs"
                      >
                        {servers.map((server, id) => {
                          return (
                            <option key={id} value={server.id}>
                              {server.serverName}
                            </option>
                          )
                        })}
                      </select>
                    </Form.Item>
                  </div>
                </div>
                <div className="w-full md:w-1/5"></div>
              </div>
            </PageContent>
          </Form>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AnalysisPage
