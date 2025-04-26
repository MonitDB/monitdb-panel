'use client'
import { useRegisterActions } from 'kbar'
import { useRouter } from 'next/router'

export default function KBarActions({ currentQuery }) {
  const router = useRouter()

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
              router.push(`monit-ai/new?query=${currentQuery}`)
            },
          },
        ]
      : []

  useRegisterActions(
    [
      {
        id: 'search',
        name: 'Search',
        keywords: 'pesquisar buscar',
      },
      ...dynamicResults,
      {
        id: 'home',
        name: 'Ir para Home',
        shortcut: ['h'],
        keywords: 'início principal',
        perform: () => router.push('/'),
      },
      {
        id: 'sobre',
        name: 'Sobre',
        shortcut: ['s'],
        keywords: 'informações sobre nós',
      },
      {
        id: 'sobre-equipe',
        name: 'Equipe',
        parent: 'sobre',
        perform: () => router.push('/about/team'),
      },
      {
        id: 'sobre-missao',
        name: 'Missão',
        parent: 'sobre',
        perform: () => router.push('/about/mission'),
      },
      {
        id: 'sobre-contato',
        name: 'Contato',
        parent: 'sobre',
        perform: () => router.push('/about/contact'),
      },
    ],
    [router, dynamicResults]
  )

  return <></>
}
