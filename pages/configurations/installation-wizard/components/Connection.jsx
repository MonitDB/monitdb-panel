import { Button, Col, Form, Input, notification, Row, Space } from 'antd'
import { useState } from 'react'

import { testServer } from '~/services/servers'

const ConnectionStep = ({ handleNextStep, handlePreviusStep, form }) => {
  const [loading, setLoading] = useState(false)
  return (
    <div style={{ height: '350px', overflowY: 'auto', padding: '25px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="serverHost"
            label="Host"
            rules={[{ required: true, message: 'Host is required!' }]}
          >
            <Input placeholder="Host" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="serverUser"
            label="User"
            rules={[{ required: true, message: 'User is required!' }]}
          >
            <Input placeholder="User" />
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
            <Input type="password" placeholder="Password" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="serverPort"
            label="Port"
            rules={[{ required: true, message: 'Port is required!' }]}
          >
            <Input type="number" placeholder="Port" />
          </Form.Item>
        </Col>
      </Row>
      <div className="flex justify-end">
        <Space>
          <Button type="default" onClick={() => handlePreviusStep()}>
            Previous
          </Button>
          <Button
            loading={loading}
            type="primary"
            onClick={async () => {
              try {
                await form.validateFields([
                  'serverHost',
                  'serverUser',
                  'serverPassword',
                  'serverPort',
                ])
              } catch {
                /* empty */
              }
              const values = form.getFieldsValue()
              if (
                !values['serverHost'] ||
                values['serverHost'] === '' ||
                !values['serverUser'] ||
                values['serverUser'] === '' ||
                !values['serverPassword'] ||
                values['serverPassword'] === '' ||
                !values['serverPort'] ||
                values['serverPort'] === ''
              ) {
                return
              }
              try {
                setLoading(true)
                const result = await testServer(values)

                if (result.status !== 200) {
                  notification.error({
                    description: 'Error to connect with the server',
                  })
                  return
                }
              } catch {
                /* empty */
              } finally {
                setLoading(false)
              }

              handleNextStep()
            }}
          >
            Next
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default ConnectionStep
