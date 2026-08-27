/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/no-null */
import {
  LoginOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  StarFilled,
  StarOutlined,
} from '@ant-design/icons'
import { Button, Empty, Input, Tooltip, Tree, Typography } from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import HostTechnologies from './host-technologies'

const NO_ENVIRONMENT = 'No environment'
const FAVORITES_KEY = 'section-favorites'
const RECENT_KEY = 'section-recent'
// Acima disto a árvore abre fechada: com 30 hosts por lado, tudo expandido vira parede.
const COLLAPSE_THRESHOLD = 15
const MAX_RECENT = 5

/**
 * Agrupa hosts SSH pelo nome do ambiente (catálogo TYPESERVERENVIRONMENT).
 * Retorna [[ambiente, hosts]] na ordem do catálogo; "No environment" por último.
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

/** Preferências locais (favoritos, recentes, grupos abertos) — por navegador. */
const readList = (key) => {
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeList = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Preferência é conveniência: sem storage, a lista só perde a memória.
  }
}

/**
 * Sidebar de acesso remoto: busca + árvore de hosts agrupados por ambiente,
 * com favoritos fixados e os últimos acessados no topo. Duplo clique na folha
 * (ou o botão de ação) chama onOpen(host). Usada pelo Terminal SSH (abas) e
 * pelo Desktop remoto; `subtitle` e `openText` customizam a linha secundária
 * e o rótulo do botão. `storageKey` separa as preferências das duas telas.
 */
const defaultSubtitle = (host) => `${host.username}@${host.host}:${host.port}`

const HostTree = ({
  hosts,
  environments,
  onOpen,
  subtitle = defaultSubtitle,
  openText = 'Open',
  // Ícone da ação de abrir: cada tela passa o seu (terminal, ecrã remoto…).
  openIcon = <LoginOutlined />,
  storageKey = 'ssh',
  // Catálogo SOLUTION.TYPESERVER: traduz os ids gravados no host em logótipos.
  serverTypes = [],
}) => {
  const [search, setSearch] = useState('')
  const [expandedByUser, setExpandedByUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [recent, setRecent] = useState([])

  const favoritesStorage = `monitdb.hostTree.${storageKey}.favorites`
  const recentStorage = `monitdb.hostTree.${storageKey}.recent`
  const expandedStorage = `monitdb.hostTree.${storageKey}.expanded`

  // localStorage só existe no cliente — o Next renderiza esta página no servidor.
  useEffect(() => {
    setFavorites(readList(favoritesStorage))
    setRecent(readList(recentStorage))
    const stored = readList(expandedStorage)
    if (stored.length > 0) setExpandedByUser(stored)
  }, [favoritesStorage, recentStorage, expandedStorage])

  const toggleFavorite = useCallback(
    (hostId) => {
      setFavorites((current) => {
        const next = current.includes(hostId)
          ? current.filter((id) => id !== hostId)
          : [...current, hostId]
        writeList(favoritesStorage, next)
        return next
      })
    },
    [favoritesStorage]
  )

  // Abrir também alimenta os recentes — na prática usa-se sempre os mesmos poucos.
  const handleOpen = useCallback(
    (host) => {
      setRecent((current) => {
        const next = [host.id, ...current.filter((id) => id !== host.id)].slice(
          0,
          MAX_RECENT
        )
        writeList(recentStorage, next)
        return next
      })
      onOpen(host)
    },
    [onOpen, recentStorage]
  )

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

  const renderLeaf = (host) => (
    <div className="group flex items-center justify-between gap-1 pr-1">
      <div className="min-w-0 leading-tight">
        {/* O logotipo vem primeiro: numa lista de trinta maquinas, e a tecnologia
            que o olho procura antes do nome. Pedido do Danilo. */}
        <div className="flex items-center gap-1">
          <HostTechnologies
            value={host.technologies}
            serverTypes={serverTypes}
            size={14}
            max={3}
          />
          <span className="truncate">{host.name}</span>
        </div>
        <Typography.Text
          type="secondary"
          style={{ fontSize: 11 }}
          className="block truncate"
          title={subtitle(host)}
        >
          {subtitle(host)}
        </Typography.Text>
      </div>
      {/* Ações só aparecem na linha sob o cursor (ou com foco): o botão escrito
          comia largura útil em todas as linhas. */}
      <div className="flex shrink-0 items-center opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <Tooltip
          title={
            favorites.includes(host.id) ? 'Remove favorite' : 'Add to favorites'
          }
        >
          <Button
            size="small"
            type="text"
            aria-label="Toggle favorite"
            icon={
              favorites.includes(host.id) ? (
                <StarFilled style={{ color: '#faad14' }} />
              ) : (
                <StarOutlined />
              )
            }
            onClick={(event) => {
              event.stopPropagation()
              toggleFavorite(host.id)
            }}
          />
        </Tooltip>
        <Tooltip title={openText}>
          <Button
            size="small"
            type="text"
            aria-label={openText}
            icon={openIcon}
            onClick={(event) => {
              event.stopPropagation()
              handleOpen(host)
            }}
          />
        </Tooltip>
      </div>
    </div>
  )

  const sectionTitle = (label, count) => (
    <Typography.Text strong>
      {label} <Typography.Text type="secondary">({count})</Typography.Text>
    </Typography.Text>
  )

  const leafNode = (host, prefix) => ({
    key: `${prefix}-h-${host.id}`,
    isLeaf: true,
    host,
    title: renderLeaf(host),
  })

  const byId = useMemo(() => {
    const map = new Map()
    for (const host of filtered) map.set(host.id, host)
    return map
  }, [filtered])

  const favoriteHosts = favorites
    .map((id) => byId.get(id))
    .filter(Boolean)
  const recentHosts = recent.map((id) => byId.get(id)).filter(Boolean)

  const treeData = [
    ...(favoriteHosts.length > 0
      ? [
          {
            key: FAVORITES_KEY,
            selectable: false,
            title: sectionTitle('Favorites', favoriteHosts.length),
            children: favoriteHosts.map((host) => leafNode(host, 'fav')),
          },
        ]
      : []),
    ...(recentHosts.length > 0
      ? [
          {
            key: RECENT_KEY,
            selectable: false,
            title: sectionTitle('Recent', recentHosts.length),
            children: recentHosts.map((host) => leafNode(host, 'rec')),
          },
        ]
      : []),
    ...groups.map(([name, list]) => ({
      key: `env-${name}`,
      selectable: false,
      title: sectionTitle(name, list.length),
      children: list.map((host) => leafNode(host, `env-${name}`)),
    })),
  ]

  const allKeys = treeData.map((node) => node.key)
  // Poucos hosts: tudo aberto. Muitos: só favoritos e recentes, para não virar parede.
  const defaultExpanded =
    hosts.length > COLLAPSE_THRESHOLD
      ? allKeys.filter((key) => key === FAVORITES_KEY || key === RECENT_KEY)
      : allKeys
  // Busca ativa expande tudo; sem busca, respeita o que o utilizador deixou aberto.
  const expandedKeys = search ? allKeys : expandedByUser ?? defaultExpanded
  const allExpanded = allKeys.every((key) => expandedKeys.includes(key))

  const setExpanded = (keys) => {
    setExpandedByUser(keys)
    writeList(expandedStorage, keys)
  }

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-1">
        <Input.Search
          placeholder="Search host…"
          allowClear
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Tooltip title={allExpanded ? 'Collapse all' : 'Expand all'}>
          <Button
            size="small"
            type="text"
            aria-label={allExpanded ? 'Collapse all' : 'Expand all'}
            disabled={!!search}
            icon={
              allExpanded ? <MinusSquareOutlined /> : <PlusSquareOutlined />
            }
            onClick={() => setExpanded(allExpanded ? [] : allKeys)}
          />
        </Tooltip>
      </div>
      {treeData.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            hosts.length === 0 ? 'No hosts registered' : 'No hosts found'
          }
        />
      ) : (
        // Só rolagem vertical: a árvore do antd recua por nível e, com nomes
        // longos, o overflow-auto fazia nascer uma barra horizontal.
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Tree
            blockNode
            treeData={treeData}
            expandedKeys={expandedKeys}
            onExpand={(keys) => {
              if (!search) setExpanded(keys)
            }}
            onDoubleClick={(event, node) => {
              if (node?.host) handleOpen(node.host)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default HostTree
