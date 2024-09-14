import { Button, Spin, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import IntegrationDrawer from '~/components/drawers/integration-drawer'
import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { listIntegrations } from '~/services/integration'

const IntegrationsPage = () => {
  const router = useRouter()
  const { query, pathname } = router

  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    const fetchIntegrations = async () => {
      setLoading(true)
      try {
        const data = await listIntegrations({ page: currentPage, pageSize })
        setIntegrations(data.result)
        setTotal(data.total) // Assumindo que a API retorna o total de registros
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }

    fetchIntegrations()
  }, [currentPage])

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
                title: 'Display Settings',
                href: '/configurations/integrations/',
              },
            ]}
            extra={
              <Button type="primary" onClick={addNewIntegration}>
                New Integration
              </Button>
            }
          />

          {loading ? (
            <Spin size="large" />
          ) : (
            <Table
              dataSource={integrations}
              columns={columns}
              rowKey="id"
              onRow={(record) => ({
                onClick: () => openIntegration(record.id),
              })}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                showSizeChanger: false, // Opcional, exibe ou esconde o seletor de tamanho de página
              }}
              onChange={handleTableChange}
            />
          )}

          <IntegrationDrawer />
        </PageContent>
      </Layout>
    </>
  )
}

export default IntegrationsPage
