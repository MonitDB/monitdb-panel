import React, { createContext, useEffect, useState } from 'react'

import { getEnvironments, getServers, getTypes } from '~/services/servers'

const initialGlobalState = {
  isModalActive: false,
  servers: [],
  serverTypes: [],
  serverEnvironments: [],
}

const GlobalContext = createContext(initialGlobalState)

const GlobalContextProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(initialGlobalState)

  const getData = async () => {
    try {
      const promises = [getServers(), getTypes(), getEnvironments()]

      const [responseServers, responseTypes, responseEnvironments] =
        await Promise.all(promises)

      setGlobalState({
        ...globalState,
        servers: responseServers?.data?.result || [],
        serverTypes: responseTypes?.data?.result || [],
        serverEnvironments: responseEnvironments?.data?.result || [],
      })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        setGlobalState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalContextProvider }

export default GlobalContext
