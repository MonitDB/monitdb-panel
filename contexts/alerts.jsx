import React, { createContext, useCallback, useEffect, useState } from 'react'

import useUser from '~/hooks/use-user'
import { getAlertsParameter } from '~/services/alerts'

const initialAlertsState = {
  parameters: [],
}

const AlertsContext = createContext(initialAlertsState)

export const AlertsContextProvider = ({ children }) => {
  const {
    userState: { logged },
  } = useUser()

  const [stateAlerts, setStateAlerts] = useState(initialAlertsState)

  const getData = useCallback(async () => {
    try {
      const responseParameters = await getAlertsParameter({
        pagenumber: 1,
        pagelength: 999,
      })

      setStateAlerts((oldState) => ({
        ...oldState,
        parameters: responseParameters?.data || [],
      }))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }, [])

  useEffect(() => {
    if (!logged) return

    getData()
  }, [logged]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AlertsContext.Provider
      value={{
        stateAlerts,
        setStateAlerts,
        refreshData: getData,
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}

export default AlertsContext
