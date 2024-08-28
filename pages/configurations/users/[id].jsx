/* eslint-disable no-console */
import { Button, Form, Input, Select } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { Label } from '~/components/form'
import Loading from '~/components/loading'
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

const usersPagePath = '/configurations/users'

const UserSinglePage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [userData, setUserData] = useState()
  const [form] = Form.useForm()

  const { userState: user } = useUser()

  useEffect(() => {
    if (
      !hasPermission(user, FeatureFunction.USER_MANAGEMENT, TypeGrant.OWNER) &&
      user.grants
    ) {
      router.push('/403')
    }
  }, [router, user])

  const getUserData = useCallback(async () => {
    try {
      const response = await UserServices.getUserById(router?.query?.id)
      setUserData(response?.data)
      form.setFieldsValue({
        id: router?.query?.id,
        idRole: response?.data?.idRole,
        loginEmail: response?.data?.loginEmail,
        loginName: response?.data?.loginName,
        loginEnable: response?.data?.loginEnable ? '1' : '0',
      })
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }, [router?.query?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const getRoles = useCallback(async () => {
    try {
      const response = await UserServices.listRoles()
      setRoles(response?.data || [])
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleDelete = useCallback(async () => {
    if (!userData?.id || !window?.confirm) return

    const confirm = window.confirm(
      `Are you sure you want to delete the user "${userData.loginName}"?`
    )

    if (!confirm) return

    try {
      const response = await UserServices.remove(userData.id)

      if (response?.status === 200) {
        toast.success(`User ${userData.loginName} deleted!`)
        router.push(usersPagePath)
      }
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

  const rolesOptions = useMemo(() => {
    return roles.map((role) => ({
      label: role.roleName,
      value: role.idRole,
    }))
  }, [roles])

  const statusOptions = useMemo(
    () => [
      { value: '1', label: 'Active' },
      { value: '0', label: 'Inactive' },
    ],
    []
  )

  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      const response = await UserServices.update({
        ...values,
        loginEnable: values.loginEnable === '1' ? true : false,
      })

      if (response?.status === 200) {
        toast.success(`User ${values.loginName} edited!`)
        router.push(usersPagePath)
      }
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getRoles()
  }, [getRoles])

  useEffect(() => {
    if (!router?.query?.id) return
    getUserData()
  }, [getUserData, router?.query?.id])

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
                  title: `Edit - ${userData?.loginName || ''}`,
                  href: `/configurations/users/${router?.query?.id}`,
                },
              ]}
            />

            {!userData && <Loading />}

            <Form
              form={form}
              onFinish={handleSubmit}
              className="grid grid-cols-2 gap-4 md:max-w-[50%]"
            >
              <Label text="Name" className="col-span-1">
                <Form.Item
                  name="loginName"
                  rules={[
                    { required: true, message: 'Please input your name!' },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Label>
              <Label text="E-mail" className="col-span-1">
                <Form.Item
                  name="loginEmail"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email!',
                      type: 'email',
                    },
                  ]}
                >
                  <Input type="email" />
                </Form.Item>
              </Label>
              <Label text="Password" className="col-span-1">
                <Form.Item name="loginPassword">
                  <Input type="password" />
                </Form.Item>
              </Label>
              <Label text="Role" className="col-span-1">
                <Form.Item
                  name="idRole"
                  rules={[{ required: true, message: 'Please select a role!' }]}
                >
                  <Select options={rolesOptions} placeholder="Select a role" />
                </Form.Item>
              </Label>
              <Label text="Status" className="col-span-1">
                <Form.Item
                  name="loginEnable"
                  rules={[
                    { required: true, message: 'Please select a status!' },
                  ]}
                >
                  <Select
                    options={statusOptions}
                    placeholder="Select a status"
                  />
                </Form.Item>
              </Label>
              <div className="col-span-2 flex justify-between items-center">
                <Button type="primary" danger onClick={handleDelete}>
                  Delete
                </Button>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </Form>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default UserSinglePage
