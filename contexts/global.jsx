import React, { createContext, useCallback, useEffect, useState } from 'react'

import useUser from '~/hooks/use-user'
import { getEnvironments, getServers, getTypes } from '~/services/servers'

const initialGlobalState = {
  isModalActive: false,
  servers: [],
  serverTypes: [],
  serverEnvironments: [],
}

const GlobalContext = createContext(initialGlobalState)

export const GlobalContextProvider = ({ children }) => {
  const {
    userState: { logged },
  } = useUser()

  const [globalState, setGlobalState] = useState(initialGlobalState)

  const getData = useCallback(async () => {
    try {
      const promises = [getServers(), getTypes(), getEnvironments()]

      const [responseServers, responseTypes, responseEnvironments] =
        await Promise.all(promises)

      const intervalId = setInterval(async () => {
        const serversData = await getServers()
        setGlobalState((oldGlobalState) => ({
          ...oldGlobalState,
          servers: serversData?.data || [],
        }))
      }, 10_000)

      setGlobalState((oldGlobalState) => ({
        ...oldGlobalState,
        servers: responseServers?.data || [],
        serverTypes: responseTypes?.data || [],
        serverEnvironments: responseEnvironments?.data || [],
      }))

      return () => {
        clearInterval(intervalId)
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }, [])

  useEffect(() => {
    if (!logged) return

    getData()
  }, [logged]) // eslint-disable-line react-hooks/exhaustive-deps

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
