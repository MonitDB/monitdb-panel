/* eslint-disable react-hooks/exhaustive-deps */
import { DatePicker, notification, Select, Space, Table } from 'antd'
import { format, parseISO } from 'date-fns'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import { getInstallationLogs, getInstallationServers } from '~/services/logs'

import { default as PageContent } from '../../content/content'

export const InstallationLog = () => {
  const DEFAULT_PAGE_SIZE = 10
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [servers, setServers] = useState(['0'])
  const [server, setServer] = useState()
  const [dateRange, setDateRange] = useState([])
  const [pagination, setPagination] = useState({
    pageSize: DEFAULT_PAGE_SIZE,
    current: 1,
  })
  const [total, setTotal] = useState(0)

  const formik = useFormik({
    initialValues: {
      PageNumber: 1,
      ServerName: router.query.ServerName || '',
      DateRange: [],
    },
  })

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getInstallationLogs({
        page: pagination.current,
        pageSize: pagination.pageSize,
        serverName: router.query.ServerName,
        startDate: new Date(dateRange[0]),
        endDate: new Date(dateRange[1]),
      })

      setData(response?.data?.logs || [])
      setPagination((previous) => ({
        ...previous,
        total: response?.data?.totalResults || 0,
      }))
      setTotal(response?.data?.totalResults || 0)
    } catch {
      notification.error({
        message: 'Error to load the logs',
        description: 'Please verify manually the errors at db.',
      })
    }
    setLoading(false)
  }, [
    pagination.current,
    pagination.pageSize,
    router.query.ServerName,
    dateRange,
    server,
  ])

  useEffect(fetchData, [fetchData])

  useEffect(async () => {
    try {
      const { data } = await getInstallationServers()
      const serversData = ['0', ...data]
      setServers(serversData)
    } catch {
      /* empty */
    }
  }, [])

  const updateFormFields = useCallback(async () => {
    const fields = Object.keys(router.query)

    for (const field of fields) {
      formik.setFieldValue(field, router.query[field])
    }
  }, [router.query])

  useEffect(() => {
    updateFormFields()
  }, [updateFormFields])

  const handleTableChange = (page, pageSize) => {
    setPagination((current) => {
      const newPage = current.pageSize !== pageSize ? 1 : page
      return {
        ...current,
        current: newPage,
        pageSize: pageSize,
      }
    })
  }

  return (
    <PageContent removeSidebarMargin={true}>
      <Space>
        <Select
          name="serverName"
          containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
          options={servers.map((server) => ({
            label: server === '0' ? 'All Servers' : server,
            value: server === '0' ? '0' : server,
          }))}
          defaultValue={undefined}
          value={server}
          onChange={(value) => {
            setServer(value)
            formik.setFieldValue('ServerName', value)
          }}
          style={{ marginBottom: '15px', width: '200px' }}
        />
        <DatePicker.RangePicker
          style={{ marginBottom: '15px' }}
          onChange={(dates) => {
            setDateRange(dates)
            formik.setFieldValue('DateRange', dates)
          }}
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
          pageSize: pagination.pageSize,
          total: total,
          current: pagination.current,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleTableChange,
        }}
      />
    </PageContent>
  )
}
