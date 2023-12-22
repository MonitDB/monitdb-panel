import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { listProfiles } from '~/services/permissions'

const ProfilePage = () => {
  const [profiles, setProfiles] = useState([])

  const getProfiles = useCallback(async () => {
    try {
      const { data } = await listProfiles()
      setProfiles(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
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
              {profiles.length > 0 ? (
                <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                    <h2 className="text-2xl font-bold mb-4">Profiles</h2>
                    <Button>
                      <Link href="/configurations/profiles/new-profile">
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                        Add Profile
                      </Link>
                    </Button>
                  </div>

                  <div className="prose max-w-full w-full">
                    <ul>
                      <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                        <table className="prose max-w-full w-full">
                          <thead>
                            <tr className="text-sm font-bold text-gray-dark text-left">
                              <th className="border-b-2 border-gray-light w-2/5">
                                Profile
                              </th>
                              <th className="border-b-2 border-gray-light">
                                Description
                              </th>
                              <th className="border-b-2 border-gray-light">
                                Created at
                              </th>
                              {/* <th className="border-b-2 border-gray-light">
                                Active
                              </th> */}
                              <th className="border-b-2 border-gray-light">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {profiles.map((profile, index) => (
                              <tr
                                key={`profile-${profile.idRole}-${index}`}
                                className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out
                          lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                              >
                                <td>{profile.roleName}</td>
                                <td>{profile.roleDescription}</td>

                                <td>{profile.roleDataCreate}</td>
                                <td>
                                  <ul className="flex items-center space-x-2 list-none w-full p-0 m-0">
                                    <li>
                                      <Link
                                        href={`/configurations/profiles/${profile.idRole}`}
                                        className="text-blue"
                                      >
                                        Edit
                                      </Link>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full min-h-28">
                  <Loading light />
                </div>
              )}
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default ProfilePage
