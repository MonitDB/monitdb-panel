import {
  faDatabase,
  faFileExport,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useContext, useEffect, useState } from 'react'

import Selector from '~/components/form/selector'
import Link from '~/components/link'
import Loading from '~/components/loading'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import GlobalContext from '~/contexts/global'
import Layout from '~/layouts/default'
import { getRepostsByType } from '~/services/reports'
import { getServerDataById } from '~/utils/server'

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
  { name: 'Jobs Changed TOP 10"', slug: 'rljobcha' },
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

const filterData = (data, { servers }) => {
  const results = []

  for (const serverData of data) {
    if (serverData?.result?.length > 0) {
      results.push(
        ...serverData.result.map((item) => ({
          ...item,
          server: getServerDataById(serverData.serverId, servers),
        }))
      )
    }
  }

  return results
}

const ReportsPage = () => {
  const {
    globalState: { servers, serverEnvironments },
  } = useContext(GlobalContext)
  const router = useRouter()
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [typeActive, setTypeActive] = useState()

  const getData = async () => {
    setIsLoading(true)

    try {
      const response = await getRepostsByType({ type: typeActive?.slug })

      response?.data?.result.length > 0
        ? setData(filterData(response.data.result, { servers }))
        : setData([])
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      setData({})
    }

    setIsLoading(false)
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      status: [],
      group: [],
      monitor: [],
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  useEffect(() => {
    typeActive?.name && servers && getData()
  }, [typeActive?.name, servers]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filteredType = reportTypes.find(
      (type) => type.slug === router?.query?.type
    )

    if (filteredType) {
      setTypeActive(filteredType)
    }
  }, [router.asPath, router.query])

  return (
    <>
      <NextSeo title="Relatórios - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageSidebar>
            <header className="mb-4">
              <PageSidebarTitle>
                <span>Tipos de relatório</span>
              </PageSidebarTitle>
            </header>
            <div>
              <PageSidebarLinksList>
                {reportTypes.map((type, typeIndex) => (
                  <li key={`sidebar-type-${type.slug}-${typeIndex}`}>
                    <Link
                      href={`/reports?type=${type.slug}`}
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
                name="server"
                options={[
                  { value: '', label: 'Todos os servidores' },
                  ...(servers || []).map((server) => ({
                    value: server.idServer,
                    label: server.serverName,
                  })),
                ]}
                onChange={(value) => {
                  formik.setFieldValue('status', value)
                }}
              />
              <Selector
                name="group"
                options={[
                  { value: '', label: 'Todos os ambientes' },
                  ...serverEnvironments.map(
                    ({
                      idTypeServerEnvironment,
                      typeServerEnvironmentName,
                    }) => ({
                      value: idTypeServerEnvironment,
                      label: typeServerEnvironmentName,
                    })
                  ),
                ]}
                onChange={(value) => {
                  formik.setFieldValue('group', value)
                }}
              />
              <button
                type="reset"
                className="btn"
                onClick={() => formik.resetForm()}
              >
                Limpar
              </button>
            </form>
          </PageContent>

          <PageContent>
            {typeActive?.name && (
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <h3 className="mb-5 heading-md">{typeActive?.name}</h3>
                {data?.length > 0 ? (
                  <button type="button" className="btn btn--small">
                    <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                    Exportar
                  </button>
                ) : (
                  ''
                )}
              </header>
            )}

            {isLoading && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading />
              </div>
            )}

            {data?.length > 0 ? (
              <div className="w-full prose max-w-full">
                <table className="m-0">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((colName, colNameIndex) => (
                        <th key={`cols-${typeActive.slug}-${colNameIndex}`}>
                          {colName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, itemIndex) => (
                      <tr key={`item-tr-${typeActive.slug}-${itemIndex}`}>
                        {Object.keys(item).map((colName, colNameIndex) => (
                          <td
                            key={`item-td-${typeActive.slug}-${colNameIndex}`}
                          >
                            {colName === 'server' && (
                              <div className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faDatabase} />
                                <span>{item[colName]?.serverName}</span>
                              </div>
                            )}
                            {colName !== 'server' && item[colName]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <p>Nenhum dado encontrado.</p>
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ReportsPage
