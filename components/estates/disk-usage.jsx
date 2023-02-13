import {
  faDatabase,
  faFileExport,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import React, { useMemo } from 'react'

import Selector from '~/components/form/selector'
import Link from '~/components/link'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const InstalledVersions = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'Todos os status' },
      { value: 'critical', label: 'Critical' },
      { value: 'warning', label: 'Warning' },
      { value: 'info', label: 'Info' },
      { value: 'healthy', label: 'Healthy' },
    ],
    []
  )

  const groupsOptions = useMemo(
    () => [
      { value: '', label: 'Todos os grupos' },
      ...serverEnvironments.map(({ id, typeServerEnvironmentName }) => ({
        value: id,
        label: typeServerEnvironmentName,
      })),
    ],
    [serverEnvironments]
  )

  const monitorsOptions = useMemo(
    () => [
      { value: '', label: 'All base monitors' },
      { value: 'primary', label: 'Primary' },
      { value: 'secondary', label: 'Secondary' },
      { value: 'azure', label: 'Azure' },
      { value: 'simulation', label: 'Simulation' },
    ],
    []
  )

  const formik = useFormik({
    initialValues: {
      name: '',
      status: [],
      groups: [],
      monitors: [],
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between border-b border-gray-light"
      >
        <header className="pt-8 mb-10 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
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
            options={statusOptions}
            value={formik.values.status}
            onChange={(value) => {
              formik.setFieldValue('status', value)
            }}
          />
          <Selector
            name="groups"
            options={groupsOptions}
            value={formik.values.groups}
            onChange={(value) => {
              formik.setFieldValue('groups', value)
            }}
          />
          <Selector
            name="monitors"
            options={monitorsOptions}
            value={formik.values.monitors}
            onChange={(value) => {
              formik.setFieldValue('monitors', value)
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
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <button type="button" className="btn btn--small md:ml-auto">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Exportar
            </button>
          </header>

          <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
            <table className="m-0">
              <thead>
                <tr>
                  <th>Nome do servidor</th>
                  <th>Disco</th>
                  <th>Espaço usado</th>
                  <th>Capacidade</th>
                  <th>Porcentagem usada</th>
                  <th>Espaço projetado em 1 ano</th>
                  <th>Mudança projetada</th>
                  <th>Tempo até encher</th>
                </tr>
              </thead>

              {serverEnvironments.map(
                (
                  { idTypeServerEnvironment, typeServerEnvironmentName },
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
                    <tbody
                      key={`server-${idTypeServerEnvironment}-${environmentIndex}`}
                    >
                      <tr>
                        <td colSpan="8">
                          <h3 className="heading-xs pt-5">
                            {environmentIndex + 1} - {typeServerEnvironmentName}
                          </h3>
                        </td>
                      </tr>
                      {filteredServers.map((server, index) => (
                        <tr key={`server-production-${index}`}>
                          <td className="border-l-4 border-gray">
                            <FontAwesomeIcon
                              icon={faDatabase}
                              className="mr-2"
                            />
                            {server.serverName}
                          </td>
                          <td>
                            <p>
                              <Link
                                href="/estates/?tab=disk-usage"
                                className="text-blue no-underline"
                              >
                                D:
                              </Link>
                            </p>
                          </td>
                          <td>115.70 GB</td>
                          <td>147.65 GB</td>
                          <td>78%</td>
                          <td>146.52 GB</td>
                          <td>+30.95 GB</td>
                          <td>em até um ano</td>
                        </tr>
                      ))}
                    </tbody>
                  )
                }
              )}
            </table>
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default InstalledVersions
