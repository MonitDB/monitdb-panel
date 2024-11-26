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
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import ServerCard from '~/components/cards/server'
import { Select } from '~/components/form'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageSidebar, PageWrapper } from '~/components/page'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import {
  Feature,
  FeatureFunction,
  hasFeature,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DashboardPage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const { userState: user } = useUser()

  const [activeKey, setActiveKey] = useState([])

  const [refreshInterval, setRefreshInterval] = useState(HOUR)
  const router = useRouter()

  useEffect(() => {
    if (!hasFeature(user, Feature.DASHBOARD) && user.grants) router.push('/403')

    const INITIAL_REFRESH_INTERVAL = Number(
      localStorage.getItem(REFRESH_INTERVAL_LOCAL_STORAGE_KEY) || 15 * SECOND
    )

    const intervalId = setInterval(() => {
      setRefreshInterval(INITIAL_REFRESH_INTERVAL)
    }, INITIAL_REFRESH_INTERVAL)

    return () => {
      clearInterval(intervalId)
    }
  }, [router, user])

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
    () => Object.values(formik.values)?.some((value) => value.length > 0),
    [formik.values]
  )

  const statusOptions = useMemo(
    () => [
      // { value: '', label: 'All status' },
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
      // { value: '', label: 'All groups' },
      ...formattedEnvironments
        .filter((environment) => environment.servers.length > 0)
        .map(({ id, typeServerEnvironmentName }) => ({
          value: id,
          label: typeServerEnvironmentName,
        })),
    ],
    [formattedEnvironments]
  )

  const updateFormattedEnvironments = useCallback(() => {
    const { environments, str, status } = formik.values

    setFormattedEnvironments((previousEnvironments) =>
      previousEnvironments.map((environment) => {
        const isActiveEnvironment =
          !hasAnyFilter ||
          environments.length === 0 ||
          environments.includes(environment.id)

        const filteredServers = environment.servers.map((server) => {
          const isActiveServer =
            (!str ||
              server.serverName.toLowerCase().includes(str.toLowerCase())) &&
            (status.length === 0 || status.includes(server.status))

          return {
            ...server,
            isActive: isActiveEnvironment && isActiveServer,
          }
        })

        return {
          ...environment,
          isActive: isActiveEnvironment,
          servers: filteredServers,
        }
      })
    )
  }, [formik.values, hasAnyFilter])

  useEffect(() => {
    // Atualize os ambientes formatados sempre que os servidores ou os tipos de servidor mudarem
    setFormattedEnvironments(
      serverEnvironments.map((environment) => ({
        ...environment,
        isActive: true,
        isDropdownActive: true,
        servers:
          filterServersByEnvironmentId(environment.id, servers).map((server) =>
            formatServer(server, { serverTypes })
          ) || [],
      }))
    )
  }, [serverEnvironments, servers, serverTypes])

  useEffect(() => {
    updateFormattedEnvironments()
  }, [servers, formik.values, hasAnyFilter, updateFormattedEnvironments])

  const collapseItems = useMemo(
    () =>
      formattedEnvironments
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
                            showCPU={hasPermission(
                              user,
                              FeatureFunction.STATUS_CPU,
                              TypeGrant.READ
                            )}
                            showMemory={hasPermission(
                              user,
                              FeatureFunction.STATUS_MEMORY,
                              TypeGrant.READ
                            )}
                            showDisks={hasPermission(
                              user,
                              FeatureFunction.DISK_SPACE,
                              TypeGrant.READ
                            )}
                            showStatus={hasPermission(
                              user,
                              FeatureFunction.STATUS_SERVICE,
                              TypeGrant.READ
                            )}
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
        .filter((item) => item?.children),
    [formattedEnvironments, refreshInterval, user]
  )

  const totalServers = useMemo(() => {
    const total = formattedEnvironments.reduce(
      (accumulator, formattedEnvironment) =>
        accumulator +
        formattedEnvironment.servers.filter((server) => server.isActive).length,
      0
    )
    setActiveKey(collapseItems.map((item) => item.key))
    return total
  }, [formattedEnvironments, collapseItems])

  return (
    <>
      <NextSeo title="Dashboard - MonitDB" />
      <Layout>
        <PageWrapper>
          {hasPermission(user, FeatureFunction.LAST_ALERTS, TypeGrant.READ) && (
            <PageSidebar>
              <LatestAlertsSidebar />
            </PageSidebar>
          )}
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
                  {hasPermission(
                    user,
                    FeatureFunction.DASHBOARD_FILTER,
                    TypeGrant.EXECUTE
                  ) && (
                    <>
                      <div className="relative min-w-56">
                        <Input
                          type="text"
                          name="str"
                          placeholder="Filter by names"
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
                    </>
                  )}

                  {hasPermission(
                    user,
                    FeatureFunction.REFRESH_FREQUENCY,
                    TypeGrant.EXECUTE
                  ) && (
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
                  )}
                </form>
              </PageContent>

              {hasPermission(
                user,
                FeatureFunction.INSTANCES,
                TypeGrant.READ
              ) && (
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
              )}
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
