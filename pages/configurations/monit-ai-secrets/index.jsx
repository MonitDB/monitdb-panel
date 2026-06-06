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
      message.error('Falha ao salvar o segredo')
    }
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag icon={<KeyOutlined />}>{text}</Tag>,
    },
    { title: 'Valor', dataIndex: 'hint', key: 'hint' },
    { title: 'Descrição', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (text, record) => (
        <Popconfirm
          title="Excluir este segredo?"
          okText="Excluir"
          cancelText="Cancelar"
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
            message="Chave para o RAG / embeddings"
            description={
              <span>
                Crie um segredo chamado <Typography.Text code>EMBEDDING_OPENAI_KEY</Typography.Text>{' '}
                com uma chave OpenAI válida para o RAG gerar embeddings (text-embedding-3-large),
                independente do provider de chat. Opcionais:{' '}
                <Typography.Text code>EMBEDDING_PROVIDER</Typography.Text> (openai|copilot|azure) e{' '}
                <Typography.Text code>EMBEDDING_URL</Typography.Text> (endpoint OpenAI-compatível).
                <Button
                  size="small"
                  type="link"
                  onClick={() => openNew({ name: 'EMBEDDING_OPENAI_KEY' })}
                >
                  Criar EMBEDDING_OPENAI_KEY
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
            pagination={{ pageSize: 10, showSizeChanger: false }}
          />

          <Modal
            open={open}
            title="Segredo"
            onCancel={() => setOpen(false)}
            onOk={handleOk}
            confirmLoading={saving}
            okText="Salvar"
            cancelText="Cancelar"
            destroyOnClose
          >
            <Form layout="vertical" form={form}>
              <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                <Input placeholder="EMBEDDING_OPENAI_KEY" />
              </Form.Item>
              <Form.Item
                name="value"
                label="Valor (chave)"
                extra="Ao editar, deixe em branco para manter o valor atual."
              >
                <Input.Password placeholder="sk-..." autoComplete="new-password" />
              </Form.Item>
              <Form.Item name="description" label="Descrição">
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
