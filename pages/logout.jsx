import Router from 'next/router'
import { useContext, useEffect } from 'react'

import UserContext from '~/contexts/user'

const LogoutPage = () => {
  const { unsetUserState } = useContext(UserContext)

  useEffect(() => {
    unsetUserState()
    Router.push('/')
  }, [unsetUserState])

  return ''
}

export default LogoutPage
