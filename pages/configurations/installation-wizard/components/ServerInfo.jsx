/* eslint-disable sonarjs/no-redundant-boolean */
import { Button, Col, Form, Input, Row, Select, Space } from 'antd'

import { useGlobal } from '~/hooks/index'

const ServerInformationStep = ({ handleNextStep, form }) => {
  const {
    globalState: { serverTypes, serverEnvironments },
  } = useGlobal()

  return (
    <div style={{ height: '350px', overflowY: 'auto', padding: '25px' }}>
      <div className="w-[100%]">
        <Row gutter={12}>
          <Col sm={12}>
            <Form.Item
              name={'serverName'}
              label="Server Name"
              rules={[{ required: true, message: 'Server name is required!' }]}
            >
              <Input placeholder="Server Name" />
            </Form.Item>
          </Col>
          <Col sm={12}>
            {' '}
            <Form.Item
              name={'serverDescription'}
              label="Description"
              rules={[{ required: true, message: 'Description is required!' }]}
            >
              <Input placeholder="Description" />
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
                placeholder="Environment"
                options={serverEnvironments.map((environment) => ({
                  value: environment.id,
                  label: environment.typeServerEnvironmentName,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      <div className="flex justify-end">
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              try {
                await form.validateFields([
                  'serverName',
                  'description',
                  'idTypeServer',
                  'idTypeServerEnvironment',
                ])
              } catch {
                /* empty */
              }
              const values = form.getFieldsValue()
              if (
                values['serverName'] == false ||
                values['description'] == false ||
                values['idTypeServer'] == false ||
                values['idTypeServerEnvironment'] == false
              )
                return
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
export default ServerInformationStep
