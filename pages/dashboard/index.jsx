import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import ServerCard from '~/components/cards/server'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageSidebar, PageWrapper } from '~/components/page'
import LatestAlertsSidebar from '~/components/sidebar/latest-alerts'
import GlobalContext from '~/contexts/global'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DashboardPage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useContext(GlobalContext)

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
      { value: '', label: 'Todos os status' },
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
      { value: '', label: 'Todos os grupos' },
      ...formattedEnvironments
        .filter(
          (environment) =>
            environment.isActive && environment.servers.length > 0
        )
        .map(({ idTypeServerEnvironment, typeServerEnvironmentName }) => ({
          value: idTypeServerEnvironment,
          label: typeServerEnvironmentName,
        })),
    ],
    [formattedEnvironments]
  )

  const totalServers = useMemo(
    () =>
      formattedEnvironments
        .filter(({ isActive }) => isActive)
        .reduce(
          (accumulator, formattedEnvironment) =>
            accumulator +
            formattedEnvironment.servers.filter((server) => server.isActive)
              .length,
          0
        ),
    [formattedEnvironments]
  )

  const toggleIndexActive = useCallback(
    (index) => {
      setFormattedEnvironments([
        ...formattedEnvironments.map((environment, environmentIndex) => ({
          ...environment,
          isDropdownActive:
            environmentIndex === index
              ? !environment.isDropdownActive
              : environment.isDropdownActive,
        })),
      ])
    },
    [formattedEnvironments]
  )

  useEffect(() => {
    const { environments, str } = formik.values

    setFormattedEnvironments((formattedEnvironments) => [
      ...formattedEnvironments.map((formattedEnvironment) => ({
        ...formattedEnvironment,
        isActive:
          !hasAnyFilter ||
          environments.length === 0 ||
          (environments.length > 0 &&
            environments.includes(
              formattedEnvironment.idTypeServerEnvironment.toString()
            ))
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
  }, [serverEnvironments, formik.values, hasAnyFilter])

  useEffect(() => {
    setFormattedEnvironments([
      ...serverEnvironments.map((environment) => ({
        ...environment,
        isActive: true,
        isDropdownActive: true,
        servers:
          filterServersByEnvironmentId(
            environment.idTypeServerEnvironment,
            servers
          ).map((server) => formatServer(server, { serverTypes })) || [],
      })),
    ])
  }, [serverEnvironments, servers, serverTypes])

  // eslint-disable-next-line no-console
  console.log(
    'formattedEnvironmentsformattedEnvironments',
    formattedEnvironments
  )

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
                  <span className="text-sm">instâncias</span>
                </p>
                <form
                  className="w-full flex flex-col space-y-4 xl:space-x-4 xl:space-y-0 xl:flex-row"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="relative min-w-56">
                    <input
                      type="text"
                      name="str"
                      className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
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
                  <button
                    type="reset"
                    className="btn"
                    disabled={!hasAnyFilter}
                    onClick={() => formik.resetForm()}
                  >
                    Limpar
                  </button>
                </form>
              </PageContent>

              <PageContent hideBreadcrumbs={true}>
                <div className="w-full space-y-5">
                  {formattedEnvironments
                    .filter(({ isActive }) => isActive)
                    .map((formattedEnvironment, environmentIndex) => {
                      const formattedServers =
                        formattedEnvironment.servers.filter(
                          ({ isActive }) => isActive
                        )

                      if (formattedServers.length === 0) {
                        return ''
                      }

                      return (
                        <div
                          key={`server-${formattedEnvironment.idTypeServerEnvironment}-${environmentIndex}`}
                          className="w-full"
                        >
                          <button
                            type="button"
                            className={classNames(
                              `w-full py-2 px-4 bg-white border space-x-4
                                rounded-sm font-bold text-left text-sm md:w-2/3 lg:hover:border-gray`,
                              {
                                'border-gray':
                                  formattedEnvironment.isDropdownActive,
                                'border-gray-light':
                                  !formattedEnvironment.isDropdownActive,
                              }
                            )}
                            onClick={() => toggleIndexActive(environmentIndex)}
                          >
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={classNames(
                                'transition-all duration-300 ease-in-out transform',
                                {
                                  'rotate-180':
                                    !formattedEnvironment.isDropdownActive,
                                }
                              )}
                            />
                            <span>
                              {environmentIndex + 1} -{' '}
                              {formattedEnvironment.typeServerEnvironmentName} (
                              {formattedEnvironment.servers.length})
                            </span>
                          </button>
                          <Reveal
                            active={formattedEnvironment.isDropdownActive}
                          >
                            <div className="flex flex-wrap py-2 gap-y-4 md:py-4">
                              {formattedServers.map((server, index) => (
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
                    })}
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
