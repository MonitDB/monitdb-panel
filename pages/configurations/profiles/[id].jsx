/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */

import {
  Button,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Loading from '~/components/loading'
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
  const [fetching, setIsFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState([])
  const [typesGrants, setTypesGrants] = useState([])

  const [form] = Form.useForm()

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

          const featureFunctions = profileData.featureFunctions.map((item) => ({
            featureFunctionId: item?.idFeatureFunction,
            typeGrantId: item?.idTypeGrant,
            featureFunction: item?.featureFunction,
          }))

          form.setFieldsValue({
            roleName: profileData.roleName,
            roleDescription: profileData.roleDescription,
            featureFunctions,
            hiddenFeatureFunctions: featureFunctions,
          })
        } else {
          const defaultGrant = typesGrantsData[1]
          const featureFunctions = []
          for (const data of permissionsData) {
            for (const item of data.featureFunction) {
              featureFunctions.push({
                featureFunctionId: item.idFeatureFunction,
                typeGrantId: defaultGrant.idTypeGrant,
                featureFunction: item,
              })
            }
          }

          form.setFieldsValue({
            featureFunctions,
            hiddenFeatureFunctions: featureFunctions,
          })
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
        href: '/configurations/profiles',
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

  const handleSubmit = async (values) => {
    delete values.hiddenFeatureFunctions

    const payload = {
      ...values,
      featureFunction: values?.featureFunction?.filter((value) =>
        value?.grantId ? !Number.isNan(value?.grantId) : true
      ),
    }

    setLoading(true)
    try {
      await (profileId === 'new-profile'
        ? createProfile(payload)
        : updateProfile(profileId, payload))
      notification.success({
        message:
          profileId === 'new-profile'
            ? 'Profile created successfully'
            : 'Profile updated successfully',
      })

      router.push('/configurations/profiles')
    } catch (error) {
      console.error(error)
      notification.error({
        message: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
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
            {fetching && <Loading />}
            {!fetching && (
              <>
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                  <Form.Item
                    label="Profile Name"
                    name="roleName"
                    rules={[{ required: 'true', message: 'Name is required' }]}
                  >
                    <Input disabled={loading} />
                  </Form.Item>
                  <Form.Item
                    label="Description"
                    name="roleDescription"
                    rules={[
                      { required: 'true', message: 'Description is required' },
                    ]}
                  >
                    <Input.TextArea disabled={loading} rows={3} />
                  </Form.Item>
                  <h2 className="text-lg font-semibold">Permissions</h2>
                  <p className="text-gray-500">
                    Select the permission level for each feature function
                  </p>
                  <br />
                  <br />

                  <Form.Item name={`featureFunctions`} hidden />

                  <Table
                    loading={fetching}
                    columns={[
                      { title: 'Name', dataIndex: 'featureName' },
                      { title: 'Description', dataIndex: 'featureDescription' },
                      { title: 'Version', dataIndex: 'featureVersion' },
                      {
                        title: 'Level',
                        width: 300,
                        render: (value, record, index) => (
                          <>
                            <Form.Item
                              hidden
                              name={[
                                'hiddenFeatureFunctions',
                                index,
                                'grantId',
                              ]}
                              initialValue={value.key}
                            />
                            {!Number.isNaN(Number(value.key)) && (
                              <Form.Item
                                hidden
                                name={[
                                  'hiddenFeatureFunctions',
                                  index,
                                  'featureFunctionId',
                                ]}
                                initialValue={value.key}
                              />
                            )}

                            {Number.isNaN(Number(value.key)) ? (
                              <></>
                            ) : (
                              <Form.Item
                                name={[
                                  'hiddenFeatureFunctions',
                                  index,
                                  'typeGrantId',
                                ]}
                              >
                                <Select
                                  onChange={(v) => {
                                    form.setFieldValue(
                                      [
                                        'hiddenFeatureFunctions',
                                        index,
                                        'typeGrantId',
                                      ],
                                      v
                                    )
                                    form.setFieldValue(
                                      'featureFunctions',
                                      form.getFieldValue(
                                        'hiddenFeatureFunctions'
                                      )
                                    )
                                  }}
                                  options={typesGrants.map((typeGrant) => ({
                                    label: typeGrant.typeGrantName,
                                    value: typeGrant.idTypeGrant,
                                  }))}
                                />
                              </Form.Item>
                            )}
                          </>
                        ),
                      },
                    ]}
                    dataSource={permissions.map((permission) => ({
                      ...permission,
                      key: `permission-${permission.id}`,
                      featureName: permission.featureName,
                      children: permission.featureFunction.map(
                        (featureFunction) => ({
                          featureName: featureFunction.featureFunctionName,
                          featureDescription:
                            featureFunction.featureFunctionDescription,
                          featureVersion:
                            featureFunction.featureFunctionVersion,
                          key: `${featureFunction.idFeatureFunction}`,
                        })
                      ),
                    }))}
                  />
                </Form>

                <Row justify={'end'}>
                  <Space>
                    <Button
                      type="primary"
                      style={{ marginTop: '15px' }}
                      onClick={form.submit}
                      loading={loading}
                    >
                      Salvar
                    </Button>
                  </Space>
                </Row>
              </>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EditProfilePage
