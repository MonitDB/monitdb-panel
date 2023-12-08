/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'

import Loading from '~/components/loading/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import { getPermissions, getProfileById } from '~/services/permissions'

const EditProfilePage = () => {
  const router = useRouter()
  const { id: profileId } = router.query
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState([]) // New state for permissions

  const validationSchema = Yup.object({
    roleName: Yup.string().required('Profile Name is required'),
    roleDescription: Yup.string().required('Description is required'),
  })

  const formik = useFormik({
    initialValues: {
      roleName: '',
      roleDescription: '',
      permissions: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values)
        // Add your logic for creating or updating the profile here

        window.location.href = '/configurations/profiles'
      } catch (error) {
        console.error(error)
        // Add logic to handle creation or update errors
      }
    },
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data: permissionsData } = await getPermissions()
        setPermissions(permissionsData)

        if (profileId !== 'new-profile') {
          const { data: profileData } = await getProfileById(profileId)
          formik.setValues(profileData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [profileId])

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
        title: profileId === 'new-profile' ? 'Create Profile' : 'Edit Profile',
        href: `/configurations/profiles/${profileId}`,
      },
    ]

    return (
      <PageHeader
        title={profileId === 'new-profile' ? 'Create Profile' : 'Edit Profile'}
        breadcrumbs={breadcrumbs}
      />
    )
  }

  if (loading) {
    return (
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            <Loading />
          </PageContent>
        </PageWrapper>
      </Layout>
    )
  }

  return (
    <>
      <NextSeo
        title={profileId === 'new-profile' ? 'Create Profile' : 'Edit Profile'}
      />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            {renderBreadcrumb()}

            <div className="mt-8">
              <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto">
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
                    name="roleName"
                    value={formik.values.roleName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                  {formik.touched.roleName && formik.errors.roleName && (
                    <div className="text-red-500">{formik.errors.roleName}</div>
                  )}
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
                    name="roleDescription"
                    value={formik.values.roleDescription}
                    onBlur={formik.handleBlur}
                    className="mt-1 p-2 border rounded-md w-full"
                  />
                  {formik.touched.roleDescription &&
                    formik.errors.roleDescription && (
                      <div className="text-red-500">
                        {formik.errors.roleDescription}
                      </div>
                    )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    Permissions:
                  </label>
                  <div className="mt-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`permission-${permission.id}`}
                          name={`permissions[${permission.id}]`}
                          checked={formik.values.permissions?.includes(
                            permission.id
                          )}
                          alt={permission.description}
                          title={permission.description}
                          onChange={({ target: { checked } }) => {
                            const newPermissions = checked
                              ? [...formik.values.permissions, permission.id]
                              : formik.values.permissions.filter(
                                  (id) => id !== permission.id
                                )

                            formik.setFieldValue('permissions', newPermissions)
                          }}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`permission-${permission.id}`}
                          title={permission.description}
                        >
                          {permission.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={formik.submitForm}
                  className="btn btn--primary"
                >
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
