import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, message, Popconfirm, Row, Space, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'
import React from 'react'

import Link from '~/components/link'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Status from '~/components/status'
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { deleteServer } from '~/services/servers'
import { handleException } from '~/utils/exceptions'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const ConfigurationsServersPage = () => {
  const {
    globalState: { servers },
    refreshData,
  } = useGlobal()

  const { userState: user } = useUser()
  const [loading, setLoading] = useState([])

  const router = useRouter()
  useEffect(() => {
    if (
      !hasPermission(
        user,
        FeatureFunction.MONITORED_SERVERS,
        TypeGrant.OWNER
      ) &&
      user.grants
    ) {
      router.push('/403')
    }
  }, [router, user])

  const handleDeleteServer = async (id) => {
    const server = servers.find((server) => server.id === id)

    try {
      setLoading((previousLoading) => [...previousLoading, id])
      const response = await deleteServer(id)
      await refreshData()
      if (response?.status === 200) {
        message.success(`Server ${server.serverName} deleted!`)
      }
    } catch (error) {
      message.error(handleException(error))
    } finally {
      setLoading((previousLoading) =>
        previousLoading.filter((loadingId) => loadingId !== id)
      )
    }
  }

  return (
    <>
      <NextSeo title="Servers - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Servers"
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
                          <Status tone="ok">Active</Status>
                        ) : (
                          <Status tone="off">Inactive</Status>
                        ),
                    },
                    { dataIndex: 'serverUser', title: 'Server User' },
                    { dataIndex: 'serverDescription', title: 'Description' },
                    { dataIndex: 'serverPort', title: 'Port' },
                    {
                      dataIndex: '',
                      title: 'Actions',
                      render: (value, record) => (
                        <Row>
                          <Space>
                            <Button type="default">
                              {' '}
                              <Link
                                href={`/configurations/servers/${record.id}`}
                                className="text-blue"
                              >
                                Edit Credentials
                              </Link>
                            </Button>
                            <Popconfirm
                              title={`Delete the server ${record.serverName}`}
                              description="Are you sure to delete this server?"
                              okText="Yes"
                              cancelText="No"
                              onConfirm={() => {
                                handleDeleteServer(record.id)
                              }}
                            >
                              <Button
                                type="default"
                                danger
                                loading={loading.includes(record.id)}
                              >
                                Delete Server
                              </Button>
                            </Popconfirm>
                          </Space>
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
