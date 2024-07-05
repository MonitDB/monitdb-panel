/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable no-console */
// utils/EventSourceContext.js
import { message } from 'antd'
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
  const token = getUserToken()

  const initializeEventSource = () => {
    if (token && !eventSource) {
      const url = APIV2 + '/events'
      const headers = {
        Authorization: `Bearer ${token}`,
        'x-api-key': process.env.apiKey,
      }

      const es = new EventSourcePolyfill(url, {
        headers: headers,
      })

      setEventSource(es)

      es.addEventListener('connection', function (event) {
        const data = JSON.parse(event.data)
        message.info('Listening Events')
        setConnectionId(data.id)
      })

      es.onerror = (error) => {
        message.error('EventSource disconnected, attempting to reconnect...')
        console.error('EventSource failed:', error)
        es.close()
        setTimeout(() => {
          initializeEventSource()
        }, 5000)
      }
    }
  }

  useEffect(() => {
    initializeEventSource()

    return () => {
      eventSource?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

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
