import React from 'react'

import { PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const AlertsPage = () => {
  return (
    <Layout>
      <PageWrapper className="p-8">
        <PageHeader title="Alertas" />
        <div className="w-full prose max-w-full"></div>
      </PageWrapper>
    </Layout>
  )
}

export default AlertsPage
