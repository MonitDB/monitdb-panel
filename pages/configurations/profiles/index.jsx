import { Button, Col, Row, Table } from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { listProfiles } from '~/services/permissions'

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const getProfiles = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await listProfiles()
      setProfiles(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getProfiles()
  }, [getProfiles])

  return (
    <>
      <NextSeo title="Profile - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Profile"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations',
                },
                {
                  title: 'Profile',
                  href: '/configurations/profile',
                },
              ]}
            />

            <div>
              <Table
                pagination={{ hideOnSinglePage: true }}
                loading={loading}
                title={() => (
                  <>
                    <Row justify={'space-between'}>
                      <Col>
                        <h1>
                          <strong>Profiles</strong>
                        </h1>
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            router.push(`/configurations/profiles/new-profile`)
                          }}
                        >
                          Add profile
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
                columns={[
                  {
                    title: 'Profile',
                    dataIndex: 'roleName',
                    key: 'roleName',
                  },
                  {
                    title: 'Description',
                    dataIndex: 'roleDescription',
                    key: 'roleDescription',
                  },
                  {
                    title: 'Created at',
                    dataIndex: 'roleDataCreate',
                    key: 'roleDataCreate',
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, record) => {
                      return (
                        <Button
                          onClick={() => {
                            router.push(
                              `/configurations/profiles/${record.idRole}`
                            )
                          }}
                        >
                          Edit
                        </Button>
                      )
                    },
                  },
                ]}
                dataSource={profiles}
                rowKey={(record) => `profile-${record.idRole}`}
              />
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ProfilePage
