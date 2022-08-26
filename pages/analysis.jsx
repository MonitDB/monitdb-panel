import React from 'react'

import { PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const AnalysisPage = () => {
  return (
    <Layout>
      <PageWrapper className="p-8">
        <PageHeader title="Análise" />
        <div className="w-full prose max-w-full"></div>
      </PageWrapper>
    </Layout>
  )
}

export default AnalysisPage
