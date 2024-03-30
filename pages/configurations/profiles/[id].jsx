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

  const [typeGrant, setTypeGrant] = useState({})
  const [fetureFunctions, setFetureFunctions] = useState([])

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
          form.setFieldsValue({
            roleName: profileData.roleName,
            roleDescription: profileData.roleDescription,
          })

          for (const data of profileData.featureFunctions) {
            setTypeGrant((oldState) => ({
              ...oldState,
              [data.idFeatureFunction]: data.idTypeGrant,
            }))
            setFetureFunctions((oldState) => [
              ...oldState,
              String(data.idFeatureFunction),
            ])
          }
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
    const payload = {
      ...values,
      featureFunctions: fetureFunctions.map((item) => ({
        featureFunctionId: item,
        typeGrantId: typeGrant[item],
      })),
    }

    setLoading(true)
    try {
      await (profileId === 'new-profile'
        ? createProfile(payload)
        : updateProfile(profileId, payload))
      if (profileId === 'new-profile') {
        notification.success({
          message: 'Profile created successfully',
        })
      } else {
        notification.success({
          message: 'Profile updated successfully',
        })
      }

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
                    Select the permissions that this profile will have
                  </p>
                  <br />
                  <br />

                  <Table
                    loading={fetching}
                    columns={[
                      { title: 'Name', dataIndex: 'featureName' },
                      { title: 'Description', dataIndex: 'featureDescription' },
                      { title: 'Version', dataIndex: 'featureVersion' },
                      {
                        title: 'Level',
                        width: 300,
                        render: (record) =>
                          Number(record.key) ? (
                            <div>
                              <Select
                                onChange={(value) => {
                                  setTypeGrant((previous) => ({
                                    ...previous,
                                    [record.key]: value,
                                  }))
                                }}
                                value={typeGrant[record.key]}
                                defaultValue={typesGrants[1]?.idTypeGrant}
                                options={typesGrants.map((typeGrant) => ({
                                  label: typeGrant.typeGrantName,
                                  value: typeGrant.idTypeGrant,
                                }))}
                              />
                            </div>
                          ) : (
                            <Select
                              status="warning"
                              onChange={(value) => {
                                for (const featureFunction of record.featureFunction) {
                                  setTypeGrant((previous) => ({
                                    ...previous,
                                    [featureFunction.idFeatureFunction]: value,
                                  }))
                                }

                                setTypeGrant((previous) => ({
                                  ...previous,
                                  [record.key]: value,
                                }))
                              }}
                              value={typeGrant[record.key]}
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
                        const rows = selectedRows.filter(Number)
                        setFetureFunctions(rows)
                      },
                      selectedRowKeys: fetureFunctions,
                    }}
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
