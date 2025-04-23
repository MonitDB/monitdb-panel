/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */

import { Col, Row, Tabs } from 'antd'
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

console.log('s')

const SingleDashboard = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const dashboardSections = []

  const { userState: user } = useUser()

  const [activeTabId, setActiveTabId] = useState('0')

  const router = useRouter()

  hasPermission(
    user,
    FeatureFunction.BLOCKING_PROCESS_TOP_10_BY_TIME,
    TypeGrant.READ
  ) &&
    dashboardSections.push({
      name: 'Blocking processes',
      slug: 'blocking-processes',
      index: 5,
    })

  hasPermission(
    user,
    FeatureFunction.SQL_USER_PROCESSES_TOP_10_BY_CPU,
    TypeGrant.READ
  ) &&
    dashboardSections.push({
      name: 'SQL user processes',
      slug: 'sqlprocesses',
      index: 6,
    })

  hasPermission(user, FeatureFunction.ERROR_LOG, TypeGrant.READ) &&
    dashboardSections.push({ name: 'Error log', slug: 'error-log', index: 7 })

  hasPermission(user, FeatureFunction.PERMISSIONS, TypeGrant.READ) &&
    dashboardSections.push({
      name: 'Permissions',
      slug: 'permissions',
      index: 4,
    })

  hasSomePermissions(
    user,
    [
      FeatureFunction.TEMPDB_DATABASE,
      FeatureFunction.TEMPDB_LOGIN,
      FeatureFunction.TEMPDB_PROGRAM,
      FeatureFunction.TEMPDB_SESSION,
      FeatureFunction.TEMPDB_USAGE_SUMMARY,
    ],
    TypeGrant.READ
  ) && dashboardSections.push({ name: 'TEMPDB', slug: 'tempdb', index: 3 })

  hasPermission(user, FeatureFunction.DATABASES, TypeGrant.READ) &&
    dashboardSections.push({ name: 'Databases', slug: 'databases', index: 2 })

  hasSomePermissions(
    user,
    [
      FeatureFunction.SQL_SERVER_METRICS_BATCH_REQUESTS,
      FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_BATCH_REQUESTS,
      FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_BATCH_REQUESTS,
      FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_SEC,
      FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_SEC,
      FeatureFunction.SQL_SERVER_METRICS_FULL_SCANS_SEC,
      FeatureFunction.SQL_SERVER_METRICS_USER_CONNECTIONS,
      FeatureFunction.LATCHES_AND_LOCKS_AVG_LATCH_WAIT,
      FeatureFunction.LATCHES_AND_LOCKS_LOCKS_TIMEOUTS_SEC,
      FeatureFunction.LATCHES_AND_LOCKS_LOCKS_WAITS_SEC,
    ],
    TypeGrant.READ
  ) &&
    dashboardSections.push({
      name: 'SQL Server metrics',
      slug: 'sql-server-metrics',
      index: 1,
    })

  hasSomePermissions(
    user,
    [FeatureFunction.CPU, FeatureFunction.MEMORY],
    TypeGrant.READ
  ) &&
    dashboardSections.push({
      name: 'Server/host metrics',
      slug: 'allinstancemetrics',
      index: 0,
    })

  dashboardSections.sort((a, b) => a.index - b.index)

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
        TypeGrant.EXECUTE
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
              {activeTabId === '0' &&
                hasPermission(
                  user,
                  FeatureFunction.SCROLL_BAR,
                  TypeGrant.READ
                ) && (
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
