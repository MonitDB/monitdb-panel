/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Select } from 'antd'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import ExportButton from '~/components/export-button'
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
import { getReportsByType } from '~/services/reports'
import { scrollToSection } from '~/utils/global'

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

  const [isLoading, setIsLoading] = useState(true)
  const [typeActive, setTypeActive] = useState()
  const [reports, setReports] = useState({})

  const serversOptions = useMemo(
    () => [
      { value: -1, label: 'All servers' },
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

  const getData = useCallback(async () => {
    setIsLoading(true)

    try {
      await Promise.allSettled(
        reportTypes.map(async (reportType) => {
          const { data } = await getReportsByType({
            type: reportType.slug,
            params: { serverId: router?.query?.server },
          })
          setReports((previousReports) => ({
            ...previousReports,
            [reportType.slug]: { data, name: reportType.name },
          }))
        })
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      // setData({})
    }

    setIsLoading(false)
  }, [router?.query?.server])

  useEffect(() => {
    getData()
  }, [getData])

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
                        setTypeActive(type.slug)
                        scrollToSection(`#${type.slug}`)
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
                className="w-full md:w-1/3 md:min-w-1/3"
                options={serversOptions}
                showSearch
                placeholder="Select a server"
                optionFilterProp="label"
                value={
                  isNaN(Number.parseInt(router?.query?.server, 10))
                    ? '-1'
                    : Number.parseInt(router?.query?.server, 10)
                }
                onChange={(value) => {
                  handleChange('server', value)
                }}
              />
            </form>
            <ExportButton disabled={isLoading} data={reports} />
          </PageContent>

          <PageContent>
            {isLoading && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading />
              </div>
            )}

            {!isLoading &&
              reportTypes.map(({ slug: key }) => {
                const data = reports[key]?.data
                const name = reports[key]?.name
                return (
                  <>
                    <header
                      id={key}
                      className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center"
                    >
                      <h3 className="mb-5 heading-md md:mb-0">{name}</h3>
                    </header>
                    <>
                      <GenericTable data={data} />
                    </>
                    <br />
                  </>
                )
              })}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ResultReportsPage
