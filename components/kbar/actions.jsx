import { useRegisterActions } from 'kbar'
import { useRouter } from 'next/router'

export default function KBarActions() {
  const router = useRouter()

  useRegisterActions(
    [
      {
        id: 'home',
        name: 'Ir para Home',
        shortcut: ['h'],
        keywords: 'início',
        perform: () => router.push('/'),
      },
      {
        id: 'about',
        name: 'Sobre',
        shortcut: ['a'],
        keywords: 'sobre nós',
        perform: () => router.push('/about'),
      },
    ],
    []
  )

  return <></>
}
