import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import Grid from '~/components/grid'
import Link from '~/components/link'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import {
  existsSomePermissions,
  Feature,
  FeatureFunction,
  hasFeature,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

// eslint-disable-next-line sonarjs/cognitive-complexity
const ConfigurationsPage = () => {
  const router = useRouter()
  const { userState: user } = useUser()
  useEffect(() => {
    if (!hasFeature(user, Feature.CONFIGURATION) && user) {
      router.push('/403')
    }
  }, [router, user])

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
                  <h3 className="mb-5 heading-md">Application options</h3>
                  <ul className="space-y-4 text-sm">
                    <li>
                      <Link
                        href="/configurations/installation-wizard"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Installation Wizard
                        </strong>
                        <span className="group-hover:opacity-75">
                          Setup and install new severs.
                        </span>
                      </Link>
                    </li>
                    <li className="">
                      <Link
                        href="/configurations/update-new-version"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Update new versions
                        </strong>
                        <span className="group-hover:opacity-75">
                          Upload SQL file with the lastests updates.
                        </span>
                      </Link>
                    </li>

                    {hasPermission(
                      user,
                      FeatureFunction.MONITORED_SERVERS,
                      TypeGrant.OWNER
                    ) && (
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
                    )}
                    <li>
                      <Link
                        href="/configurations/profiles"
                        className="group block"
                      >
                        <strong className="block group-hover:text-blue">
                          Manage profiles
                        </strong>
                        <span className="group-hover:opacity-75">
                          Configure the permissions of each profile
                        </span>
                      </Link>
                    </li>
                    {hasPermission(
                      user,
                      FeatureFunction.USER_MANAGEMENT,
                      TypeGrant.DELETE
                    ) && (
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
                    )}

                    {hasPermission(
                      user,
                      FeatureFunction.AUTHENTICATION_SETTINGS,
                      TypeGrant.OWNER
                    ) && (
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
                    )}

                    {hasPermission(
                      user,
                      FeatureFunction.DISPLAY_SETTINGS,
                      TypeGrant.EXECUTE
                    ) && (
                      <li className="">
                        <Link
                          href="/configurations/display-settings"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            Display settings
                          </strong>
                          <span className="group-hover:opacity-75">
                            Set user display preferences for MonitDB.
                          </span>
                        </Link>
                      </li>
                    )}
                    {hasPermission(
                      user,
                      FeatureFunction.BASIC_MONITOR_CONNECTIONS
                    ) && (
                      <li className="opacity-25">
                        <Link href="/configurations/" className="group block">
                          <strong className="block group-hover:text-blue">
                            Base monitor connections
                          </strong>
                          <span className="group-hover:opacity-75">
                            View details of your base monitor connections;
                            connect to different base monitors.
                          </span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>

                {existsSomePermissions(user, [
                  FeatureFunction.ALERT_SETTINGS,
                  FeatureFunction.NOTIFICATION_SETTINGS,
                  FeatureFunction.CUSTOM_METRICS,
                  FeatureFunction.ALERT_SUPPRESSION,
                ]) && (
                  <div className="w-full">
                    <h3 className="mb-5 heading-md">Alerts and metrics</h3>

                    <ul className="space-y-4 text-sm">
                      {hasPermission(
                        user,
                        FeatureFunction.ALERT_SETTINGS,
                        TypeGrant.DELETE
                      ) && (
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
                      )}
                      {hasPermission(
                        user,
                        FeatureFunction.CUSTOM_METRICS,
                        TypeGrant.DELETE
                      ) && (
                        <li>
                          <Link href="/alerts/metrics/" className="group block">
                            <strong className="block group-hover:text-blue">
                              Custom metrics
                            </strong>
                            <span className="group-hover:opacity-75">
                              Create and manage custom metrics and custom
                              alerts.
                            </span>
                          </Link>
                        </li>
                      )}
                      {hasPermission(
                        user,
                        FeatureFunction.NOTIFICATION_SETTINGS,
                        TypeGrant.EXECUTE
                      ) && (
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
                      )}

                      {hasPermission(
                        user,
                        FeatureFunction.ALERT_SUPPRESSION,
                        TypeGrant.DELETE
                      ) && (
                        <li className="opacity-25">
                          <Link href="/configurations/" className="group block">
                            <strong className="block group-hover:text-blue">
                              Alert suppression
                            </strong>
                            <span className="group-hover:opacity-75">
                              Create scheduled or one-off alert suppression
                              windows (formerly maintenance windows).
                            </span>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {existsSomePermissions(user, [
                  FeatureFunction.AUTHENTICATION_TOKENS,
                  FeatureFunction.DOWNLOAD_POWERSHELL_MODULE,
                  FeatureFunction.SEE_POWERSHELL_SCRIPT_EXAMPLES,
                  FeatureFunction.MANAGE_INTEGRATIONS,
                ]) && (
                  <div className="w-full">
                    <h3 className="mb-5 heading-md">API</h3>

                    <ul className="space-y-4 text-sm">
                      {hasPermission(
                        user,
                        FeatureFunction.MANAGE_INTEGRATIONS,
                        TypeGrant.WRITE
                      ) && (
                        <li className="opacity-100">
                          <Link
                            href="/configurations/integrations"
                            className="group block"
                          >
                            <strong className="block group-hover:text-blue">
                              Integrations
                            </strong>
                            <span className="group-hover:opacity-75">
                              Add or edit integrations
                            </span>
                          </Link>
                        </li>
                      )}

                      <li className="opacity-100">
                        <Link
                          href="/configurations/monit-ai-config"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            Ai Configuration
                          </strong>
                          <span className="group-hover:opacity-75">
                            Add or edit monit ai configuration
                          </span>
                        </Link>
                      </li>

                      <li className="opacity-100">
                        <Link
                          href="/configurations/monit-ai-skills"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            AI Skills
                          </strong>
                          <span className="group-hover:opacity-75">
                            Criar e editar skills (tools) da IA
                          </span>
                        </Link>
                      </li>

                      <li className="opacity-100">
                        <Link
                          href="/configurations/monit-ai-secrets"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            AI Secrets
                          </strong>
                          <span className="group-hover:opacity-75">
                            Chaves/credenciais da IA (ex.: embedding)
                          </span>
                        </Link>
                      </li>

                      <li className="opacity-100">
                        <Link
                          href="/configurations/monit-ai-training"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            Ai Training material
                          </strong>
                          <span className="group-hover:opacity-75">
                            Add training material for monit ai
                          </span>
                        </Link>
                      </li>

                      <li className="opacity-100">
                        <Link
                          href="/configurations/monit-ai-audit"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            Auditoria da IA
                          </strong>
                          <span className="group-hover:opacity-75">
                            Queries executadas pela IA (compliance)
                          </span>
                        </Link>
                      </li>

                      <li className="opacity-100">
                        <Link
                          href="/configurations/webhooks"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            Webhooks de Alerta
                          </strong>
                          <span className="group-hover:opacity-75">
                            Slack/Teams/genérico — alertas e insights da IA
                          </span>
                        </Link>
                      </li>

                      <li className="opacity-100">
                        <Link
                          href="/configurations/data-masking"
                          className="group block"
                        >
                          <strong className="block group-hover:text-blue">
                            Mascaramento de PII (IA)
                          </strong>
                          <span className="group-hover:opacity-75">
                            Redigir dados pessoais na saída das tools por servidor
                          </span>
                        </Link>
                      </li>

                      {hasPermission(
                        user,
                        FeatureFunction.SSH_TERMINAL,
                        TypeGrant.WRITE
                      ) && (
                        <li className="opacity-100">
                          <Link
                            href="/configurations/ssh-hosts"
                            className="group block"
                          >
                            <strong className="block group-hover:text-blue">
                              Hosts SSH
                            </strong>
                            <span className="group-hover:opacity-75">
                              Gerir hosts e credenciais do Terminal SSH (cifradas)
                            </span>
                          </Link>
                        </li>
                      )}

                      {hasPermission(
                        user,
                        FeatureFunction.SSH_TERMINAL,
                        TypeGrant.DELETE
                      ) && (
                        <li className="opacity-100">
                          <Link
                            href="/configurations/ssh-audit"
                            className="group block"
                          >
                            <strong className="block group-hover:text-blue">
                              Auditoria SSH
                            </strong>
                            <span className="group-hover:opacity-75">
                              Sessões e comandos do Terminal SSH (compliance)
                            </span>
                          </Link>
                        </li>
                      )}

                      {hasPermission(
                        user,
                        FeatureFunction.REMOTE_DESKTOP,
                        TypeGrant.WRITE
                      ) && (
                        <li className="opacity-100">
                          <Link
                            href="/configurations/remote-hosts"
                            className="group block"
                          >
                            <strong className="block group-hover:text-blue">
                              Hosts remotos (RDP/VNC)
                            </strong>
                            <span className="group-hover:opacity-75">
                              Gerir hosts e credenciais do Desktop remoto (cifradas)
                            </span>
                          </Link>
                        </li>
                      )}

                      {hasPermission(
                        user,
                        FeatureFunction.REMOTE_DESKTOP,
                        TypeGrant.DELETE
                      ) && (
                        <li className="opacity-100">
                          <Link
                            href="/configurations/remote-audit"
                            className="group block"
                          >
                            <strong className="block group-hover:text-blue">
                              Auditoria remota
                            </strong>
                            <span className="group-hover:opacity-75">
                              Sessões RDP/VNC e gravações (replay) para compliance
                            </span>
                          </Link>
                        </li>
                      )}

                      {hasPermission(
                        user,
                        FeatureFunction.AUTHENTICATION_TOKENS,
                        TypeGrant.OWNER
                      ) && (
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
                      )}
                      {hasPermission(
                        user,
                        FeatureFunction.DOWNLOAD_POWERSHELL_MODULE,
                        TypeGrant.EXECUTE
                      ) && (
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
                      )}
                      {hasPermission(
                        user,
                        FeatureFunction.SEE_POWERSHELL_SCRIPT_EXAMPLES,
                        TypeGrant.READ
                      ) && (
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
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="col-span-2 space-y-10 md:col-span-6">
                {existsSomePermissions(user, [
                  FeatureFunction.CUSTOM_METRICS,
                ]) && (
                  <div className="w-full">
                    <h3 className="mb-5 heading-md">Components</h3>
                    <ul className="space-y-4 text-sm">
                      {hasPermission(
                        user,
                        FeatureFunction.CUSTOM_METRICS,
                        TypeGrant.WRITE
                      )}
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
                )}

                <div className="w-full">
                  <h3 className="mb-5 heading-md">Monitoring</h3>
                  <ul className="space-y-4 text-sm">
                    {hasPermission(
                      user,
                      FeatureFunction.INSTANCE_DISCOVERY,
                      TypeGrant.EXECUTE
                    ) && (
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
                    )}

                    {hasPermission(
                      user,
                      FeatureFunction.HOSTS_AND_VMWARE,
                      TypeGrant.DELETE
                    ) && (
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
                    )}

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

                    {hasPermission(
                      user,
                      FeatureFunction.EXTENDED_EVENTS,
                      TypeGrant.WRITE
                    ) && (
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
                    )}

                    {hasPermission(
                      user,
                      FeatureFunction.GROUPS,
                      TypeGrant.DELETE
                    ) && (
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
                    )}
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

                {existsSomePermissions(user, [TypeGrant.ABOUT]) && (
                  <div className="w-full">
                    <h3 className="mb-5 heading-md">About</h3>
                    <ul className="space-y-4 text-sm">
                      {hasPermission(
                        user,
                        FeatureFunction.ABOUT,
                        TypeGrant.READ
                      ) && (
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
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </Grid>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsPage
