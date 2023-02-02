import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useMemo, useState } from 'react'

import Select from '~/components/form/select'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import useAlerts from '~/hooks/use-alerts'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'

import MetricsModal from './modal'

const MetricsPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()
  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [parameterIdActive, setParameterIdActive] = useState(0)

  const serversOptions = useMemo(
    () => [
      { value: '', label: 'All servers' },
      ...servers.map(({ id, serverName }) => ({
        value: id,
        label: serverName,
      })),
    ],
    [servers]
  )

  const formik = useFormik({
    initialValues: {
      server: '',
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <MonitoredServersSidebar />

          <PageContent>
            <PageHeader
              title="Custom Metrics"
              breadcrumbs={[
                {
                  title: 'Alerts',
                  href: '/alerts/',
                },
                {
                  title: 'Custom Metrics',
                  href: '/alerts/metrics/',
                },
              ]}
            />

            <form
              className="w-full flex flex-col space-y-4 max-w-[400px] mb-10 xl:space-x-4 xl:space-y-0 xl:flex-row"
              onSubmit={formik.handleSubmit}
            >
              <Select
                name="schedule"
                containerClass="bg-white border-white"
                options={serversOptions}
                value={formik.values.server}
                onChange={(value) => {
                  formik.setFieldValue('server', value)
                }}
              />
              <button
                type="reset"
                className="btn"
                onClick={() => formik.resetForm()}
              >
                Clear
              </button>
            </form>

            {parameters.length > 0 ? (
              <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                <table className="prose max-w-full w-full mb-4">
                  <thead>
                    <tr className="text-sm font-bold text-gray-dark text-left">
                      <th width="25%" className="border-b-2 border-gray-light">
                        Name
                      </th>
                      <th
                        width="25%"
                        className="border-b-2 border-gray-light w-60"
                      >
                        Procedure
                      </th>
                      <th className="border-b-2 border-gray-light w-20">
                        dsProfileEmail
                      </th>
                      <th className="border-b-2 border-gray-light w-20">
                        Frequency
                      </th>
                      <th className="border-b-2 border-gray-light w-40">
                        E-mail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((parameter, index) => (
                      <tr
                        key={`parameter-${index}`}
                        className={`text-sm border-b border-gray-light transition-colors
                          duration-200 ease-in-out cursor-pointer lg:hover:bg-gray-light lg:hover:bg-opacity-50`}
                        onClick={() => {
                          setIsModalOpen(true)
                          setParameterIdActive(parameter.id)
                        }}
                      >
                        <td>{parameter.nmAlert}</td>
                        <td>{parameter.nmProcedure}</td>
                        <td>{parameter.dsProfileEmail}</td>
                        <td>{parameter.frequencyMinutes}</td>
                        <td>{parameter.dsEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
      {isModalOpen && parameterIdActive && (
        <MetricsModal
          parameterId={parameterIdActive}
          onClose={() => {
            setIsModalOpen(false)
            setParameterIdActive(0)
          }}
        />
      )}
    </>
  )
}

export default MetricsPage
