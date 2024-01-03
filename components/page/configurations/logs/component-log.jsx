/* eslint-disable react-hooks/exhaustive-deps */
import { notification, Table, Typography } from 'antd'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import Highlighter from '~/components/highlighter'
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
        description: 'Please verify manually the erros at db.',
      })
    }
    setLoading(false)
  }, [pagination.current, router.query.ServerName])

  useEffect(fetchData, [fetchData])

  return (
    <PageContent removeSidebarMargin={true}>
      <Table
        dataSource={data.map((d) => ({ ...d, key: d.id }))}
        size="small"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <Highlighter
              code={record.componentLogResult.replace(',', ',\n')}
              showLineNumbers={true}
              language={'javascript'}
              maxHeight={'350px'}
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
