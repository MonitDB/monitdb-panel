import Router from 'next/router'
import { useCallback, useEffect } from 'react'

import { userInitialState } from '~/contexts/user'
import useUser from '~/hooks/use-user'
import { getMe, postTokenValidate } from '~/services/user'
import * as Cookies from '~/utils/cookies'

const loginPath = '/?redirected=true'

const ProtectedPage = ({ children }) => {
  const { userState, setUserState } = useUser()

  const validateToken = useCallback(async () => {
    try {
      const response = await postTokenValidate(userState?.token)
      const { data: me } = await getMe()
      const dataResult = response?.data
      if (dataResult?.token) {
        setUserState({
          ...userState,
          ...me,
          logged: true,
          token: dataResult?.token,
        })
      }
    } catch {
      Router.push(loginPath)

      setUserState(userInitialState)
      Cookies.reset()
    }
  }, [setUserState, userState])

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
