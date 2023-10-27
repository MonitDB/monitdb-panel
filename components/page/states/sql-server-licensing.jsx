import React, { useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getSqlServerLicensing } from '~/services/states'

const SqlServerLicensing = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlServerLicensing, setSqlServerLicensing] = useState([])

  const {
    globalState: { servers },
  } = useGlobal()

  const getData = async () => {
    const { data } = await getSqlServerLicensing()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('sql server licensing', data)

    setSqlServerLicensing(data)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between"
      >
        <header className="pt-8 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-th:border-b-4 prose-headings:m-0 prose-td:align-middle">
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <div className="w-full md:w-3/4">
              <h2 className="heading-md">Licence Info</h2>
            </div>

            <ExportButton
              data={sqlServerLicensing}
              fileName={'SQL_SERVER_LICENSING'}
            />
          </header>

          <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
            {isLoading ? (
              <Loading />
            ) : (
              <table className="m-0">
                <thead>
                  <tr>
                    <th>Server Name</th>
                    <th>Processors</th>
                    <th>Cores</th>
                    <th>Logic Processors</th>
                    <th>License req</th>
                    <th>Always on</th>
                    <th>SQL Instance</th>
                    <th>Version</th>
                  </tr>
                </thead>

                <tbody>
                  {servers.map(({ id, serverName }) => {
                    const filteredSqlServerLicensing =
                      sqlServerLicensing.filter(
                        ({ ServerId }) => ServerId === id
                      )

                    if (filteredSqlServerLicensing.length === 0) {
                      return ''
                    }

                    return filteredSqlServerLicensing.map(
                      (licensing, index) => (
                        <tr key={`server-item-${id}-${index}`}>
                          <td>
                            <span className="rounded py-px px-1 text-xs bg-blue text-white">
                              VM
                            </span>{' '}
                            <strong>{serverName}</strong>
                          </td>
                          <td>{licensing['Processadores']}</td>
                          <td>{licensing['Cores por Processador']}</td>
                          <td>{licensing['Processadores Logicos']}</td>
                          <td>{licensing['Licenças Requeridas']}</td>
                          <td>{licensing['Always On']}</td>
                          <td>{licensing['InstanciaSQL'] ?? 'null'}</td>
                          <td>{licensing['Version']}</td>
                        </tr>
                      )
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default SqlServerLicensing
