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
import Layout from '~/layouts/default'
import { useSshStore } from '~/services/state-manager/ssh-store'

const SshHosts = () => {
  const { hosts, loading, saving, fetchHosts, saveHost, deleteHost, testHost } =
    useSshStore()
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
      description: h.description,
      password: '',
      privateKey: '',
      passphrase: '',
    })
    setOpen(true)
  }

  const submit = async () => {
    const v = await form.validateFields()
    const ok = await saveHost(v, editing?.id)
    if (ok) {
      message.success(editing ? 'Host atualizado.' : 'Host criado.')
      setOpen(false)
      await fetchHosts()
    } else {
      message.error('Falha ao salvar.')
    }
  }

  const handleDelete = async (h) => {
    const ok = await deleteHost(h.id)
    if (ok) {
      message.success('Host removido.')
      await fetchHosts()
    } else message.error('Falha ao remover.')
  }

  const handleTest = async (h) => {
    message.loading({ content: `Testando ${h.name}…`, key: 't' })
    const r = await testHost(h.id)
    if (r?.ok) message.success({ content: r.message, key: 't', duration: 5 })
    else message.error({ content: r?.message || 'Falha.', key: 't', duration: 6 })
  }

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    {
      title: 'Destino',
      key: 'dest',
      render: (t, h) => `${h.username}@${h.host}:${h.port}`,
    },
    {
      title: 'Auth',
      dataIndex: 'authType',
      key: 'authType',
      width: 90,
      render: (a) => <Tag>{a === 'key' ? 'chave' : 'senha'}</Tag>,
    },
    {
      title: 'Credencial',
      key: 'cred',
      width: 110,
      render: (t, h) =>
        h.hasPassword || h.hasPrivateKey ? (
          <Tag color="green">definida</Tag>
        ) : (
          <Tag color="orange">faltando</Tag>
        ),
    },
    {
      title: 'Host key',
      key: 'hostkey',
      width: 120,
      render: (t, h) =>
        h.hostKeyKnown ? (
          <Tag color="blue">registrada</Tag>
        ) : (
          <Tag>na 1ª conexão</Tag>
        ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 240,
      render: (t, h) => (
        <Space>
          <Button size="small" onClick={() => handleTest(h)}>
            Testar
          </Button>
          <Button size="small" onClick={() => openEdit(h)}>
            Editar
          </Button>
          <Popconfirm
            title="Remover este host?"
            onConfirm={() => handleDelete(h)}
            okText="Remover"
            cancelText="Cancelar"
          >
            <Button size="small" danger>
              Remover
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <NextSeo title="Hosts SSH - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Hosts SSH"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Hosts SSH', href: '/configurations/ssh-hosts/' },
            ]}
            extra={
              <Button type="primary" onClick={openNew}>
                Novo host
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
            title={editing ? 'Editar host SSH' : 'Novo host SSH'}
            open={open}
            onOk={submit}
            confirmLoading={saving}
            onCancel={() => setOpen(false)}
            okText="Salvar"
            cancelText="Cancelar"
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                <Input placeholder="ex.: app-prod-01" />
              </Form.Item>
              <Space>
                <Form.Item name="host" label="Host / IP" rules={[{ required: true }]}>
                  <Input placeholder="10.0.0.10 ou host.interno" />
                </Form.Item>
                <Form.Item name="port" label="Porta" rules={[{ required: true }]}>
                  <InputNumber min={1} max={65_535} />
                </Form.Item>
              </Space>
              <Form.Item name="username" label="Usuário" rules={[{ required: true }]}>
                <Input placeholder="ex.: ubuntu" />
              </Form.Item>
              <Form.Item name="authType" label="Autenticação">
                <Select
                  onChange={setAuthType}
                  options={[
                    { value: 'password', label: 'Senha' },
                    { value: 'key', label: 'Chave privada' },
                  ]}
                />
              </Form.Item>
              {authType === 'password' ? (
                <Form.Item
                  name="password"
                  label={editing ? 'Senha (deixe vazio p/ manter)' : 'Senha'}
                >
                  <Input.Password placeholder="••••••••" autoComplete="new-password" />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="privateKey"
                    label={editing ? 'Chave privada (vazio p/ manter)' : 'Chave privada (PEM)'}
                  >
                    <Input.TextArea rows={4} placeholder="-----BEGIN OPENSSH PRIVATE KEY-----" />
                  </Form.Item>
                  <Form.Item name="passphrase" label="Passphrase (opcional)">
                    <Input.Password placeholder="••••••••" autoComplete="new-password" />
                  </Form.Item>
                </>
              )}
              <Form.Item name="description" label="Descrição (opcional)">
                <Input.TextArea rows={2} />
              </Form.Item>
              {editing?.hostKeyKnown && (
                <Form.Item
                  name="resetHostKey"
                  valuePropName="checked"
                  extra="Marque apenas se o host foi reinstalado/migrado legitimamente — a próxima conexão registra a nova host key (TOFU)."
                >
                  <Checkbox>Redefinir host key</Checkbox>
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
