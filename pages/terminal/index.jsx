/* eslint-disable unicorn/no-null */
import { CodeOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Empty, message, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import HostTree from '~/components/terminal/host-tree'
import HostWorkspace from '~/components/terminal/host-workspace'
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
      message.warning(`Limit of ${MAX_SESSIONS} simultaneous sessions.`)
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
            title={
              <span className="flex items-center gap-2">
                Terminal SSH
                <Tooltip title="Each tab opens a real shell session on the selected host. Requires the OWNER permission for SSH Terminal; the whole session (open, close and typed commands) is written to the audit trail. Hosts and credentials are managed in Configurations → SSH hosts.">
                  <Tag
                    color="warning"
                    icon={<SafetyCertificateOutlined />}
                    style={{ fontSize: 12, fontWeight: 400, marginInlineEnd: 0 }}
                  >
                    Privileged &amp; audited
                  </Tag>
                </Tooltip>
              </span>
            }
            breadcrumbs={[{ title: 'Terminal', href: '/terminal/' }]}
          />

          <HostWorkspace
            sidebar={
              <HostTree
                hosts={hosts}
                environments={serverEnvironments}
                onOpen={openSession}
                openIcon={<CodeOutlined />}
                storageKey="ssh"
              />
            }
          >
            {sessions.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                <Empty description="Double-click a host (or use the Open button) to start a session" />
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
          </HostWorkspace>
        </PageContent>
      </Layout>
    </>
  )
}

export default Terminal
