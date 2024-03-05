/* eslint-disable sonarjs/no-redundant-boolean */
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
} from 'antd'
import { useState } from 'react'

import { useGlobal } from '~/hooks/index'
import { testServer } from '~/services/servers'

const ServerInformationStep = ({ handleNextStep, form }) => {
  const {
    globalState: { serverTypes, serverEnvironments },
  } = useGlobal()

  const [loading, setLoading] = useState(false)

  return (
    <div style={{ height: '450px', overflowY: 'auto', padding: '25px' }}>
      <div className="w-[100%]">
        <Row gutter={12}>
          <Col sm={12}>
            <Form.Item
              name={'serverName'}
              label="Server Name"
              rules={[{ required: true, message: 'Server name is required!' }]}
            >
              <Input disabled={loading} placeholder="Server Name" />
            </Form.Item>
          </Col>
          <Col sm={12}>
            {' '}
            <Form.Item
              name={'serverDescription'}
              label="Description"
              rules={[{ required: true, message: 'Description is required!' }]}
            >
              <Input disabled={loading} placeholder="Description" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col sm={12}>
            <Form.Item
              name={'idTypeServer'}
              label="Server Type"
              rules={[{ required: true, message: 'Server Type is required!' }]}
            >
              <Select
                disabled={loading}
                placeholder="Server type"
                options={serverTypes.map((type) => ({
                  value: type.id,
                  label: type.typeServerName,
                }))}
              />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item
              name={'idTypeServerEnvironment'}
              label={'Environment'}
              rules={[{ required: 'Environment is required!' }]}
            >
              <Select
                disabled={loading}
                placeholder="Environment"
                options={serverEnvironments.map((environment) => ({
                  value: environment.id,
                  label: environment.typeServerEnvironmentName,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="serverHost"
              label="Host"
              rules={[{ required: true, message: 'Host is required!' }]}
            >
              <Input disabled={loading} placeholder="Host" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="serverIP"
              label="IP"
              rules={[{ required: true, message: 'IP is required!' }]}
            >
              <Input disabled={loading} placeholder="IP" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="serverUser"
              label="User"
              rules={[{ required: true, message: 'User is required!' }]}
            >
              <Input disabled={loading} placeholder="User" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serverPassword"
              label="Password"
              rules={[{ required: true, message: 'Password is required!' }]}
            >
              <Input
                disabled={loading}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="serverPort"
              label="Port"
              rules={[{ required: true, message: 'Port is required!' }]}
            >
              <Input disabled={loading} type="number" placeholder="Port" />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="flex justify-end">
        <Space>
          <Button
            type="primary"
            loading={loading}
            onClick={async () => {
              setLoading(true)
              try {
                await form.validateFields()
              } catch {
                return
              }

              try {
                const response = await testServer(form.getFieldsValue())
                if (response.data.status === 500) {
                  notification.error({ message: response.data.message })
                  return
                }
                notification.success({ message: 'Connection successful' })
                handleNextStep()
              } catch {
                notification.error({ message: 'Unable to connect to the host' })
                return
              } finally {
                setLoading(false)
              }
            }}
          >
            Next
          </Button>
        </Space>
      </div>
    </div>
  )
}
export default ServerInformationStep
