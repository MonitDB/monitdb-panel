/* eslint-disable unicorn/no-null */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable no-console */
import { EventSourcePolyfill } from 'event-source-polyfill'
import { createContext, useContext, useEffect, useState } from 'react'

import { APIV2 } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

/**
 * @typedef {Object} EventSourceContextValue
 * @property {EventSource | null} eventSource
 * @property {string | undefined} connectionId
 */

/** @type {React.Context<EventSourceContextValue>} */
const EventSourceContext = createContext({
  eventSource: null,
  connectionId: undefined,
})

export const EventSourceProvider = ({ children }) => {
  const [eventSource, setEventSource] = useState(null)
  const [connectionId, setConnectionId] = useState()
  const token = getUserToken()

  const initializeEventSource = () => {
    console.info('Initializing EventSource')
    if (token && !eventSource) {
      const url = `${APIV2}/events`
      const headers = {
        Authorization: `Bearer ${token}`,
        'x-api-key': process.env.apiKey,
      }

      const es = new EventSourcePolyfill(url, {
        headers,
      })
      console.log('Event source initialized')

      setEventSource(es)

      es.addEventListener('connection', (event) => {
        const data = JSON.parse(event.data)
        console.info('connected', data)
        setConnectionId(data.id)
      })

      es.onerror = (error) => {
        console.info('EventSource failed:', error)
        es.close()
        setEventSource(null)
        setTimeout(() => {
          initializeEventSource()
        }, 3000)
      }
    }
  }

  useEffect(() => {
    initializeEventSource()

    return () => {
      if (eventSource) {
        eventSource.close()
        console.info('EventSource closed')
        setEventSource(null)
      }
    }
  }, [eventSource])

  return (
    <EventSourceContext.Provider value={{ eventSource, connectionId }}>
      {children}
    </EventSourceContext.Provider>
  )
}

export const useEventSource = () => useContext(EventSourceContext)
