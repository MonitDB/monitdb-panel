import Router from 'next/router'
import { useContext, useEffect } from 'react'

import UserContext from '~/contexts/user'
import { postTokenValidate } from '~/services/user'

const loginPath = '/?redirected=true'

const ProtectedPage = ({ children }) => {
  const { userState } = useContext(UserContext)

  useEffect(() => {
    const validateToken = async () => {
      const response = await postTokenValidate(userState?.token)
      const dataResult = response?.data?.result

      if (!dataResult?.token) {
        Router.replace(loginPath)
      }
    }

    if (!userState?.token) {
      validateToken()
    }
  }, [userState?.token])

  if (!userState.token) {
    return ''
  }

  return children
}

export default ProtectedPage
