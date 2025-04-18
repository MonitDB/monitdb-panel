import { Button, Switch, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import AiConfigDrawer from '~/components/drawers/monitai-config-drawer'
import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useAiConfigStore } from '~/services/state-manager/ai-store'

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * AiConfigPage component renders a page for managing AI configurations.
 * It displays a table with existing configurations and provides options to add new configurations or edit existing ones.
 * The component integrates with the AI configuration store to fetch and manage configuration data.
 * It also uses React Router for navigation and provides a drawer for configuration details.
 */

/*******  1a739de9-bd6c-4696-a438-2929650f6344  *******/
const AiConfigPage = () => {
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
          'aiconfig-new': 'true',
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
          <Switch
            checked={!!text}
            loading={toggleEnableId === record.id}
            onClick={(checked, event) => {
              event.stopPropagation()
              toggleEnabled(record.id)
            }}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
          />
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

export default AiConfigPage
