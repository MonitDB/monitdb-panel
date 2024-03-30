import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Row, Space, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import * as UserServices from '~/services/user'

const ServersPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const getUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await UserServices.list()

      setUsers(response?.data || [])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  const columns = [
    {
      title: 'User',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    {
      title: 'E-mail',
      dataIndex: 'loginEmail',
      key: 'loginEmail',
    },
    {
      title: 'Created at',
      dataIndex: 'loginDateCreate',
      key: 'loginDateCreate',
    },
    {
      title: 'Active',
      dataIndex: 'loginEnable',
      key: 'loginEnable',
      render: (text) => (text ? 'Ativo' : 'Inativo'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <a href={`/configurations/users/${record.id}`} className="text-blue">
            Edit
          </a>
        </Space>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Users - Configurations - MonitDB" />
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
                  title: 'Users',
                  href: '/configurations/users',
                },
              ]}
            />

            <div>
              <Row justify={'end'} style={{ marginBottom: '10px' }}>
                <Button
                  onClick={() => router.push('/configurations/users/new')}
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Add
                </Button>
              </Row>

              <Table
                columns={columns}
                loading={isLoading}
                dataSource={users}
                rowKey={(record) => `user-${record.id}`}
                pagination={users.length > 10}
              />
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ServersPage
