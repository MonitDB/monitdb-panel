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
import moment from 'moment'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useCallback } from 'react'
import React, { useState } from 'react'

import { useGlobal } from '~/hooks/index'
import { getCpDatabase, getCpDisk, getCpFile } from '~/services/states'

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

const CapacityPlan = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const [cpFile, setCpFile] = useState()
  const [cpDisk, setCpDisk] = useState()
  const [cpDatabase, setCpDatabase] = useState()
  const [serverId, setServerId] = useState(1)

  const [loadingCpFile, setLoadingCpFile] = useState(false)
  const [loadingCpDisk, setLoadingCpDisk] = useState(false)
  const [loadingCpDatabase, setLoadingCpDatabase] = useState(false)

  const fetchCpDatabase = useCallback(async () => {
    try {
      setLoadingCpDatabase(true)
      const database = await getCpDatabase({ serverId })
      setCpDatabase(database.data)
    } catch {
      setCpFile()
    }
    setLoadingCpDatabase(false)
  }, [serverId])

  const fetchCpFile = useCallback(async () => {
    try {
      setLoadingCpFile(true)
      const file = await getCpFile({ serverId })
      setCpFile(file.data)
    } catch {
      setCpFile()
    }
    setLoadingCpFile(false)
  }, [serverId])

  const fetchCpDisk = useCallback(async () => {
    try {
      setLoadingCpDisk(true)
      const disk = await getCpDisk({ serverId })
      setCpDisk(disk.data)
    } catch {
      setCpDisk()
    }
    setLoadingCpDisk(false)
  }, [serverId])

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([fetchCpDatabase(), fetchCpFile(), fetchCpDisk()])
    } catch {
      setCpFile()
      setCpDisk()
      setCpDatabase()
    }
  }, [fetchCpDatabase, fetchCpDisk, fetchCpFile])

  useEffect(() => {
    fetchData()
  }, [fetchData])

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
          <Form layout="inline">
            <Form.Item name="server" label="Server">
              <Select
                defaultValue="server"
                style={{ width: 120, marginRight: '12px' }}
              >
                {servers.map((server) => (
                  <Select.Option key={server.id} value={server.id}>
                    {server.serverName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="dataRange" label="Data Range">
              <DatePicker.RangePicker />
            </Form.Item>
          </Form>
        </Card>
      </Row>
      <br />
      <Row gutter={12}>
        <Col span={24}>
          <Typography.Title level={3}>Disks</Typography.Title>
        </Col>
        <Col span={12}>
          <ApexChart
            options={{
              stroke: {
                width: 1,
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
                  return mbToGb(value) != '0GB' ? mbToGb(value) : `${value} MB`
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
                  return `${diskGrowthRate(record)} MB`
                },
              },
              {
                title: 'Expected use in 3 Months',
                render: (_, record) => {
                  console.log(record.LastSpaceUsed, diskGrowthRate(record))
                  return mbToGb(
                    record.LastSpaceUsed + diskGrowthRate(record) * 90
                  )
                },
              },
              {
                title: 'Disk is full in:',
                render: (_, record) => {
                  const capacity = record.LastSize
                  const used = record.LastSpaceUsed
                  const growthRate = diskGrowthRate(record)

                  const fullDays = Math.ceil((capacity - used) / growthRate)
                  const currentDate = new Date()
                  const fullDate = new Date(
                    currentDate.setDate(currentDate.getDate() + fullDays)
                  )
                  return (
                    <Tooltip title={'Based in the growth in this datarange'}>
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
      <Row gutter={12}>
        <Col span={24}>
          <Typography.Title level={3}>Databases</Typography.Title>
        </Col>
        <Col span={12}>
          <ApexChart
            options={{
              stroke: {
                width: 1,
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
                  return mbToGb(value) != '0GB' ? mbToGb(value) : `${value} MB`
                },
              },
              {
                title: 'Used space',
                dataIndex: 'LastUsedSizeMB',
                render: (value) => {
                  return mbToGb(value) != '0GB' ? mbToGb(value) : `${value} MB`
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
                  return `${databaseGrowthRate(record)} MB`
                },
              },
              {
                title: 'Expected use in 3 Months',
                render: (_, record) => {
                  return mbToGb(
                    record.LastUsedSizeMB + databaseGrowthRate(record) * 90
                  )
                },
              },
              {
                title: 'Database is full in:',
                render: (_, record) => {
                  const capacity = record.LastSizeMb
                  const used = record.LastUsedSizeMB
                  const growthRate = databaseGrowthRate(record)
                  if (!growthRate) {
                    return 'N/A'
                  }

                  const fullDays = Math.ceil((capacity - used) / growthRate)
                  const currentDate = new Date()
                  const fullDate = new Date(
                    currentDate.setDate(currentDate.getDate() + fullDays)
                  )
                  return (
                    <Tooltip title={'Based in the growth in this datarange'}>
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
      <Row gutter={12}>
        <Col span={24}>
          <Typography.Title level={3}>Files</Typography.Title>
        </Col>
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
                width: 1,
                curve: 'straight',
              },
              xaxis: {
                type: 'datetime',
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
                  return mbToGb(value) != '0GB' ? mbToGb(value) : `${value} MB`
                },
              },
              {
                title: 'Used space',
                dataIndex: 'LastUsedSizeMB',
                render: (value) => {
                  return mbToGb(value) != '0GB' ? mbToGb(value) : `${value} MB`
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
                  return `${databaseGrowthRate(record)} MB`
                },
              },
              {
                title: 'Expected use in 3 Months',
                render: (_, record) => {
                  return mbToGb(
                    record.LastUsedSizeMB + databaseGrowthRate(record) * 90
                  )
                },
              },
              {
                title: 'Database is full in:',
                render: (_, record) => {
                  const capacity = record.LastSizeMb
                  const used = record.LastUsedSizeMB
                  const growthRate = databaseGrowthRate(record)
                  if (!growthRate) {
                    return 'N/A'
                  }

                  const fullDays = Math.ceil((capacity - used) / growthRate)
                  const currentDate = new Date()
                  const fullDate = new Date(
                    currentDate.setDate(currentDate.getDate() + fullDays)
                  )
                  return (
                    <Tooltip title={'Based in the growth in this datarange'}>
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
    </PageContent>
  )
}

export default CapacityPlan
