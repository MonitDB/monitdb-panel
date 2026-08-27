import { Alert, message, Spin, Switch, Table, Tag } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useDataMaskStore } from '~/services/state-manager/data-mask-store'

const DataMasking = () => {
  const { servers, config, defaultOn, loading, fetchAll, toggle } =
    useDataMaskStore()

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  const handleToggle = async (serverId, checked) => {
    const ok = await toggle(serverId, checked)
    if (ok) {
      message.success(
        checked
          ? 'Mascaramento de PII ativado para o servidor.'
          : 'Mascaramento de PII desativado para o servidor.'
      )
    } else {
      message.error('Falha ao salvar. Tente novamente.')
    }
  }

  const isOn = (id) => (id in config ? config[id] : defaultOn)

  const columns = [
    { title: 'Server', dataIndex: 'serverName', key: 'serverName' },
    {
      title: 'Environment',
      dataIndex: 'serverDescription',
      key: 'serverDescription',
      ellipsis: true,
    },
    {
      title: 'Mascarar PII para a IA',
      key: 'mask',
      width: 200,
      render: (text, r) => (
        <span>
          <Switch
            checked={isOn(r.id)}
            onChange={(checked) => handleToggle(r.id, checked)}
          />{' '}
          {!(r.id in config) && (
            <Tag color="default" style={{ marginLeft: 8 }}>
              herda default ({defaultOn ? 'ligado' : 'desligado'})
            </Tag>
          )}
        </span>
      ),
    },
  ]

  const renderBody = () => {
    if (loading && servers.length === 0) {
      return (
        <div className="flex justify-center py-20">
          <Spin />
        </div>
      )
    }
    return (
      <Table
        dataSource={servers}
        columns={columns}
        rowKey={(r) => r.id}
        pagination={false}
      />
    )
  }

  return (
    <>
      <NextSeo title="Mascaramento de PII - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Mascaramento de dados pessoais para a IA"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Mascaramento de PII', href: '/configurations/data-masking/' },
            ]}
          />

          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Como funciona"
            description="With this on for a server, everything the AI tools read from it passes through a filter before reaching the AI provider: e-mail, CPF, CNPJ, NIF/NISS (PT), IBAN, credit card (Luhn), phone and IP are replaced by labels ([CPF], [EMAIL]…). The AI still knows a value was there, without seeing it — which is what lets regulated customers (banking, healthcare) use cloud models at all. One caveat: tool output is mostly numeric metrics, so turn this on only for servers holding sensitive data — a nine-digit metric can be redacted as [NIF]. The global default comes from AI_MASK_PII_DEFAULT."
          />

          {renderBody()}
        </PageContent>
      </Layout>
    </>
  )
}

export default DataMasking
