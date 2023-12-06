/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const EditProfilePage = ({ groupId }) => {
  const [group, setGroup] = useState({
    name: '',
    description: '',
    // Adicione mais campos conforme necessário para a criação do grupo
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        if (groupId !== 'new-profile') {
          //   const response = await GroupServices.getGroupById(groupId)
          //   setGroup(response?.data || {})
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [groupId])

  const handleInputChange = (error) => {
    const { name, value } = error.target
    setGroup((previousGroup) => ({ ...previousGroup, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      //   await (groupId === 'new-profile'
      // ? GroupServices.createGroup(group)
      // : GroupServices.updateGroup(groupId, group))

      window.location.href = '/configurations/profiles'
    } catch (error) {
      console.error(error)
      // Adicione lógica para lidar com erros de criação ou edição
    }
  }

  const renderBreadcrumb = () => {
    const breadcrumbs = [
      {
        title: 'Configurations',
        href: '/configurations',
      },
      {
        title: 'Profile',
        href: '/configurations/profile',
      },
      {
        title: groupId === 'new-profile' ? 'Create Profile' : 'Edit Profile',
        href: `/configurations/profiles/${groupId}`,
      },
    ]

    return (
      <PageHeader
        title={groupId === 'new-profile' ? 'Create Profile' : 'Edit Profile'}
        breadcrumbs={breadcrumbs}
      />
    )
  }

  if (loading) {
    return (
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            {/* Adicione uma mensagem de carregamento aqui, se necessário */}
          </PageContent>
        </PageWrapper>
      </Layout>
    )
  }

  return (
    <>
      <NextSeo
        title={groupId === 'new-profile' ? 'Create Profile' : 'Edit Profile'}
      />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            {renderBreadcrumb()}

            <div className="mt-8">
              <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                <div className="mb-4">
                  <label
                    htmlFor="profileName"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Profile Name:
                  </label>
                  <input
                    type="text"
                    id="profileName"
                    name="name"
                    value={group.name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="profileDescription"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Description:
                  </label>
                  <textarea
                    id="profileDescription"
                    name="description"
                    value={group.description}
                    onChange={handleInputChange}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                </div>

                <button type="submit" className="btn btn--primary">
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save
                </button>
              </form>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EditProfilePage
