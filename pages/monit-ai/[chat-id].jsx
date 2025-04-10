import { Layout } from 'antd'
import React from 'react'

import ChatAI from '~/components/monit AI/chat'
import SidebarAI from '~/components/monit AI/sidebar'

const { Content } = Layout

const MonitAI = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarAI />
      <Layout>
        {/* O ChatAI ocupa o restante do layout */}
        <Content>
          <ChatAI />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MonitAI
