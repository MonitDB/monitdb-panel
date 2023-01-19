import React, { createContext, useCallback, useEffect, useState } from 'react'

import { getAlertsParameter } from '~/services/alerts'

const initialAlertsState = {
  parameters: [],
}

const AlertsContext = createContext(initialAlertsState)

export const AlertsContextProvider = ({ children }) => {
  const [state, setState] = useState(initialAlertsState)

  const getData = useCallback(async () => {
    try {
      const responseParameters = await getAlertsParameter({
        pagenumber: 1,
        pagelength: 999,
      })

      setState((oldState) => ({
        ...oldState,
        parameters: responseParameters?.data || [],
      }))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }, [])

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AlertsContext.Provider
      value={{
        state,
        setState,
        refreshData: getData,
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}

export default AlertsContext
