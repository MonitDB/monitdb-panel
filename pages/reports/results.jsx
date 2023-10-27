/* eslint-disable jsx-a11y/anchor-is-valid */
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from 'react'

import ExportButton from '~/components/export-button'
import { Select } from '~/components/form'
import Link from '~/components/link'
import Loading from '~/components/loading'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import { GenericTable } from '~/components/table/genericTable'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getRepostsByType } from '~/services/reports'

const reportTypes = [
  { name: 'SQL Server Availability Time', slug: 'rltime' },
  { name: 'Disk Space', slug: 'rldisk' },
  { name: 'Data Files TOP 5', slug: 'rldtfile' },
  { name: 'Log Files TOP 5', slug: 'rllgfile' },
  { name: 'Database Growth TOP 10', slug: 'rldbgrow' },
  { name: 'Table Growth TOP 10"', slug: 'rltbgrow' },
  { name: 'Database Files - Writes', slug: 'rldbfilewr' },
  { name: 'Database Files - Reads', slug: 'rldbfilerd' },
  { name: 'Database File Growth TOP 10', slug: 'rldbflgrow' },
  { name: 'Backups Executed TOP 10', slug: 'rldbbkexe' },
  { name: 'Jobs Running TOP 10', slug: 'rljobrun' },
  { name: 'Jobs Changed TOP 10', slug: 'rljobcha' },
  { name: 'Failed Jobs TOP 10', slug: 'rljobfail' },
  { name: 'Slow Jobs TOP 10', slug: 'rljobslow' },
  { name: 'Slow Queries TOP 10', slug: 'rlqryslow' },
  { name: 'Slow Queries - Last 10 Days', slug: 'rlqryslqtd' },
  { name: 'Counters', slug: 'rlcounters' },
  { name: 'Open Connections', slug: 'rlopenconn' },
  { name: 'Index Fragmentation TOP 10', slug: 'rlidxfrag' },
  { name: 'Waits Stats TOP 10', slug: 'rlwaitsts' },
  { name: 'Alerts Without CLEAR', slug: 'rlalert' },
  { name: 'Alerts - Last Day', slug: 'rlalertld' },
  { name: 'Login Failed TOP 10', slug: 'rlloginf' },
  { name: 'Error Log SQL  TOP 100', slug: 'rlerrorlog' },
  { name: 'Databases Without Backup', slug: 'rldbbkout' },
]

const ResultReportsPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()
  const router = useRouter()
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [typeActive, setTypeActive] = useState()

  const serversOptions = useMemo(
    () => [
      { value: '-1', label: 'All servers' },
      ...(servers || []).map((server) => ({
        value: server.id,
        label: server.serverName,
      })),
    ],
    [servers]
  )

  const handleChange = (path, value) => {
    router.query[path] = value
    router.replace({ pathname: router.pathname, query: router.query })
  }

  const getData = async () => {
    setIsLoading(true)

    try {
      const { data } = await getRepostsByType({
        type: typeActive?.slug,
        params: { serverId: router?.query?.server },
      })

      setData(data)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      setData({})
    }

    setIsLoading(false)
  }

  useEffect(() => {
    typeActive?.name && servers && getData()
  }, [typeActive?.name, servers, router?.query?.server]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filteredType = reportTypes.find(
      (type) => type.slug === router?.query?.type
    )

    filteredType ? setTypeActive(filteredType) : setTypeActive(reportTypes[0])
  }, [router.asPath, router.query])

  return (
    <>
      <NextSeo title="Report - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageSidebar>
            <header className="mb-4">
              <PageSidebarTitle>
                <span>Reports types</span>
              </PageSidebarTitle>
            </header>
            <div>
              <PageSidebarLinksList>
                {reportTypes.map((type, typeIndex) => (
                  <li key={`sidebar-type-${type.slug}-${typeIndex}`}>
                    <Link
                      onClick={() => {
                        handleChange('type', type.slug)
                      }}
                      className={classNames({
                        active: typeActive?.slug === type.slug,
                      })}
                    >
                      {type.name}
                    </Link>
                  </li>
                ))}
              </PageSidebarLinksList>
            </div>
          </PageSidebar>
          <PageContent className="flex items-start justify-between border-b border-gray-light">
            <form className="w-full flex flex-col space-y-4 xl:space-x-4 xl:space-y-0 xl:flex-row">
              <Select
                name="servers"
                containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3"
                options={serversOptions}
                value={router?.query?.server}
                onChange={(value) => {
                  handleChange('server', value)
                }}
              />
            </form>
          </PageContent>

          <PageContent>
            {typeActive?.name && (
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <h3 className="mb-5 heading-md md:mb-0">{typeActive?.name}</h3>
                {data?.length > 0
                  ? !isLoading && <ExportButton data={data} />
                  : ''}
              </header>
            )}

            {isLoading && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading />
              </div>
            )}

            {!isLoading ? (
              <>{data.length > 0 ? <GenericTable data={data} /> : 'No Data'}</>
            ) : (
              ''
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ResultReportsPage
