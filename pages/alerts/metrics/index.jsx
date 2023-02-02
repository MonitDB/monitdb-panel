import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import useAlerts from '~/hooks/use-alerts'
// import useGlobal from '~/hooks/use-global'
import Layout from '~/layouts/default'

const AlertsDetailsPage = () => {
  // const {
  //   globalState: { servers, serverTypes, serverEnvironments },
  // } = useGlobal()
  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const router = useRouter()

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <MonitoredServersSidebar />

          <PageContent>
            <header className="flex flex-col mb-10">
              <PageHeader
                title="Custom Metrics"
                breadcrumbs={[
                  {
                    title: 'Alerts',
                    href: '/alerts/',
                  },
                  {
                    title: 'Custom Metrics',
                    href: '/alerts/metrics/',
                  },
                ]}
              />
              <div>
                <Link href="/alerts/metrics/new/" className="btn btn--small">
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Adicionar
                </Link>
              </div>
            </header>

            {parameters.length > 0 ? (
              <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                <table className="prose max-w-full w-full mb-4">
                  <thead>
                    <tr className="text-sm font-bold text-gray-dark text-left">
                      <th width="25%" className="border-b-2 border-gray-light">
                        Name
                      </th>
                      <th
                        width="25%"
                        className="border-b-2 border-gray-light w-60"
                      >
                        Procedure
                      </th>
                      <th className="border-b-2 border-gray-light w-20">
                        dsProfileEmail
                      </th>
                      <th className="border-b-2 border-gray-light w-20">
                        Frequency
                      </th>
                      <th className="border-b-2 border-gray-light w-40">
                        E-mail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((parameter, index) => (
                      <tr
                        key={`parameter-${index}`}
                        className={`text-sm border-b border-gray-light transition-colors
                          duration-200 ease-in-out cursor-pointer lg:hover:bg-gray-light lg:hover:bg-opacity-50`}
                        onClick={() => {
                          router.push(`/alerts/metrics/${parameter.id}/`)
                        }}
                      >
                        <td>{parameter.nmAlert}</td>
                        <td>{parameter.nmProcedure}</td>
                        <td>{parameter.dsProfileEmail}</td>
                        <td>{parameter.frequencyMinutes}</td>
                        <td>{parameter.dsEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsDetailsPage
