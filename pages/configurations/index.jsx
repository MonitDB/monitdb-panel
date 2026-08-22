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

// Reorganized in 2.2.7: sections grouped by domain, English labels, every card
// points to a real page (no placeholders). Each card's `visible` gate mirrors the
// permission the target page itself enforces, so nobody loses a working link.
const grant = (featureFunction, typeGrant) => (user) =>
  hasPermission(user, featureFunction, typeGrant)
const anyGrant = (featureFunctions) => (user) =>
  existsSomePermissions(user, featureFunctions)

const LEFT_SECTIONS = [
  {
    title: 'Servers & collection',
    items: [
      {
        title: 'Monitored servers',
        description:
          'Add servers to monitor; edit connection credentials; remove or suspend monitored servers.',
        href: '/configurations/servers/',
        visible: grant(FeatureFunction.MONITORED_SERVERS, TypeGrant.OWNER),
      },
      {
        title: 'Install the agent (new server)',
        description:
          'Installation wizard: creates the MonitorizacaoAtiva database, procedures and collection jobs on a new server, with live progress.',
        href: '/configurations/installation-wizard',
      },
      {
        title: 'Update the agent on servers',
        description:
          'Upload the SQL script with the latest agent updates and run it on the selected servers.',
        href: '/configurations/update-new-version',
      },
      {
        title: 'Health thresholds (dashboard status)',
        description:
          'CPU, disk and memory thresholds that color the server cards — global default plus per-server override.',
        href: '/configurations/health-thresholds/',
        visible: grant(FeatureFunction.MONITORED_SERVERS, TypeGrant.OWNER),
      },
    ],
  },
  {
    title: 'Alerts & notifications',
    items: [
      {
        title: 'Alerts',
        description:
          'Open the Alerts page: alerts by server, details, clearing and AI suggestions.',
        href: '/alerts/',
        visible: grant(FeatureFunction.ALERT_SETTINGS, TypeGrant.DELETE),
      },
      {
        title: 'Alert parameters per server',
        description:
          'Thresholds and settings of the agent alerts, server by server.',
        href: '/alerts/metrics/',
        visible: grant(FeatureFunction.ALERTS_CUSTOMIZATION, TypeGrant.READ),
      },
      {
        title: 'Alert webhooks (Slack / Teams)',
        description:
          'Destinations for alerts and AI insights by minimum severity — Slack, Teams or generic webhook.',
        href: '/configurations/webhooks',
        visible: anyGrant([FeatureFunction.MANAGE_INTEGRATIONS]),
      },
    ],
  },
  {
    title: 'Monit AI',
    items: [
      {
        title: 'AI provider',
        description:
          'Provider, model, keys and prompt used by Monit AI (OpenAI, Azure, Copilot or LM Studio).',
        href: '/configurations/monit-ai-config',
        visible: grant(FeatureFunction.CONFIGURATION, TypeGrant.READ),
      },
      {
        title: 'AI skills',
        description:
          'Create and edit the SQL skills (tools) the AI can run on the monitored servers.',
        href: '/configurations/monit-ai-skills',
        visible: grant(FeatureFunction.CONFIGURATION, TypeGrant.READ),
      },
      {
        title: 'AI secrets',
        description: 'Keys and credentials used by the AI (e.g. embeddings).',
        href: '/configurations/monit-ai-secrets',
        visible: grant(FeatureFunction.CONFIGURATION, TypeGrant.READ),
      },
      {
        title: 'Training material (RAG)',
        description:
          'Documents, websites, audio and video indexed as knowledge for Monit AI.',
        href: '/configurations/monit-ai-training',
        visible: grant(FeatureFunction.CONFIGURATION, TypeGrant.READ),
      },
      {
        title: 'PII masking',
        description:
          'Redact personal data in tool output before it reaches the AI provider, per server.',
        href: '/configurations/data-masking',
        visible: grant(FeatureFunction.CONFIGURATION, TypeGrant.READ),
      },
      {
        title: 'AI audit',
        description: 'Queries executed by the AI (compliance trail).',
        href: '/configurations/monit-ai-audit',
        visible: grant(FeatureFunction.CONFIGURATION, TypeGrant.READ),
      },
    ],
  },
]

const RIGHT_SECTIONS = [
  {
    title: 'Remote access',
    items: [
      {
        title: 'SSH hosts',
        description:
          'Hosts and credentials (encrypted) for the SSH terminal and SFTP file browser.',
        href: '/configurations/ssh-hosts',
        visible: grant(FeatureFunction.SSH_TERMINAL, TypeGrant.WRITE),
      },
      {
        title: 'SSH audit',
        description: 'Sessions and commands of the SSH terminal (compliance).',
        href: '/configurations/ssh-audit',
        visible: grant(FeatureFunction.SSH_TERMINAL, TypeGrant.DELETE),
      },
      {
        title: 'Remote desktop hosts (RDP / VNC)',
        description:
          'Hosts and credentials (encrypted) for the remote desktop sessions.',
        href: '/configurations/remote-hosts',
        visible: grant(FeatureFunction.REMOTE_DESKTOP, TypeGrant.WRITE),
      },
      {
        title: 'Remote desktop audit',
        description:
          'RDP/VNC sessions and recordings (replay) for compliance.',
        href: '/configurations/remote-audit',
        visible: grant(FeatureFunction.REMOTE_DESKTOP, TypeGrant.DELETE),
      },
    ],
  },
  {
    title: 'Integrations',
    items: [
      {
        title: 'Integrations (Zabbix / Rundeck)',
        description:
          'Register and edit external integrations; run them from the Integrations menu.',
        href: '/configurations/integrations',
        visible: grant(FeatureFunction.MANAGE_INTEGRATIONS, TypeGrant.WRITE),
      },
    ],
  },
  {
    title: 'Users & permissions',
    items: [
      {
        title: 'Users',
        description: 'Create, edit and deactivate users; assign their profile.',
        href: '/configurations/users',
        visible: grant(FeatureFunction.USER_MANAGEMENT, TypeGrant.OWNER),
      },
      {
        title: 'Profiles & permissions',
        description:
          'Profiles (roles) and the permission level of each feature per profile.',
        href: '/configurations/profiles',
      },
      {
        title: 'My account',
        description:
          'Your user details and display preferences (theme, font).',
        href: '/my-account/',
      },
    ],
  },
  {
    title: 'Organization & system',
    items: [
      {
        title: 'Organization details',
        description:
          'Company name, contact, address and logo shown in the panel.',
        href: '/configurations/display-settings',
        visible: grant(FeatureFunction.DISPLAY_SETTINGS, TypeGrant.EXECUTE),
      },
      {
        title: 'Screen components (advanced)',
        description:
          'Queries and URLs that feed the panel screens. Editing them changes what the screens show.',
        href: '/configurations/components/',
        visible: anyGrant([FeatureFunction.CUSTOM_METRICS]),
      },
      {
        title: 'Logs & diagnostics',
        description:
          'Component logs, API request log and agent installation history.',
        href: '/configurations/logs/',
        visible: anyGrant([FeatureFunction.CUSTOM_METRICS]),
      },
    ],
  },
]

const visibleSections = (sections, user) =>
  sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.visible ? item.visible(user) : true
      ),
    }))
    .filter((section) => section.items.length > 0)

const ConfigurationSection = ({ section }) => (
  <div className="w-full">
    <h3 className="mb-5 heading-md">{section.title}</h3>
    <ul className="space-y-4 text-sm">
      {section.items.map((item) => (
        <li key={item.href + item.title}>
          <Link href={item.href} className="group block">
            <strong className="block group-hover:text-blue">
              {item.title}
            </strong>
            <span className="group-hover:opacity-75">{item.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

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
                {visibleSections(LEFT_SECTIONS, user).map((section) => (
                  <ConfigurationSection key={section.title} section={section} />
                ))}
              </div>
              <div className="col-span-2 space-y-10 md:col-span-6">
                {visibleSections(RIGHT_SECTIONS, user).map((section) => (
                  <ConfigurationSection key={section.title} section={section} />
                ))}
              </div>
            </Grid>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsPage
