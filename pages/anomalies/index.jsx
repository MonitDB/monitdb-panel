import {
  Alert,
  Button,
  Empty,
  Spin,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useAnomalyStore } from '~/services/state-manager/anomaly-store'

const SEV_COLOR = { Critical: 'red', Warning: 'orange' }

const Anomalies = () => {
  const { anomalies, loading, fetchAll } = useAnomalyStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const columns = [
    { title: 'Servidor', dataIndex: 'serverName', key: 'serverName', width: 120 },
    { title: 'Métrica', dataIndex: 'label', key: 'label', width: 170 },
    {
      title: 'Atual',
      key: 'current',
      width: 110,
      render: (text, r) => (
        <strong>
          {r.current}
          {r.unit}
        </strong>
      ),
    },
    {
      title: 'Faixa normal (esta hora)',
      key: 'band',
      width: 190,
      render: (text, r) => (
        <Tooltip
          title={`Média ${r.mean}${r.unit} · baseline dos últimos 14 dias para a hora atual`}
        >
          <span style={{ color: '#888' }}>
            {r.lower}
            {r.unit} – {r.upper}
            {r.unit}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Desvio',
      dataIndex: 'z',
      key: 'z',
      width: 110,
      render: (z, r) => (
        <Tag color={SEV_COLOR[r.severity] || 'default'}>
          {z > 0 ? '+' : ''}
          {z}σ
        </Tag>
      ),
    },
    {
      title: 'Severidade',
      dataIndex: 'severity',
      key: 'severity',
      width: 110,
      render: (s) => <Tag color={SEV_COLOR[s] || 'default'}>{s}</Tag>,
    },
  ]

  const renderBody = () => {
    if (loading && anomalies.length === 0) {
      return (
        <div className="flex justify-center py-20">
          <Spin />
        </div>
      )
    }
    if (anomalies.length === 0) {
      return (
        <Empty description="Nenhuma anomalia agora — todas as métricas dentro da faixa normal da hora." />
      )
    }
    return (
      <Table
        dataSource={anomalies}
        columns={columns}
        rowKey={(r) => `${r.serverId}-${r.metric}`}
        pagination={{ pageSize: 15, showSizeChanger: false }}
      />
    )
  }

  return (
    <>
      <NextSeo title="Anomalias - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Anomalias (baseline)"
            breadcrumbs={[{ title: 'Anomalias', href: '/anomalies/' }]}
            extra={
              <Button type="primary" loading={loading} onClick={fetchAll}>
                🔄 Atualizar
              </Button>
            }
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Como funciona"
            description="Em vez de limites fixos, comparamos cada métrica (CPU, memória, Page Life Expectancy, batch requests/s) com a baseline da própria instância: a média ± desvio-padrão para esta hora-do-dia, calculada sobre os últimos 14 dias. Se o valor atual sai dessa faixa por 3σ ou mais, vira anomalia (≥5σ = Critical) e dispara webhook. A detecção automática roda a cada 15 min. Para análise sob demanda no chat, pergunte à IA: “há alguma anomalia no servidor X?” (skill get_anomalies)."
          />

          {renderBody()}
        </PageContent>
      </Layout>
    </>
  )
}

export default Anomalies
