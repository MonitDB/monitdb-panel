/* eslint-disable unicorn/no-null */
import React, { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Moldura das telas de acesso remoto: barra lateral de hosts + área de sessão.
 * Usada pelo Terminal SSH e pelo Desktop remoto, que antes repetiam este bloco
 * com altura cravada (68vh/70vh) e largura fixa de 280px.
 *
 * Resolve dois defeitos:
 *  - altura: acompanha a janela (o que sobra abaixo do topo da área) em vez de
 *    uma fração fixa, que cortava a lista em telas baixas e deixava moldura
 *    vazia nas altas;
 *  - largura: a lateral é arrastável, com mínimo/máximo, e a preferência fica
 *    guardada por navegador.
 *
 * `recalcKey` força a remedição quando algo acima muda de altura — mais simples
 * e previsível que observar o DOM. Hoje nenhuma das telas precisa dele (o aviso
 * do topo passou a etiqueta fixa ao lado do título), mas fica para quem venha a
 * pôr algo de altura variável acima da lista.
 */

const WIDTH_KEY = 'monitdb.hostWorkspace.width'
const MIN_WIDTH = 220
const MAX_WIDTH = 560
const DEFAULT_WIDTH = 320
const MIN_HEIGHT = 380
// Mesmo respiro do padding do PageContent, para a área não colar no rodapé.
const BOTTOM_GAP = 32
const KEYBOARD_STEP = 16

const clampWidth = (value) =>
  Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(value)))

const readStoredWidth = () => {
  try {
    const stored = Number(window.localStorage.getItem(WIDTH_KEY))
    return stored ? clampWidth(stored) : DEFAULT_WIDTH
  } catch {
    return DEFAULT_WIDTH
  }
}

const storeWidth = (value) => {
  try {
    window.localStorage.setItem(WIDTH_KEY, String(value))
  } catch {
    // Preferência de largura é conveniência: se o storage falhar, segue o padrão.
  }
}

const HostWorkspace = ({ sidebar, recalcKey, children }) => {
  const rowReference = useRef(null)
  const widthReference = useRef(DEFAULT_WIDTH)
  const [height, setHeight] = useState(MIN_HEIGHT)
  const [width, setWidth] = useState(DEFAULT_WIDTH)

  // localStorage só existe no cliente — o Next renderiza esta página no servidor.
  useEffect(() => {
    setWidth(readStoredWidth())
  }, [])

  useEffect(() => {
    widthReference.current = width
  }, [width])

  useEffect(() => {
    const measure = () => {
      const node = rowReference.current
      if (!node) return
      const { top } = node.getBoundingClientRect()
      setHeight(Math.max(MIN_HEIGHT, window.innerHeight - top - BOTTOM_GAP))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [recalcKey])

  const startDrag = useCallback((event) => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = widthReference.current

    const onMove = (moveEvent) => {
      setWidth(clampWidth(startWidth + moveEvent.clientX - startX))
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.userSelect = ''
      storeWidth(widthReference.current)
    }

    // Sem isto o arrasto seleciona o texto da árvore.
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }, [])

  const onHandleKeyDown = useCallback((event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = clampWidth(
      widthReference.current +
        (event.key === 'ArrowRight' ? KEYBOARD_STEP : -KEYBOARD_STEP)
    )
    setWidth(next)
    storeWidth(next)
  }, [])

  return (
    <div ref={rowReference} className="flex" style={{ height }}>
      <aside
        className="shrink-0 overflow-hidden rounded-md border border-gray-200 p-2 dark:border-gray-700"
        style={{ width }}
      >
        {sidebar}
      </aside>

      {/* Botão simples, sem role: o splitter precisa de foco e de teclado (o
          eslint recusa listeners em div), e a tabela do jsx-a11y trata
          `separator` como não interativo — não vale a pena forçar. */}
      <button
        type="button"
        aria-label="Resize host list (arrow keys)"
        title="Resize host list"
        onMouseDown={startDrag}
        onKeyDown={onHandleKeyDown}
        className="mx-1 w-1 shrink-0 cursor-col-resize rounded border-0 bg-transparent p-0 transition-colors hover:bg-gray-300 focus:bg-gray-300 focus:outline-none dark:hover:bg-gray-600 dark:focus:bg-gray-600"
      />

      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}

export default HostWorkspace
