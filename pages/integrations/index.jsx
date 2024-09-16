import { Tabs } from 'antd'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import RenderRundeck from '~/components/integration/RenderRundeck'
import RenderZabbix from '~/components/integration/RenderZabbix'
import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { listAllIntegrations } from '~/services/integration'

const RenderByType = {
  zabbix: RenderZabbix,
  rundeck: RenderRundeck,
}

const Integrations = () => {
  const [integrationsList, setIntegrations] = useState([])

  useEffect(() => {
    const fetchAllIntegrations = async () => {
      try {
        const data = await listAllIntegrations()
        setIntegrations(data)
      } catch {
        /* empty */
      }
    }

    fetchAllIntegrations()
  }, [])

  return (
    <>
      <NextSeo title="Integrations - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader title="Integrations" />
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            style={{ height: 220 }}
            items={integrationsList.map((integration) => {
              const IntegrationComponent =
                RenderByType[integration.type] || undefined
              return {
                label: integration.name,
                key: integration.id || integration.name,
                children: IntegrationComponent ? (
                  <IntegrationComponent id={integration.id} />
                ) : (
                  <div>Unknown integration type</div>
                ),
              }
            })}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default Integrations
