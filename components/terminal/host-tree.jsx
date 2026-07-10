/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-null */
import { Button, Empty, Input, Tree, Typography } from 'antd'
import React, { useMemo, useState } from 'react'

const NO_ENVIRONMENT = 'Sem ambiente'

/**
 * Agrupa hosts SSH pelo nome do ambiente (catálogo TYPESERVERENVIRONMENT).
 * Retorna [[ambiente, hosts]] na ordem do catálogo; "Sem ambiente" por último.
 * Reutilizado pelo Select agrupado do /sftp.
 */
export const groupHostsByEnvironment = (hosts, environments = []) => {
  const groups = hosts.reduce((accumulator, host) => {
    const name =
      host.typeServerEnvironment?.typeServerEnvironmentName || NO_ENVIRONMENT
    ;(accumulator[name] = accumulator[name] || []).push(host)
    return accumulator
  }, {})
  const order = environments.map(
    (environment) => environment.typeServerEnvironmentName
  )
  return Object.entries(groups).sort(([a], [b]) => {
    if (a === NO_ENVIRONMENT) return 1
    if (b === NO_ENVIRONMENT) return -1
    const indexA = order.indexOf(a)
    const indexB = order.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
}

/**
 * Sidebar do terminal: busca + árvore de hosts agrupados por ambiente.
 * Duplo clique na folha (ou botão "Abrir") abre uma nova aba de sessão —
 * o mesmo host pode ter várias sessões simultâneas.
 */
const HostTree = ({ hosts, environments, onOpen }) => {
  const [search, setSearch] = useState('')
  const [expandedByUser, setExpandedByUser] = useState(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return hosts
    return hosts.filter((host) =>
      [host.name, host.host, host.username, host.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query))
    )
  }, [hosts, search])

  const groups = useMemo(
    () => groupHostsByEnvironment(filtered, environments),
    [filtered, environments]
  )

  const groupKeys = groups.map(([name]) => `env-${name}`)
  // Busca ativa expande tudo; sem busca, respeita o usuário (default: tudo aberto).
  const expandedKeys = search ? groupKeys : expandedByUser ?? groupKeys

  const treeData = groups.map(([name, list]) => ({
    key: `env-${name}`,
    selectable: false,
    title: (
      <Typography.Text strong>
        {name}{' '}
        <Typography.Text type="secondary">({list.length})</Typography.Text>
      </Typography.Text>
    ),
    children: list.map((host) => ({
      key: `h-${host.id}`,
      isLeaf: true,
      host,
      title: (
        <div className="flex items-center justify-between gap-1 pr-1">
          <div className="min-w-0">
            <div className="truncate">{host.name}</div>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11 }}
              ellipsis
            >
              {host.username}@{host.host}:{host.port}
            </Typography.Text>
          </div>
          <Button
            size="small"
            type="link"
            onClick={(event) => {
              event.stopPropagation()
              onOpen(host)
            }}
          >
            Abrir
          </Button>
        </div>
      ),
    })),
  }))

  return (
    <div className="flex h-full flex-col gap-2">
      <Input.Search
        placeholder="Buscar host…"
        allowClear
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {groups.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            hosts.length === 0
              ? 'Nenhum host cadastrado'
              : 'Nenhum host encontrado'
          }
        />
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <Tree
            blockNode
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => {
              if (!search) setExpandedByUser(keys)
            }}
            onDoubleClick={(event, node) => {
              if (node?.host) onOpen(node.host)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default HostTree
