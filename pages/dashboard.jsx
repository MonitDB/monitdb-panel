import {
  faBell,
  faChevronDown,
  faCircleInfo,
  faDatabase,
  faMagnifyingGlass,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Select from '~/components/form/select'
import Selector from '~/components/form/selector'
import Grid from '~/components/grid'
import Link from '~/components/link'
import {
  PageContent,
  PageSidebar,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
import { getDashboard } from '~/services/dashboard'

const filterDataByServers = (servers) => {
  const alerts = []
  const environments = []
  const result = {}

  for (const server of servers) {
    alerts.push(...server.alerts)

    if (!result?.[server.typeServerEnvironmentName]) {
      result[server.typeServerEnvironmentName] = []
    }

    result[server.typeServerEnvironmentName].push(server)
  }

  return {
    alerts,
    environments,
    servers: result,
  }
}

const DashboardPage = () => {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [data, setData] = useState()
  const [servers, setServers] = useState()
  const [alerts, setAlerts] = useState([])
  const [environments, setEnvironments] = useState([])
  const [indexActive, setIndexActive] = useState(0)

  const formik = useFormik({
    initialValues: {
      name: '',
      status: [],
      group: [],
      monitor: [],
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  const toggleIndexActive = (index) => {
    setIndexActive(indexActive === index ? -1 : index)
  }

  const getData = async () => {
    try {
      const response = await getDashboard()
      const dataResult = response?.data?.result || []

      const { alerts, environments, servers } = filterDataByServers(
        dataResult.servers
      )

      setData({
        numberOfAlerts: dataResult?.numberOfAlerts,
        numberOfInstances: dataResult?.numberOfInstances,
      })

      setServers(servers)
      setAlerts(alerts)
      setEnvironments(environments)
      setIsDataLoaded(true)

      // setData(dataResult)
      // setAlerts(filterAlerts(dataResult))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <NextSeo title="Dashboard" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <header className="mb-4">
              <PageSidebarTitle>
                <FontAwesomeIcon icon={faBell} />
                <span>Últimos alertas</span>
              </PageSidebarTitle>
              <p className="text-sm">
                Alertas gerados ou atualizados recentemente:
              </p>
            </header>
            <form className="mb-4 flex items-center space-x-2">
              <Select
                name="hour"
                options={[
                  { value: '3', label: '3 dias' },
                  { value: '1440', label: '24 horas' },
                  { value: '720', label: '12 horas' },
                  { value: '360', label: '6 horas' },
                  { value: '180', label: '3 horas' },
                  { value: '60', label: '1 hora' },
                  { value: '15', label: '15 minutos' },
                ]}
              />
              <Select
                name="group"
                options={[
                  { value: '', label: 'Todos os grupos' },
                  { value: 'production', label: 'Production' },
                  { value: 'azure-database', label: 'Azure Database' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'test', label: 'Test' },
                  { value: 'simulation', label: 'Simulation' },
                ]}
              />
            </form>
            {alerts.length > 0 ? (
              <ul>
                {alerts.map((alertItem, alertIndex) => (
                  <li
                    key={`dashboard-${alertIndex}`}
                    className="py-2 border-b border-gray-light border-opacity-25"
                  >
                    <Link
                      href="/dashboard/"
                      className={classNames(
                        'flex items-center space-x-2 border-l-2 pl-2 text-sm transition-all duration-150 ease-in-out border-orange lg:hover:border-l-8',
                        {
                          // 'border-orange': alertItem.type === 'warning',
                          // 'border-blue': alertItem.type === 'info',
                        }
                      )}
                    >
                      <span className="w-6 min-w-6 text-lg">
                        {alertItem?.type === 'info' && (
                          <FontAwesomeIcon icon={faCircleInfo} />
                        )}
                        {/* {alertItem.type === 'warning' && (
                        <FontAwesomeIcon icon={faWarning} />
                      )} */}
                        <FontAwesomeIcon icon={faWarning} />
                      </span>
                      <div className="w-full">
                        <p>{alertItem.message}</p>
                        <p className="text-xs text-opacity-50 text-white">
                          1 alertas ativo
                        </p>
                      </div>
                      <span
                        className={classNames(
                          'flex items-center justify-center rounded-full w-6 min-w-6 h-6 ml-auto text-xs bg-orange',
                          {
                            // 'bg-blue': alertItem?.type === 'info',
                            // 'bg-orange': alertItem?.type === 'warning',
                          }
                        )}
                      >
                        1
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}
            <div className="py-4">
              <Link
                href="/alerts/"
                className="py-2 px-4 bg-blue text-white rounded text-xs lg:hover:bg-blue-light"
              >
                Ver todos
              </Link>
            </div>
          </PageSidebar>

          {isDataLoaded && data ? (
            <>
              <PageContent
                hideBreadcrumbs={true}
                className="flex items-start justify-between border-b border-gray-light"
              >
                <p className="mr-10 text-center">
                  <strong className="block text-2xl">
                    {data.numberOfInstances}
                  </strong>{' '}
                  <span className="text-sm">instâncias</span>
                </p>
                <form
                  className="w-full flex flex-col space-y-4 xl:space-x-4 xl:space-y-0 xl:flex-row"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="relative min-w-56">
                    <input
                      type="text"
                      name="name"
                      className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                      placeholder="Filtrar por nomes"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
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
                    options={[
                      { value: '', label: 'Todos os status' },
                      { value: 'critical', label: 'Critical' },
                      { value: 'warning', label: 'Warning' },
                      { value: 'info', label: 'Info' },
                      { value: 'healthy', label: 'Healthy' },
                    ]}
                    onChange={(value) => {
                      formik.setFieldValue('status', value)
                    }}
                  />
                  <Selector
                    name="group"
                    options={[
                      { value: '', label: 'Todos os grupos' },
                      { value: 'production', label: 'Production' },
                      { value: 'azure-database', label: 'Azure Database' },
                      { value: 'staging', label: 'Staging' },
                      { value: 'test', label: 'Test' },
                      { value: 'simulation', label: 'Simulation' },
                    ]}
                    onChange={(value) => {
                      formik.setFieldValue('group', value)
                    }}
                  />
                  <Selector
                    name="monitor"
                    options={[
                      { value: '', label: 'All base monitors' },
                      { value: 'primary', label: 'Primary' },
                      { value: 'secondary', label: 'Secondary' },
                      { value: 'azure', label: 'Azure' },
                      { value: 'simulation', label: 'Simulation' },
                    ]}
                    onChange={(value) => {
                      formik.setFieldValue('monitor', value)
                    }}
                  />
                  <button
                    type="reset"
                    className="block px-4 h-10 leading-10 rounded bg-blue text-white
                  text-xs uppercase lg:hover:bg-blue-light disabled:opacity-30
                  disabled:lg:hover:bg-blue"
                    onClick={() => formik.resetForm()}
                  >
                    Limpar
                  </button>
                </form>
              </PageContent>

              <PageContent hideBreadcrumbs={true}>
                <div className="w-full space-y-5">
                  {Object.keys(servers).map(
                    (serverEnvironment, serverEnvironmentIndex) => (
                      <div
                        key={`server-${serverEnvironment}-${serverEnvironmentIndex}`}
                        className="w-full"
                      >
                        <button
                          type="button"
                          className="w-full py-2 px-4 bg-white border border-gray-light space-x-4
                      rounded-sm font-bold text-left text-sm md:w-2/3"
                          onClick={() =>
                            toggleIndexActive(serverEnvironmentIndex)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={classNames(
                              'transition-all duration-300 ease-in-out transform',
                              {
                                'rotate-180':
                                  indexActive !== serverEnvironmentIndex,
                              }
                            )}
                          />
                          <span>
                            {serverEnvironmentIndex + 1} - {serverEnvironment} (
                            {servers[serverEnvironment].length})
                          </span>
                        </button>
                        <Reveal active={indexActive === serverEnvironmentIndex}>
                          <Grid className="py-2 gap-y-4 md:py-4">
                            {servers[serverEnvironment].map((server, index) => (
                              <div
                                key={`server-production-${index}`}
                                className="col-span-1 border border-gray-light md:col-span-4 lg:col-span-3"
                              >
                                <Link
                                  href="/dashboard/"
                                  className={classNames(
                                    `block bg-white p-2 relative border-l-4 lg:p-4 lg:hover:border-l-8`,
                                    {
                                      'border-l-danger':
                                        server.healthStatus === 'Critical',
                                      'border-l-orange':
                                        server.healthStatus === 'Warning',
                                      'border-l-success':
                                        server.healthStatus === 'Healtly',
                                      'opacity-25': !server.serverEnable,
                                    }
                                  )}
                                >
                                  <h4 className="flex items-center text-sm space-x-2 mb-2 lg:mb-4">
                                    <FontAwesomeIcon
                                      icon={faDatabase}
                                      className="text-base"
                                    />
                                    <span>{server.serverName}</span>
                                  </h4>
                                  <dl className="text-xs w-full text-gray">
                                    <dt className="block text-gray-dark mt-2">
                                      Memória
                                    </dt>
                                    <dd>
                                      <span className="text-success">
                                        {server.memoryInfo?.available}{' '}
                                        {server.memoryInfo?.unity} - Livre
                                      </span>{' '}
                                      /{' '}
                                      <span>
                                        {server.memoryInfo?.capacity}{' '}
                                        {server.memoryInfo?.unity} Total
                                      </span>
                                    </dd>
                                    <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                                      <span
                                        className="absolute top-0 left-0 h-full bg-success"
                                        style={{
                                          width: `${
                                            server.memoryInfo
                                              ?.availablePercent * 0.1
                                          }%`,
                                        }}
                                      />
                                    </dd>
                                    <dt className="block text-gray-dark mt-2">
                                      Disco
                                    </dt>
                                    <dd>
                                      <span className="text-success">
                                        {server.diskInfo?.totalAvailable} GB -
                                        Livre
                                      </span>{' '}
                                      /{' '}
                                      <span>
                                        {server.diskInfo?.totalCapacity} GB
                                        Total
                                      </span>
                                    </dd>
                                    <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                                      <span
                                        className="absolute top-0 left-0 h-full bg-success"
                                        style={{
                                          width: `40%`,
                                        }}
                                      />
                                    </dd>
                                  </dl>
                                </Link>
                              </div>
                            ))}
                          </Grid>
                        </Reveal>
                      </div>
                    )
                  )}
                </div>
              </PageContent>
            </>
          ) : (
            ''
          )}
        </PageWrapper>
      </Layout>
    </>
  )
}

export default DashboardPage
