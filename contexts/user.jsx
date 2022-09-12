import React, { createContext, useEffect, useState } from 'react'

import { getMe } from '~/services/user'
import { removeLocalStorage, setLocalStorage } from '~/utils/local-storage'

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
    removeLocalStorage('user_token')
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
      setLocalStorage('user_token', userState?.token)
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
