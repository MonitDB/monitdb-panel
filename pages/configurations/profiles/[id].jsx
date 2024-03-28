/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */

import { Select, Table } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

import { PageContent, PageHeader, PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'
import {
  createProfile,
  getPermissions,
  getProfileById,
  getTypesGrants,
  updateProfile,
} from '~/services/permissions'

const EditProfilePage = () => {
  const router = useRouter()
  const { id: profileId } = router.query
  const [, setIsFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState([])
  const [typesGrants, setTypesGrants] = useState([])

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
        const { data: typesGrantsData } = await getTypesGrants()
        setTypesGrants(typesGrantsData)
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
            <Table
              loading={loading}
              columns={[
                { title: 'Name', dataIndex: 'featureName' },
                { title: 'Description', dataIndex: 'featureDescription' },
                { title: 'Version', dataIndex: 'featureVersion' },
                {
                  title: 'Level',
                  render: (record) => (
                    <Select
                      style={{
                        display: Number(record.key) ? 'initial' : 'none',
                        width: '250px',
                      }}
                      defaultValue={typesGrants[1]?.idTypeGrant}
                      options={typesGrants.map((typeGrant) => ({
                        label: typeGrant.typeGrantName,
                        value: typeGrant.idTypeGrant,
                      }))}
                    />
                  ),
                },
              ]}
              rowSelection={{
                checkStrictly: false,
                onChange: (selectedRows) => {
                  console.log({ selectedRows })
                },
              }}
              dataSource={permissions.map((permission) => ({
                ...permission,
                key: `permission-${permission.id}`,
                featureName: permission.featureName,
                children: permission.featureFunction.map((featureFunction) => ({
                  featureName: featureFunction.featureFunctionName,
                  featureDescription:
                    featureFunction.featureFunctionDescription,
                  featureVersion: featureFunction.featureFunctionVersion,
                  key: `${featureFunction.idFeatureFunction}`,
                })),
              }))}
            />
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EditProfilePage
