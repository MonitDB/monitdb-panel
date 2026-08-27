import { ApiOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
} from 'antd'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useWebhooksStore } from '~/services/state-manager/webhooks-store'

const SEV_COLOR = {
  Healthy: 'green',
  Info: 'blue',
  Warning: 'orange',
  Critical: 'red',
}

const WebhooksPage = () => {
  const {
    webhooks,
    loading,
    saving,
    fetchWebhooks,
    upsertWebhook,
    toggleWebhook,
    deleteWebhook,
    testWebhook,
  } = useWebhooksStore()

  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchWebhooks()
  }, [fetchWebhooks])

  const openNew = () => {
    form.resetFields()
    form.setFieldsValue({ type: 'slack', minSeverity: 'Warning', enabled: true })
    setOpen(true)
  }

  const openEdit = (record) => {
    form.resetFields()
    form.setFieldsValue(record)
    setOpen(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      await upsertWebhook(values)
      message.success('Webhook salvo')
      setOpen(false)
    } catch {
      message.error('Falha ao salvar o webhook')
    }
  }

  const handleTest = async (event, id) => {
    event.stopPropagation()
    message.loading({ content: 'Enviando teste...', key: 'wh-test' })
    try {
      const r = await testWebhook(id)
      message.destroy('wh-test')
      if (r?.ok) message.success('Teste enviado com sucesso.')
      else message.warning(r?.message || 'Falha no envio.')
    } catch {
      message.destroy('wh-test')
      message.error('Falha ao testar o webhook.')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag icon={<ApiOutlined />}>{text}</Tag>,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      render: (t) => <Tag>{t}</Tag>,
    },
    {
      title: 'Min. severity',
      dataIndex: 'minSeverity',
      key: 'minSeverity',
      render: (s) => <Tag color={SEV_COLOR[s] || 'default'}>{s}</Tag>,
    },
    { title: 'URL', dataIndex: 'url', key: 'url', ellipsis: true },
    {
      title: 'Enabled',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 70,
      render: (enabled, record) => (
        <Switch
          checked={!!enabled}
          size="small"
          onClick={(checked, event) => {
            event.stopPropagation()
            toggleWebhook(record.id)
          }}
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 130,
      render: (text, record) => (
        <div className="flex gap-1">
          <Button
            size="small"
            onClick={(event) => handleTest(event, record.id)}
          >
            Testar
          </Button>
          <Popconfirm
            title="Excluir este webhook?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => deleteWebhook(record.id)}
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              onClick={(event) => event.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Webhooks - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Webhooks de Alerta"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Webhooks', href: '/configurations/webhooks/' },
            ]}
            extra={
              <Button type="primary" onClick={openNew}>
                Novo webhook
              </Button>
            }
          />

          <Table
            loading={loading}
            dataSource={webhooks}
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
            title="Webhook"
            onCancel={() => setOpen(false)}
            onOk={handleOk}
            confirmLoading={saving}
            okText="Save"
            cancelText="Cancel"
            destroyOnClose
          >
            <Form layout="vertical" form={form}>
              <Form.Item name="id" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="Alertas do time de DBA" />
              </Form.Item>
              <Form.Item name="url" label="URL" rules={[{ required: true }]}>
                <Input placeholder="https://hooks.slack.com/services/..." />
              </Form.Item>
              <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'slack', label: 'Slack' },
                    { value: 'teams', label: 'Microsoft Teams' },
                    { value: 'generic', label: 'Generic (POST JSON)' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="minSeverity"
                label="Minimum severity"
                extra="Only fires for events at this severity or above."
              >
                <Select
                  options={[
                    { value: 'Info', label: 'Info' },
                    { value: 'Warning', label: 'Warning' },
                    { value: 'Critical', label: 'Critical' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="enabled" label="Enabled" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Form>
          </Modal>
        </PageContent>
      </Layout>
    </>
  )
}

export default WebhooksPage
