import React, { createContext, useEffect, useState } from 'react'

import { getMe } from '~/services/user'
import * as Cookies from '~/utils/cookies'

const initialState = {
  logged: false,
  name: '',
  email: '',
  roleId: -1,
  token: '',
}

const UserContext = createContext(initialState)

const UserContextProvider = ({ children }) => {
  const [userState, setUserState] = useState(initialState)

  const unsetUserState = () => {
    setUserState(initialState)
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

  useEffect(() => {
    if (userState?.token) {
      Cookies.setUserToken(userState?.token)
      getUserData()
    }
  }, [userState?.token]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <UserContext.Provider
      value={{
        userState,
        setUserState,
        unsetUserState,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserContextProvider }

export default UserContext
