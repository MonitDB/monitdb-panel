/* eslint-disable unicorn/no-null */
/* eslint-disable react-hooks/exhaustive-deps */
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
  const retryCount = useRef(0)
  const [result, setResult] = useState({ status: '', message: '' })

  const maxRetries = 5

  const handleSocketMessage = (event) => {
    setTerminalOutput((previousOutput) => [...previousOutput, event])
  }

  const handleResult = (result) => {
    try {
      setResult(result)
    } catch {
      // optional: handle parsing errors
    }
  }

  const initializeEventSource = () => {
    if (isInitialized.current || retryCount.current >= maxRetries) return

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
        retryCount.current = 0
      })

      es.addEventListener('message', (event) => {
        handleSocketMessage(event.data)
      })

      es.addEventListener('result', (e) => {
        handleResult(JSON.parse(e.data))
      })

      es.onerror = (error) => {
        console.error('SSE Error:', error)

        if (es.readyState === EventSource.CLOSED) {
          setTerminalOutput((previousOutput) => [
            ...previousOutput,
            'Disconnected',
          ])
        }

        es.close()
        eventSourceReference.current = null
        isInitialized.current = false

        if (retryCount.current < maxRetries) {
          retryCount.current++
          const retryDelay = Math.min(1000 * 2 ** retryCount.current, 10_000)
          setTimeout(() => {
            console.log(
              `Retrying SSE connection... Attempt ${retryCount.current}`
            )
            initializeEventSource()
          }, retryDelay)
        } else {
          console.error('Max SSE reconnection attempts reached.')
        }
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

    initializeEventSource()

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
