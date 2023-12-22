import { Button } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { Input, Label, Select, Textarea } from '~/components/form'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import DatabaseIcons from '~/helpers/database-icons'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { addServer, testServer } from '~/services/servers'
import { handleException } from '~/utils/exceptions'

const ConfigurationsServersSinglePage = () => {
  const {
    globalState: { serverTypes, serverEnvironments },
    refreshData,
  } = useGlobal()

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [isTesting, setIsTesting] = useState(false)
  const onCheck = async () => {
    setIsTesting(true)

    try {
      const result = await testServer(formik.values)

      if (result.data.status == 500) {
        toast.error(result.data.message)
        return
      }

      if (result) toast.success('Server test connection successful!')
    } catch (error) {
      toast.error(`Server connection failed: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      serverName: '',
      idTypeServerConnection: '1',
      idTypeServerEnvironment: '',
      idTypeServer: '',
      serverHost: '',
      serverUser: '',
      serverPassword: '',
      serverPort: '',
      serverDescription: '',
      status: '1',
      serverIP: '',
    },

    onSubmit: async (values) => {
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
        setIsLoading(false)
      }
    },
  })

  const databaseName = useMemo(() => {
    if (serverTypes?.length === 0) return ''

    return formik?.values?.idTypeServer
      ? serverTypes.find(
          (idTypeServer) =>
            idTypeServer.idtypeserver === formik.values.idTypeServer
        )?.typeservername
      : serverTypes[0]?.typeservername
  }, [formik?.values?.idTypeServer, serverTypes])

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
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-2 gap-4 md:max-w-[50%]"
              >
                <Label text="Server name" className="col-span-2">
                  <Input
                    type="text"
                    name="serverName"
                    className="w-full px-4 h-10 bg-white leading-10
                      rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverName}
                  />
                </Label>
                <Label text="Environment" className="col-span-1">
                  {serverEnvironments.length > 0 ? (
                    <Select
                      containerClass="bg-white"
                      name="idTypeServerEnvironment"
                      options={[
                        {
                          label: 'Select...',
                          value: '',
                        },
                        ...(serverEnvironments?.map((environment) => ({
                          label: environment.typeServerEnvironmentName,
                          value: environment.id,
                        })) || []),
                      ]}
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
                        options={[
                          {
                            label: 'Select...',
                            value: '',
                          },
                          ...(serverTypes?.map((idTypeServer) => ({
                            label: idTypeServer.typeServerName,
                            value: idTypeServer.id,
                          })) || []),
                        ]}
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
                <Label text="Server IP" className="col-span-1">
                  <Input
                    type="text"
                    name="serverIP"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serverIP}
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
                    name="status"
                    options={[
                      { value: '1', label: 'Ativo' },
                      { value: '0', label: 'Inativo' },
                    ]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.status}
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

                <div className="col-span-2 flex justify-end w-full">
                  <Button
                    type="dashed"
                    disabled={isLoading || isTesting}
                    onClick={onCheck}
                  >
                    {isTesting ? 'Testing Connection...' : 'Test Server'}
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create'}
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
