/* eslint-disable unicorn/no-null */
import { Alert, Empty, message } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import RemoteSession from '~/components/remote/remote-session'
import HostTree from '~/components/terminal/host-tree'
import SessionTabs from '~/components/terminal/session-tabs'
import { useGlobal } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useRemoteStore } from '~/services/state-manager/remote-store'

// RDP/VNC pesa mais que SSH (canvas + gravação por sessão) — cap menor.
const MAX_SESSIONS = 4

const Remote = () => {
  const { hosts, fetchHosts } = useRemoteStore()
  const {
    globalState: { serverEnvironments },
  } = useGlobal()
  // Sessões abertas (abas). O client/canvas Guacamole de cada uma vive dentro
  // do RemoteSession — aqui só metadados serializáveis.
  const [sessions, setSessions] = useState([])
  const [activeKey, setActiveKey] = useState(null)
  const sequenceReference = useRef(0)

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const openHostSession = (host) => {
    if (sessions.length >= MAX_SESSIONS) {
      message.warning(`Limite de ${MAX_SESSIONS} sessões simultâneas.`)
      return
    }
    const key = `r${++sequenceReference.current}`
    setSessions([
      ...sessions,
      {
        key,
        hostId: host.id,
        hostName: host.name,
        hostLabel: `${host.protocol.toUpperCase()} ${host.host}:${host.port}`,
        status: 'connecting',
        message: '',
      },
    ])
    setActiveKey(key)
  }

  const closeSession = (key) => {
    const remaining = sessions.filter((session) => session.key !== key)
    setSessions(remaining)
    if (activeKey === key)
      setActiveKey(
        remaining.length > 0 ? remaining[remaining.length - 1].key : null
      )
  }

  const onStatusChange = useCallback((key, status, text) => {
    setSessions((current) =>
      current.map((session) =>
        session.key === key
          ? { ...session, status, message: text || '' }
          : session
      )
    )
  }, [])

  const activeSession = sessions.find((session) => session.key === activeKey)

  return (
    <>
      <NextSeo title="Desktop remoto - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Desktop remoto (RDP/VNC)"
            breadcrumbs={[{ title: 'Desktop remoto', href: '/remote/' }]}
          />

          <Alert
            type="warning"
            showIcon
            closable
            style={{ marginBottom: 12 }}
            message="Acesso remoto privilegiado e gravado"
            description="Cada aba abre uma sessão gráfica (RDP/VNC) no host via Guacamole. Requer OWNER de Desktop remoto; a abertura é auditada e cada sessão é gravada (replay) para compliance. O teclado vai para a aba ativa. Hosts e credenciais em Configurações → Hosts remotos."
          />

          <div className="flex gap-4" style={{ height: '70vh' }}>
            <aside
              className="shrink-0 overflow-hidden rounded-md border border-gray-200 p-2 dark:border-gray-700"
              style={{ width: 280 }}
            >
              <HostTree
                hosts={hosts}
                environments={serverEnvironments}
                onOpen={openHostSession}
                openText="Conectar"
                subtitle={(h) =>
                  `${h.protocol.toUpperCase()} ${h.host}:${h.port}`
                }
              />
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
              {sessions.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                  <Empty description="Dê um duplo clique em um host (ou use o botão Conectar) para abrir uma sessão" />
                </div>
              ) : (
                <>
                  <SessionTabs
                    sessions={sessions}
                    activeKey={activeKey}
                    onChange={setActiveKey}
                    onClose={closeSession}
                  />
                  {activeSession?.status === 'error' &&
                    activeSession?.message && (
                      <Alert
                        type="error"
                        showIcon
                        style={{ marginBottom: 8 }}
                        message={activeSession.message}
                      />
                    )}
                  <div className="min-h-0 flex-1">
                    {sessions.map((session) => (
                      <div
                        key={session.key}
                        style={{
                          height: '100%',
                          display: session.key === activeKey ? 'block' : 'none',
                        }}
                      >
                        <RemoteSession
                          session={session}
                          active={session.key === activeKey}
                          onStatusChange={onStatusChange}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </main>
          </div>
        </PageContent>
      </Layout>
    </>
  )
}

export default Remote
