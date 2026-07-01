/* eslint-disable unicorn/no-null, unicorn/prefer-add-event-listener */
import { Alert, Button, Select, Space, Tag } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useRemoteStore } from '~/services/state-manager/remote-store'

const STATE_LABEL = {
  idle: { c: 'default', t: 'Desconectado' },
  connecting: { c: 'processing', t: 'Conectando…' },
  connected: { c: 'green', t: 'Conectado' },
  closed: { c: 'default', t: 'Sessão encerrada' },
  error: { c: 'red', t: 'Erro' },
}

// Carrega o bundle UMD do Guacamole (estático em /public) e devolve window.Guacamole.
const loadGuacamole = () =>
  new Promise((resolve, reject) => {
    if (window.Guacamole) return resolve(window.Guacamole)
    const onError = () =>
      reject(new Error('Falha ao carregar o cliente Guacamole.'))
    const existing = document.querySelector('script[data-guac]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Guacamole))
      existing.addEventListener('error', onError)
      return
    }
    const script = document.createElement('script')
    script.src = '/guacamole-common.min.js'
    script.dataset.guac = '1'
    script.addEventListener('load', () => resolve(window.Guacamole))
    script.addEventListener('error', onError)
    document.head.append(script)
  })

const Remote = () => {
  const { hosts, fetchHosts, openSession } = useRemoteStore()
  const [hostId, setHostId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const containerReference = useRef(null)
  const clientReference = useRef(null)
  const keyboardReference = useRef(null)
  const resizeReference = useRef(null)

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const cleanup = () => {
    try { keyboardReference.current?.reset() } catch { /* noop */ }
    try { clientReference.current?.disconnect() } catch { /* noop */ }
    if (resizeReference.current) {
      window.removeEventListener('resize', resizeReference.current)
      resizeReference.current = null
    }
    if (containerReference.current) containerReference.current.innerHTML = ''
    clientReference.current = null
    keyboardReference.current = null
  }

  useEffect(() => () => cleanup(), [])

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const connect = async () => {
    if (!hostId) return
    cleanup()
    setStatus('connecting')
    setMessage('')
    try {
      const session = await openSession(hostId)
      if (!session?.ok) {
        setStatus('error')
        setMessage(session?.message || 'Falha ao abrir a sessão.')
        return
      }

      const Guacamole = await loadGuacamole()
      // A ponte WS é anexada ao servidor da API (porta 3002) no path /guac-ws —
      // assim usa uma porta já exposta (sem abrir a 3004 no firewall).
      const wsBase = (process.env.apiV2 || '').replace(/^http/, 'ws')
      const wsPath = session.wsPath || '/guac-ws'
      const tunnel = new Guacamole.WebSocketTunnel(`${wsBase}${wsPath}`)
      const client = new Guacamole.Client(tunnel)
      clientReference.current = client

      const display = client.getDisplay()
      const element = display.getElement()
      const box = containerReference.current
      box.innerHTML = ''
      box.append(element)

      // O guacd envia a resolução do host (ex.: 1856×805). Sem escala, o canvas
      // pode ficar cortado/escondido — ajustamos o display ao container e
      // recalculamos em cada resize (do host e da janela).
      let scale = 1
      const fit = () => {
        const w = display.getWidth()
        const h = display.getHeight()
        if (!w || !h || !box) return
        scale = Math.min(box.clientWidth / w, box.clientHeight / h) || 1
        display.scale(scale)
      }
      display.onresize = () => fit()
      const onWindowResize = () => fit()
      window.addEventListener('resize', onWindowResize)
      resizeReference.current = onWindowResize

      client.onstatechange = (state) => {
        // 3 = CONNECTED, 5 = DISCONNECTED
        if (state === 3) { setStatus('connected'); fit() }
        else if (state === 5) setStatus('closed')
      }
      client.onerror = (error) => {
        setStatus('error')
        setMessage(error?.message || 'Erro na sessão remota.')
        cleanup()
      }
      tunnel.onerror = (error) => {
        setStatus('error')
        setMessage(error?.message || 'Erro no túnel WebSocket.')
      }

      const width = Math.max(box.clientWidth || 1280, 640)
      const height = Math.max(box.clientHeight || 720, 480)
      client.connect(
        `token=${encodeURIComponent(session.token)}&width=${width}&height=${height}&dpi=96`
      )

      // Foco para o teclado (Guacamole.Keyboard escuta o document) e para
      // destacar o canvas ao clicar.
      box.tabIndex = 0
      box.focus()

      // Coordenadas do mouse são no espaço da tela (canvas escalado) → dividir
      // pela escala para o espaço do host.
      const mouse = new Guacamole.Mouse(element)
      const sendScaled = (mouseState) => {
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

      const keyboard = new Guacamole.Keyboard(document)
      keyboard.onkeydown = (keysym) => client.sendKeyEvent(1, keysym)
      keyboard.onkeyup = (keysym) => client.sendKeyEvent(0, keysym)
      keyboardReference.current = keyboard
    } catch (error) {
      setStatus('error')
      setMessage(error?.response?.data?.message || error?.message || 'Falha.')
    }
  }

  const disconnect = () => {
    cleanup()
    setStatus('closed')
  }

  return (
    <>
      <NextSeo title="Desktop remoto - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Desktop remoto (RDP/VNC)"
            breadcrumbs={[{ title: 'Desktop remoto', href: '/remote/' }]}
            extra={
              <Space>
                <Select
                  style={{ width: 300 }}
                  placeholder="Selecione um host"
                  value={hostId}
                  onChange={setHostId}
                  disabled={status === 'connecting' || status === 'connected'}
                  options={hosts.map((h) => ({
                    value: h.id,
                    label: `${h.name} — ${h.protocol.toUpperCase()} ${h.host}:${h.port}`,
                  }))}
                />
                {status === 'connected' ? (
                  <Button danger onClick={disconnect}>
                    Desconectar
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    disabled={!hostId || status === 'connecting'}
                    loading={status === 'connecting'}
                    onClick={connect}
                  >
                    Conectar
                  </Button>
                )}
                <Tag color={STATE_LABEL[status].c}>{STATE_LABEL[status].t}</Tag>
              </Space>
            }
          />

          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            message="Acesso remoto privilegiado e gravado"
            description="Abre uma sessão gráfica (RDP/VNC) no host via Guacamole. Requer OWNER de Desktop remoto; a abertura é auditada e a sessão é gravada (replay) para compliance. Hosts e credenciais em Configurações → Hosts remotos."
          />
          {message && status === 'error' && (
            <Alert type="error" showIcon style={{ marginBottom: 12 }} message={message} />
          )}

          <div
            ref={containerReference}
            style={{
              height: '72vh',
              background: '#000',
              borderRadius: 6,
              overflow: 'hidden',
              outline: 'none',
            }}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default Remote
