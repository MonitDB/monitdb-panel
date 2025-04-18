import { Button, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import AiConfigDrawer from '~/components/drawers/monitai-config-drawer'
import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useAiConfigStore } from '~/services/state-manager/ai-store'

const IntegrationsPage = () => {
  const router = useRouter()
  const { query, pathname } = router
  const { userState: user } = useUser()

  const { configs, loading, toggleEnableId, fetchConfigs, toggleEnabled } =
    useAiConfigStore()

  const pageSize = 10

  useEffect(() => {
    fetchConfigs()
  }, [fetchConfigs, user])

  const addNewConfig = () => {
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

  const openConfig = (id) => {
    router.push(
      {
        pathname: pathname,
        query: {
          ...query,
          'aiconfig-id': id,
        },
      },
      undefined,
      { shallow: true }
    )
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (text, record) => {
        return (
          <Button
            type={text ? 'primary' : 'default'}
            loading={toggleEnableId === record.id}
            onClick={() => toggleEnabled(record.id)}
          >
            {text ? 'Enabled' : 'Disabled'}
          </Button>
        )
      },
    },
  ]

  return (
    <>
      <NextSeo title="AI Configuration - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="AI Configuration"
            breadcrumbs={[
              {
                title: 'Configurations',
                href: '/configurations/',
              },
              {
                title: 'Integrations',
                href: '/configurations/ai-config/',
              },
            ]}
            extra={
              <Button type="primary" onClick={addNewConfig}>
                New Ai Config
              </Button>
            }
          />
          <Table
            loading={loading}
            dataSource={configs}
            columns={columns}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => openConfig(record.id),
            })}
            pagination={{
              pageSize: pageSize,
              total: configs?.length,
              showSizeChanger: false,
            }}
          />
          <AiConfigDrawer />
        </PageContent>
      </Layout>
    </>
  )
}

export default IntegrationsPage
