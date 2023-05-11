import { useRouter } from 'next/router'
import React, { useState, createContext, useMemo } from 'react'

import useGlobal from '~/hooks/use-global'
import { formatServer } from '~/utils/server'

const initialDashboardState = {
  currentServer: undefined,
}

const SingleDashboardContext = createContext(initialDashboardState)

export const SingleDashboardContextProvider = ({ children }) => {
  const [frequency, setFrequency] = useState(60)
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const router = useRouter()

  const currentServer = useMemo(() => {
    const server = servers.find((server) => server.id === +router?.query?.id)

    if (!server) {
      return
    }

    return formatServer(server, { serverTypes })
  }, [servers, serverTypes, router?.query?.id])

  return (
    <SingleDashboardContext.Provider
      value={{
        currentServer,
        frequency,
        setFrequency
      }}
    >
      {children}
    </SingleDashboardContext.Provider>
  )
}

export default SingleDashboardContext
