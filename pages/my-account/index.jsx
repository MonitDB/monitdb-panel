import { faUserGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import MyAccountForm from '~/components/forms/my-account'
import Link from '~/components/link'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import Layout from '~/layouts/default'

const MyAccountPage = () => {
  return (
    <Layout>
      <PageWrapper>
        <PageSidebar>
          <header className="mb-10">
            <PageSidebarTitle>
              <FontAwesomeIcon icon={faUserGear} />
              <span>My Account</span>
            </PageSidebarTitle>
          </header>
          <PageSidebarLinksList>
            <li>
              <Link href="/my-account/">Personal data</Link>
            </li>
            <li>
              <Link href="/my-account/">Preferences</Link>
            </li>
            <li>
              <Link href="/my-account/">Logout</Link>
            </li>
          </PageSidebarLinksList>
        </PageSidebar>

        <PageContent>
          <MyAccountForm />
        </PageContent>
      </PageWrapper>
    </Layout>
  )
}

export default MyAccountPage
