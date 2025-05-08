/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/no-null */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable no-console */
import { EventSourcePolyfill } from 'event-source-polyfill'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import { APIV2 } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

const EventSourceContext = createContext({
  eventSource: null,
  connectionId: undefined,
})

export const EventSourceProvider = ({ children }) => {
  const [terminalOutput, setTerminalOutput] = useState([])
  const token = getUserToken()

  const eventSourceReference = useRef(null)
  const connectionId = useRef(null)
  const isInitialized = useRef(false)
  const [result, setResult] = useState({ status: '', message: '' })

  const handleSocketMessage = (event) => {
    setTerminalOutput((previousOutput) => [...previousOutput, event])
  }

  const handleResult = (result) => {
    try {
      setResult(result)
    } catch {
      // console.log(error)
    }
  }

  const initializeEventSource = () => {
    if (isInitialized.current) return

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

      const es = new EventSourcePolyfill(url, { headers })
      eventSourceReference.current = es

      es.addEventListener('connection', (event) => {
        const data = JSON.parse(event.data)
        connectionId.current = data.id
        handleSocketMessage('Connected')
      })

      es.addEventListener('message', (event) => {
        handleSocketMessage(event.data)
      })

      es.current.addEventListener('result', (e) => {
        handleResult(JSON.parse(e.data))
      })

      es.addEventListener('error', () => {
        if (es.readyState === EventSource.CLOSED) {
          setTerminalOutput((previousOutput) => [
            ...previousOutput,
            'Disconnected',
          ])
        }
      })

      es.onerror = (error) => {
        es.close()
        isInitialized.current = false
        initializeEventSource()
      }

      isInitialized.current = true
    }
  }

  useEffect(() => {
    if (!token) {
      if (eventSourceReference.current) {
        eventSourceReference.current.close()
        eventSourceReference.current = null
      }
      return
    }

    if (!eventSourceReference.current) {
      initializeEventSource()
    }

    return () => {
      if (eventSourceReference.current) {
        eventSourceReference.current.close()
        eventSourceReference.current = null
        isInitialized.current = false
      }
    }
  }, [token])

  return (
    <EventSourceContext.Provider
      value={{
        connectionId: connectionId.current,
        terminalOutput,
        setTerminalOutput,
        eventSourceReference,
        result,
      }}
    >
      {children}
    </EventSourceContext.Provider>
  )
}

export const useEventSource = () => useContext(EventSourceContext)
