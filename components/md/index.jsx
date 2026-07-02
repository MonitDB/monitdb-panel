import MarkdownIt from 'markdown-it'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'

// html:false escapa HTML cru vindo da resposta da IA (defesa contra XSS);
// o markdown-it também bloqueia links com protocolo javascript:/vbscript:/data:.
const md = new MarkdownIt({ html: false, linkify: false })

// Quick win — toolbar nos blocos SQL: "Copiar" e "Abrir no Query Window".
// IMPORTANTE: o código é escapado (md.utils.escapeHtml) e NÃO há onclick inline —
// os cliques são tratados por delegação de evento lendo o textContent (sem XSS).
md.renderer.rules.fence = (tokens, index) => {
  const token = tokens[index]
  const lang = (token.info || '').trim().toLowerCase()
  const codeHtml = `<pre><code>${md.utils.escapeHtml(token.content)}</code></pre>`
  if (lang !== 'sql') return codeHtml
  return (
    `<div class="md-code-block">` +
    `<div class="md-code-actions">` +
    `<button type="button" data-md-action="copy">Copiar</button>` +
    `<button type="button" data-md-action="open-query">Abrir no Query Window</button>` +
    `</div>${codeHtml}</div>`
  )
}

const StyledMarkdown = styled.div`
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 750px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-bottom: 10px;
  }

  p {
    margin-bottom: 15px;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  code {
    font-family: 'Courier New', monospace;
    width: '100%';
    color: #f8f9fa;
    padding: 2px 4px;
    border-radius: 4px;
    text-shadow: none;
    font-weight: 500;
  }

  pre {
    background-color: #333;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
  }

  .md-code-block {
    margin-bottom: 15px;
  }

  .md-code-block pre {
    margin-bottom: 0;
    border-radius: 0 0 10px 10px;
  }

  .md-code-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    background-color: #222;
    padding: 6px 10px;
    border-radius: 10px 10px 0 0;
  }

  .md-code-actions button {
    font-size: 12px;
    color: #ddd;
    background: #444;
    border: 1px solid #555;
    border-radius: 6px;
    padding: 2px 10px;
    cursor: pointer;
  }

  .md-code-actions button:hover {
    background: #5046e5;
    color: #fff;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
`

/**
 * Renderiza markdown da IA. Se `onOpenQuery` for fornecido, os blocos ```sql```
 * ganham os botões "Copiar" / "Abrir no Query Window".
 * React.memo evita re-renderizar (e re-rodar md.render) as mensagens antigas
 * a cada delta do streaming SSE.
 */
export const Markdown = React.memo(({ content, onOpenQuery }) => {
  const reference = useRef()

  useEffect(() => {
    const root = reference.current
    if (!root) return () => {}
    const handler = (event) => {
      const button = event.target.closest('[data-md-action]')
      if (!button || !root.contains(button)) return
      const block = button.closest('.md-code-block')
      const code = block?.querySelector('code')?.textContent ?? ''
      if (!code) return
      const action = button.dataset.mdAction
      if (action === 'copy') {
        try {
          navigator.clipboard?.writeText(code)
        } catch {
          /* clipboard indisponível */
        }
      } else if (action === 'open-query') {
        onOpenQuery?.(code)
      }
    }
    root.addEventListener('click', handler)
    return () => root.removeEventListener('click', handler)
  }, [content, onOpenQuery])

  return (
    <StyledMarkdown
      ref={reference}
      dangerouslySetInnerHTML={{
        __html: md.render(content ?? 'Null'),
      }}
    />
  )
})

Markdown.displayName = 'Markdown'
