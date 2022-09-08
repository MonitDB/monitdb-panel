import React, { createContext, useEffect, useState } from 'react'

import { setLocalStorage } from '~/utils/local-storage'

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
  }

  useEffect(() => {
    if (userState?.token) {
      setLocalStorage('user_token', userState?.token)
    }
  }, [userState?.token])

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
