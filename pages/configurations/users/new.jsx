/* eslint-disable no-console */
import { Button, Form, Input, Select } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import * as UserServices from '~/services/user'
import { handleException } from '~/utils/exceptions'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const UsersSinglePage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])

  const { userState: user } = useUser()

  useEffect(() => {
    if (
      !hasPermission(user, FeatureFunction.USER_MANAGEMENT, TypeGrant.OWNER) &&
      user.grants
    ) {
      router.push('/403')
    }
  }, [router, user])

  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setIsLoading(true)

    try {
      const response = await UserServices.create({
        ...values,
        loginEnable: values.loginEnable === '1',
      })

      if (response?.status === 200) {
        toast.success(`User ${values.loginName} created!`)
        router.push('/configurations/users')
      }
    } catch (error) {
      toast.error(handleException(error))
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

  const rolesOptions = useMemo(() => {
    return roles.map((role) => ({
      label: role.roleName,
      value: role.id,
    }))
  }, [roles])

  const statusOptions = useMemo(
    () => [
      { value: '1', label: 'Active' },
      { value: '0', label: 'Inactive' },
    ],
    []
  )

  useEffect(() => {
    getRoles()
  }, [getRoles])

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
                {
                  title: `New user`,
                  href: `/configurations/users/new`,
                },
              ]}
            />

            <div>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  idRole: '',
                  loginEmail: '',
                  loginName: '',
                  loginPassword: '',
                  loginEnable: '',
                }}
              >
                <Form.Item
                  label="Name"
                  name="loginName"
                  rules={[
                    { required: true, message: 'Please enter your name' },
                  ]}
                >
                  <Input placeholder="Enter name" />
                </Form.Item>

                <Form.Item
                  label="E-mail"
                  name="loginEmail"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                >
                  <Input placeholder="Enter email" />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="loginPassword"
                  rules={[
                    { required: true, message: 'Please enter your password' },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>

                <Form.Item
                  label="Role"
                  name="idRole"
                  rules={[{ required: true, message: 'Please select a role' }]}
                >
                  <Select placeholder="Select a role" options={rolesOptions} />
                </Form.Item>

                <Form.Item
                  label="Status"
                  name="loginEnable"
                  rules={[
                    { required: true, message: 'Please select a status' },
                  ]}
                >
                  <Select
                    placeholder="Select a status"
                    options={statusOptions}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isLoading}>
                    {isLoading ? 'Creating...' : 'Create'}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default UsersSinglePage
