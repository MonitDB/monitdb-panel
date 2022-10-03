import classNames from 'classnames'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import DiskUsage from '~/components/estates/disk-usage'
import InstalledVersions from '~/components/estates/installed-versions'
import Link from '~/components/link'
import { PageWrapper } from '~/components/page'
// import GlobalContext from '~/contexts/global'
import Layout from '~/layouts/default'

const tabs = [
  {
    name: 'Versões instaladas',
    slug: 'installed-versions',
    component: InstalledVersions,
  },
  {
    name: 'Uso de disco',
    slug: 'disk-usage',
    component: DiskUsage,
  },
  {
    name: 'Backups',
    slug: 'backups',
    component: InstalledVersions,
  },
  {
    name: 'SQL Agent Jobs',
    slug: 'sql-agent-jobs',
    component: InstalledVersions,
  },
  {
    name: 'SQL Server Licensing',
    slug: 'sql-server-licensing',
    component: InstalledVersions,
  },
]

const EstatePage = () => {
  // const {
  //   globalState: { servers, serverEnvironments },
  // } = useContext(GlobalContext)
  const router = useRouter()
  // const [data, setData] = useState()
  // const [isLoading, setIsLoading] = useState(true)
  const [tabActive, setTabActive] = useState()

  // useEffect(() => {
  //   tabActive?.name && servers && getData()
  // }, [tabActive?.name, servers]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filteredTab = tabs.find((tab) => tab.slug === router?.query?.tab)

    filteredTab ? setTabActive(filteredTab) : setTabActive(tabs[0])
  }, [router.asPath, router.query])

  return (
    <>
      <NextSeo title="Propriedades - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <div className="bg-blue xl:pl-80">
            <ul className="flex items-center">
              {tabs.map((type, typeIndex) => (
                <li key={`sidebar-tab-${type.slug}-${typeIndex}`}>
                  <Link
                    href={`/estates/?tab=${type.slug}`}
                    className={classNames(
                      'py-2 px-5 block text-white text-sm',
                      {
                        'bg-blue-light text-white':
                          tabActive?.slug === type.slug,
                      }
                    )}
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {tabActive?.component && (
            <tabActive.component tabName={tabActive.name} />
          )}
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EstatePage
