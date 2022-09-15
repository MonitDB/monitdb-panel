import React from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const AnalysisPage = () => {
  return (
    <Layout>
      <PageWrapper className="p-8">
        <PageContent removeSidebarMargin={true}>
          <PageHeader title="Análise" />
        </PageContent>
      </PageWrapper>
    </Layout>
  )
}

export default AnalysisPage
