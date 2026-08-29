/* eslint-disable react-hooks/exhaustive-deps */
import { DatePicker, notification, Select, Space, Table } from 'antd'
import { format, parseISO } from 'date-fns'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { getInstallationLogs, getInstallationServers } from '~/services/logs'

import { default as PageContent } from '../../content/content'

export const InstallationLog = () => {
  const DEFAULT_PAGE_SIZE = 10

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [servers, setServers] = useState(['0'])
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [totalResults, setTotalResults] = useState(0)
  const [serverName, setServerName] = useState('0')
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, 'month').toDate(),
    dayjs().toDate(),
  ])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await getInstallationLogs({
        page: pageNumber,
        pageSize: pageSize,
        serverName: serverName,
        startDate: dateRange[0],
        endDate: dateRange[1],
      })

      setData(response?.data?.logs || [])
      setTotalResults(response?.data?.totalResults || 0)
    } catch {
      notification.error({
        message: 'Error to load the logs',
        description: 'Please verify manually the errors at db.',
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data } = await getInstallationServers()
        setServers(['0', ...data])
        setServerName('0')
      } catch {
        /* empty */
      }
    }

    fetchServers()
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [pageNumber, pageSize, serverName, dateRange])

  const handleTableChange = (pageNumber, pageSize) => {
    setPageNumber(pageNumber)
    setPageSize(pageSize)
  }

  return (
    <PageContent removeSidebarMargin={true}>
      <Space>
        <Select
          name="ServerName"
          options={servers.map((server) => ({
            label: server === '0' ? 'All Servers' : server,
            value: server,
          }))}
          defaultValue="0"
          value={serverName}
          onChange={(value) => setServerName(value)}
          style={{ marginBottom: '15px', width: '200px' }}
        />
        <DatePicker.RangePicker
          value={dateRange.map((date) => dayjs(date))}
          onChange={(dates) => setDateRange(dates.map((date) => date.toDate()))}
          style={{ marginBottom: '15px' }}
        />
      </Space>
      <br />
      <Table
        dataSource={data.map((d) => ({ ...d, key: d.id }))}
        size="large"
        loading={loading}
        columns={[
          {
            title: 'Server Name',
            dataIndex: 'versionInstalationHistoryServerName',
          },
          {
            title: 'File',
            dataIndex: 'versionFile',
            render: (value) => value.versionFileName,
          },
          {
            title: 'Output',
            dataIndex: 'versionInstallationHistoryDescription',
          },
          {
            title: 'Created At',
            dataIndex: 'versionInstallationHistoryCreateDate',
            render: (date) => format(parseISO(date), 'dd/MM/yyyy HH:mm:ss'),
          },
        ]}
        pagination={{
          hideOnSinglePage: true,
          pageSize: pageSize,
          total: totalResults,
          current: pageNumber,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleTableChange,
        }}
      />
    </PageContent>
  )
}
