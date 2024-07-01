import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Switch,
} from 'antd'
import React, { useEffect, useState } from 'react'

import useUser from '~/hooks/use-user'

const MyAccount = () => {
  const { userState } = useUser()

  const [form] = Form.useForm()
  const [changePassword, setChangePassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      name: userState?.loginName,
      email: userState?.loginEmail,
    })
  }, [userState, form])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      message.success('Data updated successfully')
    } catch {
      message.error('An error occurred, please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = (_, value) => {
    const password = form.getFieldValue('password')
    if (value && password !== value) {
      return Promise.reject(
        new Error('The two passwords that you entered do not match!')
      )
    }
    return Promise.resolve()
  }

  const handleSwitchChange = (checked) => {
    setChangePassword(checked)
    if (!checked) {
      form.setFieldsValue({
        password: '', // Limpa o campo de senha se o usuário desativar a mudança de senha
        confirmPassword: '', // Limpa o campo de confirmação de senha também
      })
    }
  }

  return (
    <Card title="Your Account Information" style={{ marginTop: 16 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input placeholder="E-mail" type="email" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <span>Change Password</span>
                    <Switch
                      checked={changePassword}
                      onChange={handleSwitchChange}
                    />
                  </Space>
                </Col>
              </Row>
            </Form.Item>
          </Col>
          {changePassword && (
            <>
              <Col span={24}>
                <Form.Item
                  label="New Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your new password!',
                    },
                  ]}
                >
                  <Input.Password placeholder="New Password" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your new password!',
                    },
                    { validator: validatePassword },
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default MyAccount
