import { faAdd, faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextSeo } from 'next-seo'
import React, { useContext } from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import GlobalContext from '~/contexts/global'
import Layout from '~/layouts/default'
import { formatServer } from '~/utils/server'

const ConfigurationsServersPage = () => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useContext(GlobalContext)
  return (
    <>
      <NextSeo title="Configurações - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Configurações"
              breadcrumbs={[
                {
                  title: 'Configurações',
                  href: '/configurations',
                },
                {
                  title: 'Servidores',
                  href: '/configurations/servers',
                },
              ]}
            />

            <div>
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <Link
                  href="/configurations/servers/new"
                  className="btn btn--small"
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Adicionar
                </Link>
              </header>

              {servers.length > 0 ? (
                <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                  <table className="prose max-w-full w-full">
                    <thead>
                      <tr className="text-sm font-bold text-gray-dark text-left">
                        <th className="border-b-2 border-gray-light w-2/5">
                          Servidor
                        </th>
                        <th className="border-b-2 border-gray-light">Status</th>
                        <th className="border-b-2 border-gray-light">
                          Credenciais
                        </th>
                        <th className="border-b-2 border-gray-light">Tags</th>
                        <th className="border-b-2 border-gray-light">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servers.map((server, index) => {
                        const serverFormatted = formatServer(server, {
                          serverTypes,
                          serverEnvironments,
                        })
                        return (
                          <tr
                            key={`server-${server.id}-${index}`}
                            className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                          >
                            <td>{server.serverName}</td>
                            <td>{server.serverEnable ? 'Ativo' : 'Inativo'}</td>
                            <td>admin@gmail.com</td>
                            <td>
                              <div className="flex items-center space-x-4">
                                {serverFormatted?.environment
                                  ?.typeServerEnvironmentName && (
                                  <span className="flex items-center space-x-1">
                                    <FontAwesomeIcon icon={faTag} />{' '}
                                    <span className="rounded py-px px-1 text-xs bg-blue text-white">
                                      {
                                        serverFormatted.environment
                                          .typeServerEnvironmentName
                                      }
                                    </span>
                                  </span>
                                )}
                                {serverFormatted?.type?.typeservername && (
                                  <span className="flex items-center space-x-1">
                                    <FontAwesomeIcon icon={faTag} />{' '}
                                    <span className="rounded py-px px-1 text-xs bg-blue text-white">
                                      {serverFormatted.type.typeservername}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <ul className="flex items-center space-x-2 list-none w-full p-0 m-0">
                                <li>
                                  <Link
                                    href={`/configurations/servers/${server.id}`}
                                    className="text-blue"
                                  >
                                    Mostrar log
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    href={`/configurations/servers/${server.id}`}
                                    className="text-blue"
                                  >
                                    Editar credenciais
                                  </Link>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full min-h-28">
                  <Loading light />
                </div>
              )}
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ConfigurationsServersPage
