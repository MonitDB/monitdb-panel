import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Col, Row, Table, Tag } from 'antd'
import { NextSeo } from 'next-seo'
import React from 'react'

import Link from '~/components/link'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'

const ConfigurationsServersPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()
  return (
    <>
      <NextSeo title="Servers - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Configurations"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations',
                },
                {
                  title: 'Servers',
                  href: '/configurations/servers',
                },
              ]}
            />

            <div>
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <Link
                  href="/configurations/servers/new"
                  className="btn btn--small"
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Add
                </Link>
              </header>

              <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                <Table
                  dataSource={servers}
                  loading={servers.length === 0}
                  columns={[
                    { dataIndex: 'serverName', title: 'Server' },
                    {
                      dataIndex: 'serverEnable',
                      title: 'Status',
                      render: (value) =>
                        value ? (
                          <Tag color="green">Active</Tag>
                        ) : (
                          <Tag color="red">Inactive</Tag>
                        ),
                    },
                    { dataIndex: 'serverUser', title: 'Server User' },
                    {
                      dataIndex: '',
                      title: 'Actions',
                      render: (value, record) => (
                        <Row>
                          <Col>
                            <Button type="link">
                              {' '}
                              <Link
                                href={`/configurations/servers/${record.id}`}
                                className="text-blue"
                              >
                                Edit Credentials
                              </Link>
                            </Button>
                          </Col>
                        </Row>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsServersPage
