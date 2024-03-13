import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Space } from 'antd'

import StepContainer from './StepContainer'

const DetailsStep = ({ handleNextStep, handlePreviusStep }) => {
  return (
    <>
      <StepContainer>
        <Row gutter={16}>
          <Col sm={12}>
            <Form.Item
              name={['serverDetail', 'serverDetailName']}
              label="Detail"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item
              name={['serverDetail', 'serverDetailDescription']}
              label="Description"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col sm={12}>
            <Form.Item
              name={['serverDetail', 'serverDetailAdmin']}
              label="Admin Detail"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item
              name={['serverDetail', 'serverDetailContacto']}
              label="Contact"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={12}>
            <Form.Item name={['serverDetail', 'serverDetailHost']} label="Host">
              <Input />
            </Form.Item>
          </Col>

          <Col sm={12}>
            <Form.Item name={['serverDetail', 'serverDetailSo']} label="SO">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Form.List name="services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ name, fieldKey, ...restField }) => (
                <>
                  <Row gutter={16}>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service Name'}
                        name={[name, 'serverServiceName']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service Description'}
                        name={[name, 'serverServiceDescription']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service Host'}
                        name={[name, 'serverServiceHost']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service IP'}
                        name={[name, 'serverServiceIp']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service User'}
                        name={[name, 'serverServiceUser']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service Password'}
                        name={[name, 'serverServicePassword']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input type="password" />
                      </Form.Item>
                    </Col>
                    <Col sm={3}>
                      <Form.Item
                        {...restField}
                        label={'Service Port'}
                        name={[name, 'serverServicePort']}
                        fieldKey={[fieldKey, 'field']}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Row>
                </>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Service
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name={['serviceIP']}>
          {(serviceIP, { add, remove }) => (
            <>
              {serviceIP.map(({ key, name, fieldKey }) => (
                <Row key={key} gutter={16}>
                  <Col>
                    <Form.Item
                      label="Server IP Name"
                      name={[name, 'serverIpName']}
                      fieldKey={[fieldKey, 'serverIpName']}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="Server IP Description"
                      name={[name, 'serverIpDescription']}
                      fieldKey={[fieldKey, 'serverIpDescription']}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col>
                    <Form.Item
                      label="IP Host"
                      name={[name, 'serverIpHost']}
                      fieldKey={[fieldKey, 'serverIpHost']}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="link"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add IP
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </StepContainer>
      <div className="flex justify-end">
        <Space>
          <Button type="default" onClick={handlePreviusStep}>
            Previous
          </Button>
          <Button type="primary" onClick={handleNextStep}>
            Next
          </Button>
        </Space>
      </div>
    </>
  )
}

export default DetailsStep
