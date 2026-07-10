/* eslint-disable unicorn/no-null */
import { Alert, Empty, message } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import HostTree from '~/components/terminal/host-tree'
import SessionTabs from '~/components/terminal/session-tabs'
import TerminalSession from '~/components/terminal/terminal-session'
import { useGlobal } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useSshStore } from '~/services/state-manager/ssh-store'

const MAX_SESSIONS = 8

const Terminal = () => {
  const { hosts, fetchHosts } = useSshStore()
  const {
    globalState: { serverEnvironments },
  } = useGlobal()
  // Sessões abertas (abas). O xterm/socket de cada uma vive dentro do
  // TerminalSession — aqui só metadados serializáveis.
  const [sessions, setSessions] = useState([])
  const [activeKey, setActiveKey] = useState(null)
  const sequenceReference = useRef(0)

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const openSession = (host) => {
    if (sessions.length >= MAX_SESSIONS) {
      message.warning(`Limite de ${MAX_SESSIONS} sessões simultâneas.`)
      return
    }
    const key = `s${++sequenceReference.current}`
    setSessions([
      ...sessions,
      {
        key,
        hostId: host.id,
        hostName: host.name,
        hostLabel: `${host.username}@${host.host}:${host.port}`,
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
      setActiveKey(remaining.length > 0 ? remaining[remaining.length - 1].key : null)
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
      <NextSeo title="Terminal SSH - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Terminal SSH"
            breadcrumbs={[{ title: 'Terminal', href: '/terminal/' }]}
          />

          <Alert
            type="warning"
            showIcon
            closable
            style={{ marginBottom: 12 }}
            message="Acesso privilegiado e auditado"
            description="Cada aba abre uma sessão de shell real no host escolhido. Requer a permissão OWNER de Terminal SSH; toda a sessão (abertura, fecho e comandos digitados) é registrada na trilha de auditoria. Os hosts e as credenciais são geridos em Configurações → Hosts SSH."
          />

          <div className="flex gap-4" style={{ height: '68vh' }}>
            <aside
              className="shrink-0 overflow-hidden rounded-md border border-gray-200 p-2 dark:border-gray-700"
              style={{ width: 280 }}
            >
              <HostTree
                hosts={hosts}
                environments={serverEnvironments}
                onOpen={openSession}
              />
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
              {sessions.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                  <Empty description="Dê um duplo clique em um host (ou use o botão Abrir) para iniciar uma sessão" />
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
                        <TerminalSession
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

export default Terminal
