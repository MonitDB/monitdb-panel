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
      name: `${server.serverName} - History`,
      subtitle: 'View history',
      parent: server.id,
      perform: () => router.push(`/dashboard/${server.id}?tab=history`),
      keywords: server.serverName,
    },
    {
      id: `${server.id}-Query`,
      name: `${server.serverName} - Query`,
      subtitle: 'View query',
      parent: server.id,
      perform: () => router.push(`/dashboard/${server.id}?tab=query`),
      keywords: server.serverName,
      hasPermission: hasPermission(
        user,
        FeatureFunction.QUERY_WINDOWS_FOR_QUERY_EXECUTION,
        TypeGrant.EXECUTE
      ),
    },
    {
      id: `${server.id}-Current-activity`,
      name: `${server.serverName} - Current Activity`,
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
      name: `${server.serverName} - Tuning Advisor`,
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
    name: `${server.serverName} - Alerts`,
    subtitle: 'View alerts',
    parent: server.id,
    perform: () => router.push(`/alerts/results/?server=${server.id}`),
    keywords: server.serverName,
  }))

  const reportsActions = servers.map((server) => ({
    id: `${server.id}-reports`,
    name: `${server.serverName} - Reports`,
    subtitle: 'View reports',
    parent: server.id,
    perform: () => router.push(`/reports/results/?server=${server.id}`),
    keywords: server.serverName,
  }))

  const analisysActions = servers.map((server) => ({
    id: `${server.id}-analysis`,
    name: `${server.serverName} - Analysis`,
    subtitle: 'View analysis',
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
    { id: 'jobs', name: 'Jobs', subtitle: 'View jobs' },
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
      group: 'configurations',
      perform: () => router.push('/configurations/installation-wizard'),
    },
    {
      id: 'update-new-version',
      name: 'Update New Version',
      subtitle: 'View update new version',
      group: 'configurations',
      perform: () => router.push('/configurations/update-new-version'),
    },
    {
      id: 'servers',
      name: 'Servers',
      subtitle: 'View servers',
      group: 'configurations',
      perform: () => router.push('/configurations/servers'),
    },
    {
      id: 'profiles',
      name: 'Profiles',
      subtitle: 'View profiles',
      group: 'configurations',
      perform: () => router.push('/configurations/profiles'),
    },
    {
      id: 'users',
      name: 'Users',
      subtitle: 'View users',
      group: 'configurations',
      perform: () => router.push('/configurations/users'),
    },
    {
      id: 'alerts',
      name: 'Alerts',
      subtitle: 'View alerts',
      group: 'configurations',
      perform: () => router.push('/configurations/alerts'),
    },
    {
      id: 'components',
      name: 'Components',
      subtitle: 'View components',
      group: 'configurations',
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
      subtitle: 'View integrations',
      parent: 'configurations',
      keywords: 'integration',
      perform: () => router.push('/configurations/integration'),
    },
    {
      id: 'AI Configurations',
      name: 'AI Configurations',
      subtitle: 'View AI configurations',
      parent: 'configurations',
      keywords: 'AI configurations',
      perform: () => router.push('/configurations/ai-configurations'),
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
        group: 'dashboard',
        perform: () => router.push('/'),
      },
      {
        id: 'states',
        name: 'States',
        keywords: 'states',
      },
      ...servers.map((server) => ({
        id: server.id,
        name: `${server.serverName}`,
        perform: () => router.push(`/dashboard/${server.id}`),
        keywords: server.serverName,
      })),
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
