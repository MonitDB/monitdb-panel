/* eslint-disable react-hooks/exhaustive-deps */
import { notification, Select, Table } from 'antd'
import { format, parseISO } from 'date-fns'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Highlighter from '~/components/highlighter'
import { useGlobal } from '~/hooks/index'
import { getLogs } from '~/services/logs'

import { default as PageContent } from '../../content/content'

export const ComponentLogs = () => {
  const MAX_POSTS_PER_PAGE = 10
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: MAX_POSTS_PER_PAGE,
    current: 1,
  })

  const {
    globalState: { servers },
  } = useGlobal()

  const serversOptions = useMemo(
    () => [
      { value: '', label: 'All servers' },
      ...servers.map(({ serverName }) => ({
        value: serverName,
        label: serverName,
      })),
    ],
    [servers]
  )
  const formik = useFormik({
    initialValues: {
      PageNumber: 1,
      ServerName: router.query.ServerName || '',
    },
  })

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getLogs({
        page: pagination.current,
        pageSize: MAX_POSTS_PER_PAGE,
        serverName: router.query.ServerName,
      })

      setData(response?.data?.logs || [])
      setPagination({
        ...pagination,
        totalResults: response?.data?.totalResults || 0,
      })
    } catch {
      notification.error({
        message: 'Error to load the logs',
        description: 'Could not load logs. Check the database for details.',
      })
    }
    setLoading(false)
  }, [pagination.current, router.query.ServerName])

  useEffect(fetchData, [fetchData])

  const handleChangeField = useCallback(
    (values) => {
      const parameters_ = {
        ...formik.values,
      }
      for (const { name, value } of values) {
        parameters_[name] = value
        formik.setFieldValue(name, value)
      }

      const query = Object.keys(parameters_)
        .filter((key) => parameters_[key])
        .map((key) => `${key}=${parameters_[key]}`)
        .join('&')

      router.push(`/configurations/logs/?${query}`)
    },
    [formik.values] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const updateFormFields = useCallback(async () => {
    const fields = Object.keys(router.query)

    for (const field of fields) {
      formik.setFieldValue(field, router.query[field])
    }
  }, [router.query])

  useEffect(() => {
    updateFormFields()
  }, [updateFormFields])

  return (
    <PageContent removeSidebarMargin={true}>
      <Select
        name="ServerName"
        containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
        options={serversOptions}
        value={formik.values.ServerName}
        onChange={(value) => {
          handleChangeField([{ name: 'ServerName', value }])
        }}
        style={{ marginBottom: '15px', width: '300px' }}
      />
      <br />
      <Table
        dataSource={data.map((d) => ({ ...d, key: d.id }))}
        size="large"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Highlighter
              code={record.componentLogResult.replace(',', ',\n')}
              showLineNumbers={true}
              language={'javascript'}
              maxHeight={'350px'}
              maxWidth={'86vw'}
            />
          ),
        }}
        columns={[
          { title: 'Name', dataIndex: 'componentName' },
          { title: 'Server Name', dataIndex: 'serverName' },
          { title: 'Component Code', dataIndex: 'componentCode' },
          {
            title: 'Created At',
            dataIndex: 'componentLogDataCreate',
            render: (date) => format(parseISO(date), 'dd/MM/yyyy HH:mm:ss'),
          },
        ]}
        pagination={{
          hideOnSinglePage: true,
          total: pagination.totalResults,
          current: pagination.current,
          showSizeChanger: false,
          onChange: (page) => {
            setPagination({ ...pagination, current: page })
            window.scrollTo(0, 0)
          },
        }}
      />
    </PageContent>
  )
}
