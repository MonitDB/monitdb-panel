'use client'
import { useRegisterActions } from 'kbar'
import { useRouter } from 'next/router'

import { useGlobal, useUser } from '~/hooks/index'
import {
  FeatureFunction,
  hasPermission,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

export default function KBarActions({ currentQuery }) {
  const router = useRouter()
  const { userState: user } = useUser()
  const {
    globalState: { servers },
  } = useGlobal()

  const dynamicResults =
    currentQuery.length > 2
      ? [
          {
            id: 'search-query',
            name: `Ask to MonitAI "${currentQuery}"`,
            subtitle: 'Press enter to search',
            keywords: currentQuery,
            parent: 'search',
            shortcut: ['enter'],
            perform: () => {
              const query64 = Buffer.from(currentQuery).toString('base64')
              router.push(`/monit-ai/new?query=${query64}`)
            },
          },
        ]
      : []

  const dashboardActions = servers.flatMap((server) => [
    {
      id: `${server.id}-History`,
      name: `History of ${server.serverName}`,
      subtitle: 'View history',
      parent: server.id,
      perform: () => router.push(`/dashboard/${server.id}?tab=history`),
      keywords: server.serverName,
    },
    {
      id: `${server.id}-Query`,
      name: ` Run query on ${server.serverName}`,
      subtitle: 'Run queries',
      parent: server.id,
      perform: () => router.push(`/dashboard/${server.id}?tab=query-window`),
      keywords: server.serverName,
      hasPermission: hasPermission(
        user,
        FeatureFunction.QUERY_WINDOWS_FOR_QUERY_EXECUTION,
        TypeGrant.EXECUTE
      ),
    },
    {
      id: `${server.id}-Current-activity`,
      name: `Current Activity of ${server.serverName} `,
      subtitle: 'View current activity',
      parent: server.id,
      perform: () =>
        router.push(`/dashboard/${server.id}?tab=current-activity`),
      keywords: server.serverName,
      hasPermission: hasPermission(
        user,
        FeatureFunction.WHO_IS_ACTIVE,
        TypeGrant.EXECUTE
      ),
    },
    {
      id: `${server.id}-Tuning-advisor`,
      name: `Tuning Advisor of ${server.serverName} `,
      subtitle: 'View tuning advisor',
      parent: server.id,
      perform: () => router.push(`/dashboard/${server.id}?tab=tuning-advisor`),
      keywords: server.serverName,
      hasPermission: hasSomePermissions(
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
  ])

  const alertsActions = servers.map((server) => ({
    id: `${server.id}-alerts`,
    name: `Alerts of ${server.serverName}`,
    subtitle: 'View active alerts',
    parent: server.id,
    perform: () => router.push(`/alerts/results/?server=${server.id}`),
    keywords: server.serverName,
  }))

  const reportsActions = servers.map((server) => ({
    id: `${server.id}-reports`,
    name: ` Reports of ${server.serverName}`,
    subtitle: 'View reports',
    parent: server.id,
    perform: () => router.push(`/reports/results/?server=${server.id}`),
    keywords: server.serverName,
  }))

  const analisysActions = servers.map((server) => ({
    id: `${server.id}-analysis`,
    name: ` Analysis of ${server.serverName}`,
    subtitle: 'Make analysis of server',
    parent: server.id,
    perform: () => router.push(`/analysis/?server=${server.id}`),
    keywords: server.serverName,
  }))

  const states = [
    {
      id: 'installed-versions',
      name: 'Installed Versions',
      subtitle: 'View installed versions',
    },
    { id: 'disk-usage', name: 'Disk Usage', subtitle: 'View disk usage' },
    {
      id: 'capacity-plan',
      name: 'Capacity Plan',
      subtitle: 'View capacity plan',
    },
    { id: 'backups', name: 'Backups', subtitle: 'View backups' },
    { id: 'sql-agent-jobs', name: 'Jobs', subtitle: 'View jobs' },
  ].map(({ id, name, subtitle }) => ({
    id: `states-${id}`,
    name,
    subtitle,
    parent: 'states',
    perform: () => router.push(`/states/?tab=${id}`),
    keywords: name.toLowerCase(),
  }))

  const configurations = [
    {
      id: 'configurations',
      name: 'Configurations',
      subtitle: 'View configurations',
    },
    {
      id: 'installation-wizard',
      name: 'Installation Wizard',
      subtitle: 'View installation wizard',
      parent: 'configurations',
      perform: () => router.push('/configurations/installation-wizard'),
    },
    {
      id: 'update-new-version',
      name: 'Update New Version',
      subtitle: 'View update new version',
      parent: 'configurations',
      perform: () => router.push('/configurations/update-new-version'),
    },
    {
      id: 'servers',
      name: 'Servers',
      subtitle: 'View servers',
      parent: 'configurations',
      perform: () => router.push('/configurations/servers'),
    },
    {
      id: 'profiles',
      name: 'Profiles',
      subtitle: 'View profiles',
      parent: 'configurations',
      perform: () => router.push('/configurations/profiles'),
    },
    {
      id: 'users',
      name: 'Users',
      subtitle: 'View users',
      parent: 'configurations',
      perform: () => router.push('/configurations/users'),
    },
    {
      id: 'components',
      name: 'Components',
      subtitle: 'View components',
      parent: 'configurations',
      perform: () => router.push('/configurations/components'),
    },
    {
      id: 'logs',
      name: 'Logs',
      subtitle: 'View logs',
      parent: 'configurations',
      perform: () => router.push('/configurations/logs'),
    },
    {
      id: 'integration',
      name: 'Integration',
      subtitle: 'View available integrations',
      parent: 'configurations',
      keywords: 'integration',
      perform: () => router.push('/configurations/integrations'),
    },
    {
      id: 'AI Configurations',
      name: 'AI Configurations',
      subtitle: 'View AI configurations',
      parent: 'configurations',
      keywords: 'AI configurations',
      perform: () => router.push('/configurations/monit-ai-config'),
    },
  ]

  useRegisterActions(
    [
      {
        id: 'search',
        name: 'Search',
        keywords: 'pesquisar buscar',
      },
      {
        id: 'dashboard',
        name: 'Go to Dashboard',
        shortcut: ['h'],
        keywords: 'dashboard home',

        perform: () => router.push('/'),
      },
      {
        id: 'states',
        name: 'States',
        keywords: 'states',
      },
      ...servers.map((server) => ({
        id: `${server.id}`,
        name: `${server.serverName}`,
        // perform: () => router.push(`/dashboard/${server.id}`),
        keywords: server.serverName,
      })),
      {
        id: 'integrations',
        name: 'Integrations',
        subtitle: 'Run integrations',
        keywords: 'integration',
        perform: () => router.push('/integrations'),
      },
      ...dashboardActions,
      ...dynamicResults,
      ...states,
      ...alertsActions,
      ...reportsActions,
      ...analisysActions,
      ...configurations,
    ],
    [router, dynamicResults]
  )

  return <></>
}
