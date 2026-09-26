import { Layout as AntdLayout } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect } from 'react'

import ChatAI from '~/components/monit AI/chat'
import SidebarAI from '~/components/monit AI/sidebar'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const { Content } = AntdLayout

const MonitAI = () => {
  const { userState: user } = useUser()
  const router = useRouter()

  // 22/09: esta pagina nao tinha guarda nenhuma — quem soubesse o endereco
  // entrava, e so a API e que travava. O nivel aqui espelha o que a API pede.
  useEffect(() => {
    if (
      !hasPermission(user, FeatureFunction.MONIT_AI, TypeGrant.READ) &&
      user.grants
    ) {
      router.push('/403')
    }
  }, [router, user])

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
