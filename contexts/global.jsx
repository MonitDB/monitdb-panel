import React, { createContext, useCallback, useEffect, useState } from 'react'

import { getEnvironments, getServers, getTypes } from '~/services/servers'

const initialGlobalState = {
  isModalActive: false,
  servers: [],
  serverTypes: [],
  serverEnvironments: [],
}

const GlobalContext = createContext(initialGlobalState)

export const GlobalContextProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState(initialGlobalState)

  const getData = useCallback(async () => {
    try {
      const promises = [getServers(), getTypes(), getEnvironments()]

      const [responseServers, responseTypes, responseEnvironments] =
        await Promise.all(promises)

      setGlobalState((oldGlobalState) => ({
        ...oldGlobalState,
        servers: responseServers?.data || [],
        serverTypes: responseTypes?.data?.result || [],
        serverEnvironments: responseEnvironments?.data?.result || [],
      }))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }, [])

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line no-console
  console.log('global globalState', globalState)

  return (
    <GlobalContext.Provider
      value={{
        globalState,
        setGlobalState,
        refreshData: getData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContext
