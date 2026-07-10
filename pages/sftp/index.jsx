/* eslint-disable unicorn/no-null */
import {
  Alert,
  Breadcrumb,
  Button,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Upload,
} from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import { PageContent, PageHeader } from '~/components/page'
import { groupHostsByEnvironment } from '~/components/terminal/host-tree'
import { useGlobal } from '~/hooks/index'
import Layout from '~/layouts/default'
import { useSshStore } from '~/services/state-manager/ssh-store'

const humanSize = (n) => {
  if (n == null) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let v = Number(n)
  let index = 0
  while (v >= 1024 && index < units.length - 1) {
    v /= 1024
    index += 1
  }
  return `${v.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

const parentPath = (p) => {
  if (!p || p === '/') return '/'
  const trimmed = p.replace(/\/+$/, '')
  const cut = trimmed.slice(0, Math.max(0, trimmed.lastIndexOf('/')))
  return cut || '/'
}

const Sftp = () => {
  const { hosts, fetchHosts, sftpList, sftpDownload, sftpUpload, sftpDelete } =
    useSshStore()
  const {
    globalState: { serverEnvironments },
  } = useGlobal()
  const [hostId, setHostId] = useState(null)
  const [path, setPath] = useState('.')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  const load = async (id, target) => {
    if (!id) return
    setLoading(true)
    try {
      const data = await sftpList(id, target)
      setPath(data.path)
      setEntries(data.entries || [])
    } catch (error) {
      message.error(
        error?.response?.data?.message || 'Falha ao listar o diretório.'
      )
    } finally {
      setLoading(false)
    }
  }

  const open = () => load(hostId, '.')

  const navigate = (name) => load(hostId, `${path.replace(/\/+$/, '')}/${name}`)

  const handleDownload = async (name) => {
    setBusy(true)
    try {
      await sftpDownload(hostId, `${path.replace(/\/+$/, '')}/${name}`, name)
    } catch {
      message.error('Falha no download.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (name) => {
    try {
      await sftpDelete(hostId, `${path.replace(/\/+$/, '')}/${name}`)
      message.success('Removido.')
      await load(hostId, path)
    } catch {
      message.error('Falha ao remover.')
    }
  }

  const handleUpload = async (file) => {
    setBusy(true)
    try {
      await sftpUpload(hostId, path, file)
      message.success(`Enviado: ${file.name}`)
      await load(hostId, path)
    } catch (error) {
      message.error(error?.response?.data?.message || 'Falha no envio.')
    } finally {
      setBusy(false)
    }
    return false // impede o upload padrão do antd
  }

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (name, r) =>
        r.isDir ? (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => navigate(name)}
          >
            📁 {name}
          </Button>
        ) : (
          <span>📄 {name}</span>
        ),
    },
    {
      title: 'Tamanho',
      dataIndex: 'size',
      key: 'size',
      width: 110,
      render: (s, r) => (r.isDir ? '—' : humanSize(s)),
    },
    { title: 'Permissões', dataIndex: 'perms', key: 'perms', width: 120 },
    {
      title: 'Ações',
      key: 'actions',
      width: 200,
      render: (t, r) =>
        r.isDir ? null : (
          <Space>
            <Button size="small" onClick={() => handleDownload(r.name)}>
              Baixar
            </Button>
            <Popconfirm
              title={`Remover ${r.name}?`}
              onConfirm={() => handleDelete(r.name)}
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
      <NextSeo title="Arquivos (SFTP) - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Arquivos (SFTP)"
            breadcrumbs={[{ title: 'Arquivos', href: '/sftp/' }]}
            extra={
              <Space>
                <Select
                  style={{ width: 280 }}
                  placeholder="Selecione um host"
                  value={hostId}
                  onChange={setHostId}
                  options={groupHostsByEnvironment(
                    hosts,
                    serverEnvironments
                  ).map(([environment, list]) => ({
                    label: environment,
                    options: list.map((h) => ({
                      value: h.id,
                      label: `${h.name} — ${h.username}@${h.host}:${h.port}`,
                    })),
                  }))}
                />
                <Button type="primary" disabled={!hostId} onClick={open}>
                  Abrir
                </Button>
              </Space>
            }
          />

          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            message="Transferência privilegiada e auditada"
            description="Navegar, baixar, enviar e remover arquivos no host via SFTP. Requer OWNER de Terminal SSH; cada operação é registrada na auditoria. Mesma verificação de host key (TOFU) do terminal."
          />

          {hostId && path !== '.' && (
            <Space style={{ marginBottom: 12 }} wrap>
              <Breadcrumb items={[{ title: <code>{path}</code> }]} />
              <Button
                size="small"
                disabled={path === '/'}
                onClick={() => load(hostId, parentPath(path))}
              >
                ⬆ Subir
              </Button>
              <Button size="small" onClick={() => load(hostId, path)}>
                Atualizar
              </Button>
              <Upload beforeUpload={handleUpload} showUploadList={false}>
                <Button size="small" type="primary" loading={busy}>
                  ⬆ Enviar arquivo
                </Button>
              </Upload>
            </Space>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <Spin />
            </div>
          ) : (
            <Table
              dataSource={entries}
              columns={columns}
              rowKey="name"
              size="small"
              pagination={{ pageSize: 25, showSizeChanger: false }}
              locale={{
                emptyText: hostId
                  ? 'Selecione um host e clique em Abrir.'
                  : 'Selecione um host.',
              }}
            />
          )}
        </PageContent>
      </Layout>
    </>
  )
}

export default Sftp
