import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Switch, Table, Tag } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import AiSkillDrawer from '~/components/drawers/monitai-skill-drawer'
import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useAiSkillStore } from '~/services/state-manager/ai-skills-store'

/**
 * Gestão de Skills da IA: cada skill é uma "tool" definida pelo admin
 * (nome + descrição + parâmetros + SQL somente-leitura) que a IA pode chamar.
 */
const AiSkillsPage = () => {
  const router = useRouter()
  const { query, pathname } = router
  const { userState: user } = useUser()

  const { skills, loading, toggleEnableId, fetchSkills, toggleEnabled, deleteSkill } =
    useAiSkillStore()

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills, user])

  const addNew = () => {
    router.push(
      { pathname, query: { ...query, 'aiskill-new': 'true' } },
      undefined,
      { shallow: true }
    )
  }

  const openSkill = (id) => {
    router.push(
      { pathname, query: { ...query, 'aiskill-id': id } },
      undefined,
      { shallow: true }
    )
  }

  const columns = [
    {
      title: 'Skill',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Habilitada',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 130,
      render: (text, record) => (
        <Switch
          checked={!!text}
          loading={toggleEnableId === record.id}
          onClick={(checked, event) => {
            event.stopPropagation()
            toggleEnabled(record.id)
          }}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (text, record) => (
        <Popconfirm
          title="Delete this skill?"
          okText="Delete"
          cancelText="Cancel"
          onConfirm={(event) => {
            event?.stopPropagation?.()
            deleteSkill(record.id)
          }}
          onCancel={(event) => event?.stopPropagation?.()}
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={(event) => event.stopPropagation()}
          />
        </Popconfirm>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="AI Skills - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="AI Skills"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'AI Skills', href: '/configurations/monit-ai-skills/' },
            ]}
            extra={
              <Button type="primary" onClick={addNew}>
                Nova Skill
              </Button>
            }
          />
          <Table
            loading={loading}
            dataSource={skills}
            columns={columns}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => openSkill(record.id),
              style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
          />
          <AiSkillDrawer />
        </PageContent>
      </Layout>
    </>
  )
}

export default AiSkillsPage
