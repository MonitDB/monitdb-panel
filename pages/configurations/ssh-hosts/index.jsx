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
import { useSshStore } from '~/services/state-manager/ssh-store'

const SshHosts = () => {
  const { hosts, loading, saving, fetchHosts, saveHost, deleteHost, testHost } =
    useSshStore()
  const {
    globalState: { serverEnvironments, serverTypes },
  } = useGlobal()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [authType, setAuthType] = useState('password')
  const [form] = Form.useForm()

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const openNew = () => {
    setEditing(null)
    setAuthType('password')
    form.resetFields()
    form.setFieldsValue({ port: 22, authType: 'password' })
    setOpen(true)
  }

  const openEdit = (h) => {
    setEditing(h)
    setAuthType(h.authType || 'password')
    form.setFieldsValue({
      name: h.name,
      host: h.host,
      port: h.port,
      username: h.username,
      authType: h.authType || 'password',
      idTypeServerEnvironment:
        h.idTypeServerEnvironment ?? h.typeServerEnvironment?.id ?? null,
      description: h.description,
      // A API grava CSV; o Select multiplo trabalha com array de ids.
      technologies: parseTechnologies(h.technologies),
      password: '',
      privateKey: '',
      passphrase: '',
    })
    setOpen(true)
  }

  const submit = async () => {
    const v = await form.validateFields()
    // allowClear manda undefined — normaliza p/ null para o PUT limpar de fato.
    v.idTypeServerEnvironment = v.idTypeServerEnvironment ?? null
    // Sem seleção o antd manda undefined; [] limpa a coluna no PUT.
    v.technologies = v.technologies ?? []
    const ok = await saveHost(v, editing?.id)
    if (ok) {
      message.success(editing ? 'Host updated.' : 'Host created.')
      setOpen(false)
      await fetchHosts()
    } else {
      message.error('Could not save the host.')
    }
  }

  const handleDelete = async (h) => {
    const ok = await deleteHost(h.id)
    if (ok) {
      message.success('Host removed.')
      await fetchHosts()
    } else message.error('Could not remove the host.')
  }

  const handleTest = async (h) => {
    message.loading({ content: `Testing ${h.name}…`, key: 't' })
    const r = await testHost(h.id)
    if (r?.ok) message.success({ content: r.message, key: 't', duration: 5 })
    else message.error({ content: r?.message || 'Test failed.', key: 't', duration: 6 })
  }

  const columns = [
    // O logotipo abre a linha: numa lista longa e a tecnologia que o olho
    // procura antes do nome. Pedido do Danilo.
    {
      title: 'Technologies',
      key: 'tech',
      width: 120,
      render: (t, h) => (
        <HostTechnologies
          value={h.technologies}
          serverTypes={serverTypes}
          size={20}
          max={5}
        />
      ),
    },
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
      title: 'Target',
      key: 'dest',
      render: (t, h) => `${h.username}@${h.host}:${h.port}`,
    },
    {
      title: 'Auth',
      dataIndex: 'authType',
      key: 'authType',
      width: 90,
      render: (a) => <Tag>{a === 'key' ? 'key' : 'password'}</Tag>,
    },
    {
      title: 'Credential',
      key: 'cred',
      width: 110,
      render: (t, h) =>
        h.hasPassword || h.hasPrivateKey ? (
          <Tag color="green">set</Tag>
        ) : (
          <Tag color="orange">missing</Tag>
        ),
    },
    {
      title: 'Host key',
      key: 'hostkey',
      width: 120,
      render: (t, h) =>
        h.hostKeyKnown ? (
          <Tag color="blue">known</Tag>
        ) : (
          <Tag>on first connection</Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 240,
      render: (t, h) => (
        <Space>
          <Button size="small" onClick={() => handleTest(h)}>
            Test
          </Button>
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
      <NextSeo title="SSH Hosts - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="SSH Hosts"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'SSH Hosts', href: '/configurations/ssh-hosts/' },
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
            title={editing ? 'Edit SSH host' : 'New SSH host'}
            open={open}
            onOk={submit}
            confirmLoading={saving}
            onCancel={() => setOpen(false)}
            okText="Save"
            cancelText="Cancel"
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. app-prod-01" />
              </Form.Item>
              <Space>
                <Form.Item name="host" label="Host / IP" rules={[{ required: true }]}>
                  <Input placeholder="10.0.0.10 or host.internal" />
                </Form.Item>
                <Form.Item name="port" label="Port" rules={[{ required: true }]}>
                  <InputNumber min={1} max={65_535} />
                </Form.Item>
              </Space>
              <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input placeholder="e.g. ubuntu" />
              </Form.Item>
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
              <Form.Item name="authType" label="Authentication">
                <Select
                  onChange={setAuthType}
                  options={[
                    { value: 'password', label: 'Password' },
                    { value: 'key', label: 'Private key' },
                  ]}
                />
              </Form.Item>
              {authType === 'password' ? (
                <Form.Item
                  name="password"
                  label={editing ? 'Password (leave empty to keep)' : 'Password'}
                >
                  <Input.Password placeholder="••••••••" autoComplete="new-password" />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="privateKey"
                    label={editing ? 'Private key (leave empty to keep)' : 'Private key (PEM)'}
                  >
                    <Input.TextArea rows={4} placeholder="-----BEGIN OPENSSH PRIVATE KEY-----" />
                  </Form.Item>
                  <Form.Item name="passphrase" label="Passphrase (optional)">
                    <Input.Password placeholder="••••••••" autoComplete="new-password" />
                  </Form.Item>
                </>
              )}
              <Form.Item name="description" label="Description (optional)">
                <Input.TextArea rows={2} />
              </Form.Item>
              {editing?.hostKeyKnown && (
                <Form.Item
                  name="resetHostKey"
                  valuePropName="checked"
                  extra="Tick only if the host was legitimately reinstalled or migrated — the next connection records the new host key (TOFU)."
                >
                  <Checkbox>Reset host key</Checkbox>
                </Form.Item>
              )}
            </Form>
          </Modal>
        </PageContent>
      </Layout>
    </>
  )
}

export default SshHosts
