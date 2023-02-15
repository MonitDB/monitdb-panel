import { faDatabase, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faker from 'faker'
import React from 'react'

import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'

const InstalledVersions = ({ tabName }) => {
  const {
    globalState: { servers },
  } = useGlobal()

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
              <h2 className="heading-md">Informações de licenciamento</h2>
            </div>
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
                  <th>Processadores</th>
                  <th>Cores</th>
                  <th>Processadores lógicos</th>
                  <th>License req</th>
                  <th>Sempre ligado</th>
                  <th>Instância SQL</th>
                  <th>Versão</th>
                </tr>
              </thead>

              <tbody>
                {servers.map(({ serverName }, serverIndex) => (
                  <tr key={`server-item-${serverIndex}`}>
                    <td>
                      <span className="rounded py-px px-1 text-xs bg-blue text-white">
                        VM
                      </span>{' '}
                      <strong>{serverName}</strong>
                    </td>
                    <td>{faker.random.number()}</td>
                    <td>{faker.random.number()}</td>
                    <td>{faker.random.number()}</td>
                    <td>4 cores</td>
                    <td>{serverIndex % 2 === 0 ? 'Ativo' : 'Passivo'}</td>
                    <td>
                      <FontAwesomeIcon icon={faDatabase} className="mr-2" />{' '}
                      {faker.random.word()}
                    </td>
                    <td>
                      SQL Server 2019 <span className="text-xs">Standard</span>
                      <br />
                      <span className="text-xs">Edition (64-bit)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default InstalledVersions
