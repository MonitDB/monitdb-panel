import { Alert, Button, Input, Space, Table, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useSshStore } from '~/services/state-manager/ssh-store'

const EVENT = {
  open: { color: 'blue', label: 'Open' },
  command: { color: 'geekblue', label: 'Command' },
  close: { color: 'default', label: 'Close' },
  error: { color: 'red', label: 'Error' },
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
      title: 'When',
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
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 140,
      render: (n, r) => n || `#${r.userId ?? '?'}`,
    },
    {
      title: 'Event',
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
      title: 'Detail',
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
      <NextSeo title="SSH audit - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="SSH terminal audit"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'SSH audit', href: '/configurations/ssh-audit/' },
            ]}
            extra={
              <Space>
                <Input.Search
                  allowClear
                  placeholder="Filter by host, user or command…"
                  style={{ width: 280 }}
                  onChange={(inputEvent) => setFilter(inputEvent.target.value)}
                />
                <Button onClick={fetchAudit} loading={auditLoading}>
                  Refresh
                </Button>
              </Space>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 12 }}
            message="Audit trail"
            description="Records every SSH terminal session: the opening (who, which host, when), the commands typed line by line, the close, and errors — including a refusal because the host key changed. Newest events first."
          />

          <Table
            dataSource={rows}
            columns={columns}
            rowKey="id"
            loading={auditLoading}
            size="small"
            pagination={{ pageSize: 20, showSizeChanger: false, hideOnSinglePage: true }}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default SshAudit
