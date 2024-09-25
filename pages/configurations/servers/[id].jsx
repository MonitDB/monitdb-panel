/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Form, Row, Space } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import ServerForm from '~/components/page/configurations/server/server-form'
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { deleteServer, updateServer } from '~/services/servers'
import { handleException } from '~/utils/exceptions'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const serversPagePath = '/configurations/servers'

const ConfigurationsServersSinglePage = () => {
  const {
    globalState: { servers },
    refreshData,
  } = useGlobal()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { userState: user } = useUser()

  const [form] = Form.useForm()

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

  const currentServer = useMemo(
    () => servers.find((server) => server.id === +router?.query?.id),
    [router?.query?.id]
  )

  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      const response = await updateServer({
        ...values,
        serverEnable: values.serverEnable,
        id: Number(router?.query?.id),
      })
      if (response?.status === 200) {
        toast.success(`Server ${values.serverName} edited!`)
        router.push(serversPagePath)
        refreshData()
      }
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }

  const handleDelete = useCallback(async () => {
    if (!currentServer || !window?.confirm) return
    const confirm = window.confirm(
      `Are you sure you want to delete the server "${currentServer.serverName}"?`
    )
    if (!confirm) return
    try {
      const response = await deleteServer(currentServer.id)
      if (response?.status === 200) {
        toast.success(`Server ${currentServer.serverName} deleted!`)
        router.push(serversPagePath)
        refreshData()
      }
    } catch (error) {
      toast.error(handleException(error))
      setIsLoading(false)
    }
  }, [currentServer, router, refreshData])

  useEffect(() => {
    if (currentServer) {
      form.setFieldsValue(currentServer)
    }
  }, [currentServer, form])

  return (
    <>
      <NextSeo title="Servers - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Configurations"
              breadcrumbs={[
                { title: 'Configurations', href: '/configurations' },
                { title: 'Servers', href: '/configurations/servers' },
                {
                  title: `Edit - ${currentServer?.serverName}`,
                  href: `/configurations/servers/${router?.query?.id}`,
                },
              ]}
            />
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <ServerForm />
            </Form>
            <Row>
              <Space>
                <Button
                  type="primary"
                  onClick={form.submit}
                  loading={isLoading}
                >
                  Save
                </Button>
                <Button
                  danger
                  type="default"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </Space>
            </Row>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsServersSinglePage
