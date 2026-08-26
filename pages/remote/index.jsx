/* eslint-disable unicorn/no-null */
import { DesktopOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Empty, message, Tag, Tooltip } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import RemoteSession from '~/components/remote/remote-session'
import HostTree from '~/components/terminal/host-tree'
import HostWorkspace from '~/components/terminal/host-workspace'
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
      message.warning(`Limit of ${MAX_SESSIONS} simultaneous sessions.`)
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
      <NextSeo title="Remote Desktop - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title={
              <span className="flex items-center gap-2">
                Remote Desktop (RDP/VNC)
                <Tooltip title="Each tab opens a graphical session (RDP/VNC) on the host through Guacamole. Requires the OWNER permission for Remote Desktop; opening is audited and every session is recorded (replay) for compliance. The keyboard goes to the active tab. Hosts and credentials are managed in Configurations → Remote hosts.">
                  <Tag
                    color="warning"
                    icon={<SafetyCertificateOutlined />}
                    style={{ fontSize: 12, fontWeight: 400, marginInlineEnd: 0 }}
                  >
                    Privileged &amp; recorded
                  </Tag>
                </Tooltip>
              </span>
            }
            breadcrumbs={[{ title: 'Remote Desktop', href: '/remote/' }]}
          />

          <HostWorkspace
            sidebar={
              <HostTree
                hosts={hosts}
                environments={serverEnvironments}
                onOpen={openHostSession}
                openText="Connect"
                openIcon={<DesktopOutlined />}
                storageKey="remote"
                subtitle={(h) =>
                  `${h.protocol.toUpperCase()} ${h.host}:${h.port}`
                }
              />
            }
          >
            {sessions.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-gray-300 dark:border-gray-700">
                <Empty description="Double-click a host (or use the Connect button) to open a session" />
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
          </HostWorkspace>
        </PageContent>
      </Layout>
    </>
  )
}

export default Remote
