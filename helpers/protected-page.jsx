import Router from 'next/router'
import { useCallback, useContext, useEffect } from 'react'

import UserContext from '~/contexts/user'
import { postTokenValidate } from '~/services/user'

const loginPath = '/?redirected=true'

const ProtectedPage = ({ children }) => {
  const { userState, setUserState } = useContext(UserContext)

  const validateToken = useCallback(async () => {
    try {
      const response = await postTokenValidate(userState?.token)
      const dataResult = response?.data?.result

      if (dataResult?.token) {
        setUserState({
          logged: true,
          token: dataResult?.token,
        })
      }
    } catch {
      Router.push(loginPath)
    }
  }, [setUserState, userState?.token])

  useEffect(() => {
    if (!userState?.token) {
      validateToken()
    }
  }, [validateToken, userState?.token])

  if (!userState.token) {
    return ''
  }

  return children
}

export default ProtectedPage
