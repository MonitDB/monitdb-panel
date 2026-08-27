/* eslint-disable unicorn/no-null */
import { Alert, Button, Space, Table, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useAiAuditStore } from '~/services/state-manager/ai-audit-store'

const AiAudit = () => {
  const { audit, auditLoading, fetchAudit } = useAiAuditStore()

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  const columns = [
    {
      title: 'Quando',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (t) => (t ? new Date(t).toLocaleString() : '—'),
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 130,
      render: (n, r) => n || `#${r.userId ?? '?'}`,
    },
    {
      title: 'Server',
      dataIndex: 'serverName',
      key: 'serverName',
      width: 130,
      render: (n, r) => n || (r.serverId != null ? `#${r.serverId}` : '—'),
    },
    {
      title: 'Tool',
      dataIndex: 'tool',
      key: 'tool',
      width: 150,
      render: (t) => (t ? <Tag color="geekblue">{t}</Tag> : '—'),
    },
    {
      title: 'SQL',
      dataIndex: 'sqlText',
      key: 'sqlText',
      ellipsis: true,
      render: (sql) =>
        sql ? (
          <Tooltip
            title={<pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{sql}</pre>}
            overlayStyle={{ maxWidth: 600 }}
          >
            <code style={{ fontSize: 12 }}>{sql}</code>
          </Tooltip>
        ) : (
          '—'
        ),
    },
    {
      title: 'Linhas',
      dataIndex: 'rowsReturned',
      key: 'rowsReturned',
      width: 80,
      align: 'right',
      render: (r) => (r == null ? '—' : r),
    },
    {
      title: 'Duration',
      dataIndex: 'durationMs',
      key: 'durationMs',
      width: 90,
      align: 'right',
      render: (d) => (d == null ? '—' : `${d} ms`),
    },
    {
      title: 'Status',
      dataIndex: 'success',
      key: 'success',
      width: 90,
      render: (ok, r) =>
        ok ? (
          <Tag color="green">OK</Tag>
        ) : (
          <Tooltip title={r.error || 'Falha'}>
            <Tag color="red">Erro</Tag>
          </Tooltip>
        ),
    },
  ]

  return (
    <>
      <NextSeo title="Auditoria da IA - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Auditoria das queries da IA"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Auditoria da IA', href: '/configurations/monit-ai-audit/' },
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
            message="Immutable trail of every AI execution"
            description="Every SQL statement the AI runs (run_query and AI Skills) is recorded: who ran it, on which server, the query itself, rows returned, duration and whether it succeeded. Read-only, for audit and compliance."
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

export default AiAudit
