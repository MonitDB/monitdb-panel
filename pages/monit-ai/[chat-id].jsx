import { Layout as AntdLayout } from 'antd'
import { NextSeo } from 'next-seo'
import React from 'react'

import ChatAI from '~/components/monit AI/chat'
import SidebarAI from '~/components/monit AI/sidebar'
import Layout from '~/layouts/default'

const { Content } = AntdLayout

const MonitAI = () => {
  return (
    <>
      <NextSeo title="Monit AI - MonitDB" />
      <Layout>
        <AntdLayout style={{ height: '100%' }}>
          <div className="bg-gray-dark">
            <SidebarAI />
          </div>

          <AntdLayout>
            <Content>
              <ChatAI />
            </Content>
          </AntdLayout>
        </AntdLayout>
      </Layout>
    </>
  )
}

export default MonitAI
