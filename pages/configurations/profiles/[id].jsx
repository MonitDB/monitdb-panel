/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import Loading from '~/components/loading/loading'
import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import {
  createProfile,
  getPermissions,
  getProfileById,
  updateProfile,
} from '~/services/permissions'

const EditProfilePage = () => {
  const router = useRouter()
  const { id: profileId } = router.query
  const [fetching, setIsFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState([])

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
        setLoading(true)

        if (profileId !== 'new-profile') {
          updateProfile(profileId, values)
        } else {
          createProfile(values)
        }
        toast.success('Profile saved successfully')
        router.push('/configurations/profiles')
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    },
  })

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true)
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
        setIsFetching(false)
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

  return (
    <>
      <NextSeo
        title={profileId === 'new-profile' ? 'Create Profile' : 'Edit Profile'}
      />
      <Layout>
        <PageWrapper className="p-8">
          <PageContent removeSidebarMargin={true}>
            {renderBreadcrumb()}

            {fetching && (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}

            {!fetching && (
              <div className="mt-8">
                <form
                  onSubmit={formik.handleSubmit}
                  className="max-w-xl mx-auto"
                >
                  <div className="mb-4">
                    <label
                      htmlFor="roleName"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Profile Name:
                    </label>
                    <input
                      type="text"
                      id="roleName"
                      name="roleName"
                      value={formik.values.roleName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 p-2 border rounded-md w-full"
                    />
                    {formik.touched.roleName && formik.errors.roleName && (
                      <div className="text-red-500">
                        {formik.errors.roleName}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="roleDescription"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Description:
                    </label>
                    <textarea
                      id="roleDescription"
                      name="roleDescription"
                      value={formik.values.roleDescription}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
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

                              formik.setFieldValue(
                                'permissions',
                                newPermissions
                              )
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

                  <div className="mb-4 flex justify-end">
                    <button disabled={loading} className="btn btn--small mr-2">
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EditProfilePage
