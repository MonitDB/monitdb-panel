/* eslint-disable unicorn/no-array-reduce */
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Input, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Loading from '~/components/loading/loading'
import { PageContent, PageWrapper } from '~/components/page'
import DatabaseIcons from '~/helpers/database-icons'
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
import { formatServer } from '~/utils/server'

const AlertsPage = () => {
  const {
    globalState: { servers, serverTypes },
  } = useGlobal()

  const { userState: user } = useUser()
  const router = useRouter()

  const [formattedServers, setFormattedServers] = useState([])
  const [search, setSearch] = useState('')

  const activeServersCount = useMemo(
    () => formattedServers.filter(({ active }) => active).length,
    [formattedServers]
  )

  const serversByEnvironment = formattedServers.reduce((previous, current) => {
    if (!previous[current.typeServerEnvironment.typeServerEnvironmentName]) {
      previous[current.typeServerEnvironment.typeServerEnvironmentName] = []
    }

    previous[current.typeServerEnvironment.typeServerEnvironmentName].push(
      current
    )

    return previous
  }, {})

  const handleSubmit = useCallback((event) => {
    event.preventDefault()

    return false
  }, [])

  const handleSearchChanges = useCallback((event) => {
    const target = event.target
    const { value } = target

    setSearch(value)
  }, [])

  useEffect(() => {
    if (!hasFeature(user, Feature.REPORTS) && user.grants) {
      router.push('/403')
    }
    if (servers.length === 0 || serverTypes.length === 0) {
      return
    }

    setFormattedServers(
      [...servers].map((server) => ({
        ...formatServer(server, { serverTypes }),
        active: true,
      }))
    )
  }, [servers, serverTypes, user, router])

  useEffect(() => {
    setFormattedServers((oldFormattedServers) =>
      [...oldFormattedServers].map((server) => ({
        ...server,
        active: search
          ? server.serverName.toLowerCase().includes(search.toLowerCase())
          : true,
      }))
    )
  }, [search])

  return (
    <>
      <NextSeo title="Reports - MonitDB" />
      <Layout>
        <PageWrapper>
          <PageContent className="lg:pt-20" removeSidebarMargin>
            <form
              className="relative w-full max-w-md mb-6"
              onSubmit={handleSubmit}
            >
              {hasPermission(
                user,
                FeatureFunction.FILTROS_POR_SERVIDOR,
                TypeGrant.EXECUTE
              ) && (
                <div className="relative">
                  <Input
                    type="text"
                    name="search"
                    className="w-full pl-4 pr-20 h-10 bg-white rounded outline-none"
                    placeholder="Search for a server..."
                    onChange={handleSearchChanges}
                    value={search}
                  />
                </div>
              )}

              {search && (
                <p className="absolute -bottom-8 left-0 w-full text-center text-sm text-gray">
                  {activeServersCount === 0 && <>No server found</>}
                  {activeServersCount === 1 && <>1 server found</>}
                  {activeServersCount > 1 && (
                    <>
                      <strong>{activeServersCount}</strong> servers found
                    </>
                  )}
                </p>
              )}
            </form>

            {activeServersCount >= 0 ? (
              <div className="w-full">
                <h2 className="mb-10 heading-md">Report Servers</h2>

                <Collapse>
                  {Object.keys(serversByEnvironment).map((environment) => (
                    <Collapse.Panel key={environment} header={environment}>
                      <Table
                        dataSource={serversByEnvironment[environment].filter(
                          (value) => value.active
                        )}
                        showHeader={false}
                        pagination={false}
                        columns={[
                          {
                            dataIndex: 'serverName',
                            render: (value, record) => (
                              <>
                                <h4 className="flex items-center text-sm space-x-2">
                                  <FontAwesomeIcon
                                    icon={faDatabase}
                                    className="text-base"
                                  />
                                  <span className="truncate">{value}</span>
                                </h4>
                                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full border-gray-light p-4 transition-all duration-200 ease-in-out opacity-50 lg:group-hover:opacity-100">
                                  <DatabaseIcons
                                    name={record.type?.typeServerName}
                                    className="w-8 h-8"
                                  />
                                </div>
                              </>
                            ),
                          },
                        ]}
                        onRow={(record) => ({
                          onClick: () => {
                            router.push(`/reports/results/?server=${record.id}`)
                          },
                          style: { cursor: 'pointer' },
                        })}
                      />
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </div>
            ) : (
              <Loading />
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsPage
