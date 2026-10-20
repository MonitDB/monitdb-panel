import React from 'react'

import { SemDados } from './estados'
import estilo from './painel.module.css'

// Tabela compacta de dentro do cartão. As colunas vêm declaradas (chave,
// cabeçalho, alinhamento, formatação) em vez de desenhadas a partir do primeiro
// registo: assim a ordem é a que o DBA quer ler e não a que o SQL devolveu.
function Tabela({ colunas, linhas, limite = 8, vazio = 'sem linhas na janela' }) {
  if (!linhas || linhas.length === 0) return <SemDados causa={vazio} />

  return (
    <div className={estilo.tabelaCaixa}>
      <table className={estilo.tabela}>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th
                key={coluna.chave}
                className={coluna.direita ? estilo.direita : undefined}
              >
                {coluna.cabecalho}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.slice(0, limite).map((linha, posicao) => (
            <tr key={colunas.map((coluna) => linha[coluna.chave]).join('|') + posicao}>
              {colunas.map((coluna) => (
                <td
                  key={coluna.chave}
                  className={coluna.direita ? estilo.direita : undefined}
                >
                  {coluna.formatar
                    ? coluna.formatar(linha[coluna.chave], linha)
                    : (linha[coluna.chave] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Tabela
