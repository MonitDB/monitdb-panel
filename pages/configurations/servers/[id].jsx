import { Button } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { Input, Label, Select, Textarea } from '~/components/form'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import DatabaseIcons from '~/helpers/database-icons'
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
    globalState: { servers, serverTypes, serverEnvironments },
    refreshData,
  } = useGlobal()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { userState: user } = useUser()

  useEffect(() => {
    if (
      !hasPermission(
        user,
        FeatureFunction.MONITORED_SERVERS,
        TypeGrant.OWNER
      ) &&
      user
    ) {
      router.push('/403')
    }
  }, [router, user])

  const formik = useFormik({
    initialValues: {
      id: router?.query?.id,
      serverName: '',
      idTypeServerConnection: '1',
      idTypeServerEnvironment: '',
      idTypeServer: '',
      serverHost: '',
      serverUser: '',
      serverPassword: '',
      serverPort: '',
      serverDescription: '',
      serverEnable: '1',
      serverIP: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true)

      try {
        const response = await updateServer({
          ...values,
          serverEnable: values.serverEnable === '1' ? true : false,
        })

        if (response?.status === 200) {
          toast.success(`Server ${values.name} edited!`)
          router.push(serversPagePath)
          refreshData()
        }
      } catch (error) {
        toast.error(handleException(error))
        setIsLoading(false)
      }
    },
  })

  const currentServer = useMemo(
    () => servers.find((server) => server.id === +router?.query?.id),
    [servers, router?.query?.id]
  )

  const databaseName = useMemo(() => {
    if (serverTypes?.length === 0) return ''

    return formik?.values?.serverType
      ? serverTypes.find(
          (serverType) => serverType.idtypeserver === formik.values.serverType
        )?.typeservername
      : serverTypes[0]?.typeservername
  }, [formik?.values?.serverType, serverTypes])

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
  }, [refreshData, currentServer]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!currentServer) return

    formik.setFieldValue('id', router?.query?.id)
    formik.setFieldValue('serverName', currentServer.serverName)
    formik.setFieldValue('serverDescription', currentServer.serverDescription)
    formik.setFieldValue('idTypeServer', currentServer.idTypeServer)
    formik.setFieldValue(
      'idTypeServerEnvironment',
      currentServer.idTypeServerEnvironment
    )

    formik.setFieldValue(
      'idTypeServerConnection',
      currentServer.idTypeServerConnection
    )
    formik.setFieldValue('serverHost', currentServer.serverHost)
    formik.setFieldValue('serverUser', currentServer.serverUser)
    formik.setFieldValue('serverPassword', currentServer.serverPassword)
    formik.setFieldValue('serverPort', currentServer.serverPort)
    formik.setFieldValue('serverDescription', currentServer.serverDescription)
    formik.setFieldValue('serverEnable', currentServer.serverEnable ? '1' : '0')
  }, [currentServer]) // eslint-disable-line react-hooks/exhaustive-deps

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
                  title: `Edit - ${currentServer?.serverName}`,
                  href: `/configurations/servers/${router?.query?.id}`,
                },
              ]}
            />

            <div>
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-2 gap-4 md:max-w-[50%]"
              >
                <Label text="Server name" className="col-span-2">
                  <Input
                    type="text"
                    name="serverName"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverName}
                  />
                </Label>
                <Label text="Environment" className="col-span-1">
                  {serverEnvironments?.length > 0 ? (
                    <Select
                      containerClass="bg-white"
                      name="idTypeServerEnvironment"
                      options={serverEnvironments?.map((environment) => ({
                        label: environment.typeServerEnvironmentName,
                        value: environment.id,
                      }))}
                      onChange={(value) => {
                        formik.setFieldValue('idTypeServerEnvironment', value)
                      }}
                      value={formik.values.idTypeServerEnvironment}
                    />
                  ) : (
                    ''
                  )}
                </Label>
                <div className="col-span-1 relative flex items-end">
                  <Label text="Server type" className="w-3/5">
                    {serverTypes.length > 0 ? (
                      <Select
                        containerClass="bg-white"
                        name="idTypeServer"
                        options={serverTypes?.map((serverType) => ({
                          label: serverType.typeServerName,
                          value: serverType.id,
                        }))}
                        onChange={(value) => {
                          formik.setFieldValue('idTypeServer', value)
                        }}
                        value={formik.values.idTypeServer}
                      />
                    ) : (
                      ''
                    )}
                  </Label>
                  <div className="w-2/5 relative pl-4">
                    <DatabaseIcons name={databaseName} className="w-10 h-10" />
                  </div>
                </div>
                <Label text="Host" className="col-span-1">
                  <Input
                    type="text"
                    name="serverHost"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverHost}
                  />
                </Label>
                <Label text="User" className="col-span-1">
                  <Input
                    type="text"
                    name="serverUser"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverUser}
                  />
                </Label>
                <Label text="Password" className="col-span-1">
                  <Input
                    type="password"
                    name="serverPassword"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverPassword}
                  />
                </Label>
                <Label text="Port" className="col-span-1">
                  <Input
                    type="text"
                    name="serverPort"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverPort}
                  />
                </Label>
                <Label text="Status" className="col-span-1">
                  <Select
                    containerClass="bg-white"
                    name="serverEnable"
                    options={[
                      { value: '1', label: 'Ativo' },
                      { value: '0', label: 'Inativo' },
                    ]}
                    onChange={(value) => {
                      formik.setFieldValue('serverEnable', value)
                    }}
                    value={formik.values.serverEnable}
                  />
                </Label>
                <Label text="Description" className="col-span-2">
                  <Textarea
                    name="serverDescription"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverDescription}
                  />
                </Label>
                <div className="col-span-2 flex justify-between items-center">
                  <Button
                    htmlType="submit"
                    type="primary"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {'Save'}
                  </Button>
                </div>
                <div
                  className="col-span-2 flex bg-danger bg-opacity-10 border
                  border-danger border-opacity-50 p-4 rounded-md"
                >
                  <Button type="primary" danger onClick={() => handleDelete()}>
                    Delete
                  </Button>
                </div>
              </form>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsServersSinglePage
