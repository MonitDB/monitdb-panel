import {
  Alert,
  Button,
  Descriptions,
  Drawer,
  Image,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
} from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useBugReportStore } from '~/services/state-manager/bug-report-store'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const STATUS = {
  new: { color: 'red', label: 'New' },
  seen: { color: 'gold', label: 'Seen' },
  fixed: { color: 'green', label: 'Fixed' },
}

const STATUS_OPTIONS = Object.entries(STATUS).map(([value, s]) => ({
  value,
  label: s.label,
}))

const EMAIL = {
  queued: { color: 'blue', label: 'Queued' },
  sent: { color: 'green', label: 'Sent' },
  failed: { color: 'red', label: 'Failed' },
}

const showDate = (value) =>
  value ? dayjs(value).format('YYYY-MM-DD HH:mm') : '—'

const emailTag = (value) =>
  value ? (
    <Tag color={EMAIL[value]?.color || 'default'}>
      {EMAIL[value]?.label || value}
    </Tag>
  ) : (
    '—'
  )

const BugReports = () => {
  const router = useRouter()
  const { userState: user } = useUser()
  const {
    reports,
    loading,
    fetchReports,
    fetchReport,
    fetchImage,
    setStatus,
  } = useBugReportStore()

  const allowed = hasPermission(
    user,
    FeatureFunction.USER_MANAGEMENT,
    TypeGrant.OWNER
  )

  const [status, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [detail, setDetail] = useState()
  const [detailLoading, setDetailLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    if (!allowed && user.grants) router.push('/403')
  }, [allowed, router, user])

  const load = useCallback(async () => {
    setError('')
    try {
      await fetchReports({ status, q: search.trim() })
    } catch (error_) {
      setError(
        error_?.response?.data?.message ||
          error_?.message ||
          'Could not load the bug reports.'
      )
    }
  }, [fetchReports, status, search])

  useEffect(() => {
    if (allowed) load()
    // A pesquisa recarrega no Enter; o filtro de estado recarrega logo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, status])

  const openDetail = useCallback(
    async (id) => {
      setDetailLoading(true)
      setDetail({ id })
      setImageUrls([])
      try {
        const report = await fetchReport(id)
        setDetail(report)
        const urls = await Promise.all(
          (report.images || []).map((img) => fetchImage(id, img.id))
        )
        setImageUrls(urls)
      } catch (error_) {
        setDetail()
        setError(
          error_?.response?.data?.message ||
            error_?.message ||
            'Could not open the report.'
        )
      } finally {
        setDetailLoading(false)
      }
    },
    [fetchReport, fetchImage]
  )

  // Link do email: /configurations/bug-reports?id=N abre o reporte.
  useEffect(() => {
    const id = Number(router.query.id)
    if (allowed && id) openDetail(id)
  }, [allowed, router.query.id, openDetail])

  const closeDetail = () => {
    for (const url of imageUrls) URL.revokeObjectURL(url)
    setImageUrls([])
    setDetail()
    if (router.query.id) {
      router.replace('/configurations/bug-reports', undefined, {
        shallow: true,
      })
    }
  }

  const changeStatus = async (id, value) => {
    try {
      await setStatus(id, value)
      setDetail((current) =>
        current?.id === id ? { ...current, status: value } : current
      )
    } catch (error_) {
      setError(
        error_?.response?.data?.message ||
          error_?.message ||
          'Could not change the status.'
      )
    }
  }

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 70 },
    {
      title: 'When',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: showDate,
    },
    { title: 'Section', dataIndex: 'section', key: 'section', width: 140 },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (title, r) => (
        <Button type="link" className="p-0" onClick={() => openDetail(r.id)}>
          {title}
        </Button>
      ),
    },
    {
      title: 'Reported by',
      dataIndex: 'userName',
      key: 'userName',
      width: 180,
      render: (name, r) => (
        <Space direction="vertical" size={0}>
          <span>{name || '—'}</span>
          {r.customerName && (
            <span style={{ fontSize: 12, opacity: 0.65 }}>
              {r.customerName}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: 'Screens',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      align: 'right',
    },
    {
      title: 'Email',
      dataIndex: 'emailStatus',
      key: 'emailStatus',
      width: 90,
      render: emailTag,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value, r) => (
        <Select
          size="small"
          value={value}
          options={STATUS_OPTIONS}
          style={{ width: 100 }}
          onChange={(next) => changeStatus(r.id, next)}
        />
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Bug reports - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Bug reports"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Bug reports', href: '/configurations/bug-reports/' },
            ]}
            extra={
              <Space wrap>
                <Select
                  value={status}
                  style={{ width: 140 }}
                  options={[{ value: '', label: 'All statuses' }, ...STATUS_OPTIONS]}
                  onChange={setStatusFilter}
                />
                <Input.Search
                  allowClear
                  placeholder="Search title, text, section or user…"
                  style={{ width: 280 }}
                  value={search}
                  onChange={(inputEvent) => setSearch(inputEvent.target.value)}
                  onSearch={load}
                />
                <Button onClick={load} loading={loading}>
                  Refresh
                </Button>
              </Space>
            }
          />

          {error && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 12 }}
              message="Bug reports"
              description={error}
            />
          )}

          <Table
            dataSource={reports}
            columns={columns}
            rowKey="id"
            loading={loading}
            size="small"
            pagination={{ pageSize: 20, hideOnSinglePage: true }}
          />

          <Drawer
            open={Boolean(detail)}
            onClose={closeDetail}
            width={760}
            title={detail?.title ? `#${detail.id} — ${detail.title}` : 'Bug report'}
            extra={
              detail?.status && (
                <Select
                  value={detail.status}
                  options={STATUS_OPTIONS}
                  style={{ width: 110 }}
                  onChange={(next) => changeStatus(detail.id, next)}
                />
              )
            }
          >
            {detailLoading && !detail?.title ? (
              <Spin />
            ) : (
              detail?.title && (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="Section">
                      <Tag color="geekblue">{detail.section}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Reported by">
                      {detail.userName} {detail.userEmail && `<${detail.userEmail}>`}
                    </Descriptions.Item>
                    {detail.customerName && (
                      <Descriptions.Item label="Customer">
                        {detail.customerName}
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="When">
                      {showDate(detail.createdAt)}
                    </Descriptions.Item>
                    {detail.pageUrl && (
                      <Descriptions.Item label="Page">
                        <span style={{ wordBreak: 'break-all' }}>
                          {detail.pageUrl}
                        </span>
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Browser">
                      <span style={{ fontSize: 12 }}>{detail.userAgent || '—'}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <Space>
                        {emailTag(detail.emailStatus)}
                        <span style={{ fontSize: 12 }}>{detail.emailTo}</span>
                      </Space>
                      {detail.emailError && (
                        <div style={{ fontSize: 12, color: '#cf1322' }}>
                          {detail.emailError}
                        </div>
                      )}
                    </Descriptions.Item>
                  </Descriptions>

                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      borderLeft: '4px solid #5046e5',
                      padding: '12px 16px',
                      background: 'rgba(80, 70, 229, 0.06)',
                    }}
                  >
                    {detail.description}
                  </div>

                  {detail.images?.length > 0 && (
                    <Image.PreviewGroup>
                      <Space wrap>
                        {imageUrls.map((url, index) => (
                          <Image
                            key={url}
                            src={url}
                            alt={detail.images[index]?.name}
                            width={220}
                          />
                        ))}
                        {imageUrls.length === 0 && <Spin />}
                      </Space>
                    </Image.PreviewGroup>
                  )}
                </Space>
              )
            )}
          </Drawer>
        </PageContent>
      </Layout>
    </>
  )
}

export default BugReports
