/* eslint-disable no-console */
import { Form, notification } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useState } from 'react'

import UserForm from '~/components/forms/userForm'
import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import * as UserServices from '~/services/user'
import { handleException } from '~/utils/exceptions'

const UsersCreatePage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])

  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setIsLoading(true)

    try {
      await UserServices.create({
        ...values,
        loginEnable: values.loginEnable === '1',
      })

      notification.success({ description: `User ${values.loginName} created!` })
      router.push('/configurations/users')
    } catch (error) {
      notification.error({ description: handleException(error) })
      setIsLoading(false)
    }
  }

  const getRoles = useCallback(async () => {
    try {
      const response = await UserServices.listRoles()
      setRoles(response?.data || [])
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getRoles()
  }, [getRoles])

  return (
    <Layout>
      <NextSeo title="Users - Configurations - MonitDB" />

      <PageContent removeSidebarMargin={true}>
        <PageHeader
          title="New user"
          breadcrumbs={[
            {
              title: 'Configurations',
              href: '/configurations',
            },
            {
              title: 'Users',
              href: '/configurations/users',
            },
            {
              title: `New`,
              href: `/configurations/users/new`,
            },
          ]}
        />
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <UserForm
            roles={roles}
            isLoading={isLoading}
            statusOptions={[
              { value: '1', label: 'Active' },
              { value: '0', label: 'Inactive' },
            ]}
          />
        </Form>
      </PageContent>
    </Layout>
  )
}

export default UsersCreatePage
