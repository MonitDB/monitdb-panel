/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-extra-semi */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-identical-functions */
import {
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useCallback } from 'react'
import React, { useState } from 'react'

import Loading from '~/components/loading'
import { useGlobal } from '~/hooks/index'
import {
  getAvailableDatabases,
  getCpDatabase,
  getCpDisk,
  getCpFile,
} from '~/services/states'

import PageContent from '../../content/content'

export const ApexChart = dynamic(
  () => {
    return import('react-apexcharts')
  },
  { ssr: false }
)

function groupObjects(array, keyToGroup) {
  return array.reduce((grouped, object) => {
    const key = object[keyToGroup ?? 'key']
    grouped[key] = grouped[key] || []
    grouped[key].push(object)

    return grouped
  }, {})
}

function countDays(startDate, endDate) {
  var startDateObject = new Date(startDate)
  var endDateObject = new Date(endDate)
  var difference = endDateObject.getTime() - startDateObject.getTime()
  return Math.floor(difference / (1000 * 60 * 60 * 24))
}

const diskGrowthRate = (record) => {
  const days = countDays(record.FirstCollectData, record.LastCollectData)
  const { FirstSpaceUsed, LastSpaceUsed } = record
  const diff = LastSpaceUsed - FirstSpaceUsed
  return Math.ceil(diff / days)
}

const databaseGrowthRate = (record) => {
  const days = countDays(record.FirstCollectData, record.LastCollectData)
  const { FirstUsedSizeMb, LastUsedSizeMB } = record
  const diff = LastUsedSizeMB - FirstUsedSizeMb
  return Math.ceil(diff / days)
}

const mbToGb = (value) => {
  return `${Math.ceil(value / 1024)}GB`
}

const today = dayjs()
const startOfCurrentMonth = today.startOf('month')
const endOfCurrentMonth = today.startOf('day')

const rangePresets = [
  { label: 'Last 7 Days', value: [today.subtract(7, 'd'), today] },
  { label: 'Last 14 Days', value: [today.subtract(14, 'd'), today] },
  { label: 'Current Month', value: [startOfCurrentMonth, endOfCurrentMonth] },
  { label: 'Last Month', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 3 Months', value: [dayjs().add(-90, 'd'), dayjs()] },
]

const CapacityPlan = ({ tabName }) => {
  const {
    globalState: { servers },
  } = useGlobal()

  const [cpFile, setCpFile] = useState()
  const [cpDisk, setCpDisk] = useState()
  const [cpDatabase, setCpDatabase] = useState()

  const [availableDatabase, setAvailableDatabases] = useState([])

  const [databaseCpDisk, setDatabaseCpDisk] = useState([])
  const [databaseCpFile, setDatabaseCpFile] = useState([])

  const [loadingCpFile, setLoadingCpFile] = useState(false)
  const [loadingCpDisk, setLoadingCpDisk] = useState(false)
  const [loadingCpDatabase, setLoadingCpDatabase] = useState(false)

  const [form] = Form.useForm()

  const serverId = Form.useWatch('server', form)
  const dataRange = Form.useWatch('dataRange', form)
  const [sd, ed] = dataRange ?? []
  const startDate = dayjs(sd).format('YYYY-MM-DD')
  const endDate = dayjs(ed).format('YYYY-MM-DD')
  const fetchCpDatabase = useCallback(async () => {
    try {
      setLoadingCpDatabase(true)
      const database = await getCpDatabase({
        serverId,
        startDate,
        endDate,
        databaseName: JSON.stringify(databaseCpDisk),
      })
      setCpDatabase(database.data)
    } catch {
      setCpDatabase()
    }
    setLoadingCpDatabase(false)
  }, [serverId, startDate, endDate, databaseCpDisk])

  const fetchCpFile = useCallback(async () => {
    try {
      setLoadingCpFile(true)
      const file = await getCpFile({
        serverId,
        startDate,
        endDate,
        databaseName: JSON.stringify(databaseCpFile),
      })
      setCpFile(file.data)
    } catch {
      setCpFile()
    }
    setLoadingCpFile(false)
  }, [serverId, startDate, endDate, databaseCpFile])

  const fetchCpDisk = useCallback(async () => {
    try {
      setLoadingCpDisk(true)
      const disk = await getCpDisk({
        serverId,
        startDate,
        endDate,
      })
      setCpDisk(disk.data)
    } catch {
      setCpDisk()
    }
    setLoadingCpDisk(false)
  }, [serverId, startDate, endDate])

  useEffect(fetchCpDatabase, [fetchCpDatabase])
  useEffect(fetchCpFile, [fetchCpFile])
  useEffect(fetchCpDisk, [fetchCpDisk])
  useEffect(() => {
    {
      ;(async () => {
        const databases = await getAvailableDatabases({ serverId })
        setAvailableDatabases(databases.data.availableDatabases)
      })()
    }
  }, [serverId, startDate, endDate])

  const firstFetch = useRef(false)

  useEffect(() => {
    if (firstFetch.current === false) {
      form.setFieldsValue({
        dataRange: [startOfCurrentMonth, endOfCurrentMonth],
      })
      form.setFieldsValue({ server: servers[0]?.id })
    }
    if (servers.length > 0) firstFetch.current = true
  }, [form, servers])

  const diskSeries = Array.isArray(cpDisk?.diskGrowth)
    ? groupObjects(cpDisk?.diskGrowth, 'DRIVE_LETTER')
    : []
  const databaseSeries = Array.isArray(cpDatabase?.databaseGrowth)
    ? groupObjects(cpDatabase?.databaseGrowth, 'DatabaseName')
    : []
  const fileSeries = Array.isArray(cpFile?.fileGrowth)
    ? groupObjects(cpFile?.fileGrowth, 'FILE_LOGICAL_NAME')
    : []

  return (
    <PageContent removeSidebarMargin={true} hideBreadcrumbs={true}>
      <header className="pt-8 w-full flex flex-col md:flex-row md:justify-between md:items-end">
        <h1 className="heading-lg">{tabName}</h1>
      </header>
      <br />
      <Row gutter={12}>
        <Card
          style={{ width: '100%', justifyContent: 'flex-end', display: 'flex' }}
        >
          <Form layout="inline" form={form}>
            <Form.Item
              name="server"
              label="Server"
              initialValue={servers[0]?.id}
            >
              <Select style={{ width: 120, marginRight: '12px' }}>
                {servers.map((server) => (
                  <Select.Option key={server.id} value={server.id}>
                    {server.serverName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="dataRange" label="Data Range">
              <DatePicker.RangePicker presets={rangePresets} />
            </Form.Item>
          </Form>
        </Card>
      </Row>
      <br />
      <Row>
        {' '}
        <Col span={24}>
          <Typography.Title level={3}>Disks</Typography.Title>
        </Col>
      </Row>
      {loadingCpDisk ? (
        <div
          style={{
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '15px',
          }}
        >
          <Loading />
        </div>
      ) : (
        <Row gutter={12}>
          <Col span={12}>
            <ApexChart
              options={{
                stroke: {
                  width: 2,
                  curve: 'straight',
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: true,
                    type: 'x',
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    margin: 10,
                  },
                },
                xaxis: {
                  type: 'datetime',
                  show: false,
                },
                yaxis: {
                  show: true,
                  labels: {
                    show: true,
                  },
                },
                tooltip: {
                  x: {
                    format: 'dd MMM yyyy',
                  },
                  y: {
                    formatter: (value) => `${value} MB`,
                  },
                },
                legend: {
                  show: false,
                },
              }}
              series={Object.keys(diskSeries).map((key) => ({
                data: diskSeries[key].map((data) => [
                  new Date(data.CREATEDATA).getTime(),
                  data.DISC_SPACE_USED_MB,
                ]),
                name: key,
                type: 'line',
              }))}
              width={'100%'}
              height={400}
            />
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <Table
              size="small"
              pagination={cpDisk?.capacityPlan?.length > 10}
              dataSource={cpDisk?.capacityPlan ?? []}
              columns={[
                {
                  title: 'Drive Letter',
                  dataIndex: 'DriveLetter',
                },
                {
                  title: 'Disk Size',
                  dataIndex: 'LastSize',
                  render: (value) => {
                    return mbToGb(value) ? mbToGb(value) : `${value} MB`
                  },
                },
                {
                  title: 'Used space',
                  dataIndex: 'LastSpaceUsed',
                  render: (value) => {
                    return mbToGb(value) != '0GB'
                      ? mbToGb(value)
                      : `${value} MB`
                  },
                },

                {
                  title: 'Collected Data',
                  dataIndex: 'LastCollectData',
                  render: (value) => {
                    return new Date(value).toLocaleString()
                  },
                },
                {
                  title: 'Growth Rate (Day)',
                  render: (_, record) => {
                    const growthRate = diskGrowthRate(record)
                    if (!growthRate || Number.isNaN(growthRate)) return 'N/A'
                    return `${growthRate} MB`
                  },
                },
                {
                  title: 'Expected use in 3 Months',
                  render: (_, record) => {
                    const growthRate = diskGrowthRate(record)
                    if (!growthRate || Number.isNaN(growthRate)) return 'N/A'
                    return mbToGb(record.LastSpaceUsed + growthRate * 90)
                  },
                },
                {
                  title: 'Disk is full in:',
                  render: (_, record) => {
                    const capacity = record.LastSize
                    const used = record.LastSpaceUsed
                    const growthRate = diskGrowthRate(record)

                    if (!growthRate || Number.isNaN(growthRate)) return 'N/A'

                    const fullDays = Math.ceil((capacity - used) / growthRate)
                    const currentDate = new Date()
                    const fullDate = new Date(
                      currentDate.setDate(currentDate.getDate() + fullDays)
                    )
                    return (
                      <Tooltip
                        title={
                          'Considering the expansion observed within this date range'
                        }
                      >
                        {' '}
                        <p>{moment(fullDate.toLocaleString()).format('LL')}</p>
                      </Tooltip>
                    )
                  },
                },
              ]}
            />
          </Col>
        </Row>
      )}

      <Row>
        <Col span={24}>
          <Typography.Title level={3}>Databases</Typography.Title>
        </Col>
        <Card
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            display: 'flex',
            marginBottom: '15px',
          }}
        >
          <label>Database </label>
          <Select
            mode="multiple"
            style={{ width: 250, marginRight: '12px' }}
            onChange={(value) => {
              setDatabaseCpDisk(value)
            }}
            onSelect={(value) => {
              if (value === 'NULL') {
                setDatabaseCpDisk(['NULL'])
              } else
                setDatabaseCpDisk([
                  value,
                  ...databaseCpDisk.filter((value) => value !== 'NULL'),
                ])
            }}
            value={databaseCpDisk}
          >
            {['NULL', ...availableDatabase].map((item) => (
              <Select.Option key={item} value={item}>
                {item === 'NULL' ? 'ALL' : item}
              </Select.Option>
            ))}
          </Select>
        </Card>
      </Row>
      {loadingCpDatabase ? (
        <div
          style={{
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '15px',
          }}
        >
          <Loading />{' '}
        </div>
      ) : (
        <Row gutter={12}>
          <Col span={12}>
            <ApexChart
              options={{
                stroke: {
                  width: 2,
                  curve: 'straight',
                },
                chart: {
                  toolbar: {
                    show: false,
                  },
                  zoom: {
                    enabled: true,
                    type: 'x',
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    margin: 10,
                  },
                },
                xaxis: {
                  type: 'datetime',
                },
                tooltip: {
                  x: {
                    format: 'dd MMM yyyy',
                  },
                  y: {
                    formatter: (value) => `${value} MB`,
                  },
                },
              }}
              series={Object.keys(databaseSeries).map((key) => ({
                data: databaseSeries[key].map((data) => [
                  new Date(data.CollectData).getTime(),
                  data.UsedSizeMb,
                ]),
                name: key,
                type: 'line',
              }))}
              width={'100%'}
              height={400}
            />
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <Table
              size="small"
              pagination={cpDatabase?.capacityPlan?.length > 10}
              dataSource={cpDatabase?.capacityPlan ?? []}
              columns={[
                {
                  title: 'Database',
                  dataIndex: 'DatabaseName',
                },
                {
                  title: 'Database Size',
                  dataIndex: 'LastSizeMb',
                  render: (value) => {
                    return mbToGb(value) != '0GB'
                      ? mbToGb(value)
                      : `${value} MB`
                  },
                },
                {
                  title: 'Used space',
                  dataIndex: 'LastUsedSizeMB',
                  render: (value) => {
                    return mbToGb(value) != '0GB'
                      ? mbToGb(value)
                      : `${value} MB`
                  },
                },

                {
                  title: 'Collected Data',
                  dataIndex: 'LastCollectData',
                  render: (value) => {
                    return new Date(value).toLocaleString()
                  },
                },
                {
                  title: 'Growth Rate (Day)',
                  render: (_, record) => {
                    const growthRate = databaseGrowthRate(record)
                    return Number.isNaN(growthRate) ? 'N/A' : `${growthRate} MB`
                  },
                },
                {
                  title: 'Expected use in 3 Months',
                  render: (_, record) => {
                    const growthRate = databaseGrowthRate(record)
                    if (Number.isNaN(growthRate)) return 'N/A'
                    return mbToGb(record.LastUsedSizeMB + growthRate * 90)
                  },
                },
                {
                  title: 'Database is full in:',
                  render: (_, record) => {
                    const capacity = record.LastSizeMb
                    const used = record.LastUsedSizeMB
                    const growthRate = databaseGrowthRate(record)
                    if (
                      !growthRate ||
                      Number.isNaN(growthRate) ||
                      growthRate <= 0
                    ) {
                      return 'N/A'
                    }

                    const fullDays = Math.ceil((capacity - used) / growthRate)
                    const currentDate = new Date()
                    const fullDate = new Date(
                      currentDate.setDate(currentDate.getDate() + fullDays)
                    )
                    return (
                      <Tooltip
                        title={
                          'Considering the expansion observed within this date range,'
                        }
                      >
                        {' '}
                        <p>{moment(fullDate.toLocaleString()).format('LL')}</p>
                      </Tooltip>
                    )
                  },
                },
              ]}
            />
          </Col>
        </Row>
      )}
      <Row>
        {' '}
        <Col span={24}>
          <Typography.Title level={3}>Files</Typography.Title>
        </Col>
        <Card
          style={{
            width: '100%',
            justifyContent: 'flex-end',
            display: 'flex',
            marginBottom: '15px',
          }}
        >
          <label>Database </label>
          <Select
            mode="multiple"
            style={{ width: 250, marginRight: '12px' }}
            onChange={(value) => {
              setDatabaseCpFile(value)
            }}
            onSelect={(value) => {
              if (value === 'NULL') {
                setDatabaseCpFile(['NULL'])
              } else
                setDatabaseCpFile([
                  value,
                  ...databaseCpFile.filter((value) => value !== 'NULL'),
                ])
            }}
            value={databaseCpFile}
          >
            {['NULL', ...availableDatabase].map((item) => (
              <Select.Option key={item} value={item}>
                {item === 'NULL' ? 'ALL' : item}
              </Select.Option>
            ))}
          </Select>
        </Card>
      </Row>
      {loadingCpFile ? (
        <div
          style={{
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '15px',
          }}
        >
          <Loading />
        </div>
      ) : (
        <Row gutter={12}>
          <Col span={12}>
            <ApexChart
              options={{
                chart: {
                  type: 'area',
                  toolbar: {
                    show: false,
                    offsetX: '-100%',
                  },
                  zoom: {
                    enabled: false,
                  },
                  offsetX: 0,
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    margin: 10,
                  },
                },
                stroke: {
                  width: 2,
                },
                xaxis: {
                  type: 'datetime',
                },
                tooltip: {
                  x: {
                    format: 'dd MMM yyyy',
                  },
                  y: {
                    formatter: (value) => `${value} MB`,
                  },
                },
              }}
              series={Object.keys(fileSeries).map((key) => ({
                data: fileSeries[key].map((data) => [
                  new Date(data.CREATEDATA).getTime(),
                  data.FILE_SPACE_USED_MB,
                ]),
                name: key,
                type: 'line',
              }))}
              width={'100%'}
              height={400}
            />
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <Table
              size="small"
              pagination={cpFile?.capacityPlan?.length > 10}
              dataSource={cpFile?.capacityPlan ?? []}
              columns={[
                {
                  title: 'File Name',
                  dataIndex: 'FileName',
                },
                {
                  title: 'File Size',
                  dataIndex: 'LastSizeMb',
                  render: (value) => {
                    return mbToGb(value) != '0GB'
                      ? mbToGb(value)
                      : `${value} MB`
                  },
                },
                {
                  title: 'Used space',
                  dataIndex: 'LastUsedSizeMB',
                  render: (value) => {
                    return mbToGb(value) != '0GB'
                      ? mbToGb(value)
                      : `${value} MB`
                  },
                },

                {
                  title: 'Collected Data',
                  dataIndex: 'LastCollectData',
                  render: (value) => {
                    return new Date(value).toLocaleString()
                  },
                },
                {
                  title: 'Growth Rate (Day)',
                  render: (_, record) => {
                    const growthRate = databaseGrowthRate(record)
                    return Number.isNaN(growthRate) ? 'N/A' : `${growthRate} MB`
                  },
                },
                {
                  title: 'Expected use in 3 Months',
                  render: (_, record) => {
                    const growthRate = databaseGrowthRate(record)
                    if (Number.isNaN(growthRate)) return 'N/A'
                    return mbToGb(record.LastUsedSizeMB + growthRate * 90)
                  },
                },
                {
                  title: 'Database is full in:',
                  render: (_, record) => {
                    const capacity = record.LastSizeMb
                    const used = record.LastUsedSizeMB
                    const growthRate = databaseGrowthRate(record)
                    if (
                      !growthRate ||
                      Number.isNaN(growthRate) ||
                      growthRate <= 0
                    ) {
                      return 'N/A'
                    }

                    const fullDays = Math.ceil((capacity - used) / growthRate)
                    const currentDate = new Date()
                    const fullDate = new Date(
                      currentDate.setDate(currentDate.getDate() + fullDays)
                    )
                    return (
                      <Tooltip
                        title={
                          'Considering the expansion observed within this date range,'
                        }
                      >
                        {' '}
                        <p>{moment(fullDate.toLocaleString()).format('LL')}</p>
                      </Tooltip>
                    )
                  },
                },
              ]}
            />
          </Col>
        </Row>
      )}
    </PageContent>
  )
}

export default CapacityPlan
