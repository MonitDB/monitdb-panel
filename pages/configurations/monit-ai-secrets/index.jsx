import { DeleteOutlined, KeyOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Typography,
} from 'antd'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useAiSecretStore } from '~/services/state-manager/ai-secrets-store'

const AiSecretsPage = () => {
  const { userState: user } = useUser()
  const { secrets, loading, saving, fetchSecrets, upsertSecret, deleteSecret } =
    useAiSecretStore()

  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchSecrets()
  }, [fetchSecrets, user])

  const openNew = (preset) => {
    form.resetFields()
    if (preset) form.setFieldsValue(preset)
    setOpen(true)
  }

  const openEdit = (record) => {
    form.resetFields()
    form.setFieldsValue({ name: record.name, description: record.description })
    setOpen(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await upsertSecret(values)
      message.success('Segredo salvo')
      setOpen(false)
      form.resetFields()
    } catch {
      message.error('Could not save the secret.')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag icon={<KeyOutlined />}>{text}</Tag>,
    },
    { title: 'Valor', dataIndex: 'hint', key: 'hint' },
    { title: 'Description', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (text, record) => (
        <Popconfirm
          title="Delete this secret?"
          okText="Delete"
          cancelText="Cancel"
          onConfirm={(event) => {
            event?.stopPropagation?.()
            deleteSecret(record.id)
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
      <NextSeo title="AI Secrets - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="AI Secrets"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'AI Secrets', href: '/configurations/monit-ai-secrets/' },
            ]}
            extra={
              <Button type="primary" onClick={() => openNew()}>
                Novo segredo
              </Button>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Key for the RAG / embeddings"
            description={
              <span>
                Create a secret named <Typography.Text code>EMBEDDING_OPENAI_KEY</Typography.Text>{' '}
                holding a valid OpenAI key, so the RAG can generate embeddings
                (text-embedding-3-large) independently of the chat provider. Optional:{' '}
                <Typography.Text code>EMBEDDING_PROVIDER</Typography.Text> (openai|copilot|azure) and{' '}
                <Typography.Text code>EMBEDDING_URL</Typography.Text> (OpenAI-compatible endpoint).
                <Button
                  size="small"
                  type="link"
                  onClick={() => openNew({ name: 'EMBEDDING_OPENAI_KEY' })}
                >
                  Create EMBEDDING_OPENAI_KEY
                </Button>
              </span>
            }
          />

          <Table
            loading={loading}
            dataSource={secrets}
            columns={columns}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => openEdit(record),
              style: { cursor: 'pointer' },
            })}
            pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
          />

          <Modal
            open={open}
            title="Segredo"
            onCancel={() => setOpen(false)}
            onOk={handleOk}
            confirmLoading={saving}
            okText="Save"
            cancelText="Cancel"
            destroyOnClose
          >
            <Form layout="vertical" form={form}>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="EMBEDDING_OPENAI_KEY" />
              </Form.Item>
              <Form.Item
                name="value"
                label="Valor (chave)"
                extra="Leave it blank while editing to keep the current value."
              >
                <Input.Password placeholder="sk-..." autoComplete="new-password" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input />
              </Form.Item>
            </Form>
          </Modal>
        </PageContent>
      </Layout>
    </>
  )
}

export default AiSecretsPage
