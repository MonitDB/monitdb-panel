import { faUserGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Card, Descriptions } from 'antd'
import Meta from 'antd/es/card/Meta'
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
            {/* <li>
              <Link href="/my-account/">Preferences</Link>
            </li> */}
            <li>
              <Link href="/logout/">Logout</Link>
            </li>
          </PageSidebarLinksList>
        </PageSidebar>

        <PageContent>
          <Card style={{ marginTop: 16 }}>
            <Meta
              avatar={
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  shape="circle"
                >
                  {userState.loginName[0].toUpperCase()}
                </Avatar>
              }
              description={
                <>
                  <Descriptions title="User Info">
                    <Descriptions.Item label="User Name">
                      {userState.loginName}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Telephone">
                      1810000000
                    </Descriptions.Item> */}
                    {/* <Descriptions.Item label="Live">
                      Hangzhou, Zhejiang
                    </Descriptions.Item> */}
                    <Descriptions.Item label="Email">
                      {userState.loginEmail}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Address">
                      No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang,
                      China
                    </Descriptions.Item> */}
                  </Descriptions>
                </>
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
