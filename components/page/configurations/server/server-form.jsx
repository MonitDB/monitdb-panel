import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { useMemo } from 'react'

import { default as DatabaseIcons } from '~/helpers/database-icons'
import { useGlobal } from '~/hooks/index'

const ServerForm = () => {
  const {
    globalState: { serverTypes, serverEnvironments },
  } = useGlobal()
  const form = Form.useFormInstance()

  const idTypeServer = Form.useWatch('idTypeServer', form)

  const databaseName = useMemo(() => {
    if (serverTypes?.length === 0) return ''
    return idTypeServer
      ? serverTypes.find((serverType) => serverType.id === idTypeServer)
          ?.typeServerName
      : serverTypes[0]?.typeServerName
  }, [idTypeServer, serverTypes])

  return (
    <>
      <Row gutter={6}>
        <Col span={12}>
          <Form.Item
            label="Server Name"
            name="serverName"
            rules={[
              {
                required: true,
                message: 'Please enter the server name',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="Environment"
            name="idTypeServerEnvironment"
            rules={[
              {
                required: true,
                message: 'Please select an environment',
              },
            ]}
          >
            <Select
              options={serverEnvironments.map((environment) => ({
                label: environment.typeServerEnvironmentName,
                value: environment.id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Server Type"
            name="idTypeServer"
            rules={[
              {
                required: true,
                message: 'Please select a server type',
              },
            ]}
          >
            <Select
              options={serverTypes.map((type) => ({
                label: type.typeServerName,
                value: type.id,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={2}>
          <DatabaseIcons name={databaseName} className="w-10 h-10" />
        </Col>
      </Row>

      <Row gutter={6}>
        <Col span={6}>
          <Form.Item
            label="Host"
            name="serverHost"
            rules={[
              {
                required: true,
                message: 'Please enter the server host',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="User"
            name="serverUser"
            rules={[
              {
                required: true,
                message: 'Please enter the server user',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Password"
            name="serverPassword"
            rules={[
              {
                required: true,
                message: 'Please enter the server password',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Port"
            name="serverPort"
            rules={[
              {
                required: true,
                message: 'Please enter the server port',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item
            label="Status"
            name="serverEnable"
            rules={[{ required: true, message: 'Please select the status' }]}
          >
            <Select
              options={[
                { value: '1', label: 'Ativo' },
                { value: '0', label: 'Inativo' },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item
            label="Description"
            name="serverDescription"
            rules={[
              {
                required: true,
                message: 'Please enter the server description',
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>

      <>
        {' '}
        <Row gutter={16}>
          <Col sm={6}>
            <Form.Item
              name={['serverDetail', 'serverDetailName']}
              label="Detail"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item
              name={['serverDetail', 'serverDetailDescription']}
              label="Description"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item
              name={['serverDetail', 'serverDetailAdmin']}
              label="Admin Detail"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item
              name={['serverDetail', 'serverDetailContacto']}
              label="Contact"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col sm={6}>
            <Form.Item name={['serverDetail', 'serverDetailHost']} label="Host">
              <Input />
            </Form.Item>
          </Col>
          <Col sm={18}>
            <Form.Item name={['serverDetail', 'serverDetailSo']} label="SO">
              <Input />
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
      </>
    </>
  )
}

export default ServerForm
