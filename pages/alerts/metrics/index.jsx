import { Select, Table } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getAlertsParameterByServerId } from '~/services/alerts'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

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
        value: `${id}`,
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

  const { userState: user } = useUser()

  useEffect(() => {
    if (
      user.grants &&
      !hasPermission(user, FeatureFunction.ALERTS_CUSTOMIZATION, TypeGrant.READ)
    ) {
      router.push('/403')
    }
  }, [router, user])

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

  const handleMetricsModalClose = useCallback(
    (forceRefresh) => {
      setIsModalOpen(false)
      setParameterIdActive(0)

      forceRefresh && getParameters()
    },
    [getParameters]
  )

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
                style={{ width: '300px' }}
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
                <Table
                  size="small"
                  loading={isLoading}
                  pagination={parameters?.length > 10}
                  dataSource={parameters ?? []}
                  columns={[
                    { dataIndex: 'alertName', title: 'Name' },
                    { dataIndex: 'procedureName', title: 'Procedure' },
                    {
                      dataIndex: 'profileEmailDescription',
                      title: 'dsProfileEmail',
                    },
                    { dataIndex: 'frequencyMinutes', title: 'Frequency' },
                    { dataIndex: 'emailDescription', title: 'E-mail' },
                  ]}
                  onRow={(parameter) => ({
                    style: { cursor: 'pointer' },
                    onClick: () => {
                      setIsModalOpen(true)
                      setParameterIdActive(parameter.id)
                    },
                  })}
                />
              </>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>

      {isModalOpen && parameterIdActive && (
        <MetricsModal
          serverId={router.query.server}
          parameterId={parameterIdActive}
          onClose={handleMetricsModalClose}
        />
      )}
    </>
  )
}

export default MetricsPage
