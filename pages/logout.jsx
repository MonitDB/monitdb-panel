import Router from 'next/router'
import { useEffect } from 'react'

import useUser from '~/hooks/use-user'

const LogoutPage = () => {
  const { unsetUserState } = useUser()

  useEffect(() => {
    unsetUserState()
    Router.push('/')
  }, [unsetUserState])

  return ''
}

export default LogoutPage
