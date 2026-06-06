import MarkdownIt from 'markdown-it'
import React from 'react'
import styled from 'styled-components'

// html:false escapa HTML cru vindo da resposta da IA (defesa contra XSS);
// o markdown-it também bloqueia links com protocolo javascript:/vbscript:/data:.
const md = new MarkdownIt({ html: false, linkify: false })

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

export const Markdown = ({ content }) => {
  return (
    <StyledMarkdown
      dangerouslySetInnerHTML={{
        __html: md.render(content ?? 'Null'),
      }}
    />
  )
}
