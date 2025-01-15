import { Button, Col, Result, Row, Tabs } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { memo, useEffect, useState } from 'react'

import RenderRundeck from '~/components/integration/RenderRundeck'
import RenderZabbix from '~/components/integration/RenderZabbix'
import Loading from '~/components/loading'
import { PageContent, PageHeader } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { listAllIntegrations } from '~/services/integration'
import {
  Feature,
  FeatureFunction,
  hasFeature,
  hasPermissions,
  TypeGrant,
} from '~/utils/hasPermission'

const MemoizedRenderRundeck = memo(RenderRundeck)
const MemoizedRenderZabbix = memo(RenderZabbix)

const RenderByType = {
  zabbix: MemoizedRenderZabbix,
  rundeck: MemoizedRenderRundeck,
}

const Integrations = () => {
  const { userState: user } = useUser()

  const [integrationsList, setIntegrations] = useState([])
  const [activeKey, setActiveKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const [refreshKeys, setRefreshKeys] = useState({})

  const router = useRouter()

  useEffect(() => {
    if (
      !hasPermissions(
        user,
        [FeatureFunction.READ_INTEGRATIONS],
        TypeGrant.READ
      ) &&
      user
    ) {
      router.push('/403')
      return
    }

    const fetchAllIntegrations = async () => {
      try {
        setLoading(true)
        const data = await listAllIntegrations()
        setIntegrations(data)
        if (data.length > 0) {
          setActiveKey(data[0].id)
        }
      } catch {
        /* empty */
      }
      setLoading(false)
    }

    fetchAllIntegrations()
  }, [router, user])

  const handleRefresh = (key) => {
    setRefreshKeys((previousKeys) => ({
      ...previousKeys,
      [key]: (previousKeys[key] || 0) + 1,
    }))
  }

  return (
    <>
      <NextSeo title="Integrations - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader title="Integrations" />
          {!loading && (
            <Row style={{ marginBottom: 20 }}>
              <Col offset={22}>
                <Button type="primary" onClick={() => handleRefresh(activeKey)}>
                  Refresh
                </Button>
              </Col>
            </Row>
          )}
          {loading && <Loading />}
          {integrationsList?.length > 0 && !loading && (
            <Tabs
              activeKey={activeKey}
              onChange={setActiveKey}
              tabPosition="left"
              style={{ height: 220 }}
              destroyInactiveTabPane={false}
              items={integrationsList.map((integration) => {
                const IntegrationComponent =
                  RenderByType[integration.type] || undefined
                const refreshKey = refreshKeys[integration.id] || 0
                return {
                  label: integration.name,
                  key: integration.id || integration.name,
                  children: IntegrationComponent ? (
                    <IntegrationComponent
                      id={integration.id}
                      key={refreshKey}
                    />
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
