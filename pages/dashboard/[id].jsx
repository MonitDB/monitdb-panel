/* eslint-disable no-console */

import classNames from 'classnames'
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
import { History } from '~/components/page/dashboard/history'
import { TuningAdvisor } from '~/components/page/dashboard/tuning-advisor'
import { ServerInfo } from '~/components/page/server-info'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import { SingleDashboardContextProvider } from '~/contexts/single-dashboard'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { scrollToSection } from '~/utils/global'
import { formatServer } from '~/utils/server'

export const labels = Array.from({ length: 60 }, (_, index) => `8:${index}`)

export const tableDataItems = labels.map(() => ({
  title: `SELECT user_id FROM ${faker.random.word()} WHERE meta_key = '${faker.random.word()}'`,
}))

const dashboardSections = [
  { name: 'Server/host metrics', slug: 'allinstancemetrics' },
  { name: 'TEMPDB', slug: 'tempdb' },
  { name: 'Blocking processes', slug: 'blocking-processes' },
  { name: 'SQL user processes', slug: 'sqlprocesses' },
  { name: 'Processes', slug: 'processes' },
  { name: 'Error log', slug: 'error-log' },
  { name: 'Databases', slug: 'databases' },
]

const tabItems = [
  {
    title: 'History',
    id: 'history',
  },
  {
    title: 'Current activity',
    id: 'current-activity',
  },
  {
    title: 'Tuning Advisor',
    id: 'tuning-advisor',
  },
]

const SingleDashboard = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const [activeTabId, setActiveTabId] = useState(tabItems[0]['id'])

  const router = useRouter()

  const currentServer = useMemo(() => {
    const server = servers.find((server) => server.id === +router?.query?.id)

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.id])

  return (
    <SingleDashboardContextProvider>
      <NextSeo title="Dashboard - MonitDB" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <LatestAlertsSidebar />
            {activeTabId === 'history' && (
              <PageSidebarLinksList className="mt-5">
                {dashboardSections.map((section, sectionIndex) => (
                  <li key={section.slug}>
                    <button
                      onClick={() => scrollToSection(`#${section.slug}`)}
                      className={classNames({
                        active: sectionIndex === 0,
                      })}
                    >
                      {section.name}
                    </button>
                  </li>
                ))}
              </PageSidebarLinksList>
            )}
          </PageSidebar>
          <PageContent hideBreadcrumbs={true}>
            {!currentServer && <Loading />}
            {currentServer && (
              <>
                <div className="w-full flex flex-col gap-y-6">
                  <header className="w-full">
                    <h2 className="heading-lg mb-6">Dashboard - Overview</h2>
                  </header>
                  <ServerInfo currentServer={currentServer} />
                  {/* <div className="w-full flex items-center gap-4 py-2 px-4 border border-orange border-opacity-25 bg-orange bg-opacity-10 text-sm">
                    <div className="flex items-center justify-center w-16 h-16">
                      <FontAwesomeIcon
                        icon={faWarning}
                        className="text-4xl text-orange"
                      />
                    </div>
                    <div>
                      <h6 className="heading-xs">
                        SQL Server Reporting Service status (2017+): ssc-db-n1
                      </h6>
                      <p>
                        Raised at Wed, Oct 6 10:47 (Active for more than 427
                        days)
                      </p>
                    </div>
                  </div> */}
                </div>

                <div className="flex items-center border-b-gray-light border-b-4">
                  {tabItems.map((tab) => (
                    <button
                      className={classNames('px-2 h-11 relative', {
                        'after:content-[""] after:block after:bg-blue after:h-1 after:w-full after:absolute after:-bottom-1 after:left-0':
                          tab.id === activeTabId,
                      })}
                      key={tab.id}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>

                {activeTabId === 'history' && (
                  <History currentServer={currentServer} />
                )}

                {activeTabId === 'current-activity' && (
                  <CurrentActivity currentServer={currentServer} />
                )}
                {activeTabId === 'current-activity' && (
                  <CurrentActivity currentServer={currentServer} />
                )}
                {activeTabId === 'tuning-advisor' && (
                  <TuningAdvisor currentServer={currentServer} />
                )}
              </>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </SingleDashboardContextProvider>
  )
}

export default SingleDashboard
