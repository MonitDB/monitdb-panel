import { Result, Tabs } from 'antd'
import { NextSeo } from 'next-seo'
import { memo, useEffect, useState } from 'react'

import RenderRundeck from '~/components/integration/RenderRundeck'
import RenderZabbix from '~/components/integration/RenderZabbix'
import Loading from '~/components/loading'
import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { listAllIntegrations } from '~/services/integration'

const MemoizedRenderRundeck = memo(RenderRundeck)
const MemoizedRenderZabbix = memo(RenderZabbix)

const RenderByType = {
  zabbix: MemoizedRenderZabbix,
  rundeck: MemoizedRenderRundeck,
}

const Integrations = () => {
  const [integrationsList, setIntegrations] = useState([])
  const [key, setKey] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAllIntegrations = async () => {
      try {
        setLoading(true)
        const data = await listAllIntegrations()
        setIntegrations(data)
      } catch {
        /* empty */
      }
      setLoading(false)
    }

    fetchAllIntegrations()
  }, [])

  return (
    <>
      <NextSeo title="Integrations - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader title="Integrations" />
          {loading && <Loading />}
          {integrationsList?.length > 0 && !loading && (
            <Tabs
              defaultActiveKey="1"
              tabPosition="left"
              onChange={setKey}
              style={{ height: 220 }}
              destroyInactiveTabPane={false}
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
          )}
          {integrationsList?.length === 0 && !loading && (
            <Result
              status="info"
              title="No Integrations Found"
              subTitle="There are currently no integrations available."
            />
          )}
        </PageContent>
      </Layout>
    </>
  )
}

export default Integrations
