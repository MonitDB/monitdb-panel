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
      message.success(editing ? 'Host atualizado.' : 'Host criado.')
      setOpen(false)
      await fetchHosts()
    } else message.error('Falha ao salvar.')
  }

  const handleDelete = async (h) => {
    const ok = await deleteHost(h.id)
    if (ok) {
      message.success('Host removido.')
      await fetchHosts()
    } else message.error('Falha ao remover.')
  }

  const columns = [
    { title: 'Nome', dataIndex: 'name', key: 'name' },
    {
      title: 'Ambiente',
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
          <Tag>Sem ambiente</Tag>
        ),
    },
    {
      title: 'Tecnologias',
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
      title: 'Protocolo',
      dataIndex: 'protocol',
      key: 'protocol',
      width: 100,
      render: (p) => <Tag color={p === 'vnc' ? 'purple' : 'blue'}>{p.toUpperCase()}</Tag>,
    },
    {
      title: 'Destino',
      key: 'dest',
      render: (t, h) => `${h.host}:${h.port}`,
    },
    {
      title: 'Credencial',
      key: 'cred',
      width: 110,
      render: (t, h) =>
        h.hasPassword ? (
          <Tag color="green">definida</Tag>
        ) : (
          <Tag color="orange">faltando</Tag>
        ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 200,
      render: (t, h) => (
        <Space>
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
      <NextSeo title="Hosts remotos - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Hosts remotos (RDP/VNC)"
            breadcrumbs={[
              { title: 'Configurations', href: '/configurations/' },
              { title: 'Hosts remotos', href: '/configurations/remote-hosts/' },
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
            title={editing ? 'Editar host remoto' : 'Novo host remoto'}
            open={open}
            onOk={submit}
            confirmLoading={saving}
            onCancel={() => setOpen(false)}
            okText="Salvar"
            cancelText="Cancelar"
          >
            <Form form={form} layout="vertical">
              <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
                <Input placeholder="ex.: win-app-01" />
              </Form.Item>
              <Form.Item name="protocol" label="Protocolo">
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
                <Form.Item name="port" label="Porta" rules={[{ required: true }]}>
                  <InputNumber min={1} max={65_535} />
                </Form.Item>
              </Space>
              <Form.Item name="idTypeServerEnvironment" label="Ambiente">
                <Select
                  allowClear
                  placeholder="Sem ambiente"
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
                label="Tecnologias"
                extra="O que corre nesta máquina. Aparece como logótipo na árvore de acesso."
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Nenhuma"
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
                <Form.Item name="username" label="Usuário">
                  <Input placeholder="ex.: Administrator" />
                </Form.Item>
              )}
              <Form.Item
                name="password"
                label={editing ? 'Senha (vazio = manter)' : 'Senha'}
              >
                <Input.Password placeholder="••••••••" autoComplete="new-password" />
              </Form.Item>
              {protocol === 'rdp' && (
                <>
                  <Form.Item name="domain" label="Domínio (opcional)">
                    <Input placeholder="ex.: CORP" />
                  </Form.Item>
                  <Form.Item name="security" label="Segurança">
                    <Select
                      options={[
                        { value: 'any', label: 'Automático' },
                        { value: 'nla', label: 'NLA' },
                        { value: 'tls', label: 'TLS' },
                        { value: 'rdp', label: 'RDP (legado)' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="ignoreCert" valuePropName="checked">
                    <Checkbox>Ignorar certificado do servidor</Checkbox>
                  </Form.Item>
                </>
              )}
              <Form.Item name="description" label="Descrição (opcional)">
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
