/* eslint-disable unicorn/prefer-number-properties */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Select } from 'antd'
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
import { useUser } from '~/hooks/index'
import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'
import { getReportsByType } from '~/services/reports'
import useComponentContext from '~/services/state-manager/components'
import { scrollToSection } from '~/utils/global'
import {
  Feature,
  FeatureFunction,
  hasFeature,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

const reportTypesData = [
  {
    name: 'SQL Server Availability Time',
    slug: 'rltime',
    featureFunction: FeatureFunction.SQL_SERVER_AVAILABILITY_TIME,
  },
  {
    name: 'Disk Space',
    slug: 'rldisk',
    featureFunction: FeatureFunction.REPORT_DISK_SPACE,
  },
  {
    name: 'Data Files TOP 5',
    slug: 'rldtfile',
    featureFunction: FeatureFunction.DATA_FILES_TOP_5,
  },
  {
    name: 'Log Files TOP 5',
    slug: 'rllgfile',
    featureFunction: FeatureFunction.LOG_FILES_TOP_5,
  },
  {
    name: 'Database Growth TOP 10',
    slug: 'rldbgrow',
    featureFunction: FeatureFunction.DATABASE_GROWTH_TOP_10,
  },
  {
    name: 'Table Growth TOP 10"',
    slug: 'rltbgrow',
    featureFunction: FeatureFunction.TABLE_GROWTH_TOP_10,
  },
  {
    name: 'Database Files - Writes',
    slug: 'rldbfilewr',
    featureFunction: FeatureFunction.DATABASE_FILES_WRITES,
  },
  {
    name: 'Database Files - Reads',
    slug: 'rldbfilerd',
    featureFunction: FeatureFunction.DATABASE_FILES_READS,
  },
  {
    name: 'Database File Growth TOP 10',
    slug: 'rldbflgrow',
    featureFunction: FeatureFunction.DATABASE_FILE_GROWTH_TOP_10,
  },
  {
    name: 'Backups Executed TOP 10',
    slug: 'rldbbkexe',
    featureFunction: FeatureFunction.BACKUPS_EXECUTED_TOP_10,
  },
  {
    name: 'Jobs Running TOP 10',
    slug: 'rljobrun',
    featureFunction: FeatureFunction.JOBS_RUNNING_TOP_10,
  },
  {
    name: 'Jobs Changed TOP 10',
    slug: 'rljobcha',
    featureFunction: FeatureFunction.JOBS_CHANGED_TOP_10,
  },
  {
    name: 'Failed Jobs TOP 10',
    slug: 'rljobfail',
    featureFunction: FeatureFunction.FAILED_JOBS_TOP_10,
  },
  {
    name: 'Slow Jobs TOP 10',
    slug: 'rljobslow',
    featureFunction: FeatureFunction.SLOW_JOBS_TOP_10,
  },
  {
    name: 'Slow Queries TOP 10',
    slug: 'rlqryslow',
    featureFunction: FeatureFunction.SLOW_QUERIES_TOP_10,
  },
  {
    name: 'Slow Queries - Last 10 Days',
    slug: 'rlqryslqtd',
    featureFunction: FeatureFunction.SLOW_QUERIES_LAST_10_DAYS,
  },
  {
    name: 'Counters',
    slug: 'rlcounters',
    featureFunction: FeatureFunction.COUNTERS,
  },
  {
    name: 'Open Connections',
    slug: 'rlopenconn',
    featureFunction: FeatureFunction.OPEN_CONNECTIONS,
  },
  {
    name: 'Index Fragmentation TOP 10',
    slug: 'rlidxfrag',
    featureFunction: FeatureFunction.INDEX_FRAGMENTATION_TOP_10,
  },
  {
    name: 'Waits Stats TOP 10',
    slug: 'rlwaitsts',
    featureFunction: FeatureFunction.WAITS_STATS_TOP_10,
  },
  {
    name: 'Alerts Without CLEAR',
    slug: 'rlalert',
    featureFunction: FeatureFunction.ALERT_WITHOUT_CLEAR,
  },
  {
    name: 'Alerts - Last Day',
    slug: 'rlalertld',
    featureFunction: FeatureFunction.ALERTS_LAST_DAY,
  },
  {
    name: 'Login Failed TOP 10',
    slug: 'rlloginf',
    featureFunction: FeatureFunction.LOGIN_FAILED_TOP_10,
  },
  {
    name: 'Error Log SQL  TOP 100',
    slug: 'rlerrorlog',
    featureFunction: FeatureFunction.ERROR_LOG_SQL_TOP_100,
  },
  {
    name: 'Databases Without Backup',
    slug: 'rldbbkout',
    featureFunction: FeatureFunction.DATABASES_WITHOUT_BACKUP,
  },
]

const ResultReportsPage = () => {
  const {
    globalState: { servers },
  } = useGlobal()
  const router = useRouter()
  const { userState: user } = useUser()

  const { executeQueryComponent } = useComponentContext()

  const [isLoading, setIsLoading] = useState(true)
  const [, setTypeActive] = useState()
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

  const reportTypes = reportTypesData.filter((report) =>
    hasPermission(user, report.featureFunction, TypeGrant.READ)
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
            serverId: router?.query?.server,
          })
          setReports((previousReports) => ({
            ...previousReports,
            [reportType.slug]: { data, name: reportType.name },
          }))
        })
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }

    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.server])

  const refreshReports = async () => {
    try {
      setReports({})
      setIsLoading(true)
      await executeQueryComponent('SPLOADCHK', router.query.server)
    } catch {
      /* empty */
    } finally {
      getData()
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    if (!hasFeature(user, Feature.REPORTS) && user.grants) {
      router.push('/403')
    }
    const filteredType = reportTypes.find(
      (type) => type.slug === router?.query?.type
    )

    filteredType ? setTypeActive(filteredType) : setTypeActive(reportTypes[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, router.asPath, router?.query, user])

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
              {reportTypes.length > 0 && (
                <PageSidebarLinksList>
                  {reportTypes.map((type, typeIndex) => (
                    <li key={`sidebar-type-${type.slug}-${typeIndex}`}>
                      <Link
                        onClick={() => {
                          setTypeActive(type.slug)
                          scrollToSection(`#${type.slug}`)
                        }}
                      >
                        {type.name}
                      </Link>
                    </li>
                  ))}
                </PageSidebarLinksList>
              )}
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
            {router?.query?.server !== '-1' && router?.query?.server ? (
              <Button
                onClick={refreshReports}
                type="primary"
                disabled={isLoading}
              >
                Get newest reports
              </Button>
            ) : (
              ''
            )}
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
