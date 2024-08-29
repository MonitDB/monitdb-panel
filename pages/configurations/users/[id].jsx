/* eslint-disable no-console */
import { Form, notification } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import UserForm from '~/components/forms/userForm'
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
      notification.error({ description: handleException(error) })
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
        notification.success({
          description: `User ${userData.loginName} deleted!`,
        })
        router.push(usersPagePath)
      }
    } catch (error) {
      notification.error({ description: handleException(error) })
      setIsLoading(false)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

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
      await UserServices.update({
        id: router?.query?.id,
        ...values,
        loginEnable: values.loginEnable === '1' ? true : false,
      })

      notification.success({ description: `User ${values.loginName} edited!` })
      router.push(usersPagePath)
    } catch (error) {
      notification.error({ description: handleException(error) })
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

            <Form form={form} onFinish={handleSubmit}>
              <UserForm
                handleDelete={handleDelete}
                roles={roles}
                statusOptions={statusOptions}
                isLoading={isLoading}
                isEdit={true}
              />
            </Form>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default UserSinglePage
