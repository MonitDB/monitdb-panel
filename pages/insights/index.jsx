/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Empty,
  message as antdMessage,
  Spin,
  Tooltip,
} from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { Markdown } from '~/components/md'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Status from '~/components/status'
import Layout from '~/layouts/default'
import { useInsightsStore } from '~/services/state-manager/insights-store'

// Antes: cores de fabrica do AntD (red/orange/blue/green). Agora os tons de
// estado do produto, que sao os mesmos do cartao do dashboard e do ecra 12.
const SEVERITY_TONE = {
  Critical: 'crit',
  Warning: 'warn',
  Info: 'off',
  Healthy: 'ok',
}

// O produto mostra datas em dd/mm/aaaa hh:mm. Aqui vinha um toLocaleString
// pt-BR, com segundos e noutra ordem.
const pad = (n) => `${n}`.padStart(2, '0')

const formatMoment = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const stripFirstSeverityLine = (text = '') =>
  text.replace(/^\s*severidade:\s*\w+\s*\n?/i, '')

const Insights = () => {
  const { insights, loading, running, fetchInsights, runNow } =
    useInsightsStore()

  useEffect(() => {
    fetchInsights()
  }, [])

  const handleRun = async () => {
    antdMessage.loading({
      content: 'Running the proactive analysis — this can take a few minutes…',
      key: 'run-insights',
      duration: 0,
    })
    const ok = await runNow()
    antdMessage.destroy('run-insights')
    if (ok) antdMessage.success('Analysis complete.')
    else antdMessage.error('Could not run the analysis.')
  }

  const renderBody = () => {
    if (loading && insights.length === 0) {
      return (
        <div className="flex justify-center py-20">
          <Spin />
        </div>
      )
    }
    if (insights.length === 0) {
      return (
        <Empty description="No insights yet — use Run now to generate the first ones." />
      )
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white border border-gray-light rounded-lg p-4"
          >
            {/* A hora sobe para o cabecalho: a primeira pergunta de quem le um
                diagnostico e "isto e de hoje?". Os mesmos dados, noutro sitio. */}
            <div className="flex items-baseline justify-between gap-3 mb-3">
              <span className="flex items-baseline gap-2 min-w-0">
                <span className="mn-mono font-bold">{insight.serverName}</span>
                <Tooltip title="Quando foi gerado">
                  <small className="text-gray whitespace-nowrap">
                    {formatMoment(insight.createdAt)}
                  </small>
                </Tooltip>
                {insight.model ? (
                  <small className="text-gray truncate">{insight.model}</small>
                ) : undefined}
              </span>
              <Status tone={SEVERITY_TONE[insight.severity] ?? 'off'}>
                {insight.severity || 'Info'}
              </Status>
            </div>
            <Markdown content={stripFirstSeverityLine(insight.content)} />
            {insight.totalTokens ? (
              <div className="text-gray text-xs mt-3">
                {insight.totalTokens} tokens
              </div>
            ) : undefined}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <NextSeo title="Insights - MonitDB" />
      <Layout>
        {/* O PageWrapper nao aceita className: o "p-8" que aqui estava nunca
            chegou ao DOM e por isso esta pagina era a unica colada a borda.
            A margem vem do PageContent, como em todas as outras. */}
        <PageWrapper>
          <PageContent removeSidebarMargin>
            <PageHeader
              title="AI Insights"
              extra={
                <Button type="primary" loading={running} onClick={handleRun}>
                  Run now
                </Button>
              }
            />
            <p className="text-gray -mt-8 mb-8">
              Proactive analysis per server — diagnosis, likely cause and
              recommended actions, drawn from the real telemetry.
            </p>
            {renderBody()}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default Insights
