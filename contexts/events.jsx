/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable no-console */
// utils/EventSourceContext.js

import { EventSourcePolyfill } from 'event-source-polyfill'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { APIV2 } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

/**
 * @typedef {Object} EventSourceContextValue
 * @property {EventSource | null} eventSource - The EventSource instance or null if not yet initialized.
 * @property {string | undefined} connectionId - The connection ID received from the server.
 */

/** @type {React.Context<EventSourceContextValue>} */
const EventSourceContext = createContext({
  eventSource: undefined,
  connectionId: undefined,
})

export const EventSourceProvider = ({ children }) => {
  const [eventSource, setEventSource] = useState()
  const [connectionId, setConnectionId] = useState()
  const isConnecting = useRef(false)
  const token = getUserToken()

  const initializeEventSource = () => {
    if (!token || eventSource || isConnecting.current) return

    isConnecting.current = true

    const url = APIV2 + '/events'
    const headers = {
      Authorization: `Bearer ${token}`,
      'x-api-key': process.env.apiKey,
    }

    const es = new EventSourcePolyfill(url, { headers })

    es.addEventListener('connection', (event) => {
      try {
        const data = JSON.parse(event.data)
        setConnectionId(data.id)
      } catch (error) {
        console.error('Failed to parse connection event data:', error)
      }
    })

    es.onerror = (error) => {
      console.error('EventSource failed:', error)
      es.close()
      setEventSource()
      isConnecting.current = false

      setTimeout(() => {
        initializeEventSource()
      }, 3000)
    }

    setEventSource(es)
    isConnecting.current = false
  }

  useEffect(() => {
    initializeEventSource()

    return () => {
      eventSource?.close()
      setEventSource()
    }
  }, [token]) // React to token change (e.g., user logs in/out)

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
