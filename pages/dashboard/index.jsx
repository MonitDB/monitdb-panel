import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Collapse, Input } from 'antd'
import {
  HOUR,
  MINUTE,
  REFRESH_INTERVAL_LOCAL_STORAGE_KEY,
  SECOND,
} from 'const/time'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from 'react'

import ServerCard from '~/components/cards/server'
import { Select } from '~/components/form'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageSidebar, PageWrapper } from '~/components/page'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DashboardPage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const [activeKey, setActiveKey] = useState([])

  const [refreshInterval, setRefreshInterval] = useState(HOUR)

  useEffect(() => {
    const INITIAL_REFRESH_INTERVAL = Number(
      localStorage.getItem(REFRESH_INTERVAL_LOCAL_STORAGE_KEY) || 15 * SECOND
    )
    setRefreshInterval(INITIAL_REFRESH_INTERVAL)
  }, [])

  const [formattedEnvironments, setFormattedEnvironments] = useState([])

  const formik = useFormik({
    initialValues: {
      str: '',
      status: [],
      environments: [],
    },
    onSubmit: () => {},
  })

  const hasAnyFilter = useMemo(
    () => Object.values(formik.values).some((value) => value.length > 0),
    [formik.values]
  )

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'All status' },
      { value: 1, label: 'Healtly' },
      { value: 2, label: 'Info' },
      { value: 3, label: 'Warning' },
      { value: 4, label: 'Critical' },
      { value: 5, label: 'Down' },
    ],
    []
  )

  const environmentsOptions = useMemo(
    () => [
      { value: '', label: 'All groups' },
      ...formattedEnvironments
        .filter((environment) => environment.servers.length > 0)
        .map(({ id, typeServerEnvironmentName }) => ({
          value: id,
          label: typeServerEnvironmentName,
        })),
    ],
    [formattedEnvironments]
  )

  const collapseItems = formattedEnvironments
    .map((formattedEnvironment, environmentIndex) => {
      return formattedEnvironment.servers.length > 0 &&
        formattedEnvironment.isActive
        ? {
            key: `${formattedEnvironment.id}`,
            label: (
              <div className="flex items-center">
                <span className="mr-2">
                  {environmentIndex + 1} -{' '}
                  {formattedEnvironment.typeServerEnvironmentName} (
                  {formattedEnvironment.servers.length})
                </span>
              </div>
            ),
            children: (
              <div className="flex flex-wrap py-2 gap-y-4 md:py-4">
                {formattedEnvironment.servers
                  .filter(({ isActive }) => isActive)
                  .map((server, index) => (
                    <div key={index} style={{ marginRight: '15px' }}>
                      <ServerCard
                        key={`server-${index}`}
                        className="w-full mb-4 md:mb-0 m:10"
                        interval={refreshInterval}
                        type={server.idTypeServer}
                        {...server}
                      />
                    </div>
                  ))}
              </div>
            ),
          }
        : undefined
    })
    .filter((item) => item?.children)

  const totalServers = useMemo(() => {
    formattedEnvironments
      // .filter(({ isActive }) => isActive)
      .reduce(
        (accumulator, formattedEnvironment) =>
          accumulator +
          formattedEnvironment.servers.filter((server) => server.isActive)
            .length,
        0
      )
    setActiveKey(collapseItems.map((item) => item.key))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formattedEnvironments])

  useEffect(() => {
    const { environments, str } = formik.values

    setFormattedEnvironments((formattedEnvironments) => [
      ...formattedEnvironments.map((formattedEnvironment) => ({
        ...formattedEnvironment,
        isActive:
          !hasAnyFilter ||
          environments.length === 0 ||
          (environments.length > 0 &&
            environments.includes(formattedEnvironment.id.toString()))
            ? true
            : false,
        servers: formattedEnvironment.servers.map((server) => ({
          ...server,
          isActive:
            !hasAnyFilter ||
            !str ||
            (str && server.serverName.toLowerCase().includes(str.toLowerCase()))
              ? true
              : false,
        })),
      })),
    ])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverEnvironments, formik.values, hasAnyFilter])

  useEffect(() => {
    setFormattedEnvironments([
      ...serverEnvironments.map((environment) => ({
        ...environment,
        isActive: true,
        isDropdownActive: true,
        servers:
          filterServersByEnvironmentId(environment.id, servers).map((server) =>
            formatServer(server, { serverTypes })
          ) || [],
      })),
    ])
  }, [serverEnvironments, servers, serverTypes])

  return (
    <>
      <NextSeo title="Dashboard - MonitDB" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <LatestAlertsSidebar />
          </PageSidebar>

          {servers?.length > 0 ? (
            <>
              <PageContent
                hideBreadcrumbs={true}
                className="flex items-start justify-between border-b border-gray-light"
              >
                <p className="mr-10 text-center">
                  <strong className="block text-2xl">{totalServers}</strong>{' '}
                  <span className="text-sm">Instances</span>
                </p>
                <form
                  className="w-full flex flex-col space-y-4 xl:space-x-4 xl:space-y-0 xl:flex-row"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="relative min-w-56">
                    <Input
                      type="text"
                      name="str"
                      placeholder="Filtrar por nomes"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.str}
                    />
                    <button
                      type="submit"
                      className="group absolute top-1/2 transform -translate-y-1/2 right-4"
                    >
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-sm text-gray lg:group-hover:text-gray-dark"
                      />
                    </button>
                  </div>
                  <Selector
                    name="status"
                    value={formik.values.status}
                    options={statusOptions}
                    onChange={(value) => {
                      formik.setFieldValue('status', value)
                    }}
                  />
                  <Selector
                    name="environments"
                    value={formik.values.environments}
                    options={environmentsOptions}
                    onChange={(value) => {
                      formik.setFieldValue('environments', value)
                    }}
                  />
                  <Button
                    type="text"
                    htmlType="reset"
                    disabled={!hasAnyFilter}
                    onClick={() => formik.resetForm()}
                  >
                    Clear
                  </Button>
                  <div style={{ width: '400px' }}>
                    <Select
                      name="refreshInterval"
                      options={[
                        { value: 5 * SECOND, label: 'Every 5 seconds' },
                        { value: 15 * SECOND, label: 'Every 15 seconds' },
                        { value: 30 * SECOND, label: 'Every 30 seconds' },
                        { value: 15 * SECOND, label: 'Every 45 seconds' },
                        { value: MINUTE, label: 'Every 1 minute' },
                      ]}
                      value={refreshInterval}
                      onChange={(value) => {
                        localStorage.setItem(
                          REFRESH_INTERVAL_LOCAL_STORAGE_KEY,
                          value
                        )
                        setRefreshInterval(value)
                      }}
                    />
                  </div>
                </form>
              </PageContent>

              <PageContent hideBreadcrumbs={true}>
                <div className="w-full space-y-5">
                  <Collapse
                    size="small"
                    bordered={false}
                    activeKey={activeKey}
                    items={collapseItems}
                    onChange={setActiveKey}
                  />
                </div>
              </PageContent>
            </>
          ) : (
            <PageContent className="w-full min-h-screen flex items-center justify-center">
              <Loading />
            </PageContent>
          )}
        </PageWrapper>
      </Layout>
    </>
  )
}

export default DashboardPage
