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
    { title: 'Servidor', dataIndex: 'serverName', key: 'serverName' },
    {
      title: 'Ambiente',
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
            description="Quando ligado para um servidor, todo dado que as ferramentas da IA leem desse servidor passa por um filtro antes de ir ao provedor de IA: e-mail, CPF, CNPJ, NIF/NISS (PT), IBAN, cartão de crédito (Luhn), telefone e IP são substituídos por etiquetas ([CPF], [EMAIL]…). A IA entende que ali havia um dado, sem ver o valor — o que desbloqueia o uso de modelos em nuvem por clientes regulados (banco/saúde). Observação: como a saída das tools é principalmente métrica numérica, ative apenas nos servidores com dados sensíveis (um número de métrica com 9 dígitos pode ser redigido como [NIF]). O default global é controlado pela variável AI_MASK_PII_DEFAULT."
          />

          {renderBody()}
        </PageContent>
      </Layout>
    </>
  )
}

export default DataMasking
