/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Empty,
  message as antdMessage,
  Spin,
  Tag,
  Tooltip,
} from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { Markdown } from '~/components/md'
import { PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { useInsightsStore } from '~/services/state-manager/insights-store'

const SEVERITY_COLOR = {
  Critical: 'red',
  Warning: 'orange',
  Info: 'blue',
  Healthy: 'green',
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
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold">{insight.serverName}</span>
              <Tag color={SEVERITY_COLOR[insight.severity] || 'default'}>
                {insight.severity || 'Info'}
              </Tag>
            </div>
            <Markdown content={stripFirstSeverityLine(insight.content)} />
            <div className="text-gray text-xs mt-2 flex gap-3">
              <Tooltip title="Quando foi gerado">
                <span>
                  🕒 {new Date(insight.createdAt).toLocaleString('pt-BR')}
                </span>
              </Tooltip>
              {insight.model && <span>🤖 {insight.model}</span>}
              {insight.totalTokens ? (
                <span>🔢 {insight.totalTokens} tokens</span>
              ) : undefined}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <NextSeo title="Insights - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">AI Insights</h1>
              <p className="text-gray">
                Proactive analysis per server — diagnosis, likely cause and
                recommended actions, drawn from the real telemetry.
              </p>
            </div>
            <Button type="primary" loading={running} onClick={handleRun}>
              ▶ Run now
            </Button>
          </div>
          {renderBody()}
        </PageWrapper>
      </Layout>
    </>
  )
}

export default Insights
