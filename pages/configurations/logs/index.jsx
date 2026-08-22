/* eslint-disable react-hooks/exhaustive-deps */

import { Tabs } from 'antd'
import { NextSeo } from 'next-seo'
import React from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import { ApiLogs } from '~/components/page/configurations/logs/api-log'
import { ComponentLogs } from '~/components/page/configurations/logs/component-log'
import { InstallationLog } from '~/components/page/configurations/logs/installation-log'
import Layout from '~/layouts/default'

const LogsPage = () => {
  return (
    <>
      <NextSeo title="Logs - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent
            className="border-b border-gray-light"
            removeSidebarMargin={true}
          >
            <PageHeader
              title="Logs"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations/',
                },
                {
                  title: 'Logs',
                  href: '/configurations/logs/',
                },
              ]}
            />
          </PageContent>
          <PageContent removeSidebarMargin={true}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: '1',
                  label: 'Components',
                  children: <ComponentLogs />,
                },
                {
                  key: '2',
                  label: 'API',
                  children: <ApiLogs />,
                },
                {
                  key: '3',
                  label: 'Installation History',
                  children: <InstallationLog />,
                },
              ]}
            />
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default LogsPage
