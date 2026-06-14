import { Alert, Button, Input, Space, Table, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useSshStore } from '~/services/state-manager/ssh-store'

const EVENT = {
  open: { color: 'blue', label: 'Abertura' },
  command: { color: 'geekblue', label: 'Comando' },
  close: { color: 'default', label: 'Fecho' },
  error: { color: 'red', label: 'Erro' },
}

const SshAudit = () => {
  const { audit, auditLoading, fetchAudit } = useSshStore()
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  const rows = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return audit
    return audit.filter((r) =>
      [r.hostLabel, r.userName, r.event, r.detail]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [audit, filter])

  const columns = [
    {
      title: 'Quando',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (t) => (t ? new Date(t).toLocaleString() : '—'),
    },
    {
      title: 'Host',
      dataIndex: 'hostLabel',
      key: 'hostLabel',
      ellipsis: true,
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
      title: 'Detalhe',
      dataIndex: 'detail',
      key: 'detail',
      render: (d, r) =>
        r.event === 'command' ? (
          <code style={{ fontSize: 12 }}>{d}</code>
        ) : (
          <Tooltip title={d}>
            <span style={{ color: r.event === 'error' ? '#cf1322' : undefined }}>
              {d}
            </span>
          </Tooltip>
        ),
    },
  ]

  return (
    <>
      <NextSeo title="Auditoria SSH - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Auditoria do Terminal SSH"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Auditoria SSH', href: '/configurations/ssh-audit/' },
            ]}
            extra={
              <Space>
                <Input.Search
                  allowClear
                  placeholder="Filtrar host/usuário/comando…"
                  style={{ width: 280 }}
                  onChange={(inputEvent) => setFilter(inputEvent.target.value)}
                />
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
            message="Trilha de auditoria"
            description="Registra cada sessão do terminal SSH: abertura (quem, host, quando), comandos digitados (por linha), fecho e erros (incl. recusa por mudança de host key). Os eventos mais recentes aparecem primeiro."
          />

          <Table
            dataSource={rows}
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

export default SshAudit
