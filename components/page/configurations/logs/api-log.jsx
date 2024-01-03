/* eslint-disable react-hooks/exhaustive-deps */
import { notification, Table, Tag } from 'antd'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import Highlighter from '~/components/highlighter'
import { getApiLogs } from '~/services/logs'

import { default as PageContent } from '../../content/content'

export const ApiLogs = () => {
  const MAX_POSTS_PER_PAGE = 10
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: MAX_POSTS_PER_PAGE,
    current: 1,
  })

  const fetchData = useCallback(async () => {
    setLoading(true)

    try {
      const response = await getApiLogs({
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
        description: 'Please verify manually the erros at db.',
      })
    }
    setLoading(false)
  }, [pagination.current, router.query.ServerName])

  useEffect(fetchData, [fetchData])

  return (
    <PageContent removeSidebarMargin={true}>
      <Table
        dataSource={data.map((d) => ({ ...d, key: d.idExecutionLog }))}
        size="small"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Highlighter
              code={JSON.parse(record.result)}
              showLineNumbers={true}
              language={'javascript'}
              maxHeight={'350px'}
              maxWidth={'86vw'}
            />
          ),
        }}
        columns={[
          { title: 'Route', dataIndex: 'route' },
          {
            title: 'Method',
            dataIndex: 'method',
            render: (method) => <Tag>{method.toUpperCase()} </Tag>,
          },
          {
            title: 'Created At',
            dataIndex: 'executionLogDateCreate',
            render: (date) => format(parseISO(date), 'dd/MM/yyyy HH:mm:ss'),
          },
        ]}
        pagination={{
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
