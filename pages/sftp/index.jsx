/* eslint-disable unicorn/no-null */
import { SafetyCertificateOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
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
        error?.response?.data?.message || 'Could not list the directory.'
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
      message.error('Download failed.')
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
      message.error('Could not remove the file.')
    }
  }

  const handleUpload = async (file) => {
    setBusy(true)
    try {
      await sftpUpload(hostId, path, file)
      message.success(`Enviado: ${file.name}`)
      await load(hostId, path)
    } catch (error) {
      message.error(error?.response?.data?.message || 'Upload failed.')
    } finally {
      setBusy(false)
    }
    return false // impede o upload padrão do antd
  }

  const columns = [
    {
      title: 'Name',
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
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 110,
      render: (s, r) => (r.isDir ? '—' : humanSize(s)),
    },
    { title: 'Permissions', dataIndex: 'perms', key: 'perms', width: 120 },
    {
      title: 'Actions',
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
              okText="Remove"
              cancelText="Cancel"
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
      <NextSeo title="Files (SFTP) - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title={
              <span className="flex items-center gap-2">
                Files (SFTP)
                <Tooltip title="Browse, download, upload and remove files on the host over SFTP. Requires SSH Terminal OWNER; every operation is written to the audit trail. Same host key check (TOFU) as the terminal.">
                  <Tag
                    color="default"
                    icon={<SafetyCertificateOutlined />}
                    style={{ fontSize: 12, fontWeight: 400, marginInlineEnd: 0 }}
                  >
                    Privileged &amp; audited
                  </Tag>
                </Tooltip>
              </span>
            }
            breadcrumbs={[{ title: 'Files', href: '/sftp/' }]}
            extra={
              <Space>
                <Select
                  style={{ width: 280 }}
                  placeholder="Pick a host"
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
              pagination={{ pageSize: 25, showSizeChanger: false, hideOnSinglePage: true }}
              locale={{
                emptyText: hostId
                  ? 'Pick a host on the left and choose Open.'
                  : 'Pick a host to list its files.',
              }}
            />
          )}
        </PageContent>
      </Layout>
    </>
  )
}

export default Sftp
