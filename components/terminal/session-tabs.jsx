import { Badge, Tabs, Tooltip } from 'antd'
import React from 'react'

const STATUS_BADGE = {
  connecting: 'processing',
  connected: 'success',
  closed: 'default',
  error: 'error',
}

/**
 * Barra de abas das sessões SSH. Só navegação: os painéis (xterm) são renderizados
 * pela página, sempre montados, para preservar o buffer das abas ocultas.
 */
const SessionTabs = ({ sessions, activeKey, onChange, onClose }) => (
  <Tabs
    type="editable-card"
    hideAdd
    size="small"
    activeKey={activeKey}
    onChange={onChange}
    onEdit={(key, action) => action === 'remove' && onClose(key)}
    items={sessions.map((session) => ({
      key: session.key,
      label: (
        <Tooltip title={session.hostLabel}>
          <Badge
            status={STATUS_BADGE[session.status] || 'default'}
            text={session.hostName}
          />
        </Tooltip>
      ),
    }))}
  />
)

export default SessionTabs
