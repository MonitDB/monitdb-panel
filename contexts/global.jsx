import React, { createContext, useCallback, useEffect, useState } from 'react'

import useUser from '~/hooks/use-user'
import { getEnvironments, getServers, getTypes } from '~/services/servers'

const initialGlobalState = {
  isModalActive: false,
  servers: [],
  serverTypes: [],
  serverEnvironments: [],
  // 'loading' | 'loaded' | 'error' — permite à UI distinguir carregando,
  // vazio de verdade e falha (antes: spinner infinito em qualquer falha).
  serversStatus: 'loading',
}

const GlobalContext = createContext(initialGlobalState)

export const GlobalContextProvider = ({ children }) => {
  const {
    userState: { logged },
  } = useUser()

  const [globalState, setGlobalState] = useState(initialGlobalState)

  const getData = useCallback(async () => {
    setGlobalState((oldGlobalState) => ({
      ...oldGlobalState,
      serversStatus: 'loading',
    }))
    try {
      const promises = [getServers(), getTypes(), getEnvironments()]

      const [serversData, responseTypes, responseEnvironments] =
        await Promise.all(promises)

      setGlobalState((oldGlobalState) => ({
        ...oldGlobalState,
        servers: serversData?.data || [],
        serverTypes: responseTypes?.data || [],
        serverEnvironments: responseEnvironments?.data || [],
        serversStatus: 'loaded',
      }))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      setGlobalState((oldGlobalState) => ({
        ...oldGlobalState,
        serversStatus: 'error',
      }))
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
