import { Button, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import IntegrationDrawer from '~/components/drawers/integration-drawer'
import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { listIntegrations } from '~/services/integration'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const IntegrationsPage = () => {
  const router = useRouter()
  const { query, pathname } = router
  const { userState: user } = useUser()

  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    if (
      !hasPermission(
        user,
        FeatureFunction.MANAGE_INTEGRATIONS,
        TypeGrant.WRITE
      ) &&
      user.grants
    ) {
      router.push('/403')
      return
    }
    const fetchIntegrations = async () => {
      setLoading(true)
      try {
        const data = await listIntegrations(currentPage, pageSize)
        setIntegrations(data.data)
        setTotal(data.total)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    if (Object.keys(query).length === 0) fetchIntegrations()
  }, [currentPage, query, router, user])

  const addNewIntegration = () => {
    router.push(
      {
        pathname: pathname,
        query: {
          ...query,
          'integration-new': 'true',
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const openIntegration = (id) => {
    router.push(
      {
        pathname: pathname,
        query: {
          ...query,
          'integration-id': id,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
  ]

  return (
    <>
      <NextSeo title="Integrations - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Integrations"
            breadcrumbs={[
              {
                title: 'Configurations',
                href: '/configurations/',
              },
              {
                title: 'Integrations',
                href: '/configurations/integrations/',
              },
            ]}
            extra={
              <Button type="primary" onClick={addNewIntegration}>
                New Integration
              </Button>
            }
          />
          <Table
            loading={loading}
            dataSource={integrations}
            columns={columns}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => openIntegration(record.id),
            })}
            pagination={{
              hideOnSinglePage: true,
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: false,
            }}
            onChange={handleTableChange}
          />
          <IntegrationDrawer />
        </PageContent>
      </Layout>
    </>
  )
}

export default IntegrationsPage
