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
      message.error('O limiar crítico deve ser maior ou igual ao de atenção.')
      return
    }
    try {
      await saveThreshold(values)
      message.success('Limiares salvos.')
      setModal({ open: false, editing: null })
      fetchThresholds()
    } catch {
      message.error('Falha ao salvar os limiares.')
    }
  }

  const onDelete = async (serverId) => {
    try {
      await deleteThreshold(serverId)
      message.success('Override removido (volta a usar o default global).')
      fetchThresholds()
    } catch {
      message.error('Falha ao remover o override.')
    }
  }

  const modalTitle = (() => {
    if (!modal.editing) return 'Novo override por servidor'
    if (modal.editing.serverId === 0) return 'Default global'
    const label = modal.editing.serverName || `#${modal.editing.serverId}`
    return `Servidor ${label}`
  })()

  const columns = [
    {
      title: 'Alvo',
      dataIndex: 'serverName',
      key: 'serverName',
      render: (n, r) =>
        r.serverId === 0 ? <b>Default global</b> : n || `#${r.serverId}`,
    },
    { title: 'CPU atenção %', dataIndex: 'cpuWarn', key: 'cpuWarn', width: 120, align: 'right' },
    { title: 'CPU crítico %', dataIndex: 'cpuCrit', key: 'cpuCrit', width: 120, align: 'right' },
    { title: 'Disco atenção %', dataIndex: 'diskWarn', key: 'diskWarn', width: 130, align: 'right' },
    { title: 'Disco crítico %', dataIndex: 'diskCrit', key: 'diskCrit', width: 130, align: 'right' },
    { title: 'Mem. mín. (MB)', dataIndex: 'memMinMb', key: 'memMinMb', width: 130, align: 'right' },
    {
      title: 'Ações',
      key: 'actions',
      width: 170,
      render: (_, r) => (
        <Space size="small">
          <Button size="small" onClick={() => openEdit(r)}>
            Editar
          </Button>
          {r.serverId === 0 ? null : (
            <Popconfirm
              title="Remover este override?"
              onConfirm={() => onDelete(r.serverId)}
            >
              <Button size="small" danger>
                Remover
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Limiares de saúde - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Limiares de saúde"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Limiares de saúde', href: '/configurations/health-thresholds/' },
            ]}
            extra={
              <Space>
                <Button onClick={fetchThresholds} loading={loading}>
                  Atualizar
                </Button>
                <Button
                  type="primary"
                  onClick={openAdd}
                  disabled={serverOptions.length === 0}
                >
                  + Override por servidor
                </Button>
              </Space>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message="Limiares que definem a saúde (bolinha) dos servidores"
            description="A cor de status usa estes limiares: atenção (amarelo) e crítico (vermelho) para CPU/disco (%) e memória mínima livre (MB). O 'Default global' vale para todos; um override por servidor tem prioridade."
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
            okText="Salvar"
            destroyOnClose
            title={modalTitle}
          >
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              message="Como estes limiares viram a cor do card no dashboard"
              description={
                <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                  🟢 <b>Saudável</b>: abaixo dos limiares.
                  <br />
                  🟡 <b>Atenção</b>: CPU% ou Disco% acima do valor de{' '}
                  <i>atenção</i>.
                  <br />
                  🟠 <b>Crítico</b>: CPU% ou Disco% acima do <i>crítico</i>, ou
                  memória livre abaixo do mínimo (MB).
                  <br />
                  🔵 <b>Info</b>: há alerta ativo. · 🔴 <b>Offline</b>: sem
                  conexão.
                  <br />O <i>crítico</i> deve ser ≥ <i>atenção</i>. Um override
                  por servidor tem prioridade sobre o default global.
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
                  label="Servidor"
                  rules={[{ required: true, message: 'Selecione o servidor' }]}
                >
                  <Select options={serverOptions} placeholder="Selecione um servidor" />
                </Form.Item>
              )}
              <Space>
                <Form.Item name="cpuWarn" label="CPU atenção %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item name="cpuCrit" label="CPU crítico %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
              </Space>
              <Space>
                <Form.Item name="diskWarn" label="Disco atenção %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
                <Form.Item name="diskCrit" label="Disco crítico %">
                  <InputNumber min={0} max={100} />
                </Form.Item>
              </Space>
              <Form.Item name="memMinMb" label="Memória mínima livre (MB)">
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
