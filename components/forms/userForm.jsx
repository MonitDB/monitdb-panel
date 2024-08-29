/* eslint-disable unicorn/no-nested-ternary */
import { Button, Col, Form, Input, Row, Select } from 'antd'
import React, { useMemo } from 'react'

const UserForm = ({
  roles,
  isLoading,
  statusOptions,
  isEdit = false,
  handleDelete,
}) => {
  const rolesOptions = useMemo(() => {
    return roles.map((role) => ({
      label: role.roleName,
      value: role.idRole,
    }))
  }, [roles])

  return (
    <>
      <div className="md:max-w-[50%]">
        <Row gutter={[16, 16]}>
          <Col sm={24} md={12}>
            <Form.Item
              label="Name"
              name="loginName"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>

          <Col sm={24} md={12}>
            <Form.Item
              label="E-mail"
              name="loginEmail"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>

          {!isEdit && (
            <Col sm={24} md={12}>
              <Form.Item
                label="Password"
                name="loginPassword"
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
          )}

          <Col sm={24} md={12}>
            <Form.Item
              label="Role"
              name="idRole"
              rules={[{ required: true, message: 'Please select a role' }]}
              valuePropName="value"
            >
              <Select placeholder="Select a role" options={rolesOptions} />
            </Form.Item>
          </Col>

          <Col sm={24} md={12}>
            <Form.Item
              label="Status"
              name="loginEnable"
              rules={[{ required: true, message: 'Please select a status' }]}
            >
              <Select placeholder="Select a status" options={statusOptions} />
            </Form.Item>
          </Col>

          <Col sm={24}>
            <Form.Item>
              <div className="flex justify-between items-center">
                {isEdit && handleDelete && (
                  <Button type="primary" danger onClick={handleDelete}>
                    Delete
                  </Button>
                )}
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {isLoading
                    ? isEdit
                      ? 'Saving...'
                      : 'Creating...'
                    : isEdit
                    ? 'Save'
                    : 'Create'}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default UserForm
