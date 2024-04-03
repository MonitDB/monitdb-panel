import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Input } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import Grid from '~/components/grid'
import Link from '~/components/link'
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
    if (!hasFeature(user, Feature.REPORTS) && user) {
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
          <PageContent className="lg:pt-20">
            <form
              className="relative w-full mx-auto mb-10 lg:w-2/3 lg:mb-20"
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
                    className="w-full pl-8 pr-20 h-20 shadow-md bg-white leading-10 rounded outline-none text-lg"
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
                <Grid>
                  {formattedServers.map(({ id, serverName, type, active }) =>
                    active ? (
                      <div
                        key={`alerts-server-${id}`}
                        className="group relative col-span-2 transition-all duration-200 md:col-span-3 lg:col-span-4 lg:hover:!opacity-100 xl:col-span-3"
                      >
                        <Link
                          href={`/reports/results/?server=${id}`}
                          className="relative block p-4 pr-14 border border-gray border-opacity-50 transition-all duration-200 ease-in-out bg-white lg:group-hover:bg-gray lg:group-hover:bg-opacity-25 lg:group-hover:border-opacity-25"
                        >
                          <h4 className="flex items-center text-sm space-x-2">
                            <FontAwesomeIcon
                              icon={faDatabase}
                              className="text-base"
                            />
                            <span className="truncate">{serverName}</span>
                          </h4>
                          {type?.typeServerName && (
                            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full border-gray-light p-4 transition-all duration-200 ease-in-out opacity-50 lg:group-hover:opacity-100">
                              <DatabaseIcons
                                name={type.typeServerName}
                                className="w-8 h-8"
                              />
                            </div>
                          )}
                        </Link>
                      </div>
                    ) : (
                      ''
                    )
                  )}
                </Grid>
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
