/* eslint-disable sonarjs/no-duplicate-string */
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from 'antd'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useRef, useState } from 'react'

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

const { Panel } = Collapse

const EditProfilePage = () => {
  const router = useRouter()
  const { id: profileId } = router.query
  const [fetching, setIsFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState([])
  const [typesGrants, setTypesGrants] = useState([])

  const [permission, setPermission] = useState()
  const [typeGrant, setTypeGrant] = useState()

  const [form] = Form.useForm()

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true)
      try {
        const { data: permissionsData } = await getPermissions()
        const { data: typesGrantsData } = await getTypesGrants()
        setTypesGrants(typesGrantsData)
        setPermissions(permissionsData)
        const defaultGrant = typesGrantsData[1]
        const mapIdFeature = new Map()
        const featureFunctions = []
        for (const data of permissionsData) {
          for (const item of data.featureFunction) {
            mapIdFeature.set(item.idFeatureFunction, item.idFeature)
            featureFunctions.push({
              idFeatureFunction: item.idFeatureFunction,
              idTypeGrant: defaultGrant.idTypeGrant,
              featureFunction: item,
            })
          }
        }

        form.setFieldsValue({
          featureFunctions,
        })

        if (profileId !== 'new-profile') {
          const { data: profileData } = await getProfileById(profileId)

          const previousFeatureFunctions = profileData.featureFunctions.map(
            (item) => ({
              idFeatureFunction: item?.idFeatureFunction,
              idTypeGrant: item?.idTypeGrant,
              featureFunction: {
                idFeature: mapIdFeature.get(item?.idFeatureFunction),
              },
            })
          )

          form.setFieldsValue({
            roleName: profileData.roleName,
            roleDescription: profileData.roleDescription,
            featureFunctions: previousFeatureFunctions,
          })
        }
      } catch (error) {
        /* empty */
        // eslint-disable-next-line no-console
        console.error(error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [form, profileId])

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
      notification.error({
        message: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const onApply = () => {
    const selectedPermission = permission ?? permissions[0]?.id
    const selectedTypeGrant = typeGrant ?? typesGrants[0]?.idTypeGrant

    const featureFunctions = form.getFieldValue('featureFunctions')

    for (const [index, featureFunction] of featureFunctions.entries()) {
      if (featureFunction?.featureFunction?.idFeature == selectedPermission) {
        form.setFieldValue(
          ['featureFunctions', index, 'idTypeGrant'],
          selectedTypeGrant
        )
      }
    }
  }

  const featureFunctionIndex = useRef(0)

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
            <Form layout="vertical" form={form} onFinish={handleSubmit}>
              {!fetching && (
                <>
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
                  <Card style={{ marginBottom: '15px', marginTop: '15px' }}>
                    <p className="text-gray-800">Bulk Change</p>
                    <br />
                    <Row gutter={16} align="middle">
                      <Col>
                        <Select
                          style={{ width: '200px' }}
                          defaultValue={permissions[0]?.id}
                          options={permissions.map((permission) => ({
                            label: permission.featureName,
                            value: permission.id,
                          }))}
                          value={permission}
                          onChange={setPermission}
                        />
                      </Col>
                      <Col>
                        <Select
                          style={{ width: '200px' }}
                          defaultValue={typesGrants[0]?.idTypeGrant}
                          options={typesGrants.map((typeGrant) => ({
                            label: typeGrant.typeGrantName,
                            value: typeGrant.idTypeGrant,
                          }))}
                          value={typeGrant}
                          onChange={setTypeGrant}
                        />
                      </Col>
                      <Col flex="auto" style={{ textAlign: 'right' }}>
                        <Button
                          type="primary"
                          style={{ width: '200px' }}
                          onClick={onApply}
                        >
                          Apply
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                  <Form.Item name={'featureFunctions'} hidden />
                  <Collapse>
                    {permissions.map((permission, permissionIndex) => {
                      if (permissionIndex === 0)
                        featureFunctionIndex.current = -1
                      return (
                        <Panel
                          header={permission.featureName}
                          key={`permission-${permission.id}`}
                        >
                          {permission.featureFunction.map((featureFunction) => {
                            featureFunctionIndex.current++

                            return (
                              <Row
                                gutter={16}
                                key={`featureFunction-${featureFunction.idFeatureFunction}`}
                              >
                                <Col span={8}>
                                  <span>
                                    {featureFunction.featureFunctionName}
                                  </span>
                                </Col>
                                <Col span={8}>
                                  <span>
                                    {featureFunction.featureFunctionDescription}
                                  </span>
                                </Col>
                                <Form.Item
                                  name={[
                                    'featureFunctions',
                                    featureFunctionIndex.current,
                                    'idFeatureFunction',
                                  ]}
                                  hidden
                                />
                                <Form.Item
                                  name={[
                                    'featureFunctions',
                                    featureFunctionIndex.current,
                                    'featureFunction',
                                  ]}
                                  hidden
                                />
                                <Form.Item
                                  name={[
                                    'featureFunctions',
                                    featureFunctionIndex.current,
                                    'grantId',
                                  ]}
                                  hidden
                                />
                                <Col span={8}>
                                  <Form.Item
                                    name={[
                                      'featureFunctions',
                                      featureFunctionIndex.current,
                                      'idTypeGrant',
                                    ]}
                                  >
                                    <Select
                                      options={typesGrants.map((typeGrant) => ({
                                        label: typeGrant.typeGrantName,
                                        value: typeGrant.idTypeGrant,
                                      }))}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                            )
                          })}
                        </Panel>
                      )
                    })}
                  </Collapse>

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
            </Form>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EditProfilePage
