import {
  Alert,
  Button,
  DatePicker,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd'
import dayjs from 'dayjs'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useLoginAuditStore } from '~/services/state-manager/login-audit-store'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const RESULT = {
  success: { color: 'green', label: 'Success' },
  wrong_password: { color: 'red', label: 'Wrong password' },
  unknown_user: { color: 'volcano', label: 'Unknown user' },
  disabled: { color: 'orange', label: 'User disabled' },
}

const RESULT_OPTIONS = [
  { value: '', label: 'All results' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'All failures' },
  { value: 'wrong_password', label: 'Wrong password' },
  { value: 'unknown_user', label: 'Unknown user' },
  { value: 'disabled', label: 'User disabled' },
]

const formatDate = (value) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''

const showDate = (value) => formatDate(value) || '—'

// CSV com ';' e BOM: abre direto no Excel em PT, acentos incluídos.
const BOM = String.fromCodePoint(0xFE_FF)

const escapeCsv = (value) => {
  const text = value === undefined || value === null ? '' : String(value)
  return /[\n\r";]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const toCsv = (headers, rows) => {
  const lines = [headers.map((h) => escapeCsv(h.label)).join(';')]
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(h.value(row))).join(';'))
  }
  return `${BOM}${lines.join('\r\n')}`
}

const SUMMARY_CSV = [
  { label: 'User', value: (r) => r.userName },
  { label: 'Email', value: (r) => r.loginEmail },
  { label: 'Profile', value: (r) => r.roleName },
  { label: 'Enabled', value: (r) => (r.enabled ? 'yes' : 'no') },
  { label: 'Last login', value: (r) => formatDate(r.lastLogin) },
  { label: 'Last access', value: (r) => formatDate(r.lastAccess) },
  { label: 'Logins in period', value: (r) => r.logins },
  { label: 'Failures in period', value: (r) => r.failures },
]

const EVENTS_CSV = [
  { label: 'When', value: (r) => formatDate(r.createdAt) },
  { label: 'Login typed', value: (r) => r.loginEmail },
  { label: 'User', value: (r) => r.userName },
  { label: 'Result', value: (r) => RESULT[r.result]?.label || r.result },
  { label: 'IP', value: (r) => r.ip },
  { label: 'Browser', value: (r) => r.userAgent },
]

const LoginAudit = () => {
  const router = useRouter()
  const { userState: user } = useUser()
  const { events, summary, loading, fetchAll } = useLoginAuditStore()

  const allowed = hasPermission(
    user,
    FeatureFunction.USER_MANAGEMENT,
    TypeGrant.OWNER
  )

  const [range, setRange] = useState([dayjs().subtract(30, 'day'), dayjs()])
  const [result, setResult] = useState('')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('users')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!allowed && user.grants) router.push('/403')
  }, [allowed, router, user])

  const load = useCallback(async () => {
    setError('')
    try {
      await fetchAll({
        from: range?.[0]?.format('YYYY-MM-DD'),
        to: range?.[1]?.format('YYYY-MM-DD'),
        result: result || undefined,
        q: search.trim() || undefined,
      })
    } catch (error_) {
      setError(
        error_?.response?.data?.message ||
          error_?.message ||
          'Could not load the login audit.'
      )
    }
  }, [fetchAll, range, result, search])

  useEffect(() => {
    if (allowed) load()
    // Recarrega só quando muda o período ou o resultado; a pesquisa vai no Enter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, range, result])

  const summaryRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return summary
    return summary.filter((r) =>
      [r.userName, r.loginEmail, r.roleName]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [summary, search])

  const exportCsv = () => {
    const from = range?.[0]?.format('YYYYMMDD') || 'start'
    const to = range?.[1]?.format('YYYYMMDD') || 'today'
    const csv =
      tab === 'users'
        ? toCsv(SUMMARY_CSV, summaryRows)
        : toCsv(EVENTS_CSV, events)
    saveAs(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
      `login-audit-${tab}-${from}-${to}.csv`
    )
  }

  const summaryColumns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => String(a.userName).localeCompare(String(b.userName)),
      render: (name, r) => (
        <Space direction="vertical" size={0}>
          <span>{name}</span>
          <span style={{ fontSize: 12, opacity: 0.65 }}>{r.loginEmail}</span>
        </Space>
      ),
    },
    { title: 'Profile', dataIndex: 'roleName', key: 'roleName', width: 140 },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled) =>
        enabled ? <Tag color="green">Enabled</Tag> : <Tag>Disabled</Tag>,
    },
    {
      title: 'Last login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 170,
      sorter: (a, b) => dayjs(a.lastLogin || 0) - dayjs(b.lastLogin || 0),
      render: (value) =>
        value ? showDate(value) : <Tag color="default">Never</Tag>,
    },
    {
      title: (
        <Tooltip title="Last time the user opened MonitDB (updated at most every 5 minutes).">
          Last access
        </Tooltip>
      ),
      dataIndex: 'lastAccess',
      key: 'lastAccess',
      width: 170,
      sorter: (a, b) => dayjs(a.lastAccess || 0) - dayjs(b.lastAccess || 0),
      render: showDate,
    },
    {
      title: 'Logins',
      dataIndex: 'logins',
      key: 'logins',
      width: 90,
      align: 'right',
      sorter: (a, b) => a.logins - b.logins,
    },
    {
      title: 'Failures',
      dataIndex: 'failures',
      key: 'failures',
      width: 90,
      align: 'right',
      sorter: (a, b) => a.failures - b.failures,
      render: (n) =>
        n ? <span style={{ color: '#cf1322' }}>{n}</span> : n,
    },
  ]

  const eventColumns = [
    {
      title: 'When',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: showDate,
    },
    {
      title: 'Login typed',
      dataIndex: 'loginEmail',
      key: 'loginEmail',
      ellipsis: true,
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 160,
      render: (name) => name || '—',
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      width: 140,
      render: (value) => (
        <Tag color={RESULT[value]?.color || 'default'}>
          {RESULT[value]?.label || value}
        </Tag>
      ),
    },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140 },
    {
      title: 'Browser',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: { showTitle: false },
      render: (ua) => (
        <Tooltip title={ua}>
          <span>{ua || '—'}</span>
        </Tooltip>
      ),
    },
  ]

  // Sem guarda de "return vazio" aqui: é o Layout que carrega o utilizador e os
  // grants; sem ele montado, `allowed` nunca passa a true (página em branco).
  // Quem não tem permissão vai para /403 (efeito acima) e a API recusa na mesma.
  return (
    <>
      <NextSeo title="Login audit - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Login audit"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Login audit', href: '/configurations/login-audit/' },
            ]}
            extra={
              <Space wrap>
                <DatePicker.RangePicker
                  value={range}
                  onChange={(value) => setRange(value || [])}
                  allowClear={false}
                />
                <Select
                  value={result}
                  options={RESULT_OPTIONS}
                  style={{ width: 160 }}
                  onChange={setResult}
                  disabled={tab === 'users'}
                />
                <Input.Search
                  allowClear
                  placeholder="Search user, email or IP…"
                  style={{ width: 240 }}
                  value={search}
                  onChange={(inputEvent) => setSearch(inputEvent.target.value)}
                  onSearch={load}
                />
                <Button onClick={load} loading={loading}>
                  Refresh
                </Button>
                <Button type="primary" onClick={exportCsv} disabled={loading}>
                  Export CSV
                </Button>
              </Space>
            }
          />

          {error ? (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 12 }}
              message="Could not load the login audit"
              description={error}
            />
          ) : (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 12 }}
              message="Who is using MonitDB"
              description="Every login attempt is recorded, successful or not (the password is never stored). Users shows one line per user with the last login, the last time they opened MonitDB and the counts in the chosen period. Events lists each attempt, newest first."
            />
          )}

          <Tabs
            activeKey={tab}
            onChange={setTab}
            items={[
              {
                key: 'users',
                label: `Users (${summaryRows.length})`,
                children: (
                  <Table
                    dataSource={summaryRows}
                    columns={summaryColumns}
                    rowKey="userId"
                    loading={loading}
                    size="small"
                    pagination={{ pageSize: 20, hideOnSinglePage: true }}
                  />
                ),
              },
              {
                key: 'events',
                label: `Events (${events.length})`,
                children: (
                  <Table
                    dataSource={events}
                    columns={eventColumns}
                    rowKey="id"
                    loading={loading}
                    size="small"
                    pagination={{ pageSize: 20, hideOnSinglePage: true }}
                  />
                ),
              },
            ]}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default LoginAudit
