/* eslint-disable unicorn/no-null */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable no-console */
import { EventSourcePolyfill } from 'event-source-polyfill'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

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
  const [terminalOutput, setTerminalOutput] = useState([])
  const token = getUserToken()

  const eventSourceReference = useRef(null)
  const connectionId = useRef(null)

  const handleSocketMessage = (event) => {
    setTerminalOutput((previousOutput) => [...previousOutput, event])
  }

  const initializeEventSource = () => {
    if (eventSourceReference.current) {
      eventSourceReference.current.close()
      eventSourceReference.current = null
    }
    if (token) {
      const url = `${APIV2}/events`
      const headers = {
        Authorization: `Bearer ${token}`,
        'x-api-key': process.env.apiKey,
      }

      if (eventSourceReference.current) {
        eventSourceReference.current.close()
      }

      const es = new EventSourcePolyfill(url, {
        headers,
      })

      eventSourceReference.current = es

      eventSourceReference.current.addEventListener('connection', (event) => {
        const data = JSON.parse(event.data)
        console.log(es)
        console.info('connected', data)
        connectionId.current = data.id

        handleSocketMessage('Connected')
      })

      eventSourceReference.current.addEventListener('message', (event) => {
        console.info('EVENT MESSAGE')
        handleSocketMessage(event.data)
      })

      eventSourceReference.current.addEventListener('error', () => {
        if (es.readyState === EventSource.CLOSED) {
          setTerminalOutput((previousOutput) => [
            ...previousOutput,
            'Disconnected',
          ])
        }
      })

      eventSourceReference.current.onerror = (error) => {
        console.info('EventSource failed:', error)
        es.close()
        initializeEventSource()
      }
    }
  }

  useEffect(() => {
    do {
      if (token) {
        initializeEventSource()
      } else {
        if (eventSourceReference.current) {
          eventSourceReference.current.close()
        }
      }
    } while (!token)

    return () => {
      if (eventSourceReference.current) {
        eventSourceReference.current.close()
      }
    }
  }, [])

  return (
    <EventSourceContext.Provider
      value={{
        connectionId: connectionId.current,
        terminalOutput,
        setTerminalOutput,
        eventSourceReference,
      }}
    >
      {children}
    </EventSourceContext.Provider>
  )
}

export const useEventSource = () => useContext(EventSourceContext)
