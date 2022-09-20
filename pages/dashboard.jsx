import {
  faChevronDown,
  faDatabase,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useContext, useEffect, useState } from 'react'

import Selector from '~/components/form/selector'
import Grid from '~/components/grid'
import Link from '~/components/link'
import { PageContent, PageWrapper } from '~/components/page'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import GlobalContext from '~/contexts/global'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DashboardPage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useContext(GlobalContext)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [data, setData] = useState()
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

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <NextSeo title="Dashboard" />
      <Layout>
        <PageWrapper>
          <LatestAlertsSidebar />

          <PageContent
            hideBreadcrumbs={true}
            className="flex items-start justify-between border-b border-gray-light"
          >
            <p className="mr-10 text-center">
              <strong className="block text-2xl">{servers.length}</strong>{' '}
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
                  ...serverEnvironments.map(
                    ({
                      idTypeServerEnvironment,
                      typeServerEnvironmentName,
                    }) => ({
                      value: idTypeServerEnvironment,
                      label: typeServerEnvironmentName,
                    })
                  ),
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
              {serverEnvironments.map(
                (
                  { idTypeServerEnvironment, typeServerEnvironmentName },
                  environmentIndex
                ) => {
                  const filteredServers = filterServersByEnvironmentId(
                    idTypeServerEnvironment,
                    servers
                  ).map((server) => formatServer(server, { serverTypes }))

                  return (
                    <div
                      key={`server-${idTypeServerEnvironment}-${environmentIndex}`}
                      className="w-full"
                    >
                      <button
                        type="button"
                        className="w-full py-2 px-4 bg-white border border-gray-light space-x-4
                      rounded-sm font-bold text-left text-sm md:w-2/3"
                        onClick={() => toggleIndexActive(environmentIndex)}
                      >
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={classNames(
                            'transition-all duration-300 ease-in-out transform',
                            {
                              'rotate-180': indexActive !== environmentIndex,
                            }
                          )}
                        />
                        <span>
                          {environmentIndex + 1} - {typeServerEnvironmentName} (
                          {filteredServers.length})
                        </span>
                      </button>
                      <Reveal active={indexActive === environmentIndex}>
                        <Grid className="py-2 gap-y-4 md:py-4">
                          {filteredServers.map((server, index) => (
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
                                          server.memoryInfo?.availablePercent *
                                          0.1
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
                                      {server.diskInfo?.totalCapacity} GB Total
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
                }
              )}
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default DashboardPage
