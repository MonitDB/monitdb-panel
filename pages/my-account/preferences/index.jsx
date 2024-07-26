import { faCogs } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  notification,
  Row,
  Select,
  Spin,
} from 'antd'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import { useUser } from '~/hooks/index'
import Layout from '~/layouts/default'
import { updateMe } from '~/services/user'
import { safeJsonParse } from '~/utils/json'

const { Option } = Select

const PreferencesPage = () => {
  const { userState, getUserData } = useUser()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userState?.loginPreferences) {
      const preferences = safeJsonParse(userState.loginPreferences)
      form.setFieldsValue({ loginPreferences: preferences })
    }
  }, [userState, form])

  const handleFinish = async (values) => {
    setLoading(true)
    try {
      const preferencesString = JSON.stringify(values.loginPreferences)
      await updateMe({ loginPreferences: preferencesString })
      getUserData()
      notification.success({
        message: 'Success',
        description: 'Your preferences have been updated successfully!',
      })
    } catch {
      notification.error({
        message: 'Error',
        description: 'There was an error updating your preferences.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <PageWrapper>
        <PageSidebar>
          <header className="mb-10">
            <PageSidebarTitle>
              <FontAwesomeIcon icon={faCogs} />
              <span>Preferences</span>
            </PageSidebarTitle>
          </header>
          <PageSidebarLinksList>
            <li>
              <Link href="/my-account/">Personal data</Link>
            </li>
            <li>
              <Link href="/my-account/preferences">Preferences</Link>
            </li>
            <li>
              <Link href="/logout/">Logout</Link>
            </li>
          </PageSidebarLinksList>
        </PageSidebar>

        <PageContent>
          <Card style={{ marginTop: 16 }}>
            <Card.Meta
              avatar={
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  shape="circle"
                >
                  {userState?.loginName}
                </Avatar>
              }
              description={
                <>
                  <Descriptions title="User Info">
                    <Descriptions.Item label="User Name">
                      {typeof userState?.loginName === 'string'
                        ? userState?.loginName[0].toUpperCase()
                        : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {userState?.loginEmail}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              }
            />
          </Card>
          <br />
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                loginPreferences: {
                  theme: 'default',
                  fontSize: 'normal',
                  fontFamily: 'Arial',
                  backgroundColor: '#ffffff',
                  textColor: '#000000',
                  borderRadius: '4px',
                  boxShadow: 'none',
                  fontWeight: 'normal',
                  lineHeight: '1.5',
                  letterSpacing: 'normal',
                  textAlign: 'left',
                },
              }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item label="Theme" name={['loginPreferences', 'theme']}>
                    <Select>
                      <Option value="default">Default</Option>
                      <Option value="dark">Dark</Option>
                      <Option value="light">Light</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name={['loginPreferences', 'fontSize']}
                    label="Font Size"
                  >
                    <Select>
                      <Option value="small">Small</Option>
                      <Option value="normal">Normal</Option>
                      <Option value="bigger">Bigger</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    name={['loginPreferences', 'fontFamily']}
                    label="Font Family"
                  >
                    <Select>
                      <Option value="Arial">Arial</Option>
                      <Option value="Verdana">Verdana</Option>
                      <Option value="Times New Roman">Times New Roman</Option>
                      <Option value="Georgia">Georgia</Option>
                      <Option value="Courier New">Courier New</Option>
                      <Option value="Comic Sans MS">Comic Sans MS</Option>
                      <Option value="Trebuchet MS">Trebuchet MS</Option>
                      <Option value="Tahoma">Tahoma</Option>
                      <Option value="Impact">Impact</Option>
                      <Option value="Lucida Console">Lucida Console</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form>
          </Spin>
        </PageContent>
      </PageWrapper>
    </Layout>
  )
}

export default PreferencesPage
