/* eslint-disable unicorn/no-null */
import { Alert, Button, Select, Space, Tag } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { useSshStore } from '~/services/state-manager/ssh-store'
import { SOCKET } from '~/utils/client-api'
import { getUserToken } from '~/utils/cookies'

const Terminal = () => {
  const { hosts, fetchHosts } = useSshStore()
  const [hostId, setHostId] = useState(null)
  const [status, setStatus] = useState('idle') // idle | connecting | connected | closed | error
  const [message, setMessage] = useState('')
  const containerReference = useRef(null)
  const terminalReference = useRef(null)
  const fitReference = useRef(null)
  const socketReference = useRef(null)

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const cleanup = () => {
    if (terminalReference.current?._monitOnResize)
      window.removeEventListener(
        'resize',
        terminalReference.current._monitOnResize
      )
    try { socketReference.current?.disconnect() } catch { /* noop */ }
    try { terminalReference.current?.dispose() } catch { /* noop */ }
    socketReference.current = null
    terminalReference.current = null
    fitReference.current = null
  }

  useEffect(() => () => cleanup(), [])

  const connect = async () => {
    if (!hostId) return
    cleanup()
    setStatus('connecting')
    setMessage('')

    // Imports dinâmicos (xterm e socket.io só no browser).
    const [{ Terminal: XTerm }, { FitAddon }, { io }] = await Promise.all([
      import('xterm'),
      import('xterm-addon-fit'),
      import('socket.io-client'),
    ])

    const term = new XTerm({
      cursorBlink: true,
      fontFamily: 'Menlo, Consolas, monospace',
      fontSize: 13,
      theme: { background: '#1b1b1b' },
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(containerReference.current)
    fit.fit()
    terminalReference.current = term
    fitReference.current = fit

    const socket = io(`${SOCKET}/ssh`, {
      transports: ['websocket'],
      auth: { token: getUserToken(), apiKey: process.env.apiKey },
    })
    socketReference.current = socket

    socket.on('ssh:auth', () => {
      socket.emit('open', { hostId, cols: term.cols, rows: term.rows })
    })
    socket.on('ssh:ready', (p) => {
      setStatus('connected')
      term.focus()
      if (p?.host) term.writeln(`[32m● conectado a ${p.host}[0m\r\n`)
    })
    socket.on('ssh:hostkey', (p) => {
      if (p?.firstUse)
        term.writeln(`\r\n🔑 host key registrada nesta primeira conexão (TOFU).`)
    })
    socket.on('ssh:data', (d) => term.write(d))
    socket.on('ssh:close', () => {
      setStatus('closed')
      term.writeln('\r\n[33m— sessão encerrada —[0m')
    })
    socket.on('ssh:error', (m) => {
      setStatus('error')
      setMessage(m)
      term.writeln(`\r\n[31m${m}[0m`)
    })
    socket.on('disconnect', () => {
      if (terminalReference.current) setStatus((s) => (s === 'connected' ? 'closed' : s))
    })

    term.onData((d) => socket.emit('data', d))
    const onResize = () => {
      try {
        fit.fit()
        socket.emit('resize', { cols: term.cols, rows: term.rows })
      } catch { /* noop */ }
    }
    window.addEventListener('resize', onResize)
    term._monitOnResize = onResize
  }

  const disconnect = () => {
    cleanup()
    setStatus('closed')
  }

  const STATUS = {
    idle: { c: 'default', t: 'Desconectado' },
    connecting: { c: 'processing', t: 'Conectando…' },
    connected: { c: 'green', t: 'Conectado' },
    closed: { c: 'default', t: 'Sessão encerrada' },
    error: { c: 'red', t: 'Erro' },
  }

  return (
    <>
      <NextSeo title="Terminal SSH - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Terminal SSH"
            breadcrumbs={[{ title: 'Terminal', href: '/terminal/' }]}
            extra={
              <Space>
                <Select
                  style={{ width: 280 }}
                  placeholder="Selecione um host"
                  value={hostId}
                  onChange={setHostId}
                  options={hosts.map((h) => ({
                    value: h.id,
                    label: `${h.name} — ${h.username}@${h.host}:${h.port}`,
                  }))}
                  disabled={status === 'connecting' || status === 'connected'}
                />
                {status === 'connected' ? (
                  <Button danger onClick={disconnect}>
                    Desconectar
                  </Button>
                ) : (
                  <Button type="primary" disabled={!hostId} onClick={connect}>
                    Conectar
                  </Button>
                )}
                <Tag color={STATUS[status].c}>{STATUS[status].t}</Tag>
              </Space>
            }
          />

          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            message="Acesso privilegiado e auditado"
            description="Esta aba abre uma sessão de shell real no host selecionado. Requer a permissão OWNER de Terminal SSH; toda a sessão (abertura, fecho e comandos digitados) é registrada na trilha de auditoria. Os hosts e as credenciais são geridos em Configurações → Hosts SSH."
          />
          {message && status === 'error' && (
            <Alert type="error" showIcon style={{ marginBottom: 12 }} message={message} />
          )}

          <div
            ref={containerReference}
            style={{
              height: '64vh',
              background: '#1b1b1b',
              padding: 8,
              borderRadius: 6,
            }}
          />
        </PageContent>
      </Layout>
    </>
  )
}

export default Terminal
