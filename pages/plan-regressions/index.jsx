import { Alert, Button, Empty, Spin, Table, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { usePlanRegressionStore } from '~/services/state-manager/plan-regression-store'

const SEV_COLOR = { Critical: 'red', Warning: 'orange' }

const PlanRegressions = () => {
  const { regressions, loading, snapshotting, fetchAll, snapshotNow } =
    usePlanRegressionStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleSnapshot = async () => {
    await snapshotNow()
    await fetchAll()
  }

  const renderBody = () => {
    if (loading && regressions.length === 0) {
      return (
        <div className="flex justify-center py-20">
          <Spin />
        </div>
      )
    }
    if (regressions.length === 0) {
      return (
        <Empty description="Nenhuma regressão detectada (ou ainda sem snapshots suficientes)." />
      )
    }
    return (
      <Table
        dataSource={regressions}
        columns={columns}
        rowKey={(r) => `${r.serverId}-${r.queryHash}`}
        pagination={{ pageSize: 15, showSizeChanger: false }}
      />
    )
  }

  const columns = [
    { title: 'Servidor', dataIndex: 'serverName', key: 'serverName', width: 120 },
    {
      title: 'Query',
      dataIndex: 'sampleText',
      key: 'sampleText',
      ellipsis: true,
      render: (t) => (
        <Tooltip title={t}>
          <code style={{ fontSize: 12 }}>{t}</code>
        </Tooltip>
      ),
    },
    {
      title: 'Antes → Depois',
      key: 'avg',
      width: 150,
      render: (text, r) => (
        <span>
          {r.avgBeforeMs}ms → <strong>{r.avgAfterMs}ms</strong>
        </span>
      ),
    },
    {
      title: 'Piora',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 80,
      render: (ratio, r) => (
        <Tag color={SEV_COLOR[r.severity] || 'default'}>{ratio}×</Tag>
      ),
    },
    {
      title: 'Severidade',
      dataIndex: 'severity',
      key: 'severity',
      width: 110,
      render: (s) => <Tag color={SEV_COLOR[s] || 'default'}>{s}</Tag>,
    },
    {
      title: 'Execuções',
      dataIndex: 'execCount',
      key: 'execCount',
      width: 100,
    },
  ]

  return (
    <>
      <NextSeo title="Regressão de Plano - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Regressão de Plano de Execução"
            breadcrumbs={[{ title: 'Regressão de Plano', href: '/plan-regressions/' }]}
            extra={
              <Button
                type="primary"
                loading={snapshotting}
                onClick={handleSnapshot}
              >
                📸 Capturar snapshot agora
              </Button>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Como funciona"
            description="A cada hora capturamos um snapshot das estatísticas de plano (sys.dm_exec_query_stats) por servidor. Quando o plano de uma query muda e a duração média piora ≥ 2×, listamos aqui a regressão (e disparamos webhook). Precisa de pelo menos dois snapshots com 1h de intervalo. Para uma detecção imediata por instabilidade de plano no cache, pergunte à IA: “quais queries estão com regressão de plano?” (skill get_plan_regressions)."
          />

          {renderBody()}
        </PageContent>
      </Layout>
    </>
  )
}

export default PlanRegressions
