import { Col, Form, Input, Row, Select } from 'antd'

const ServerInformationStep = () => {
  return (
    <div className="w-[100%]">
      <Row gutter={12}>
        <Col sm={12}>
          <Form.Item name={'serverName'} label="Server Name" required>
            <Input placeholder="Server Name" />
          </Form.Item>
        </Col>
        <Col sm={12}>
          {' '}
          <Form.Item name={'description'} label="Description" required>
            <Input placeholder="Description" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col sm={12}>
          <Form.Item name={'idTypeServer'} label="Server Type" required>
            <Select placeholder="Server type" />
          </Form.Item>
        </Col>
        <Col sm={12}>
          <Form.Item
            name={'idTypeServerEnvironment'}
            label={'Environment'}
            required
          >
            <Select placeholder="Environment" />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}
export default ServerInformationStep
