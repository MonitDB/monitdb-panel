import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useContext, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { Input, Label, Select, Textarea } from '~/components/form'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import GlobalContext from '~/contexts/global'
import DatabaseIcons from '~/helpers/database-icons'
import Layout from '~/layouts/default'
import { addServer } from '~/services/servers'
import { handleException } from '~/utils/exceptions'

const ConfigurationsServersSinglePage = () => {
  const {
    globalState: { serverTypes, serverEnvironments },
    refreshData,
  } = useContext(GlobalContext)

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      serverType: '',
      connection: '1',
      environment: '',
      host: '',
      user: '',
      password: '',
      port: '',
      description: '',
      // status: '1',
    },
    onSubmit: async (values) => {
      setIsLoading(true)

      try {
        const response = await addServer(values)

        if (response?.status === 200) {
          toast.success(`Servidor ${values.name} criado!`)
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

    return formik?.values?.serverType
      ? serverTypes.find(
          (serverType) =>
            serverType.idtypeserver.toString() === formik.values.serverType
        )?.typeservername
      : serverTypes[0]?.typeservername
  }, [formik?.values?.serverType, serverTypes])

  return (
    <>
      <NextSeo title="Configurações - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Configurações"
              breadcrumbs={[
                {
                  title: 'Configurações',
                  href: '/configurations',
                },
                {
                  title: 'Servidores',
                  href: '/configurations/servers',
                },
                {
                  title: `Novo servidor`,
                  href: `/configurations/servers/new`,
                },
              ]}
            />

            <div>
              <form
                onSubmit={formik.handleSubmit}
                className="grid grid-cols-2 gap-4 md:max-w-[50%]"
              >
                <Label text="Nome do servidor" className="col-span-2">
                  <Input
                    type="text"
                    name="name"
                    className="w-full px-4 h-10 bg-white leading-10
                      rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </Label>
                <Label text="Ambiente" className="col-span-1">
                  {serverEnvironments.length > 0 ? (
                    <Select
                      containerClass="bg-white"
                      name="environment"
                      options={[
                        {
                          label: 'Selecione...',
                          value: '',
                        },
                        ...(serverEnvironments?.map((environment) => ({
                          label: environment.typeServerEnvironmentName,
                          value: environment.idTypeServerEnvironment,
                        })) || []),
                      ]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.environment}
                    />
                  ) : (
                    ''
                  )}
                </Label>
                <div className="col-span-1 relative flex items-end">
                  <Label text="Tipo de servidor" className="w-3/5">
                    {serverTypes.length > 0 ? (
                      <Select
                        containerClass="bg-white"
                        name="serverType"
                        options={[
                          {
                            label: 'Selecione...',
                            value: '',
                          },
                          ...(serverTypes?.map((serverType) => ({
                            label: serverType.typeservername,
                            value: serverType.idtypeserver,
                          })) || []),
                        ]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                <Label text="Usuário" className="col-span-1">
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
                <Label text="Porta" className="col-span-1">
                  <Input
                    type="text"
                    name="port"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.port}
                  />
                </Label>
                {/* <Label text="Status" className="col-span-1">
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
                </Label> */}
                <Label text="Descrição" className="col-span-2">
                  <Textarea
                    name="description"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                  />
                </Label>
                <div className="col-span-2">
                  <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar'}
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
