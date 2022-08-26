import React from 'react'

import { PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const ReportsPage = () => {
  return (
    <Layout>
      <PageWrapper className="p-8">
        <PageHeader title="Relatórios" />
        <div className="w-full prose max-w-full"></div>
      </PageWrapper>
    </Layout>
  )
}

export default ReportsPage
