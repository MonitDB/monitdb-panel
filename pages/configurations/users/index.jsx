import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Space, Table } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Status from '~/components/status'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import * as UserServices from '~/services/user'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const ServersPage = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const { userState: user } = useUser()

  useEffect(() => {
    if (
      !hasPermission(user, FeatureFunction.USER_MANAGEMENT, TypeGrant.OWNER) &&
      user.grants
    ) {
      router.push('/403')
    }
  }, [router, user])

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
      // A coluna vem vazia da API. Um traco diz "nao ha dado"; a celula em
      // branco parece um erro de render.
      render: (value) =>
        value ? (
          <span className="mn-mono whitespace-nowrap">
            {moment(value).format('DD/MM/YYYY HH:mm')}
          </span>
        ) : (
          <span className="text-gray">—</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'loginEnable',
      key: 'loginEnable',
      render: (value) =>
        value ? (
          <Status tone="ok">Active</Status>
        ) : (
          <Status tone="off">Inactive</Status>
        ),
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
              title="Users"
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
              extra={
                <Button
                  type="primary"
                  onClick={() => router.push('/configurations/users/new')}
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  New user
                </Button>
              }
            />

            <div>

              <Table
                columns={columns}
                loading={isLoading}
                dataSource={users}
                rowKey={(record) => `user-${record.id}`}
                pagination={{ hideOnSinglePage: true }}
              />
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ServersPage
