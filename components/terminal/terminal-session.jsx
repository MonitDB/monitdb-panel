/* eslint-disable unicorn/no-null */
import React, { useEffect, useRef } from 'react'

import { SOCKET } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

// Liga os eventos do gateway (/ssh) ao xterm desta sessão.
const wireSocket = ({ socket, term, session, emitStatus, activeReference }) => {
  socket.on('ssh:auth', () => {
    socket.emit('open', {
      hostId: session.hostId,
      cols: term.cols,
      rows: term.rows,
    })
  })
  socket.on('ssh:ready', (payload) => {
    emitStatus('connected')
    if (activeReference.current) term.focus()
    if (payload?.host)
      term.writeln(`[32m● connected to ${payload.host}[0m\r\n`)
  })
  socket.on('ssh:hostkey', (payload) => {
    if (payload?.firstUse)
      term.writeln(`\r\n🔑 host key recorded on this first connection (TOFU).`)
  })
  socket.on('ssh:data', (data) => term.write(data))
  socket.on('ssh:close', () => {
    emitStatus('closed')
    term.writeln('\r\n[33m— session closed —[0m')
  })
  socket.on('ssh:error', (text) => {
    emitStatus('error', text)
    term.writeln(`\r\n[31m${text}[0m`)
  })
  term.onData((data) => socket.emit('data', data))
}

// Handler de resize da janela: só a aba visível pode medir o container;
// as ocultas (display:none, dimensão 0) refitam ao serem ativadas.
const makeResizeHandler = ({ activeReference, fit, term, socket }) => () => {
  if (!activeReference.current) return
  try {
    fit.fit()
    socket.emit('resize', { cols: term.cols, rows: term.rows })
  } catch {
    /* noop */
  }
}

/**
 * Uma sessão SSH (uma aba): xterm + socket próprios, isolados das demais.
 * O gateway trata cada socket como uma sessão independente (auditoria por SESSION_ID),
 * então N abas = N sockets, sem mudança no servidor.
 */
const TerminalSession = ({ session, active, onStatusChange }) => {
  const containerReference = useRef(null)
  const terminalReference = useRef(null)
  const fitReference = useRef(null)
  const socketReference = useRef(null)
  const activeReference = useRef(active)
  const statusReference = useRef('connecting')
  // Evita closure velha nos handlers do socket sem reconectar a cada render.
  const onStatusChangeReference = useRef(onStatusChange)
  onStatusChangeReference.current = onStatusChange

  const emitStatus = (status, text) => {
    statusReference.current = status
    onStatusChangeReference.current(session.key, status, text)
  }

  useEffect(() => {
    activeReference.current = active
    if (!active) return
    // Ao ativar a aba (estava display:none, dimensão 0): refit + resize + foco.
    const frame = requestAnimationFrame(() => {
      try {
        fitReference.current?.fit()
        const terminal = terminalReference.current
        if (terminal && socketReference.current)
          socketReference.current.emit('resize', {
            cols: terminal.cols,
            rows: terminal.rows,
          })
        terminalReference.current?.focus()
      } catch {
        /* container ainda sem dimensão — o próximo resize corrige */
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [active])

  useEffect(() => {
    let disposed = false
    let onResize

    const connect = async () => {
      // Imports dinâmicos (xterm e socket.io só no browser).
      const [{ Terminal: XTerm }, { FitAddon }, { io }] = await Promise.all([
        import('xterm'),
        import('xterm-addon-fit'),
        import('socket.io-client'),
      ])
      if (disposed || !containerReference.current) return

      const term = new XTerm({
        cursorBlink: true,
        fontFamily: 'Menlo, Consolas, monospace',
        fontSize: 13,
        theme: { background: '#1b1b1b' },
      })
      const fit = new FitAddon()
      term.loadAddon(fit)
      // A aba nasce ativa (container visível) — dimensões válidas no open().
      term.open(containerReference.current)
      fit.fit()
      terminalReference.current = term
      fitReference.current = fit

      const socket = io(`${SOCKET}/ssh`, {
        transports: ['websocket'],
        auth: { token: getUserToken(), apiKey: process.env.apiKey },
      })
      socketReference.current = socket

      wireSocket({ socket, term, session, emitStatus, activeReference })
      socket.on('disconnect', () => {
        if (!disposed && statusReference.current === 'connected')
          emitStatus('closed')
      })

      onResize = makeResizeHandler({ activeReference, fit, term, socket })
      window.addEventListener('resize', onResize)
    }

    connect()

    return () => {
      disposed = true
      if (onResize) window.removeEventListener('resize', onResize)
      try {
        socketReference.current?.disconnect()
      } catch {
        /* noop */
      }
      try {
        terminalReference.current?.dispose()
      } catch {
        /* noop */
      }
      socketReference.current = null
      terminalReference.current = null
      fitReference.current = null
    }
    // Sessão é imutável (key/hostId definidos na criação da aba) — conecta uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerReference}
      style={{
        height: '100%',
        background: '#1b1b1b',
        padding: 8,
        borderRadius: 6,
      }}
    />
  )
}

export default TerminalSession
