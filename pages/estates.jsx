import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { Suspense, useEffect, useState } from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageWrapper } from '~/components/page'
// import GlobalContext from '~/contexts/global'
import Layout from '~/layouts/default'

const tabs = [
  {
    name: 'Installed versions',
    slug: 'installed-versions',
    component: dynamic(() =>
      import('~/components/page/estates/installed-versions')
    ),
  },
  {
    name: 'Disk usage',
    slug: 'disk-usage',
    component: dynamic(() => import('~/components/page/estates/disk-usage')),
  },
  {
    name: 'Backups',
    slug: 'backups',
    component: dynamic(() => import('~/components/page/estates/backups')),
  },
  {
    name: 'Jobs',
    slug: 'sql-agent-jobs',
    component: dynamic(() =>
      import('~/components/page/estates/sql-agent-jobs')
    ),
  },
  {
    name: 'SQL Server Licensing',
    slug: 'sql-server-licensing',
    component: dynamic(() =>
      import('~/components/page/estates/sql-server-licensing')
    ),
  },
]

const EstatePage = () => {
  const router = useRouter()
  const [tabActive, setTabActive] = useState()

  useEffect(() => {
    const filteredTab = tabs.find((tab) => tab.slug === router?.query?.tab)

    filteredTab ? setTabActive(filteredTab) : setTabActive(tabs[0])
  }, [router.asPath, router.query])

  return (
    <>
      <NextSeo title="Propriedades - MonitDB" />

      <Layout>
        <PageWrapper className="p-8">
          <div className="fixed w-full top-16 left-0 bg-blue z-10 xl:pl-80">
            <ul className="flex items-center">
              {tabs.map((type, typeIndex) => (
                <li key={`sidebar-tab-${type.slug}-${typeIndex}`}>
                  <Link
                    href={`/estates/?tab=${type.slug}`}
                    className={classNames(
                      'py-2 px-5 block text-white text-sm lg:hover:bg-blue-light',
                      {
                        'bg-blue-light': tabActive?.slug === type.slug,
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
            <Suspense fallback={<Loading />}>
              <tabActive.component tabName={tabActive.name} />
            </Suspense>
          )}
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EstatePage
