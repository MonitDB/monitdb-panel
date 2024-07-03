/* eslint-disable no-console */
// utils/EventSourceContext.js
import { message, notification } from 'antd'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { createContext, useContext, useEffect, useState } from 'react'

import { APIV2 } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

/**
 * @typedef {Object} EventSourceContextValue
 * @property {EventSource | null} eventSource - The EventSource instance or null if not yet initialized.
 */

/** @type {React.Context<EventSourceContextValue>} */
const EventSourceContext = createContext({ eventSource: undefined })

export const EventSourceProvider = ({ children }) => {
  const [eventSource, setEventSource] = useState()
  const [connectionId, setConnectionId] = useState()
  console.log(getUserToken())
  useEffect(() => {
    const url = APIV2 + '/events'
    const headers = {
      Authorization: `Bearer ${getUserToken()}`,
      'x-api-key': process.env.apiKey,
    }

    const es = new EventSourcePolyfill(url, {
      headers: headers,
    })

    setEventSource(es)

    es.addEventListener('connection', function (event) {
      const data = JSON.parse(event.data)
      message.info(data.id)
      setConnectionId(data.id)
    })

    // eslint-disable-next-line unicorn/prefer-add-event-listener
    es.onerror = (error) => {
      message.error('EventSource disconnected')
      console.error('EventSource failed:', error)
    }

    return () => {
      es.close()
    }
  }, [])

  return (
    <EventSourceContext.Provider value={{ eventSource, connectionId }}>
      {children}
    </EventSourceContext.Provider>
  )
}

/**
 * Custom hook to use the EventSource context.
 * @returns {EventSourceContextValue} The EventSource context value.
 */
export const useEventSource = () => useContext(EventSourceContext)
