import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useContext } from 'react'

import { Input, Label, Select, Selector, Textarea } from '~/components/form'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import GlobalContext from '~/contexts/global'
import Layout from '~/layouts/default'

const ConfigurationsServersSinglePage = () => {
  const {
    globalState: { serverTypes, serverEnvironments },
  } = useContext(GlobalContext)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

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
                className="grid grid-cols-2 gap-4 max-w-[50%]"
              >
                <Label text="Nome do servidor" className="col-span-2">
                  <Input
                    type="text"
                    name="name"
                    className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </Label>
                <Label text="Ambiente" className="col-span-1">
                  {serverEnvironments.length > 0 ? (
                    <Select
                      name="environment"
                      options={serverEnvironments?.map((environment) => ({
                        label: environment.typeServerEnvironmentName,
                        value: environment.idTypeServerEnvironment,
                      }))}
                      onChange={(value) => {
                        formik.setFieldValue('status', value)
                      }}
                    />
                  ) : (
                    ''
                  )}
                </Label>
                <Label text="Tipo de servidor" className="col-span-1">
                  {serverTypes.length > 0 ? (
                    <Select
                      name="serverType"
                      options={serverTypes?.map((serverType) => ({
                        label: serverType.typeservername,
                        value: serverType.idtypeserver,
                      }))}
                      onChange={(value) => {
                        formik.setFieldValue('serverType', value)
                      }}
                    />
                  ) : (
                    ''
                  )}
                </Label>
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
                    type="text"
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
                <Label text="Status" className="col-span-2">
                  <Selector
                    name="status"
                    options={[
                      { value: '1', label: 'Ativo' },
                      { value: '0', label: 'Inativo' },
                    ]}
                    onChange={(value) => {
                      formik.setFieldValue('status', value)
                    }}
                  />
                </Label>
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
                  <button type="submit" className="btn">
                    Criar
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
