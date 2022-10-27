import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useContext, useEffect, useState } from 'react'

import ServerCard from '~/components/cards/server'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
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
  const [customEnvironments, setCustomEnvironments] = useState([])

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
    setCustomEnvironments([
      ...customEnvironments.map((environment, environmentIndex) => ({
        ...environment,
        isActive:
          environmentIndex === index
            ? !environment.isActive
            : environment.isActive,
      })),
    ])
  }

  useEffect(() => {
    setCustomEnvironments([
      ...serverEnvironments.map((environment) => ({
        ...environment,
        isActive: false,
      })),
    ])
  }, [serverEnvironments]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <NextSeo title="Dashboard - MonitDB" />
      <Layout>
        <PageWrapper>
          <LatestAlertsSidebar />

          {servers?.length > 0 ? (
            <>
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
                    className="btn"
                    onClick={() => formik.resetForm()}
                  >
                    Limpar
                  </button>
                </form>
              </PageContent>

              <PageContent hideBreadcrumbs={true}>
                <div className="w-full space-y-5">
                  {customEnvironments?.map(
                    (
                      {
                        idTypeServerEnvironment,
                        typeServerEnvironmentName,
                        isActive,
                      },
                      environmentIndex
                    ) => {
                      const filteredServers = filterServersByEnvironmentId(
                        idTypeServerEnvironment,
                        servers
                      ).map((server) => formatServer(server, { serverTypes }))

                      if (filteredServers.length === 0) {
                        return ''
                      }

                      return (
                        <div
                          key={`server-${idTypeServerEnvironment}-${environmentIndex}`}
                          className="w-full"
                        >
                          <button
                            type="button"
                            className={classNames(
                              `w-full py-2 px-4 bg-white border space-x-4
                                rounded-sm font-bold text-left text-sm md:w-2/3 lg:hover:border-gray`,
                              {
                                'border-gray': isActive,
                                'border-gray-light': !isActive,
                              }
                            )}
                            onClick={() => toggleIndexActive(environmentIndex)}
                          >
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={classNames(
                                'transition-all duration-300 ease-in-out transform',
                                {
                                  'rotate-180': !isActive,
                                }
                              )}
                            />
                            <span>
                              {environmentIndex + 1} -{' '}
                              {typeServerEnvironmentName} (
                              {filteredServers.length})
                            </span>
                          </button>
                          <Reveal active={isActive}>
                            <div className="flex flex-wrap py-2 gap-y-4 md:py-4">
                              {filteredServers.map((server, index) => (
                                <ServerCard
                                  key={`server-production-${index}`}
                                  className="w-full mb-4 md:w-72 md:mr-4"
                                  {...server}
                                />
                              ))}
                            </div>
                          </Reveal>
                        </div>
                      )
                    }
                  )}
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
