import React, { createContext, useCallback, useEffect, useState } from 'react'

import { getMe } from '~/services/user'
import * as Cookies from '~/utils/cookies'
import { safeJsonParse } from '~/utils/json'

export const userInitialState = {
  logged: false,
  name: '',
  email: '',
  roleId: -1,
  token: '',
  permissions: [],
  hasPermissions: () => false,
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
      const dataResult = response?.data

      if (dataResult?.loginName || dataResult?.loginEmail) {
        setUserState({
          ...userState,
          name: dataResult?.loginname,
          email: dataResult?.loginemail,
          ...dataResult,
          preferences: safeJsonParse(dataResult.loginPreferences),
          hasPermissions: (permissions) => {
            return dataResult?.permissions?.some((permission) =>
              permissions?.includes(permission)
            )
          },
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

    setUserState((oldUserState) => {
      const updatedUserState = oldUserState || {} // Se oldUserState for undefined, use um objeto vazio {}
      return {
        ...updatedUserState,
        ...newUserState,
      }
    })
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
        getUserData: getUserData,
        setUserState: handleChangeUserState,
        unsetUserState,
        hasPermissions: userState.hasPermissions,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
