import { faUserGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Card } from 'antd'
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
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'

// Duas letras chegam para um circulo de 48px; o nome inteiro nao.
const initials = (name) =>
  typeof name === 'string'
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
    : ''

const MyAccountPage = () => {
  const { userState } = useUser()

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
              <Link href="/my-account/preferences">Preferences</Link>
            </li>
            {/* <li>
              <Link href="/my-account/">Preferences</Link>
            </li> */}
            <li>
              <Link href="/logout/">Logout</Link>
            </li>
          </PageSidebarLinksList>
        </PageSidebar>

        <PageContent>
          {/* Estava trocado: o avatar levava o nome inteiro (a encolher para
              caber num circulo de 40px) e o campo "User Name" mostrava so a
              primeira letra. As duas coisas ao contrario do que deviam ser. */}
          <Card style={{ marginTop: 16 }}>
            <Card.Meta
              avatar={
                <Avatar
                  size={48}
                  shape="circle"
                  style={{ backgroundColor: '#5046e5', fontWeight: 500 }}
                >
                  {initials(userState?.loginName)}
                </Avatar>
              }
              title={userState?.loginName}
              description={
                <span className="text-gray">{userState?.loginEmail}</span>
              }
            />
          </Card>
          <br></br>
          <MyAccountForm />
        </PageContent>
      </PageWrapper>
    </Layout>
  )
}

export default MyAccountPage
