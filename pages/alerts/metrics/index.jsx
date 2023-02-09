import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Select from '~/components/form/select'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getAlertsParameterByServerId } from '~/services/alerts'

import MetricsModal from './modal'

const MetricsPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()

  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [parameterIdActive, setParameterIdActive] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [parameters, setParameters] = useState([])

  const serversOptions = useMemo(
    () => [
      { value: '', label: 'Select a server...' },
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

  const getParameters = useCallback(async () => {
    const { server } = router.query

    if (!server) return

    setIsLoading(true)
    setParameters([])

    try {
      const parameters = await getAlertsParameterByServerId(server)

      setParameters(parameters?.data)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [router.query])

  const handleChangeServer = useCallback((value) => {
    formik.setFieldValue('server', value)

    router.push(`/alerts/metrics/?server=${value}`)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    formik.setFieldValue('server', router.query.server)
    getParameters()
  }, [getParameters, router.query.server]) // eslint-disable-line react-hooks/exhaustive-deps

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
                onChange={handleChangeServer}
              />
            </form>

            {!router.query.server && (
              <div className="w-full">
                <p className="text-center text-gray-light md:text-3xl">
                  Please, select a server to view the alert parameters...
                </p>
              </div>
            )}

            {router.query.server && (
              <>
                {!isLoading ? (
                  <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                    <table className="prose max-w-full w-full mb-4">
                      <thead>
                        <tr className="text-sm font-bold text-gray-dark text-left">
                          <th
                            width="25%"
                            className="border-b-2 border-gray-light"
                          >
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
                        {parameters.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-10 text-center">
                              No parameters found
                            </td>
                          </tr>
                        )}

                        {parameters.length > 0 &&
                          parameters.map((parameter, index) => (
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
              </>
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
