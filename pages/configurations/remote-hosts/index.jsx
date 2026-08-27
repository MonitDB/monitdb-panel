/* eslint-disable unicorn/no-null */
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import HostTechnologies, {
  parseTechnologies,
} from '~/components/terminal/host-technologies'
import { useGlobal } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useRemoteStore } from '~/services/state-manager/remote-store'

const RemoteHosts = () => {
  const { hosts, loading, saving, fetchHosts, saveHost, deleteHost } =
    useRemoteStore()
  const {
    globalState: { serverEnvironments, serverTypes },
  } = useGlobal()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [protocol, setProtocol] = useState('rdp')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const openNew = () => {
    setEditing(null)
    setProtocol('rdp')
    form.resetFields()
    form.setFieldsValue({
      protocol: 'rdp',
      port: 3389,
      security: 'any',
      ignoreCert: true,
    })
    setOpen(true)
  }

  const openEdit = (h) => {
    setEditing(h)
    setProtocol(h.protocol)
    form.setFieldsValue({
      ...h,
      password: '',
      idTypeServerEnvironment:
        h.idTypeServerEnvironment ?? h.typeServerEnvironment?.id ?? null,
      // A API grava CSV; o Select multiplo trabalha com array de ids.
      technologies: parseTechnologies(h.technologies),
    })
    setOpen(true)
  }

  const onProtocol = (value) => {
    setProtocol(value)
    form.setFieldsValue({ port: value === 'vnc' ? 5900 : 3389 })
  }

  const submit = async () => {
    const values = await form.validateFields()
    // allowClear manda undefined — normaliza p/ null para o PUT limpar de fato.
    values.idTypeServerEnvironment = values.idTypeServerEnvironment ?? null
    // Sem seleção o antd manda undefined; [] limpa a coluna no PUT.
    values.technologies = values.technologies ?? []
    const ok = await saveHost(values, editing?.id)
    if (ok) {
      message.success(editing ? 'Host updated.' : 'Host created.')
      setOpen(false)
      await fetchHosts()
    } else message.error('Could not save the host.')
  }

  const handleDelete = async (h) => {
    const ok = await deleteHost(h.id)
    if (ok) {
      message.success('Host removed.')
      await fetchHosts()
    } else message.error('Could not remove the host.')
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Environment',
      key: 'env',
      width: 150,
      filters: serverEnvironments.map((environment) => ({
        text: environment.typeServerEnvironmentName,
        value: environment.id,
      })),
      onFilter: (value, h) =>
        (h.idTypeServerEnvironment ?? h.typeServerEnvironment?.id) === value,
      render: (t, h) =>
        h.typeServerEnvironment?.typeServerEnvironmentName ? (
          <Tag color="geekblue">
            {h.typeServerEnvironment.typeServerEnvironmentName}
          </Tag>
        ) : (
          <Tag>No environment</Tag>
        ),
    },
    {
      title: 'Technologies',
      key: 'tech',
      width: 130,
      render: (t, h) => (
        <HostTechnologies
          value={h.technologies}
          serverTypes={serverTypes}
          size={20}
          max={5}
        />
      ),
    },
    {
      title: 'Protocol',
      dataIndex: 'protocol',
      key: 'protocol',
      width: 100,
      render: (p) => <Tag color={p === 'vnc' ? 'purple' : 'blue'}>{p.toUpperCase()}</Tag>,
    },
    {
      title: 'Target',
      key: 'dest',
      render: (t, h) => `${h.host}:${h.port}`,
    },
    {
      title: 'Credential',
      key: 'cred',
      width: 110,
      render: (t, h) =>
        h.hasPassword ? (
          <Tag color="green">set</Tag>
        ) : (
          <Tag color="orange">missing</Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (t, h) => (
        <Space>
          <Button size="small" onClick={() => openEdit(h)}>
            Edit
          </Button>
          <Popconfirm
            title="Remove this host?"
            onConfirm={() => handleDelete(h)}
            okText="Remove"
            cancelText="Cancel"
          >
            <Button size="small" danger>
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Remote Hosts - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Remote Hosts (RDP/VNC)"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Remote Hosts', href: '/configurations/remote-hosts/' },
            ]}
            extra={
              <Button type="primary" onClick={openNew}>
                New host
              </Button>
            }
          />

          <Table
            dataSource={hosts}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={false}
          />

          <Modal
            title={editing ? 'Edit remote host' : 'New remote host'}
            open={open}
            onOk={submit}
            confirmLoading={saving}
            onCancel={() => setOpen(false)}
            okText="Save"
            cancelText="Cancel"
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. win-app-01" />
              </Form.Item>
              <Form.Item name="protocol" label="Protocol">
                <Select
                  onChange={onProtocol}
                  options={[
                    { value: 'rdp', label: 'RDP (Windows)' },
                    { value: 'vnc', label: 'VNC' },
                  ]}
                />
              </Form.Item>
              <Space>
                <Form.Item name="host" label="Host / IP" rules={[{ required: true }]}>
                  <Input placeholder="10.0.0.20" />
                </Form.Item>
                <Form.Item name="port" label="Port" rules={[{ required: true }]}>
                  <InputNumber min={1} max={65_535} />
                </Form.Item>
              </Space>
              <Form.Item name="idTypeServerEnvironment" label="Environment">
                <Select
                  allowClear
                  placeholder="No environment"
                  options={serverEnvironments
                    .filter(
                      (environment) =>
                        environment.typeServerEnvironmentEnable !== false
                    )
                    .map((environment) => ({
                      value: environment.id,
                      label: environment.typeServerEnvironmentName,
                    }))}
                />
              </Form.Item>
              <Form.Item
                name="technologies"
                label="Technologies"
                extra="What runs on this machine. Shown as a logo in the access tree."
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="None"
                  optionFilterProp="label"
                  options={serverTypes
                    .filter((type) => type.typeServerEnable !== false)
                    .map((type) => ({
                      value: type.id,
                      label: type.typeServerName,
                    }))}
                />
              </Form.Item>
              {protocol === 'rdp' && (
                <Form.Item name="username" label="Username">
                  <Input placeholder="e.g. Administrator" />
                </Form.Item>
              )}
              <Form.Item
                name="password"
                label={editing ? 'Password (empty = keep)' : 'Password'}
              >
                <Input.Password placeholder="••••••••" autoComplete="new-password" />
              </Form.Item>
              {protocol === 'rdp' && (
                <>
                  <Form.Item name="domain" label="Domain (optional)">
                    <Input placeholder="e.g. CORP" />
                  </Form.Item>
                  <Form.Item name="security" label="Security">
                    <Select
                      options={[
                        { value: 'any', label: 'Automatic' },
                        { value: 'nla', label: 'NLA' },
                        { value: 'tls', label: 'TLS' },
                        { value: 'rdp', label: 'RDP (legacy)' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="ignoreCert" valuePropName="checked">
                    <Checkbox>Ignore server certificate</Checkbox>
                  </Form.Item>
                </>
              )}
              <Form.Item name="description" label="Description (optional)">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Form>
          </Modal>
        </PageContent>
      </Layout>
    </>
  )
}

export default RemoteHosts
