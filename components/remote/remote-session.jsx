/* eslint-disable unicorn/no-null, unicorn/prefer-add-event-listener */
import React, { useEffect, useRef } from 'react'

import { useRemoteStore } from '~/services/state-manager/remote-store'
import { loadGuacamole } from '~/utils/guacamole'

// O Guacamole.Keyboard escuta o `document` inteiro e seus listeners não são
// removíveis — por isso é um SINGLETON compartilhado entre as abas, roteado
// para o client da aba ativa (a última attach vence).
let sharedKeyboard = null
let keyboardOwner = null

const attachKeyboard = (Guacamole, client, ownerKey) => {
  if (!sharedKeyboard) sharedKeyboard = new Guacamole.Keyboard(document)
  keyboardOwner = ownerKey
  try {
    sharedKeyboard.reset()
  } catch {
    /* noop */
  }
  sharedKeyboard.onkeydown = (keysym) => client.sendKeyEvent(1, keysym)
  sharedKeyboard.onkeyup = (keysym) => client.sendKeyEvent(0, keysym)
}

const detachKeyboard = (ownerKey) => {
  if (!sharedKeyboard || keyboardOwner !== ownerKey) return
  try {
    sharedKeyboard.reset()
  } catch {
    /* noop */
  }
  sharedKeyboard.onkeydown = null
  sharedKeyboard.onkeyup = null
  keyboardOwner = null
}

// Ajusta o canvas (resolução do host) ao container. A aba oculta tem dimensão
// 0 — não mede (o refit acontece ao ativar).
const createFit = ({ display, box, activeReference, scaleReference }) => () => {
  if (!activeReference.current) return
  const width = display.getWidth()
  const height = display.getHeight()
  if (!width || !height || !box.clientWidth) return
  scaleReference.current =
    Math.min(box.clientWidth / width, box.clientHeight / height) || 1
  display.scale(scaleReference.current)
}

const wireClient = ({ client, tunnel, fit, emitStatus }) => {
  client.onstatechange = (state) => {
    // 3 = CONNECTED, 5 = DISCONNECTED
    if (state === 3) {
      emitStatus('connected')
      fit()
    } else if (state === 5) emitStatus('closed')
  }
  client.onerror = (error) =>
    emitStatus('error', error?.message || 'Erro na sessão remota.')
  tunnel.onerror = (error) =>
    emitStatus('error', error?.message || 'Erro no túnel WebSocket.')
}

// Mouse por sessão: coordenadas no espaço do canvas escalado → dividir pela
// escala corrente para o espaço do host.
const wireMouse = ({ Guacamole, element, client, box, getScale }) => {
  const mouse = new Guacamole.Mouse(element)
  const sendScaled = (mouseState) => {
    const scale = getScale() || 1
    const scaled = new Guacamole.Mouse.State(
      mouseState.x / scale,
      mouseState.y / scale,
      mouseState.left,
      mouseState.middle,
      mouseState.right,
      mouseState.up,
      mouseState.down
    )
    client.sendMouseState(scaled)
  }
  mouse.onmousedown = (mouseState) => {
    box.focus()
    sendScaled(mouseState)
  }
  mouse.onmouseup = sendScaled
  mouse.onmousemove = sendScaled
}

// Abre a sessão (token efêmero) e monta tunnel + client + canvas nos references.
const startSession = async ({ session, openSession, isDisposed, references, emitStatus }) => {
  try {
    const opened = await openSession(session.hostId)
    if (isDisposed()) return
    if (!opened?.ok) {
      emitStatus('error', opened?.message || 'Falha ao abrir a sessão.')
      return
    }

    const Guacamole = await loadGuacamole()
    const box = references.containerReference.current
    if (isDisposed() || !box) return
    references.guacamoleReference.current = Guacamole

    // A ponte WS é anexada ao servidor da API (porta 3002) no path /guac-ws.
    const wsBase = (process.env.apiV2 || '').replace(/^http/, 'ws')
    const wsPath = opened.wsPath || '/guac-ws'
    const tunnel = new Guacamole.WebSocketTunnel(`${wsBase}${wsPath}`)
    const client = new Guacamole.Client(tunnel)
    references.clientReference.current = client

    const display = client.getDisplay()
    const element = display.getElement()
    box.innerHTML = ''
    box.append(element)

    const fit = createFit({
      display,
      box,
      activeReference: references.activeReference,
      scaleReference: references.scaleReference,
    })
    references.fitReference.current = fit
    display.onresize = () => fit()
    const onWindowResize = () => fit()
    window.addEventListener('resize', onWindowResize)
    references.resizeReference.current = onWindowResize

    wireClient({ client, tunnel, fit, emitStatus })

    const width = Math.max(box.clientWidth || 1280, 640)
    const height = Math.max(box.clientHeight || 720, 480)
    client.connect(
      `token=${encodeURIComponent(opened.token)}&width=${width}&height=${height}&dpi=96`
    )

    box.tabIndex = 0
    wireMouse({
      Guacamole,
      element,
      client,
      box,
      getScale: () => references.scaleReference.current,
    })

    // A aba nasce ativa: teclado + foco já apontam para esta sessão.
    if (references.activeReference.current) {
      attachKeyboard(Guacamole, client, session.key)
      box.focus()
    }
  } catch (error) {
    if (!isDisposed())
      emitStatus(
        'error',
        error?.response?.data?.message || error?.message || 'Falha.'
      )
  }
}

const teardownSession = (references, ownerKey) => {
  detachKeyboard(ownerKey)
  try {
    references.clientReference.current?.disconnect()
  } catch {
    /* noop */
  }
  if (references.resizeReference.current) {
    window.removeEventListener('resize', references.resizeReference.current)
    references.resizeReference.current = null
  }
  if (references.containerReference.current)
    references.containerReference.current.innerHTML = ''
  references.clientReference.current = null
  references.guacamoleReference.current = null
  references.fitReference.current = null
}

/**
 * Uma sessão de Desktop remoto (uma aba): tunnel WS + Guacamole.Client +
 * canvas próprios. Só o teclado é compartilhado (singleton acima). A aba
 * oculta continua recebendo frames (canvas não precisa de layout); o refit
 * da escala acontece ao ativar.
 */
const RemoteSession = ({ session, active, onStatusChange }) => {
  const { openSession } = useRemoteStore()
  const containerReference = useRef(null)
  const clientReference = useRef(null)
  const guacamoleReference = useRef(null)
  const fitReference = useRef(null)
  const resizeReference = useRef(null)
  const scaleReference = useRef(1)
  const activeReference = useRef(active)
  const onStatusChangeReference = useRef(onStatusChange)
  onStatusChangeReference.current = onStatusChange

  const references = useRef({
    containerReference,
    clientReference,
    guacamoleReference,
    fitReference,
    resizeReference,
    scaleReference,
    activeReference,
  }).current

  const emitStatus = (status, text) => {
    onStatusChangeReference.current(session.key, status, text)
  }

  useEffect(() => {
    activeReference.current = active
    if (!active) return
    const frame = requestAnimationFrame(() => {
      fitReference.current?.()
      const client = clientReference.current
      if (client && guacamoleReference.current)
        attachKeyboard(guacamoleReference.current, client, session.key)
      containerReference.current?.focus()
    })
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    let disposed = false
    startSession({
      session,
      openSession,
      isDisposed: () => disposed,
      references,
      emitStatus,
    })
    return () => {
      disposed = true
      teardownSession(references, session.key)
    }
    // Sessão é imutável (key/hostId definidos na criação da aba) — conecta uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerReference}
      style={{
        height: '100%',
        background: '#000',
        borderRadius: 6,
        overflow: 'hidden',
        outline: 'none',
      }}
    />
  )
}

export default RemoteSession
