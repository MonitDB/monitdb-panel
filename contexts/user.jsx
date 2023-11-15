import React, { createContext, useCallback, useEffect, useState } from 'react'

import { getMe } from '~/services/user'
import * as Cookies from '~/utils/cookies'

export const userInitialState = {
  logged: false,
  name: '',
  email: '',
  roleId: -1,
  token: '',
}

const UserContext = createContext(userInitialState)

export const UserContextProvider = ({ children }) => {
  const [userState, setUserState] = useState(userInitialState)

  const unsetUserState = () => {
    setUserState(userInitialState)
    Cookies.reset()
  }

  const getUserData = async () => {
    try {
      const response = await getMe()
      const dataResult = response?.data?.result
      if (dataResult?.loginname || dataResult?.loginemail) {
        setUserState({
          ...userState,
          name: dataResult?.loginname,
          email: dataResult?.loginemail,
        })
      }
    } catch {
      unsetUserState()
    }
  }

  const handleChangeUserState = useCallback((newUserState) => {
    if (newUserState?.logged && newUserState?.token) {
      Cookies.setUserToken(newUserState.token)
    }

    setUserState((oldUserState) => ({
      ...oldUserState,
      ...newUserState,
    }))
  }, [])

  useEffect(() => {
    if (userState?.token) {
      getUserData()
    }
  }, [userState?.token]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserState: handleChangeUserState,
        unsetUserState,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
