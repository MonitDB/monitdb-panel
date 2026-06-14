import { Alert, Button, message, Space, Table, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useRemoteStore } from '~/services/state-manager/remote-store'

const EVENT = {
  open: { color: 'blue', label: 'Abertura' },
  close: { color: 'default', label: 'Fecho' },
  error: { color: 'red', label: 'Erro' },
}

const RemoteAudit = () => {
  const { audit, auditLoading, fetchAudit, downloadRecording } = useRemoteStore()

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  const handleDownload = async (name) => {
    message.loading({ content: 'Baixando gravação…', key: 'rec' })
    try {
      await downloadRecording(name)
      message.success({ content: 'Gravação baixada.', key: 'rec', duration: 3 })
    } catch {
      message.error({
        content: 'Gravação ainda não disponível ou não encontrada.',
        key: 'rec',
        duration: 5,
      })
    }
  }

  const columns = [
    {
      title: 'Quando',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (t) => (t ? new Date(t).toLocaleString() : '—'),
    },
    { title: 'Host', dataIndex: 'hostLabel', key: 'hostLabel', ellipsis: true },
    {
      title: 'Protocolo',
      dataIndex: 'protocol',
      key: 'protocol',
      width: 90,
      render: (p) =>
        p ? <Tag color={p === 'vnc' ? 'purple' : 'blue'}>{p.toUpperCase()}</Tag> : '—',
    },
    {
      title: 'Usuário',
      dataIndex: 'userName',
      key: 'userName',
      width: 140,
      render: (n, r) => n || `#${r.userId ?? '?'}`,
    },
    {
      title: 'Evento',
      dataIndex: 'event',
      key: 'event',
      width: 110,
      render: (eventName) => (
        <Tag color={EVENT[eventName]?.color || 'default'}>
          {EVENT[eventName]?.label || eventName}
        </Tag>
      ),
    },
    {
      title: 'Gravação',
      dataIndex: 'recording',
      key: 'recording',
      render: (rec) =>
        rec ? (
          <Tooltip title={rec}>
            <Button size="small" onClick={() => handleDownload(rec)}>
              ⬇ Replay (.guac)
            </Button>
          </Tooltip>
        ) : (
          '—'
        ),
    },
  ]

  return (
    <>
      <NextSeo title="Auditoria remota - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Auditoria do Desktop remoto"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Auditoria remota', href: '/configurations/remote-audit/' },
            ]}
            extra={
              <Space>
                <Button onClick={fetchAudit} loading={auditLoading}>
                  Atualizar
                </Button>
              </Space>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message="Sessões e gravações"
            description="Cada sessão RDP/VNC registra quem conectou, host e quando, e é gravada (replay). O arquivo .guac é reproduzível num player do Guacamole — útil para auditoria/compliance. A gravação fica disponível após o fim da sessão."
          />

          <Table
            dataSource={audit}
            columns={columns}
            rowKey="id"
            loading={auditLoading}
            size="small"
            pagination={{ pageSize: 20, showSizeChanger: false }}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default RemoteAudit
