import { faAdd } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextSeo } from 'next-seo'
import React, { useCallback, useEffect, useState } from 'react'

import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import * as UserServices from '~/services/user'

const ServersPage = () => {
  const [users, setUsers] = useState([])

  const getUsers = useCallback(async () => {
    try {
      const response = await UserServices.list()

      setUsers(response?.data || [])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [])

  useEffect(() => {
    getUsers()
  }, [getUsers])

  return (
    <>
      <NextSeo title="Users - Configurations - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <PageHeader
              title="Configurations"
              breadcrumbs={[
                {
                  title: 'Configurations',
                  href: '/configurations',
                },
                {
                  title: 'Users',
                  href: '/configurations/users',
                },
              ]}
            />

            <div>
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <Link
                  href="/configurations/users/new"
                  className="btn btn--small"
                >
                  <FontAwesomeIcon icon={faAdd} className="mr-2" />
                  Add
                </Link>
              </header>

              {users.length > 0 ? (
                <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                  <table className="prose max-w-full w-full">
                    <thead>
                      <tr className="text-sm font-bold text-gray-dark text-left">
                        <th className="border-b-2 border-gray-light w-2/5">
                          User
                        </th>
                        <th className="border-b-2 border-gray-light">E-mail</th>
                        <th className="border-b-2 border-gray-light">
                          Created at
                        </th>
                        <th className="border-b-2 border-gray-light">Active</th>
                        <th className="border-b-2 border-gray-light">&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={`user-${user.id}-${index}`}
                          className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out
                          lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                        >
                          <td>{user.loginName}</td>
                          <td>{user.loginEmail}</td>
                          <td>{user.loginDateCreate}</td>
                          <td>{user.loginEnable ? 'Ativo' : 'Inativo'}</td>
                          <td>
                            <ul className="flex items-center space-x-2 list-none w-full p-0 m-0">
                              <li>
                                <Link
                                  href={`/configurations/users/${user.id}`}
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

export default ServersPage
