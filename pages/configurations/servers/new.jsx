import { Button, Col, Form, Input, Row, Space } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import ServerForm from '~/components/page/configurations/server/server-form'
import DatabaseIcons from '~/helpers/database-icons'
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { addServer, testServer } from '~/services/servers'
import { handleException } from '~/utils/exceptions'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const ConfigurationsServersSinglePage = () => {
  const {
    globalState: { serverTypes, serverEnvironments },
    refreshData,
  } = useGlobal()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
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

  const onCheck = async () => {
    const values = form.getFieldsValue()
    setIsTesting(true)
    try {
      const result = await testServer(values)
      if (result.data.status === 500) {
        toast.error(result.data.message)
        return
      }
      toast.success('Server test connection successful!')
    } catch (error) {
      toast.error(`Server connection failed: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  const handleSubmit = async (values) => {
    setIsLoading(true)
    try {
      const response = await addServer(values)
      if (response?.status === 201) {
        toast.success(`Server ${values.serverName} created!`)
        router.push('/configurations/servers')
        refreshData()
      }
    } catch (error) {
      toast.error(handleException(error))
    } finally {
      setIsLoading(false)
    }
  }

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
                {
                  title: `New server`,
                  href: `/configurations/servers/new`,
                },
              ]}
            />

            <div>
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <ServerForm />
              </Form>
              <Space
                gutter={16}
                justify={'end'}
                style={{ marginTop: '12px', width: '50%' }}
              >
                <Button
                  type="dashed"
                  onClick={onCheck}
                  disabled={isLoading || isTesting}
                >
                  {isTesting ? 'Testing Connection...' : 'Test Server'}
                </Button>

                <Button
                  type="primary"
                  onClick={form.submit}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </Button>
              </Space>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsServersSinglePage
