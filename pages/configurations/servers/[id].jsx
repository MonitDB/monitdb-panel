import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { Input, Label, Select, Textarea } from '~/components/form'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { deleteServer, updateServer } from '~/services/servers'
import { handleException } from '~/utils/exceptions'

const serversPagePath = '/configurations/servers'

const ConfigurationsServersSinglePage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
    refreshData,
  } = useGlobal()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      id: router?.query?.id,
      name: '',
      serverType: '',
      environment: '',
      connection: '1',
      host: '',
      user: '',
      password: '',
      port: '',
      description: '',
      status: '',
    },
    onSubmit: async (values) => {
      setIsLoading(true)

      try {
        const response = await updateServer({
          ...values,
          status: values.status === '1' ? true : false,
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
          (serverType) =>
            serverType.idtypeserver.toString() === formik.values.serverType
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
    formik.setFieldValue('name', currentServer.serverName)
    formik.setFieldValue('description', currentServer.serverDescription)
    formik.setFieldValue('serverType', currentServer.idTypeServer?.toString())
    formik.setFieldValue('environment', currentServer.idTypeServerEnvironment)

    formik.setFieldValue('connection', currentServer.idTypeServerConnection)
    formik.setFieldValue('host', currentServer.serverHost)
    formik.setFieldValue('user', currentServer.serverUser)
    formik.setFieldValue('port', currentServer.serverPort)
    formik.setFieldValue('description', currentServer.serverDescription)
    formik.setFieldValue('status', currentServer.serverEnable ? '1' : '0')
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
                    name="name"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </Label>
                <Label text="Environment" className="col-span-1">
                  {serverEnvironments?.length > 0 ? (
                    <Select
                      containerClass="bg-white"
                      name="environment"
                      options={serverEnvironments?.map((environment) => ({
                        label: environment.typeServerEnvironmentName,
                        value: environment.idTypeServerEnvironment,
                      }))}
                      onChange={(value) => {
                        formik.setFieldValue('environment', value)
                      }}
                      value={formik.values.environment}
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
                        name="serverType"
                        options={serverTypes?.map((serverType) => ({
                          label: serverType.typeservername,
                          value: serverType.idtypeserver,
                        }))}
                        onChange={(value) => {
                          formik.setFieldValue('serverType', value)
                        }}
                        value={formik.values.serverType}
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
                    name="host"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.host}
                  />
                </Label>
                <Label text="User" className="col-span-1">
                  <Input
                    type="text"
                    name="user"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.user}
                  />
                </Label>
                <Label text="Password" className="col-span-1">
                  <Input
                    type="password"
                    name="password"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </Label>
                <Label text="Port" className="col-span-1">
                  <Input
                    type="text"
                    name="port"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.port}
                  />
                </Label>
                <Label text="Status" className="col-span-1">
                  <Select
                    containerClass="bg-white"
                    name="status"
                    options={[
                      { value: '1', label: 'Ativo' },
                      { value: '0', label: 'Inativo' },
                    ]}
                    onChange={(value) => {
                      formik.setFieldValue('status', value)
                    }}
                    value={formik.values.status}
                  />
                </Label>
                <Label text="Description" className="col-span-2">
                  <Textarea
                    name="description"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                </Label>
                <div className="col-span-2 flex justify-between items-center">
                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <div
                  className="col-span-2 flex bg-danger bg-opacity-10 border
                  border-danger border-opacity-50 p-4 rounded-md"
                >
                  <button
                    type="button"
                    className="btn btn-danger ml-auto"
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </button>
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
