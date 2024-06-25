/* eslint-disable react-hooks/exhaustive-deps */
import { DatePicker, notification, Select, Space, Table } from 'antd'
import { format, parseISO } from 'date-fns'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getInstallationLogs, getInstallationServers } from '~/services/logs'

import { default as PageContent } from '../../content/content'

export const InstallationLog = () => {
  const DEFAULT_PAGE_SIZE = 10

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [servers, setServers] = useState(['0'])

  const formik = useFormik({
    initialValues: {
      PageNumber: 1,
      ServerName: '0',
      DateRange: [dayjs().subtract(1, 'month').toDate(), dayjs().toDate()],
    },
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const response = await getInstallationLogs({
          page: values.PageNumber,
          pageSize: DEFAULT_PAGE_SIZE,
          serverName: values.ServerName,
          startDate: values.DateRange[0],
          endDate: values.DateRange[1],
        })

        setData(response?.data?.logs || [])
        formik.setFieldValue('totalResults', response?.data?.totalResults || 0)
      } catch {
        notification.error({
          message: 'Error to load the logs',
          description: 'Please verify manually the errors at db.',
        })
      }
      setLoading(false)
    },
  })

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const { data } = await getInstallationServers()
        setServers(['0', ...data])
        formik.setFieldValue('ServerName', '0')
      } catch {
        /* empty */
      }
    }

    fetchServers()
  }, [])

  useEffect(() => {
    formik.submitForm()
  }, [
    formik.values.PageNumber,
    formik.values.ServerName,
    formik.values.DateRange,
  ])

  const handleTableChange = (page, pageSize) => {
    formik.setFieldValue('PageNumber', page)
    formik.setFieldValue('pageSize', pageSize)
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
          value={formik.values.ServerName}
          onChange={(value) => formik.setFieldValue('ServerName', value)}
          style={{ marginBottom: '15px', width: '200px' }}
        />
        <DatePicker.RangePicker
          value={formik.values.DateRange.map((date) => dayjs(date))}
          onChange={(dates) => formik.setFieldValue('DateRange', dates)}
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
          pageSize: DEFAULT_PAGE_SIZE,
          total: formik.values.totalResults,
          current: formik.values.PageNumber,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          onChange: handleTableChange,
        }}
      />
    </PageContent>
  )
}
