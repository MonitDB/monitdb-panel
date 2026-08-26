/* eslint-disable unicorn/no-null */
import { Tooltip } from 'antd'
import React from 'react'

import DatabaseIcons, { Icons } from '~/helpers/database-icons'
import { slugify } from '~/utils/global'

/**
 * Tecnologias de um host de acesso remoto (SSH/Desktop).
 *
 * O host guarda os ids do catálogo SOLUTION.TYPESERVER em CSV — o mesmo
 * catálogo dos servidores monitorizados, que o painel já carrega no estado
 * global. Aqui só traduzimos id → nome → logótipo, reaproveitando os SVG que
 * o produto já usa nos cartões de servidor.
 */

/** CSV do host → array de ids (o Select do formulário trabalha com ids). */
export const parseTechnologies = (value) => {
  if (Array.isArray(value)) return value.map(Number).filter(Boolean)
  if (!value) return []
  return String(value)
    .split(',')
    .map((part) => Number(part.trim()))
    .filter(Boolean)
}

/** ids → entradas do catálogo, na ordem em que o catálogo veio. */
export const resolveTechnologies = (value, serverTypes = []) => {
  const ids = new Set(parseTechnologies(value))
  return serverTypes.filter((type) => ids.has(type.id))
}

/** Nem toda tecnologia do catálogo tem SVG — sem logótipo não desenhamos nada. */
const hasIcon = (name) => !!Icons[slugify(name || '')]

/**
 * Fila de logótipos. `size` em pixeis; `max` corta a lista e resume o resto,
 * para a linha do host não crescer quando a máquina tem várias tecnologias.
 */
const HostTechnologies = ({ value, serverTypes = [], size = 16, max = 4 }) => {
  const types = resolveTechnologies(value, serverTypes).filter((type) =>
    hasIcon(type.typeServerName)
  )
  if (types.length === 0) return null

  const shown = types.slice(0, max)
  const hidden = types.slice(max)

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {shown.map((type) => (
        <Tooltip key={type.id} title={type.typeServerName}>
          {/* span em volta: o Tooltip precisa de um nó que aceite ref. */}
          <span className="inline-flex" style={{ lineHeight: 0 }}>
            <DatabaseIcons
              name={type.typeServerName}
              style={{ width: size, height: size }}
            />
          </span>
        </Tooltip>
      ))}
      {hidden.length > 0 && (
        <Tooltip
          title={hidden.map((type) => type.typeServerName).join(', ')}
        >
          <span className="text-xs text-gray-400">+{hidden.length}</span>
        </Tooltip>
      )}
    </span>
  )
}

export default HostTechnologies
