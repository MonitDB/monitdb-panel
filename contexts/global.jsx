import React, { createContext, useEffect, useState } from 'react'

import { getServers } from '~/services/servers'

const initialGlobalState = {
  isModalActive: false,
  servers: [],
}

const GlobalContext = createContext(initialGlobalState)

const GlobalContextProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(initialGlobalState)
  const getServersData = async () => {
    try {
      const servers = await getServers()

      if (servers?.data?.result.length > 0) {
        setGlobalState({ ...globalState, servers: servers.data.result })
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getServersData()
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
