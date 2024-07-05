/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */

import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Col, FloatButton, Modal, Row, Tabs } from 'antd'
import faker from 'faker'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from 'react'

import Loading from '~/components/loading'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageWrapper,
} from '~/components/page'
import CurrentActivity from '~/components/page/dashboard/current-activity'
import HistoryInfo from '~/components/page/dashboard/history-info'
import { ServerProperties } from '~/components/page/dashboard/history-info/components/server-host-metrics/server-metrics/server-properties'
import QueryWindow from '~/components/page/dashboard/query-window'
import { TuningAdvisor } from '~/components/page/dashboard/tuning-advisor'
import { ServerInfo } from '~/components/page/server-info'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import { SingleDashboardContextProvider } from '~/contexts/single-dashboard'
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { scrollToSection } from '~/utils/global'
import {
  Feature,
  FeatureFunction,
  hasFeature,
  hasPermission,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'
import { formatServer } from '~/utils/server'

export const labels = Array.from({ length: 60 }, (_, index) => `8:${index}`)

export const tableDataItems = labels.map(() => ({
  title: `SELECT user_id FROM ${faker.random.word()} WHERE meta_key = '${faker.random.word()}'`,
}))

const dashboardSections = [
  { name: 'Server/host metrics', slug: 'allinstancemetrics' },
  { name: 'SQL Server metrics', slug: 'sql-server-metrics' },
  { name: 'Databases', slug: 'databases' },
  { name: 'TEMPDB', slug: 'tempdb' },
  { name: 'Permissions', slug: 'permissions' },
  { name: 'Blocking processes', slug: 'blocking-processes' },
  { name: 'SQL user processes', slug: 'sqlprocesses' },
  { name: 'Error log', slug: 'error-log' },
]

const SingleDashboard = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()
  const { userState: user } = useUser()

  const [activeTabId, setActiveTabId] = useState('0')

  const router = useRouter()

  useEffect(() => {
    if (!hasFeature(user, Feature.DASHBOARD) && user.grants) router.push('/403')
  }, [router, user])

  const currentServer = useMemo(() => {
    const server = servers.find((server) => server.id === +router?.query?.id)

    if (!server) return
    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.id])

  const items = [
    {
      key: '0',
      label: 'History',
      children: <HistoryInfo currentServer={currentServer} />,
      render: true,
    },
    {
      key: '1',
      label: 'Query Window',
      children: <QueryWindow currentServer={currentServer} />,
      render: hasPermission(
        user,
        FeatureFunction.QUERY_WINDOWS_FOR_QUERY_EXECUTION,
        TypeGrant.EXECUTE
      ),
    },
    {
      key: '2',
      label: 'Current Activity',
      children: <CurrentActivity currentServer={currentServer} />,
      render: hasPermission(
        user,
        FeatureFunction.WHO_IS_ACTIVE,
        TypeGrant.EXECUTE
      ),
    },
    {
      key: '3',
      label: 'Tuning Advisor',
      children: <TuningAdvisor currentServer={currentServer} />,
      render: hasSomePermissions(
        user,
        [
          FeatureFunction.SP_BLITZ,
          FeatureFunction.SP_BLITZ_ANALYSIS,
          FeatureFunction.SP_BLITZ_BACKUP,
          FeatureFunction.SP_BLITZ_CACHE,
          FeatureFunction.SP_BLITZ_FIRST,
          FeatureFunction.SP_BLITZ_INDEX,
          FeatureFunction.SP_BLITZ_INDEX,
          FeatureFunction.SP_BLITZ_QUERY_STORE,
          FeatureFunction.SP_BLITZ_WHO,
        ],
        TypeGrant.READ
      ),
    },
  ]

  try {
    return (
      <SingleDashboardContextProvider>
        <NextSeo title="Dashboard - MonitDB" />
        <Layout>
          <PageWrapper>
            <PageSidebar>
              <LatestAlertsSidebar />
              {activeTabId === '0' && (
                <PageSidebarLinksList className="mt-5">
                  {dashboardSections.map((section) => (
                    <li
                      key={section.slug}
                      style={{ width: '100%' }}
                      onClick={() => {
                        scrollToSection(`#${section.slug}`)
                      }}
                    >
                      <button>{section.name}</button>
                    </li>
                  ))}
                </PageSidebarLinksList>
              )}
            </PageSidebar>

            <PageContent hideBreadcrumbs={true}>
              <div>
                {!currentServer && <Loading />}
                {currentServer && (
                  <>
                    <Row gutter={14}>
                      <Col sm={12}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                          }}
                        >
                          <h2 className="heading-lg">Dashboard - Overview</h2>
                        </div>
                      </Col>
                      <Col sm={12}>
                        {hasPermission(
                          user,
                          FeatureFunction.SERVER_INFORMATION,
                          TypeGrant.READ
                        ) && <ServerInfo currentServer={currentServer} />}
                      </Col>
                    </Row>

                    <div className="flex items-center border-b-gray-light">
                      <Tabs
                        size="large"
                        defaultActiveKey="0"
                        items={items.filter((item) => item.render)}
                        onChange={setActiveTabId}
                        style={{ width: '100%', overflowX: 'hidden' }}
                      />
                    </div>
                  </>
                )}

                {hasPermission(
                  user,
                  FeatureFunction.SQL_PROPERTIES,
                  TypeGrant.READ
                ) && (
                  <FloatButton
                    icon={<ExclamationCircleOutlined />}
                    tooltip={'Server Properties'}
                    type="primary"
                    style={{ right: 24 }}
                    onClick={() => {
                      Modal.info({
                        title: 'Server Properties',
                        width: '80vw',
                        content: (
                          <>
                            <ServerProperties />
                          </>
                        ),
                      })
                    }}
                  />
                )}
              </div>
            </PageContent>
          </PageWrapper>
        </Layout>
      </SingleDashboardContextProvider>
    )
  } catch {
    router.push('/dashboard')
  }
}

export default SingleDashboard
