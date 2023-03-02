import { NextSeo } from 'next-seo'
import React from 'react'

import Grid from '~/components/grid'
import Link from '~/components/link'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const ConfigurationsPage = () => {
  return (
    <>
      <NextSeo title="Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader title="Configurations" />

            <Grid>
              <div className="col-span-2 space-y-10 md:col-span-6">
                <div className="w-full">
                  <h3 className="mb-5 heading-md">Monitoring</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link
                        href="/configurations/servers/"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Monitored servers
                        </strong>
                        <span className="group-hover:opacity-75">
                          Add servers to monitor; edit connection credentials;
                          remove or suspend monitored servers.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Instance discovery
                        </strong>
                        <span className="group-hover:opacity-75">
                          Discover new instances across your estate.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          VMware hosts
                        </strong>
                        <span className="group-hover:opacity-75">
                          Configure VMware hosts for monitoring.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Trace
                        </strong>
                        <span className="group-hover:opacity-75">
                          Enable or disable Profiler trace on selected servers.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Extended Events
                        </strong>
                        <span className="group-hover:opacity-75">
                          Enable or disable extended events for advanced
                          alerting.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Groups
                        </strong>
                        <span className="group-hover:opacity-75">
                          Organize your monitored servers into groups.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Application options</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Authentication settings
                        </strong>
                        <span className="group-hover:opacity-75">
                          Set authentication preferences for MonitDB.
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/configurations/users"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Manage users
                        </strong>
                        <span className="group-hover:opacity-75">
                          Manage users, roles and permissions.
                        </span>
                      </Link>
                    </li>
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Base monitor connections
                        </strong>
                        <span className="group-hover:opacity-75">
                          View details of your base monitor connections; connect
                          to different base monitors.
                        </span>
                      </Link>
                    </li>
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Display settings
                        </strong>
                        <span className="group-hover:opacity-75">
                          Set user display preferences for MonitDB.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">API</h3>

                  <ul className="space-y-4 text-sm">
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Authentication tokens
                        </strong>
                        <span className="group-hover:opacity-75">
                          Manage authentication tokens for MonitDB.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Download PowerShell Module
                        </strong>
                        <span className="group-hover:opacity-75">
                          Configure MonitDB via PowerShell.
                        </span>
                      </Link>
                    </li>
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          View example PowerShell scripts
                        </strong>
                        <span className="group-hover:opacity-75">
                          Download example PowerShell scripts for the API.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-span-2 space-y-10 md:col-span-6">
                <div className="w-full">
                  <h3 className="mb-5 heading-md">Alerts and metrics</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link href="/alerts/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Alert settings
                        </strong>
                        <span className="group-hover:opacity-75">
                          Enable and disable alert types; change alert
                          thresholds and levels.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Notification settings
                        </strong>
                        <span className="group-hover:opacity-75">
                          Set up and manage notifications for alerts
                          (Email/Slack/SNMP/Webhook/EventLog).
                        </span>
                      </Link>
                    </li>

                    <li>
                      <Link href="/alerts/metrics/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Custom metrics
                        </strong>
                        <span className="group-hover:opacity-75">
                          Create and manage custom metrics and custom alerts.
                        </span>
                      </Link>
                    </li>

                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Alert suppression
                        </strong>
                        <span className="group-hover:opacity-75">
                          Create scheduled or one-off alert suppression windows
                          (formerly maintenance windows).
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Components</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link
                        href="/configurations/components/"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Component settings
                        </strong>
                        <span className="group-hover:opacity-75">
                          Set up and manage component settings
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/configurations/logs/"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Logs
                        </strong>
                        <span className="group-hover:opacity-75">
                          View logs for MonitDB components.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Data Management</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          <i className="rounded py-px px-1 text-xs bg-blue text-white not-italic">
                            improved
                          </i>{' '}
                          Data settings
                        </strong>
                        <span className="group-hover:opacity-75">
                          Specify how long MonitDB keeps historic data in its
                          Data Repository.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Licensing</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          Licensing
                        </strong>
                        <span className="group-hover:opacity-75">
                          Allocate licenses to your servers.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="w-full">
                  <h3 className="mb-5 heading-md">About</h3>
                  <ul className="space-y-4 text-sm">
                    <li className="opacity-25">
                      <Link href="/configurations/" className="group block">
                        <strong className="block group-hover:text-blue">
                          About
                        </strong>
                        <span className="group-hover:opacity-75">
                          View information about MonitDB components.
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Grid>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsPage
