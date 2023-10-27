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

//  <>
//       <NextSeo title="Alerts - MonitDB" />
//       <Layout>
//         <PageWrapper>
//           <MonitoredServersSidebar />

//           <PageContent className="lg:pt-20">
//             <form
//               className="relative w-full mx-auto mb-10 lg:w-2/3 lg:mb-20"
//               onSubmit={handleSubmit}
//             >
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="search"
//                   className="w-full pl-8 pr-20 h-20 shadow-md bg-white leading-10 rounded outline-none text-lg"
//                   placeholder="Search for a server..."
//                   onChange={handleSearchChanges}
//                   value={search}
//                 />
//               </div>
//               {search && (
//                 <p className="absolute -bottom-8 left-0 w-full text-center text-sm text-gray">
//                   {activeServersCount === 0 && <>No server found</>}
//                   {activeServersCount === 1 && <>1 server found</>}
//                   {activeServersCount > 1 && (
//                     <>
//                       <strong>{activeServersCount}</strong> servers found
//                     </>
//                   )}
//                 </p>
//               )}
//             </form>

//             {activeServersCount >= 0 && !loadingAlertCount ? (
//               <div className="w-full">
//                 <h2 className="mb-10 heading-md">Servers</h2>
//                 <Grid className={styles.serversList}>
//                   {formattedServers.map(({ id, serverName, type, active }) =>
//                     active ? (
//                       <div
//                         key={`alerts-server-${id}`}
//                         className="group relative col-span-2 transition-all duration-200 md:col-span-3 lg:col-span-4 lg:hover:!opacity-100 xl:col-span-3"
//                       >
//                         <Link
//                           href={`/alerts/results/?server=${id}`}
//                           className="relative block p-4 pr-14 border border-gray border-opacity-50 transition-all duration-200 ease-in-out bg-white lg:group-hover:bg-gray lg:group-hover:bg-opacity-25 lg:group-hover:border-opacity-25"
//                         >
//                           <h4 className="flex items-center text-sm space-x-2">
//                             <FontAwesomeIcon
//                               icon={faDatabase}
//                               className="text-base"
//                             />
//                             <span className="truncate">{serverName}</span>
//                             <span className="flex items-center justify-center rounded-full w-5 min-w-5 h-5 ml-auto text-xs bg-orange text-white">
//                               {error
//                                 ? '?'
//                                 : serverAlertsCount[id]?.count || '?'}
//                             </span>
//                           </h4>
//                           {type?.typeServerName && (
//                             <div className="absolute top-1/2 right-0 transform -translate-y-1/2 rounded-full border-gray-light p-4 transition-all duration-200 ease-in-out opacity-50 lg:group-hover:opacity-100">
//                               <DatabaseIcons
//                                 name={type.typeServerName}
//                                 className="w-8 h-8"
//                               />
//                             </div>
//                           )}
//                         </Link>
//                         <div className="absolute top-full left-0 w-full text-xs z-10 bg-white border border-gray border-opacity-50 transition-all duration-150 ease-in-out invisible opacity-0 lg:group-hover:visible lg:group-hover:opacity-100">
//                           <ul>
//                             <li>
//                               <Link
//                                 href={`/alerts/metrics/?server=${id}`}
//                                 className="border-l-2 border-l-gray-dark block py-2 pl-2 underline lg:hover:text-blue lg:hover:border-l-4 lg:hover:border-l-blue"
//                               >
//                                 Edit metrics and custom alerts
//                               </Link>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     ) : (
//                       ''
//                     )
//                   )}
//                 </Grid>
//               </div>
//             ) : (
//               <Loading />
//             )}
//           </PageContent>
//         </PageWrapper>
//       </Layout>
//     </>
