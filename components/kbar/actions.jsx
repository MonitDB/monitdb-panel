'use client'
import { useRegisterActions } from 'kbar'
import { useRouter } from 'next/router'

import { useGlobal } from '~/hooks/index'

export default function KBarActions({ currentQuery }) {
  const router = useRouter()

  const generateServerAction = (
    server,
    section,
    actionType,
    subtitle,
    tab
  ) => ({
    id: `${server.id}-${actionType}`,
    name: `${server.serverName} - ${actionType}`,
    subtitle,
    parent: server.id,
    perform: () => router.push(`/${section}/${server.id}?tab=${tab}`),
    keywords: server.serverName,
  })

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

  const dashboardActions = [
    'history',
    'query',
    'current-activity',
    'tuning-advisor',
  ].flatMap((action) =>
    servers.map((server) =>
      generateServerAction(
        server,
        'dashboard',
        action.charAt(0).toUpperCase() + action.slice(1),
        `View ${action}`,
        action
      )
    )
  )

  const alertsActions = servers.map((server) => ({
    id: `${server.id}-alerts`,
    name: `${server.serverName} - Alerts`,
    subtitle: 'View alerts',
    parent: server.id,
    perform: () => router.push(`/alerts/?server=${server.id}`),
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
      parent: 'configurations',
      keywords: 'installation wizard',
      peform: () => router.push('configurations/installation-wizard'),
    },
    {
      id: 'update-new-version',
      name: 'Update New Version',
      subtitle: 'View update new version',
      parent: 'configurations',
      keywords: 'update new version',
      peform: () => router.push('configurations/update-new-version'),
    },
    {
      id: 'servers',
      name: 'Servers',
      subtitle: 'View servers',
      parent: 'configurations',
      keywords: 'servers',
      peform: () => router.push('configurations/servers'),
    },
    {
      id: 'profiles',
      name: 'Profiles',
      subtitle: 'View profiles',
      parent: 'configurations',
      keywords: 'profiles',
      peform: () => router.push('configurations/profiles'),
    },
    {
      id: 'users',
      name: 'Users',
      subtitle: 'View users',
      parent: 'configurations',
      keywords: 'users',
      peform: () => router.push('configurations/users'),
    },
    {
      id: 'alerts',
      name: 'Alerts',
      subtitle: 'View alerts',
      parent: 'configurations',
      keywords: 'config alerts',
      peform: () => router.push('configurations/alerts'),
    },
    {
      id: 'components',
      name: 'Components',
      subtitle: 'View components',
      parent: 'configurations',
      keywords: 'components',
      peform: () => router.push('configurations/components'),
    },
    {
      id: 'logs',
      name: 'Logs',
      subtitle: 'View logs',
      parent: 'configurations',
      keywords: 'logs',
      peform: () => router.push('configurations/logs'),
    },
    {
      id: 'integration',
      name: 'Integration',
      subtitle: 'View integrations',
      parent: 'configurations',
      keywords: 'integration',
      peform: () => router.push('configurations/integration'),
    },
    {
      id: 'AI Configurations',
      name: 'AI Configurations',
      subtitle: 'View AI configurations',
      parent: 'configurations',
      keywords: 'AI configurations',
      perform: () => router.push('configurations/ai-configurations'),
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
