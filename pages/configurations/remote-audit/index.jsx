/* eslint-disable unicorn/no-null */
import { Alert, Button, message, Space, Table, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import RecordingPlayer from '~/components/remote/recording-player'
import Layout from '~/layouts/default'
import { useRemoteStore } from '~/services/state-manager/remote-store'

const EVENT = {
  open: { color: 'blue', label: 'Open' },
  close: { color: 'default', label: 'Close' },
  error: { color: 'red', label: 'Error' },
}

const RemoteAudit = () => {
  const { audit, auditLoading, fetchAudit, downloadRecording } = useRemoteStore()
  const [player, setPlayer] = useState({ open: false, name: null })

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  const handleDownload = async (name) => {
    message.loading({ content: 'Downloading recording…', key: 'rec' })
    try {
      await downloadRecording(name)
      message.success({ content: 'Recording downloaded.', key: 'rec', duration: 3 })
    } catch {
      message.error({
        content: 'Recording not available yet, or not found.',
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
      title: 'User',
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
      title: 'Recording',
      dataIndex: 'recording',
      key: 'recording',
      render: (rec) =>
        rec ? (
          <Space size="small">
            <Button
              size="small"
              type="primary"
              onClick={() => setPlayer({ open: true, name: rec })}
            >
              ▶ Reproduzir
            </Button>
            <Tooltip title={`Baixar ${rec}`}>
              <Button size="small" onClick={() => handleDownload(rec)}>
                ⬇
              </Button>
            </Tooltip>
          </Space>
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
            message="Sessions and recordings"
            description="Every RDP/VNC session records who connected, to which host and when, and is captured for replay. The .guac file plays back in a Guacamole player — useful for audit and compliance. The recording becomes available once the session ends."
          />

          <Table
            dataSource={audit}
            columns={columns}
            rowKey="id"
            loading={auditLoading}
            size="small"
            pagination={{ pageSize: 20, showSizeChanger: false, hideOnSinglePage: true }}
          />

          <RecordingPlayer
            name={player.name}
            open={player.open}
            onClose={() => setPlayer({ open: false, name: null })}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default RemoteAudit
