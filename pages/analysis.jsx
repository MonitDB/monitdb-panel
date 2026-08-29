/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable unicorn/no-array-reduce */
import '@uiw/react-textarea-code-editor/dist.css'

import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Modal,
  notification,
  Row,
  Select,
  Spin,
  Table,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import Highlighter from '~/components/highlighter'
import Link from '~/components/link'
import { PageContent, PageWrapper } from '~/components/page'
import QueryPlanRenderer from '~/components/qp-render'
import Layout from '~/layouts/default'
import { getAnalysis, getQueriesProfile, getWhoIs } from '~/services/analysis'
import { Feature, hasFeature } from '~/utils/hasPermission'
import { truncateString } from '~/utils/truncateString'

import { useGlobal, useUser } from '../hooks'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const datasets = {
  Log_Full_Scans_Count: {
    code: 'Log_Full_Scans_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_Batch_Requests_Count: {
    code: 'Log_Batch_Requests_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_Tempdb_Usage: {
    code: 'Log_Tempdb_Usage',
    options: [
      { label: 'Allocated Space', value: 'allocatedSpaceMB' },
      { label: 'Space Used', value: 'spaceUsedMB' },
      { label: 'Available Space', value: 'availableSpaceMB' },
      { label: 'Usage %', value: 'usedPercent' },
    ],
    parent: 'HISTORIC',
    accumulative: false,
  },
  Log_Lock_Waits_Count: {
    code: 'Log_Lock_Waits_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_Tempdb_Space_Use: {
    code: 'Log_Tempdb_Space_Use',
    options: [
      { label: 'Allocated Space (MB)', value: 'allocatedSpaceMB' },
      { label: 'Space Used (MB)', value: 'spaceUsedMB' },
    ],
    parent: 'HISTORIC',
    accumulative: false,
  },
  Log_Processes: {
    code: 'Log_Processes',
    options: [
      { label: 'CPU', value: 'cpu' },
      { label: 'Logical Reads', value: 'logicalReads' },
      { label: 'Writes', value: 'writes' },
      { label: 'Wait Time', value: 'waitTime' },
    ],
    parent: 'HISTORIC',
    accumulative: false,
  },
  Log_Memory_Usage: {
    code: 'Log_Memory_Usage',
    options: [
      { label: 'Available Os Memory', value: 'availableOsMemoryMb' },
      { label: 'Total OS Memory', value: 'totalOsMemoryMb' },
      { label: 'Percent Usaged', value: 'percentUsage' },
    ],
    parent: 'HISTORIC',
    accumulative: false,
  },
  Log_CPU_Usage: {
    code: 'Log_CPU_Usage',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_User_Connections_Count: {
    code: 'Log_User_Connections_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_SQL_Compilations_Count: {
    code: 'Log_SQL_Compilations_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_Page_Splits_Count: {
    code: 'Log_Page_Splits_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_Lock_Timeouts_Count: {
    code: 'Log_Lock_Timeouts_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
  Log_Latch_Waits_Count: {
    code: 'Log_Latch_Waits_Count',
    options: [{ label: 'Count', value: 'count' }],
    parent: 'HISTORIC',
    accumulative: true,
  },
}

const AnalysisPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()
  const { userState: user } = useUser()
  const [data, setData] = useState([])
  const [whoIs, setWhoIs] = useState([])
  const [queriesProfile, setQueriesProfile] = useState([])
  const [options, setOptions] = useState([{ label: 'Count', value: 'count' }])

  const [highlightedDate, setHighlightedDate] = useState()
  const [highlightedWhoIs, setHighlightedWhoIs] = useState([])

  const [modalWhoData, setModalWhoData] = useState()
  const [modalQueryProfileData, setModalQueryProfileData] = useState()

  const firstFetch = useRef(false)

  const intervalOptions = useMemo(
    () => [
      { value: 1, label: '1 minutes' },
      { value: 2, label: '2 minutes' },
      { value: 5, label: '5 minutes' },
      { value: 10, label: '10 minutes' },
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

  const groupedServers = servers.reduce((accumulator, server) => {
    if (!accumulator[server.typeServerEnvironment.typeServerEnvironmentName])
      accumulator[server.typeServerEnvironment.typeServerEnvironmentName] = []
    accumulator[server.typeServerEnvironment.typeServerEnvironmentName].push(
      server
    )
    return accumulator
  }, {})

  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm()
  const router = useRouter()

  const { query } = router

  useEffect(() => {
    const { server } = query
    if (server) {
      form.setFieldsValue({ server: Number(server) })
    }
  }, [form, query])

  useEffect(() => {
    if (!hasFeature(user, Feature.ANALYSIS) && user.grants) {
      router.push('/403')
    }
  }, [router, user])

  useEffect(() => {
    if (servers && servers[0] && !firstFetch.current) {
      form.setFieldsValue({
        metric: 'Log_Full_Scans_Count',
        param: 'count',
        server: servers[0]?.id,
      })
      firstFetch.current = true
      form.submit()
    }
  }, [form, servers])

  const fetchData = async (metric, serverId, filter) => {
    setLoading(true)
    try {
      const [whoIsResult, analysisResult, queryProfileResult] =
        await Promise.allSettled([
          getWhoIs({ serverId, filter }),
          getAnalysis({ metric, serverId, filter }),
          getQueriesProfile({ serverId, filter }),
        ])

      const whoIs =
        whoIsResult.status === 'fulfilled' ? whoIsResult.value.data : []
      const analysisData =
        analysisResult.status === 'fulfilled' ? analysisResult.value.data : []
      const queryProfileData =
        queryProfileResult.status === 'fulfilled'
          ? queryProfileResult.value.data
          : []
      setWhoIs(whoIs)
      setData(analysisData)
      setQueriesProfile(queryProfileData)
    } catch (error) {
      notification.error({ message: error.message })
    }
    setLoading(false)
  }

  // const dataRange = Form.useWatch('rangeDate', form)

  const handleSubmit = (values) => {
    const { rangeDate, metric, server, interval, param } = values
    const [startDate, endDate] = rangeDate
    fetchData(metric, server, {
      startDate,
      endDate,
      interval,
      param,
      accumulative: datasets[metric].accumulative,
    })
  }

  return (
    <>
      <NextSeo title="Analysis - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <PageContent
              removeSidebarMargin={true}
              // className="border-b border-gray-light"
            >
              <Divider />
              <Row gutter={12}>
                <Col>
                  <Form.Item
                    label="Sample rate"
                    name="interval"
                    rules={[
                      {
                        required: true,
                        message: 'Choice an interval of sample',
                      },
                    ]}
                    initialValue={15}
                  >
                    <Select
                      onChange={() => form.submit()}
                      options={intervalOptions}
                      className="w-40"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="Period"
                    name="rangeDate"
                    initialValue={[
                      dayjs(new Date().setHours(new Date().getHours() - 1)),
                      dayjs(),
                    ]}
                    rules={[
                      { required: true, message: 'Pick the range of date' },
                    ]}
                  >
                    <DatePicker.RangePicker onChange={() => form.submit()} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="Metric"
                    name="metric"
                    style={{ width: '280px' }}
                    rules={[{ required: true, message: 'Select the metric' }]}
                  >
                    <Select
                      showSearch
                      size="15"
                      optionFilterProp="label"
                      className="w-full appearance-none border border-gray-light text-xs"
                      onSelect={() => {
                        const [choice] =
                          // eslint-disable-next-line no-unsafe-optional-chaining
                          datasets[form.getFieldValue('metric')]?.options
                        form.setFieldValue('param', choice?.value)
                        setOptions(
                          datasets[form.getFieldValue('metric')].options
                        )
                      }}
                      onChange={() => form.submit()}
                      options={Object.keys(groupedDatasets).map((key) => {
                        return {
                          label: key,
                          options: groupedDatasets[key].map((value) => ({
                            label: value.code.replace(/_/g, ' '),
                            value: value.code,
                          })),
                        }
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="Parameter"
                    name="param"
                    style={{ width: '180px' }}
                    rules={[
                      {
                        required: true,
                        message: 'Select a parameter',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      options={options}
                      onChange={() => form.submit()}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    label="Server"
                    name="server"
                    style={{ width: '180px' }}
                    rules={[
                      {
                        required: true,
                        message: 'Select the server to analyze',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      onChange={(value) => {
                        router.push(`/analysis?server=${value}`, undefined, {
                          shallow: true,
                        })

                        form.submit()
                      }}
                      options={Object.keys(groupedServers).map((key) => {
                        return {
                          label: key,
                          options: groupedServers[key].map((value) => ({
                            label: value.serverName,
                            value: value.id,
                          })),
                        }
                      })}
                    />
                  </Form.Item>
                </Col>
              </Row>

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
                          rangeDate: [dayjs(oneHourAgo), dayjs()],
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
                          rangeDate: [dayjs(startDate), dayjs()],
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
                          rangeDate: [dayjs(startDate), dayjs()],
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
                          rangeDate: [dayjs(startDate), dayjs()],
                        })
                      }}
                    >
                      Last 7 days
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setDate(startDate.getDate() - 14)

                        form.setFieldsValue({
                          rangeDate: [dayjs(startDate), dayjs()],
                        })
                      }}
                    >
                      Last 14 days
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => {
                        const startDate = new Date()
                        startDate.setHours(0)

                        form.setFieldsValue({
                          rangeDate: [dayjs(startDate), dayjs()],
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
                          rangeDate: [dayjs(startDate), dayjs()],
                        })
                      }}
                    >
                      This week
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex items-center mt-5">
                <Row>
                  <Button htmlType="submit" type="primary" loading={loading}>
                    Compare
                  </Button>
                </Row>{' '}
              </div>
            </PageContent>

            <PageContent
              removeSidebarMargin={true}
              // className="border-b border-gray-light"
            >
              <Divider />
              <div className=" mb-10 bg-white">
                {loading && (
                  <div className="col-span-2 bg-white lg:col-span-6 h-200 flex items-center justify-center h-[215px]">
                    <Spin />
                  </div>
                )}
                {!loading && (
                  <ApexChart
                    height={200}
                    width={'100%'}
                    options={{
                      title: {
                        text: !data
                          ? 'Error to load the data'
                          : form.getFieldValue('metric')?.replace(/_/g, ' '),
                        offsetY: 10,
                        offsetX: 5,
                      },
                      // O ApexCharts entra com a paleta de fabrica (azul
                      // #008FFB), que nao e cor do produto.
                      colors: ['#5046e5', '#fc9003', '#409d66', '#cc0000'],
                      stroke: { width: 1, curve: 'straight' },
                      xaxis: {
                        type: 'datetime',
                      },
                      yaxis: {
                        tickAmount: 5,
                      },
                      legend: {
                        itemMargin: '10px',

                        labels: {
                          useSeriesColors: true,
                          formatter: function (seriesName) {
                            return seriesName.replace(/_/g, ' ')
                          },
                        },
                      },

                      chart: {
                        toolbar: false,
                        events: {
                          click: function (event, chartContext, options) {
                            const config = options.config
                            const dataPointIndex = options.dataPointIndex
                            const seriesIndex = options.seriesIndex

                            if (config && dataPointIndex && seriesIndex) {
                              const { series } = config

                              const [date] =
                                series[seriesIndex].data[dataPointIndex]
                              setHighlightedWhoIs([])
                              setHighlightedDate(date)
                            }
                          },
                          mouseLeave: function () {
                            setHighlightedDate()
                          },
                        },
                      },
                    }}
                    series={[
                      {
                        name: form.getFieldValue('param'),
                        data,
                      },
                    ]}
                  />
                )}
              </div>
            </PageContent>
            <PageContent removeSidebarMargin={true}>
              <Divider />
              <Typography.Title level={5}> Who is active</Typography.Title>
              <Table
                loading={loading}
                dataSource={highlightedDate ? highlightedWhoIs : whoIs}
                pagination={
                  (highlightedDate ? highlightedWhoIs : whoIs).length > 10
                }
                rowKey={'dtLog'}
                onRow={(record) => ({
                  onClick: () => {
                    setModalWhoData(record)
                  },
                  style: { cursor: 'pointer' },
                })}
                columns={[
                  {
                    title: 'Date',
                    dataIndex: 'dtLog',
                    render: (value) => {
                      // eslint-disable-next-line sonarjs/no-duplicate-string
                      return moment(value).format('YYYY/MM/DD HH:mm:ss')
                    },
                  },
                  {
                    title: 'Status',
                    dataIndex: 'status',
                  },
                  {
                    title: 'Login Name',
                    dataIndex: 'loginName',
                  },
                  { title: 'Host Name', dataIndex: 'hostName' },
                  {
                    title: 'Program Name',
                    dataIndex: 'programName',
                  },
                ]}
              />
              <Divider />
              <Typography.Title level={5}> Queries Profile</Typography.Title>
              <Table
                loading={loading}
                dataSource={queriesProfile}
                onRow={(record) => ({
                  onClick: () => {
                    setModalQueryProfileData(record)
                  },
                  style: { cursor: 'pointer' },
                })}
                pagination={{ hideOnSinglePage: true }}
                locale={{
                  // "No data" nao diz o que se procurou. A consulta le a
                  // QueriesProfile do servidor escolhido entre as duas datas,
                  // sem limiar nenhum: vazio quer dizer janela sem recolha.
                  emptyText: 'No queries collected in this window.',
                }}
                columns={[
                  {
                    title: 'Text data',
                    dataIndex: 'textData',
                    render: (value) =>
                      value.length > 25 ? truncateString(value, 25) : value,
                  },
                  {
                    title: 'Login Name',
                    dataIndex: 'loginName',
                  },
                  {
                    title: 'Host Name',
                    dataIndex: 'hostName',
                  },
                  {
                    title: 'Database Name',
                    dataIndex: 'dataBaseName',
                  },
                  {
                    title: 'Duration',
                    dataIndex: 'duration',
                    render: (value) => {
                      return `${value} s`
                    },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.duration - b.duration,
                  },
                  {
                    title: 'Start Time',
                    dataIndex: 'startTime',
                    render: (value) => {
                      return moment(value).format('YYYY/MM/DD HH:mm:ss')
                    },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) =>
                      new Date(a.startTime).getTime() -
                      new Date(b.startTime).getTime(),
                  },
                  {
                    title: 'End Time',
                    dataIndex: 'endTime',
                    render: (value) => {
                      return moment(value).format('YYYY/MM/DD HH:mm:ss')
                    },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) =>
                      new Date(a.endTime).getTime() -
                      new Date(b.endTime).getTime(),
                  },
                ]}
              />
            </PageContent>
            {modalWhoData && (
              <Modal
                open={true}
                width={'90vw'}
                style={{ zIndex: 5, display: 'absolute' }}
                onOk={() => {
                  setModalWhoData()
                }}
                closable={false}
                cancelButtonProps={{ style: { display: 'none' } }}
              >
                <div style={{ height: '70vh', overflowY: 'auto' }}>
                  {modalWhoData.queryPlan && (
                    <QueryPlanRenderer queryPlan={modalWhoData.queryPlan} />
                  )}
                  <Descriptions
                    column={4}
                    layout="vertical"
                    bordered
                    size="small"
                  >
                    <Descriptions.Text label="CPU">
                      {modalWhoData.cpu ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="CPU Delta">
                      {modalWhoData.cpuDelta ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Blocking Session ID">
                      {modalWhoData.blockingSessionId || '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Database Name">
                      {modalWhoData.databaseName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Time">
                      {modalWhoData['ddHhMmSsMss'] ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Host Name">
                      {modalWhoData.hostName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Login Name">
                      {modalWhoData.loginName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Open transactions count">
                      {modalWhoData.openTranCount ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Percent Complete">
                      {modalWhoData.percentComplete ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Program Name">
                      {modalWhoData.programName}
                    </Descriptions.Text>
                    <Descriptions.Text label="Reads">
                      {modalWhoData.reads ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Reads Delta">
                      {modalWhoData.readsDelta ?? '-'}
                    </Descriptions.Text>

                    <Descriptions.Text label="Status">
                      {modalWhoData.status ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Wait Information">
                      {modalWhoData.waitInfo ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="writes">
                      {modalWhoData.writes ?? '-'}
                    </Descriptions.Text>
                  </Descriptions>
                  <br />
                  <Highlighter
                    code={modalWhoData.sqlText}
                    showLineNumbers={true}
                    language={'sql'}
                    maxHeight={'350px'}
                  />
                </div>
              </Modal>
            )}

            {modalQueryProfileData && (
              <Modal
                open={true}
                width={'90vw'}
                style={{ zIndex: 5, display: 'absolute' }}
                onOk={() => {
                  setModalQueryProfileData()
                }}
                closable={false}
                cancelButtonProps={{ style: { display: 'none' } }}
              >
                <div style={{ overflowY: 'auto' }}>
                  <Descriptions
                    column={3}
                    layout="vertical"
                    bordered
                    size="small"
                  >
                    <Descriptions.Text label="Login Name">
                      {modalQueryProfileData.loginName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Server Name">
                      {modalQueryProfileData.serverName ?? '-'}
                    </Descriptions.Text>

                    <Descriptions.Text label="Host Name">
                      {modalQueryProfileData.hostName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Database Name">
                      {modalQueryProfileData.dataBaseName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Agent Name">
                      {modalQueryProfileData.ntUserName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Application Name">
                      {modalQueryProfileData.applicationName ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="CPU">
                      {modalQueryProfileData.cpu ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Writes">
                      {modalQueryProfileData.writes ?? '-'}
                    </Descriptions.Text>

                    <Descriptions.Text label="Row Counts">
                      {modalQueryProfileData.rowCounts ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="SPID">
                      {modalQueryProfileData.spid ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Reads">
                      {modalQueryProfileData.reads ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Duration">
                      {`${modalQueryProfileData.duration} s` ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="Start Time">
                      {`${moment(modalQueryProfileData.startTime).format(
                        'DD/MM/YYYY HH:mm:ss'
                      )}` ?? '-'}
                    </Descriptions.Text>
                    <Descriptions.Text label="End Time">
                      {`${moment(modalQueryProfileData.endTime).format(
                        'DD/MM/YYYY HH:mm:ss'
                      )}` ?? '-'}
                    </Descriptions.Text>
                  </Descriptions>
                  <Highlighter
                    code={modalQueryProfileData.textData ?? '-'}
                    showLineNumbers={true}
                    maxHeight={'350px'}
                  />
                </div>
              </Modal>
            )}
          </Form>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AnalysisPage
