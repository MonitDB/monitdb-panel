import { Button, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import IntegrationDrawer from '~/components/drawers/integration-drawer'
import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'

const Integrations = () => {
  const router = useRouter()
  const { query, pathname } = router

  const addNewIntegration = () => {
    router.push(
      {
        pathname: pathname,
        query: {
          ...query,
          'integration-new': 'true',
        },
      },
      undefined,
      { shallow: true }
    )
  }

  return (
    <>
      {' '}
      <NextSeo title="Integrations - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Integrations"
            breadcrumbs={[
              {
                title: 'Configurations',
                href: '/configurations/',
              },
              {
                title: 'Display Settings',
                href: '/configurations/integrations/',
              },
            ]}
            extra={
              <Button type="primary" onClick={addNewIntegration}>
                New Integration
              </Button>
            }
          />

          <Table></Table>

          <IntegrationDrawer />
        </PageContent>
      </Layout>
    </>
  )
}

export default Integrations
