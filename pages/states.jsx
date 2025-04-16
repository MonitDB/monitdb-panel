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
import {
  Feature,
  FeatureFunction,
  hasFeature,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

import { useUser } from '../hooks'

const tabsData = [
  {
    name: 'Installed versions',
    slug: 'installed-versions',
    component: dynamic(() =>
      import('~/components/page/states/installed-versions')
    ),
    featureFuntion: FeatureFunction.DASHBOARD_OF_VERSIONS,
  },
  {
    name: 'Disk usage',
    slug: 'disk-usage',
    component: dynamic(() => import('~/components/page/states/disk-usage')),
    featureFuntion: FeatureFunction.DISK_INFORMATION,
  },
  {
    name: 'Capacity Plan',
    slug: 'capacity-plan',
    component: dynamic(() => import('~/components/page/states/capacity-plan')),
  },
  {
    name: 'Backups',
    slug: 'backups',
    component: dynamic(() => import('~/components/page/states/backups')),
    featureFuntion: FeatureFunction.BACKUPS,
  },
  {
    name: 'Jobs',
    slug: 'sql-agent-jobs',
    component: dynamic(() => import('~/components/page/states/sql-agent-jobs')),
    featureFuntion: FeatureFunction.JOBS,
  },
  // {
  //   name: 'SQL Server Licensing',
  //   slug: 'sql-server-licensing',
  //   component: dynamic(() =>
  //     import('~/components/page/states/sql-server-licensing')
  //   ),
  //   featureFuntion: FeatureFunction.LICENSING_INFORMATION,
  // },
]

const StatePage = () => {
  const router = useRouter()
  const [tabActive, setTabActive] = useState()
  const { userState: user } = useUser()

  const tabs = tabsData.filter((tab) =>
    tab.featureFuntion
      ? hasPermission(user, tab.featureFuntion, TypeGrant.READ)
      : true
  )

  useEffect(() => {
    if (user.grants && !hasFeature(user, Feature.STATES)) {
      router.push('/403')
    }
    const filteredTab = tabs.find((tab) => tab.slug === router?.query?.tab)

    filteredTab ? setTabActive(filteredTab) : setTabActive(tabs[0])
  }, [router, router.asPath, router?.query, tabs, user])

  return (
    <>
      <NextSeo title="States - MonitDB" />

      <Layout>
        <PageWrapper className="p-8">
          <div className="fixed w-full top-16 left-0 bg-blue z-10 xl:pl-80">
            <ul className="flex items-center">
              {tabs.map((type, typeIndex) => (
                <li key={`sidebar-tab-${type.slug}-${typeIndex}`}>
                  <Link
                    href={`/states/?tab=${type.slug}`}
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

export default StatePage
