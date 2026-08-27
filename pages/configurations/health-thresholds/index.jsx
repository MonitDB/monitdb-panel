/* eslint-disable unicorn/no-null */
import {
  Alert,
  Button,
  Form,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useHealthThresholdStore } from '~/services/state-manager/health-threshold-store'

const HealthThresholds = () => {
  const {
    thresholds,
    servers,
    loading,
    fetchThresholds,
    fetchServers,
    saveThreshold,
    deleteThreshold,
  } = useHealthThresholdStore()
  const [modal, setModal] = useState({ open: false, editing: null })
  const [form] = Form.useForm()

  useEffect(() => {
    fetchThresholds()
    fetchServers()
  }, [fetchThresholds, fetchServers])

  const existingIds = new Set(thresholds.map((t) => t.serverId))
  const serverOptions = servers
    .filter((s) => !existingIds.has(s.id))
    .map((s) => ({ value: s.id, label: `${s.name} (#${s.id})` }))

  const openAdd = () => {
    form.resetFields()
    form.setFieldsValue({
      cpuWarn: 75,
      cpuCrit: 90,
      diskWarn: 75,
      diskCrit: 90,
      memMinMb: 250,
    })
    setModal({ open: true, editing: null })
  }
  const openEdit = (row) => {
    form.setFieldsValue({ ...row })
    setModal({ open: true, editing: row })
  }

  const onSave = async () => {
    let values
    try {
      values = await form.validateFields()
    } catch {
      return
    }
    if (values.cpuCrit < values.cpuWarn || values.diskCrit < values.diskWarn) {
      message.error('The critical threshold must be greater than or equal to the warning one.')
      return
    }
    try {
      await saveThreshold(values)
      message.success('Thresholds saved.')
      setModal({ open: false, editing: null })
      fetchThresholds()
    } catch {
      message.error('Could not save the thresholds.')
    }
  }

  const onDelete = async (serverId) => {
    try {
      await deleteThreshold(serverId)
      message.success('Override removed — this server goes back to the global default.')
      fetchThresholds()
    } catch {
      message.error('Could not remove the override.')
    }
  }

  const modalTitle = (() => {
    if (!modal.editing) return 'New per-server override'
    if (modal.editing.serverId === 0) return 'Global default'
    const label = modal.editing.serverName || `#${modal.editing.serverId}`
    return `Server ${label}`
  })()

  const columns = [
    {
      title: 'Target',
      dataIndex: 'serverName',
      key: 'serverName',
      render: (n, r) =>
        r.serverId === 0 ? <b>Global default</b> : n || `#${r.serverId}`,
    },
    { title: 'CPU warning %', dataIndex: 'cpuWarn', key: 'cpuWarn', width: 120, align: 'right' },
    { title: 'CPU critical %', dataIndex: 'cpuCrit', key: 'cpuCrit', width: 120, align: 'right' },
    { title: 'Disk warning %', dataIndex: 'diskWarn', key: 'diskWarn', width: 130, align: 'right' },
    { title: 'Disk critical %', dataIndex: 'diskCrit', key: 'diskCrit', width: 130, align: 'right' },
    { title: 'Min. free memory (MB)', dataIndex: 'memMinMb', key: 'memMinMb', width: 130, align: 'right' },
    {
      title: 'Actions',
      key: 'actions',
      width: 170,
      render: (_, r) => (
        <Space size="small">
          <Button size="small" onClick={() => openEdit(r)}>
            Edit
          </Button>
          {r.serverId === 0 ? null : (
            <Popconfirm
              title="Remove this override?"
              onConfirm={() => onDelete(r.serverId)}
            >
              <Button size="small" danger>
                Remove
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Health Thresholds - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Health Thresholds"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Health Thresholds', href: '/configurations/health-thresholds/' },
            ]}
            extra={
              <Space>
                <Button onClick={fetchThresholds} loading={loading}>
                  Refresh
                </Button>
                <Button
                  type="primary"
                  onClick={openAdd}
                  disabled={serverOptions.length === 0}
                >
                  + Per-server override
                </Button>
              </Space>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message="The thresholds behind each server's health dot"
            description="The status colour comes from these thresholds: warning (yellow) and critical (red) for CPU and disk (%), plus minimum free memory (MB). The global default applies to every server; a per-server override wins over it."
          />

          <Table
            dataSource={thresholds}
            columns={columns}
            rowKey="serverId"
            loading={loading}
            size="small"
            pagination={false}
          />

          <Modal
            open={modal.open}
            onCancel={() => setModal({ open: false, editing: null })}
            onOk={onSave}
            okText="Save"
            destroyOnClose
            title={modalTitle}
          >
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="How these thresholds become the card colour on the dashboard"
              description={
                <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                  🟢 <b>Healthy</b>: below every threshold.
                  <br />
                  🟡 <b>Warning</b>: CPU% or Disk% above the{' '}
                  <i>warning</i> value.
                  <br />
                  🟠 <b>Critical</b>: CPU% or Disk% above <i>critical</i>, or free
                  memory below the minimum (MB).
                  <br />
                  🔵 <b>Info</b>: an alert is active. · 🔴 <b>Offline</b>: no
                  connection.
                  <br />The <i>critical</i> value must be ≥ <i>warning</i>. A
                  per-server override wins over the global default.
                </div>
              }
            />
            <Form form={form} layout="vertical">
              {modal.editing ? (
                <Form.Item name="serverId" hidden>
                  <InputNumber />
                </Form.Item>
              ) : (
                <Form.Item
                  name="serverId"
                  label="Server"
                  rules={[{ required: true, message: 'Pick a server' }]}
                >
                  <Select options={serverOptions} placeholder="Pick a server" />
                </Form.Item>
              )}
              <Space>
                <Form.Item name="cpuWarn" label="CPU warning %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item name="cpuCrit" label="CPU critical %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
              </Space>
              <Space>
                <Form.Item name="diskWarn" label="Disk warning %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item name="diskCrit" label="Disk critical %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
              </Space>
              <Form.Item name="memMinMb" label="Minimum free memory (MB)">
                <InputNumber min={0} style={{ width: 200 }} />
              </Form.Item>
            </Form>
          </Modal>
        </PageContent>
      </Layout>
    </>
  )
}

export default HealthThresholds
